import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
// import { ToastService } from 'ng-zorro-antd-mobile';
import {WxService} from '../../services/wx.service';
import {DateUtils} from 'dist/svs-common-lib';
import {Uploader, UploaderOptions} from 'ngx-weui';
import {Observable} from 'rxjs';
import {FileItem} from 'ngx-weui';
import {log} from 'ng-zorro-antd';

@Component({
  selector: 'app-add-inject-feedback',
  templateUrl: './add-inject-feedback.component.html',
  styleUrls: [
    './add-inject-feedback.component.scss',
    '../../wx.component.scss'
  ]
})
export class AddInjectFeedbackComponent implements OnInit {
  baseForm: FormGroup;
  maxImageCount = 4;
  injectInfo = {
    injectChild: [{label: '选择', value: ''}],
    injectTime: undefined,
    injectRecord: [{label: '选择', value: ''}],
    mark: '',
    imageList: []
  };
  // 上传的图片id
  imagIdList = [];

  constructor(
    private fb: FormBuilder,
    private wxService: WxService,
    // private _toast: ToastService
  ) {
  }

  userInfo = {userAccount: '', info: {}};
  attendList = [];
  injectList = [];

  uploader: Uploader = new Uploader({
    limit: 4,
    method: 'POST',
    url: 'https://svs.chinavacc.com.cn:19999/svs/sob/sodr/uploadFile',
    headers: [{name: 'auth', value: 'test'}],
    params: {
      a: 1,
      b: new Date(),
      c: 'test',
      d: 12.123,
    },
    onFileQueued: () => {
      // @ts-ignore
      console.log('onFileQueued', arguments);
      // @ts-ignore
      const fileItem = arguments[0]['_file'];

    },
    onError() {
      console.log('onError', arguments);
    },
  } as UploaderOptions);

  img: any;
  imgShow: boolean = false;

  onGallery(item: any) {
    this.img = [{file: item._file, item}];
    this.imgShow = true;
  }

  onDel(item: any) {
    this.uploader.removeFromQueue(item.item);
  }

  compressAllImage() {
    const imageList = this.uploader.queue || [];
    imageList.map(item => {
      this.compressImage(item['_file'], base64 => {
        this.injectInfo.imageList.push(base64);
        console.log(2, this.injectInfo.imageList);
        this.uploadImage(base64);
      });
    });
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('wxUserInfo'));
    this.getAttendAndInjectList();
    console.log('用户信息====', this.userInfo);
    this.baseForm = this.fb.group({
      injectChild: [[{}]],
      injectTime: [null],
      injectRecord: [[{}]],
      mark: [null]
    });
  }

  getAttendAndInjectList() {
    const params = {
      userAccount: this.userInfo.userAccount
    };
    this.wxService.queryAttendList(params, res => {
      if (res.code === 0) {
        this.attendList = res.data.map(item => {
          return {
            ...item,
            label: item.profileName,
            value: item.profileCode
          };
        });
        console.log('我的关注列表====', this.attendList);
      }
    });
  }

  toSubmit() {
    const form = {
      ...this.baseForm.value,
      imageList: this.injectInfo.imageList
    };
    console.log(33, form);
    let toastStr = '';
    if (!form.injectChild[0].value) {
      toastStr = '请先选择接种人！';
      // this._toast.show(toastStr, 2000);
      // return;
    }
    if (!form.injectTime) {
      toastStr = '请先选择发生日期！';
      // this._toast.show(toastStr, 2000);
      // return;
    }
    if (!form.injectRecord[0].value) {
      toastStr = '请先选择接种的疫苗！';
      // this._toast.show(toastStr, 2000);
      // return;
    }
    // 如果有图片，则先提交图片在提交反馈请求
    if (this.uploader.queue.length > 0) {
      this.compressAllImage();
    } else {
      this.addInject();
    }
  }

  addInject() {
    const form = {
      ...this.baseForm.value,
      imageList: this.injectInfo.imageList
    };

    const selfObserveImgRecords = this.imagIdList.map(item => {
      return {
        id: item
      };
    });

    // 筛选接种儿童信息
    let childInfo = {};
    this.attendList.forEach((item, index) => {
      if (item.value === this.baseForm.value.injectChild) {
        childInfo = item;
        return;
      }
    });
    console.log('form信息=====', childInfo);
    const params = {
      selfObserveRecord: {
        globalRecordNumber: form.injectRecord[0]['globalRecordNumber'],
        profileCode: childInfo['profileCode'],
        profileName: childInfo['profileName'],
        vaccinatePovCode: childInfo['povCode'],
        // feedbackUserId: this.userInfo['userCode'],
        feedbackUserId: this.userInfo['userAccount'],
        feedbackTime: DateUtils.getFormatTime(
          form.injectTime,
          'YYYY-MM-DD HH:mm:ss'
        )
      },
      selfObserveImgRecords,
      selfObserveFeedbackContent: {
        userFeedbackContent: form.mark || '无'
      }
    };

    this.wxService.addOneObserveRecord(params, res => {
      console.log('添加反馈记录error===', res);
      if (res.code === 0) {
        console.log('添加反馈记录===', res);
      }
    });
  }

  uploadImage(img) {
    const blob = this.baseUrltoBlob(img);
    console.log('*******base64转blob对象******', blob);
    let formData = new FormData();
    // @ts-ignore
    formData.append('file', blob, '1.png');
    // 如果有图片，则先提交图片在提交反馈请求
    this.wxService.uploadFile(formData, res => {
      if (res.code === 0) {
        // 获取到图片id，存
        this.imagIdList.push(res.data);
        if (this.injectInfo.imageList.length === this.uploader.queue.length) {
          this.addInject();
        }
      }
    });
  }

  childChange(e) {
    let selectChild = {};
    console.log(11, e, this.attendList);
    this.attendList.forEach(item => {
      if (e === item['value']) {
        console.log(2, item);
        this.queryVaccRecord(item);
        return;
      }
    });
  }

  queryVaccRecord(child) {
    //  profileCode
    this.wxService.queryVaccinateRecord(
      {managePovCode: this.userInfo['vaccinationPovCode'], profileCode: child['profileCode']},
      res => {
        if (res.code === 0) {
          this.injectList = res.data.map(item => {
            return {
              ...item,
              label: item.vaccineProductName,
              value: item.vaccineBatchNo
            };
          });
          console.log('接种记录====', this.injectList);
        }
      }
    );
  }

  imageClick(params) {
    console.log(params);
  }

  getMaxDate() {
    return new Date();
  }

  currentDateFormat(date, format: string = 'yyyy-mm-dd HH:MM'): any {
    return date ? DateUtils.getFormatTime(date, format) : '选择';
  }

  compressImage(file, result) {
    // 创建读取文件的对象
    const reader = new FileReader();
    // 正式读取文件
    reader.readAsDataURL(file);
    reader.onloadend = ev => {
      const imgFile = ev.target.result;
      console.log('压缩前base64+++', imgFile['length']);
      console.log('压缩前大小++', file.size);
      const img = new Image();
      if (typeof imgFile === 'string') {
        img['src'] = imgFile;
      }
      img.onload = () => {
        const compressBase64 = this.toCompress(img);
        result(compressBase64); // 回调结果
      };
    };
  }

  toCompress(img) {
    let imgWidth = img.width;
    let imgHeight = img.height;
    let canvas = document.createElement('canvas');
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; // 铺底色
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 进行最小压缩
    let pressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
    return pressedBase64;
  }

  baseUrltoBlob(base64Data) {
    // base64转成bolb对象
    let byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(base64Data.split(',')[1]);
    else byteString = unescape(base64Data.split(',')[1]);
    let mimeString = base64Data
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
      type: mimeString
    });
  }
}

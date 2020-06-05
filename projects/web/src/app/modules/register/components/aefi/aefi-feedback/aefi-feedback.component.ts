import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Observable, Observer } from 'rxjs';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { QueryVaccRecordComponent } from '../query-vacc-record/query-vacc-record.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UserService } from '@tod/uea-auth-lib';
import { PROFILE_URLS, ProfileDataService, ProfileService, AefiCodeService, AefiService, DateUtils } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-f-aefi-feedback',
  templateUrl: './aefi-feedback.component.html',
  styleUrls: ['./aefi-feedback.component.scss']
})
export class AefiFeedbackComponent implements OnInit {
  // 接种记录列表
  vaccinateTime: number;

  aefiForm: FormGroup;

  loading = false;

  // 图片上传地址
  downloadUrl = PROFILE_URLS.aefiFileDownload;

  uploadUrl = PROFILE_URLS.aefiFileUpload;

  picUploadList = [];
  picList = [];

  profile: any;

  updateData: any;

  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };

  previewImage: string | undefined = '';
  previewVisible = false;
  vaccSettings = {
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    noDataMessage: '暂无数据',
    columns: {
      vaccinateTime: {
        title: '接种日期',
        type: 'number',
        valuePrepareFunction: date => {
          const raw = new Date(date);
          const formatted = this.datePipe.transform(raw, 'yyyy-MM-dd HH:mm');
          return formatted;
        }
      },
      vaccineProductName: {
        title: '接种疫苗',
        type: 'string'
      },
      vaccinateInjectNumber: {
        title: '接种针次',
        type: 'number'
      }
    }
  };

  // 用户信息
  userInfo: any;

  aefiCodeOptions = [];

  dataSource: any;
  constructor(
    private ref: NbDialogRef<AefiFeedbackComponent>,
    private msg: NzMessageService,
    private profileDataService: ProfileDataService,
    private profileSvc: ProfileService,
    private dialog: NbDialogService,
    private fb: FormBuilder,
    private userSvc: UserService,
    private datePipe: DatePipe,
    private aefiCodeSvc: AefiCodeService,
    private aefiSvc: AefiService
  ) {
    this.profileDataService.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
        this.userSvc.getUserInfoByType().subscribe(user => {
          this.userInfo = user;
          this.uploadUrl =
            this.uploadUrl +
            '/' +
            this.userInfo.pov +
            '/' +
            resp['profileCode'];
          console.log(this.uploadUrl);
        });
      }
    });
  }

  ngOnInit() {
    this.aefiCodeOptions = this.aefiCodeSvc.getAefiData();
    const name = this.profile ? this.profile.name : '';
    const profileCode = this.profile ? this.profile.profileCode : '';
    const idCardNo = this.profile ? this.profile.idCardNo : '';

    // aefiRecordCode: 在后端生成
    this.aefiForm = this.fb.group({
      idCardNo: [idCardNo], // 受种人证件号码
      name: [name, [Validators.required]], // 受种人姓名
      profileCode: [profileCode, [Validators.required]], // 档案编码
      vaccinateDate: [null, [Validators.required]], // 接种日期
      vacRecordCode: [null, [Validators.required]], // 接种记录编码
      reaction: [null], // 异常反应描述
      pic: [null], // 上传图片的路径
      createBy: [null, [Validators.required]], // 创建人
      createByType: [null, [Validators.required]], // 创建人类型
      aefiDate: [null, [Validators.required]], // 异常发生的时间
      vacPovCode: [null, [Validators.required]], // 接种的pov
      period: [null, [Validators.required]], // 接种与 aefi的时间间隔
      uploadBy: [null],
      uploadDate: [null],
      uploadStatus: ['0', [Validators.required]],
      uploadPov: [null],
      aefiShortName: [null, [Validators.required]],
      aefiFullName: [null, [Validators.required]],
      aefiCode: [null, [Validators.required]]
    });

    // 如果是数据更新，则将传入的数据遍历赋值给表格
    if (this.updateData) {
      this.queryVacRecordByCode();
      console.log(this.updateData);
      // 对表单内容进行赋值
      for (let controlsKey in this.aefiForm.controls) {
        if (this.updateData.hasOwnProperty(controlsKey)) {
          if (controlsKey.toLowerCase().indexOf('date') < 0) {
            this.aefiForm
              .get(controlsKey)
              .setValue(this.updateData[controlsKey]);
          } else {
            const dateVal = DateUtils.getFormatDateTime(
              this.updateData[controlsKey]
            );
            this.aefiForm.get(controlsKey).setValue(dateVal);
          }
        }
      }

      const pic = this.updateData.pic;
      if (pic.toString().trim() !== '') {
        const picVal = this.updateData.pic;
        if (
          picVal
            .toString()
            .trim()
            .indexOf('-') < 0
        ) {
          this.picList.push(picVal);
        } else {
          let picArr = picVal.toString().split('-');
          picArr.forEach(item => this.picList.push(item));
        }
      }
      console.log(this.picList);
    }
  }

  onClose() {
    this.ref.close();
  }

  /**
   * 自动补全内容
   */
  autoFillForm() {
    if (this.updateData) return;
    this.aefiForm.get('createBy').setValue(this.userInfo.userCode);
    this.aefiForm.get('createByType').setValue('创建人类型');
    this.aefiForm.get('vacPovCode').setValue(this.userInfo.pov);
    const aefiCode = this.aefiForm.get('aefiCode').value;
    const aefiOption = this.aefiCodeOptions.filter(
      a => a.aefiCode === aefiCode
    )[0];
    this.aefiForm.get('aefiShortName').setValue(aefiOption['shortName']);
    this.aefiForm.get('aefiFullName').setValue(aefiOption['fullName']);
  }

  /**
   * 上传前的检查，包括图片大小，图片格式，图片分辨率
   */
  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg';
      if (!isJPG) {
        this.msg.error('图片格式只能是 jpeg/png/jpg');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('图片大小只能在 2MB 以内!');
        observer.complete();
        return;
      }
      console.log(file);
      console.log(this.picUploadList);
      const profileCode = this.profile['profileCode'];
      let n_file = new File([file], profileCode + file.name, {
        type: file.type
      });
      console.log(n_file);
      this.picUploadList = this.picUploadList.concat(n_file);
      console.log(this.picUploadList);
      observer.next(isJPG && isLt2M);
      observer.complete();
    });
  }

  /**
   * 删除图片 - 调用方法
   * 直接从服务器删除图片
   * @param file
   */
  deleteFile = (file: File) => {
    console.log(file);
    console.log(this.picUploadList);
    const fileName = this.profile['profileCode'] + file.name;
    this.aefiSvc.deleteFileByFileName(fileName, resp => {
      console.log('删除文件', resp);
      if (resp.code !== 0 || !resp.hasOwnProperty('data')) {
        this.msg.error('操作失败，请重试');
        return;
      }
      this.picUploadList = this.picUploadList.filter(pic => pic !== file);
      console.log(this.picUploadList);
    });
  }

  /**
   *
   * @Author sun
   * @Description 根据文件名删除文件，这两个方法不能放在一起传入参数是不一样的
   * @Date 2019-07-16 20:27

   name = "fileUrl",value = "/svs/aefi/downloadFile/gyy2.jpg"

   *
   */
  deleteFileByName(fileUrl: string) {
    // 先更新aefi 表中的pic 字段值，因为要达到的效果就是在页面上至少要让用户感知到数据被删除了，只要用户执行了删除操作，并且看不到被删除的数据，就可以认为操作成功了
    let params = {
      aefiCode: this.updateData['aefiCode'],
      pic: ''
    };
    let pic = '';
    this.picList.forEach(item => {
      if (item !== fileUrl) {
        pic += item + '-';
      }
    });
    if (pic.trim() !== '') {
      pic = pic.substring(0, pic.length - 1);
    }
    params.pic = pic;
    console.log(params);
    this.aefiSvc.updateAefiRecord(params, resp => {
      console.log('删除图片更新 aefi record', resp);
      if (resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data !== 1) {
        this.msg.error('操作失败，请重试');
        return;
      }
      // 如果执行成功，则从页面上将数据删除，这样用户就看不到了，可以认为操作成功了
      this.picList = this.picList.filter(url => url !== fileUrl);
      // 再删除具体图片
      const fileName = fileUrl.substring(fileUrl.lastIndexOf('/'));
      console.log(fileName);
      this.aefiSvc.deleteFileByFileName(fileName, resp1 => {
        console.log('删除文件', resp1);
        if (resp1.code !== 0 || !resp1.hasOwnProperty('data') || !resp1.data) {
          return;
        }
        this.msg.success('操作成功');
      });
    });
  }

  /**
   * 处理图片预览
   * @param file
   */
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  /**
   * 打开查询接种记录的页面
   */
  openDialog() {
    if (!this.profile) return;
    this.dialog
      .open(QueryVaccRecordComponent, {
        context: {
          profile: this.profile
        }
      })
      .onClose.subscribe(resp => {
        console.log(resp);
        if (resp) {
          this.vaccinateTime = resp['vaccinateTime'];
          if (this.aefiForm.get('aefiDate').value !== null) {
            this.checkTimeValid();
          }
          this.aefiForm.get('vaccinateDate').setValue(resp['vaccinateTime']);
          this.aefiForm
            .get('vacRecordCode')
            .setValue(resp['registerRecordNumber']);
        }
      });
  }

  selectAefiDate() {
    if (!this.vaccinateTime || this.aefiForm.get('aefiDate').value === null)
      return;
    if (!this.checkTimeValid()) return;
    const date = this.aefiForm.get('aefiDate').value;
    const time1 = new Date(date).getTime();
    const result = DateUtils.calDays(time1, this.vaccinateTime);
    this.aefiForm.get('period').setValue(`${result.days}天${result.hours}小时`);
    this.aefiForm
      .get('vaccinateDate')
      .setValue(DateUtils.getFormatDateTime(this.vaccinateTime));
  }

  disabledDate = (current: Date) => {
    // console.log(current);
    if (!this.vaccinateTime || current === null) {
      return;
    }
    const currentTime = current.getTime();
    return currentTime <= this.vaccinateTime;
  }

  disabledTime = (current: Date) => {
    // console.log(current);
    if (!this.vaccinateTime || current === null) {
      return;
    }
    const currentTime = current.getTime();
    return currentTime <= this.vaccinateTime;
  }

  onSubmit() {
    if (!this.profile) return;
    console.log(this.aefiForm);
    if (this.aefiForm.get('vacRecordCode').value === null) {
      this.msg.warning('请先选择一条接种记录');
      return;
    }
    if (this.aefiForm.get('aefiCode').value === null) {
      this.msg.warning('请选择AEFI编码');
      return;
    }
    this.autoFillForm();
    if (this.aefiForm.invalid) {
      this.msg.warning('表格填写不完整，请检查');
      return;
    }
    this.loading = true;
    let aefi = JSON.parse(JSON.stringify(this.aefiForm.value));
    // console.log(aefi);
    aefi['aefiDate'] = DateUtils.getFormatDateTime(aefi['aefiDate']);
    // console.log(aefi);
    // console.log(this.picUploadList);
    let picUrl = '';
    this.picUploadList.forEach(p => {
      const name = this.profile['profileCode'] + p.name;
      picUrl += this.downloadUrl + '/' + this.userInfo.pov + '/' + name + '-';
    });
    if (picUrl.trim() !== '') {
      picUrl = picUrl.substring(0, picUrl.length - 1);
    }
    aefi['pic'] = picUrl;
    console.log(aefi);
    if (this.updateData) {
      // 如果picList 存在数据，则以picList 数据为准，不更新pic字段，因为之前删除数据的时候已经更新过aefi record了
      if (this.picList.length !== 0) {
        delete aefi['pic'];
      }
      this.aefiSvc.updateAefiRecord(aefi, resp => {
        this.loading = false;
        console.log('更新数据', resp);
        if (
          resp.code !== 0 ||
          !resp.hasOwnProperty('data') ||
          resp.data !== 1
        ) {
          this.msg.error('操作失败，请重试');
          return;
        }
        this.msg.success('操作成功');
        this.ref.close();
      });
    } else {
      this.aefiSvc.saveAefiRecord(aefi, resp => {
        this.loading = false;
        console.log(resp);
        if (resp.code !== 0) {
          this.msg.error('操作失败，请重试');
          return;
        }
        this.msg.success('操作成功');
        this.ref.close();
      });
    }
  }

  /**
   * 检查所选的日期和时间是否小于接种日期，如果小于，则不予提交
   */
  checkTimeValid(): boolean {
    const time1 = new Date(this.aefiForm.get('aefiDate').value).getTime();
    if (time1 < this.vaccinateTime) {
      this.msg.warning('接种反馈日期不可小于接种日期，请重新选择');
      this.aefiForm.get('aefiDate').setValue(null);
      return false;
    }
    return true;
  }

  /**
   * 根据接种记录编码查询接种记录
   */
  queryVacRecordByCode() {
    this.loading = true;
    let query = {
      registerRecordNumber: this.updateData['vacRecordCode']
    };
    console.log(query);
    this.aefiSvc.queryVacRecordByParams(query, resp => {
      console.log('自己查询 vac record', resp);
      this.loading = false;
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp.data.length === 0
      ) {
        return;
      }
    });
  }
}

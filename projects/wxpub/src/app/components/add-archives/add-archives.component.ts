import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import { ToastService } from 'ng-zorro-antd-mobile';
import {WxService} from '../../services/wx.service';
import {AdministrativeService, DateUtils} from '@tod/svs-common-lib';
import {NzCascaderOption} from 'ng-zorro-antd/cascader';
import {NotifierService} from 'angular-notifier';
import {DialogComponent, DialogConfig, DialogService} from 'ngx-weui/dialog';

@Component({
  selector: 'app-add-archives',
  templateUrl: './add-archives.component.html',
  styleUrls: [
    './add-archives.component.scss',
    '../../wx.component.scss'
  ]
})
export class AddArchivesComponent implements OnInit {
  @ViewChild('ios', {static: true}) iosAS: DialogComponent;
  // private DEFCONFIG: DialogConfig = {
  //   title: '弹窗标题',
  //   content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
  //   cancel: '辅助操作',
  //   confirm: '主操作',
  // } as DialogConfig;
  config: DialogConfig = {};
  // 省市区数据
  districtData: NzCascaderOption[] | null = null;

  baseForm: FormGroup;
  registerForm: FormGroup;
  familyForm: FormGroup;
  // 成年人form
  adultForm: FormGroup;
  // // 省市区数据
  //   // districtData = [];
  // 配置数据 户口类型 居住类型 医院类型 民族数据
  wxDicInfo: any = {};
  userInfo = {userAccount: ''};
  // tabIndex = 0;
  stepIndex = 0;
  steps = [];

  tabCurrentIndex = 0;

  sexData = [
    {
      list: ['sun', 'earth', 'moon']
    }
  ];

  testForm = '';

  constructor(
    private fb: FormBuilder,
    // private administrativeSvc: AdministrativeService,
    private wxService: WxService,
    private notifier: NotifierService
    // private msg: NzMessageService,
    // private _toast: ToastService
  ) {
  }

  ngOnInit() {
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx27f981e2313b12a0&redirect_uri=http://qbcs.fuxinx5.xin&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
    const administrativeDivisionTreeData = require('../../../assets/data/common/AdministrativeDivisionTreeData.json');
    // 从本地取配置数据   户口类型 居住类型 医院类型 民族数据
    this.wxDicInfo = JSON.parse(localStorage.getItem('wxDicInfo'));
    this.userInfo = JSON.parse(localStorage.getItem('wxUserInfo'));
    console.log('====wxDicInfo====', this.wxDicInfo);

    this.districtData = administrativeDivisionTreeData.data;

    // 取省市区数据
    // this.wxService.queryAdministrativeData({}, res => {
    //   this.districtData = res.data;
    //   console.log(2, this.districtData);
    // });
    this.baseForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(5)]],
      sex: [null, [Validators.required]],
      birthday: [null, [Validators.required]],
      nation: [[{label: '选择', value: ''}]],
      vaccNum: [null],
      idNum: [null],
      phone: [null],
      birthdayNum: [null],
      hospital: [null],
      weight: [null],
      birthNum: [null, [Validators.required]] // 胎次
    });

    this.registerForm = this.fb.group({
      accountType: [null], // 户口类别
      liveType: [null], // 居住类型
      householdAddress: [null], // 户籍所在地
      householdAddressInfo: [null], // 户籍详细住址
      liveAddress: [[]], // 居住地区
      liveAddressInfo: [null] // 居住地区详细住址
    });

    this.familyForm = this.fb.group({
      motherName: [null, [Validators.required]],
      motherId: [null, [Validators.required]],
      motherPhone: [null, [Validators.required]],
      fatherName: [null, [Validators.required]],
      fatherId: [null, [Validators.required]],
      fatherPhone: [null, [Validators.required]],
      mark: [null]
    });

    this.adultForm = this.fb.group({
      name: [null, [Validators.required]],
      sex: [null, [Validators.required]],
      birthday: [null, [Validators.required]],
      idNum: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      liveAddress: [[]],
      liveAddressInfo: [null],
      mark: [null, Validators.maxLength(100)]
    });

    this.steps = [
      {
        title: '基本信息'
      },
      {
        title: '户籍信息'
      },
      {
        title: '亲属信息'
      }
    ];
  }

  nextStep() {
    const submitInfo = {
      ...this.baseForm.value,
      ...this.registerForm.value,
      ...this.familyForm.value
    };
    // this.testForm = JSON.stringify(submitInfo);
    console.log(2, JSON.stringify(submitInfo));
    let toastStr = '';
    switch (this.stepIndex) {
      case 0:
        // if (this.baseForm.invalid) {
        console.log(
          '====信息未填写完整，请检查确认后在提交====',
          this.baseForm.value
        );
        // this.msg.warning('信息未填写完整，请检查确认后在提交', {nzDuration: 1000});
        if (!this.baseForm.value.name) {
          toastStr = '请先填写宝宝名字在提交！';
          this.notifier.notify('warning', toastStr);
          return;
        } else if (!this.baseForm.value.sex) {
          toastStr = '请先选择宝宝性别在提交！';
          this.notifier.notify('warning', toastStr);
          return;
        } else if (!this.baseForm.value.birthday) {
          toastStr = '请先选择宝宝生日在提交！';
          this.notifier.notify('warning', toastStr);
          return;
        } else if (!this.baseForm.value.birthNum) {
          toastStr = '请先填写胎次在提交！';
          this.notifier.notify('warning', toastStr);
          return;
        }
        // }
        break;
      case 1:
        // if (this.registerForm.invalid) {
        if (!this.registerForm.value.accountType || this.registerForm.value.accountType === '1000') {
          toastStr = '请先填写户口类别！';
          this.notifier.notify('warning', toastStr);
          return;
        } else if (!this.registerForm.value.liveType || this.registerForm.value.liveType === '1000') {
          toastStr = '请先填写居住类型！';
          this.notifier.notify('warning', toastStr);
          return;
        } else if (!this.registerForm.value.householdAddress) {
          toastStr = '请先填写户籍所在地！';
          this.notifier.notify('warning', toastStr);
          return;
        } else if (!this.registerForm.value.householdAddressInfo) {
          toastStr = '请先填写户籍住址！';
          this.notifier.notify('warning', toastStr);
          return;
        }
        // }
        break;
      default:
        if (this.familyForm.invalid) {
          if (!this.familyForm.value.motherName) {
            toastStr = '请先填写母亲姓名！';
            this.notifier.notify('warning', toastStr);
            return;
          } else if (!this.familyForm.value.motherId) {
            toastStr = '请先填写母亲身份证号！';
            this.notifier.notify('warning', toastStr);
            return;
          } else if (!this.familyForm.value.motherPhone) {
            toastStr = '请先填写母亲电话！';
            this.notifier.notify('warning', toastStr);
            return;
          } else if (!this.familyForm.value.fatherName) {
            toastStr = '请先填写父亲姓名！';
            this.notifier.notify('warning', toastStr);
            return;
          } else if (!this.familyForm.value.fatherId) {
            toastStr = '请先填写居父亲身份证号！';
            this.notifier.notify('warning', toastStr);
            return;
          } else if (!this.familyForm.value.fatherPhone) {
            toastStr = '请先填写居父亲电话！';
            this.notifier.notify('warning', toastStr);
            return;
          }
        }
    }


    if (this.stepIndex === 2) {
      this.addChildArchives(submitInfo);
    }

    if (this.stepIndex < 2) {
      this.stepIndex++;
    }
  }

  addChildArchives(info) {
    const params = {
      profileName: info.name,
      gender: info.sex[0] === '女' ? 'f' : 'm',
      birthDate: DateUtils.getFormatTime(info.birthday, 'YYYY-MM-DD HH:mm:ss'),
      nationCode: info.nation[0].value || '',
      immunityVacCard: info.vaccNum || '',
      idCardNo: info.idNum || '',
      contactPhone: info.phone || '',
      birthCardNo: info.birthdayNum || '',
      // TODO: 暂时做成输入框、后面做picker效果需要改变取值方式
      birthHospitalCode: info.hospital ? info.hospital[0] : '',
      birthWeight: info.weight || '',
      parity: info.birthNum || '',

      idTypeCode: info.accountType.length > 0 ? info.accountType[0] : '',
      residentialTypeCode:
        info.liveType.length > 0 ? info.liveType[0] : '',
      idCardProvCode:
        info.householdAddress.length > 0 ? info.householdAddress[0] : '', // 户籍所在省编码
      idCardCityCode:
        info.householdAddress.length > 0 ? info.householdAddress[1] : '', // 户籍所在市编码
      idCardDistrictCode:
        info.householdAddress.length > 1 ? info.householdAddress[2] : '', // 户籍所在县编码户籍地址
      idCardDetail: info.householdAddressInfo || '', // 户籍详细地址
      liveProvCode: info.liveAddress[0] || '', // 居住地省编码
      liveCityCode: info.liveAddress[1], // 居住地市编码
      liveDistrictCode: info.liveAddress[2], // 居住地县编码
      liveDetail: info.liveAddressInfo || '',

      motherName: info.motherName || '',
      motherIdCardNo: info.motherId || '',
      motherContactPhone: info.motherPhone || '',
      fatherName: info.fatherName || '',
      fatherIdCardNo: info.fatherId || '',
      fatherContactPhone: info.fatherPhone || '',
      createAccount: this.userInfo.userAccount || '',
      memo: info.mark || ''
    };
    for (let key in params) {
      if (!params[key]) {
        delete params[key];
      }
    }
    console.log(info);
    console.table(params);
    // return;
    this.wxService.addProfile(params, res => {
      if (res.code === 0) {
        this.config = {
          skin: 'ios',
          title: '建档成功',
          content: `请前往门诊将档案编码${res.data}告知医生，等待医生审核`,
          cancel: '',
          confirm: '确认',
        } as DialogConfig;
        setTimeout(() => {
          (this[`${'ios'}AS`] as DialogComponent).show().subscribe((result: any) => {
            // console.log('type', res);
            history.go(-1);
          });
        }, 10);
        // this.notifier.notify('success', `请前往门诊将档案编码${res.data}告知医生，等待医生审核`);
      }
    });
  }

  adultSubmit() {
    let toastStr = '';
    // if (this.adultForm.invalid) {
    if (!this.adultForm.value.name) {
      toastStr = '请先填写姓名！';
      this.notifier.notify('warning', toastStr);
      return;
    } else if (!this.adultForm.value.sex) {
      toastStr = '请先填写性别！';
      this.notifier.notify('warning', toastStr);
      return;
    } else if (!this.adultForm.value.birthday) {
      toastStr = '请先填写出生日期！';
      this.notifier.notify('warning', toastStr);
      return;
    } else if (!this.adultForm.value.idNum) {
      toastStr = '请先填写身份证号！';
      this.notifier.notify('warning', toastStr);
      return;
    } else if (!this.adultForm.value.phone) {
      toastStr = '请先填写联系电话！';
      this.notifier.notify('warning', toastStr);
      return;
    }
    // this.notifier.notify('warning', toastStr);
    // return;
    // }
    const info = this.adultForm.value;
    console.log(33, info);
    const params = {
      profileName: info.name,
      gender: info.sex[0] === '女' ? 'f' : 'm',
      birthDate: DateUtils.getFormatTime(info.birthday, 'YYYY-MM-DD HH:mm:ss'),
      idCardNo: info.idNum || '',
      contactPhone: info.phone || '',
      liveProvCode: info.liveAddress.length > 0 ? info.liveAddress[0] : '', // 居住地省编码
      liveCityCode: info.liveAddress.length > 0 ? info.liveAddress[1] : '', // 居住地市编码
      liveDistrictCode: info.liveAddress.length > 0 ? info.liveAddress[2] : '', // 居住地县编码
      liveDetail: info.liveAddressInfo || '',
      memo: info.mark || '',
      createAccount: this.userInfo.userAccount || ''
    };
    for (let key in params) {
      if (!params[key]) {
        delete params[key];
      }
    }
    this.wxService.addAdultProfile(params, res => {
      if (res.code === 0) {
        this.config = {
          skin: 'ios',
          title: '建档成功',
          content: `请前往门诊将档案编码${res.data}告知医生，等待医生审核`,
          cancel: '',
          confirm: '确认',
        } as DialogConfig;
        setTimeout(() => {
          (this[`${'ios'}AS`] as DialogComponent).show().subscribe((result: any) => {
            // console.log('type', res);
            history.go(-1);
          });
        }, 10);
        console.log('成人信息===', params);
      } else {
        this.config = {
          skin: 'ios',
          title: '温馨提示',
          content: res.msg + '请选择删除已有的档案！' || '',
          cancel: '',
          confirm: '确认',
        } as DialogConfig;
        setTimeout(() => {
          (this[`${'ios'}AS`] as DialogComponent).show().subscribe((result: any) => {
            // console.log('type', res);
            history.go(-1);
          });
        }, 10);
      }
    });
  }

  getDistrict(res = []) {
    let district = '';
    for (let item of res) {
      district += item.label;
    }
    // console.log(44, district);
    return district;
  }

  sexChange({gIndex, iIndex}) {
    console.log(gIndex, iIndex);
  }

  stepClick(i) {
    this.stepIndex = i;
  }

  getMaxDate() {
    return new Date();
  }

  currentDateFormat(date, format: string = 'yyyy-mm-dd HH:MM'): any {
    return date ? DateUtils.getFormatTime(date, format) : '选择';
  }

  tranLatePickValue(item) {
    return item.label;
  }

  tabClick(i) {
    this.tabCurrentIndex = i;
  }
}

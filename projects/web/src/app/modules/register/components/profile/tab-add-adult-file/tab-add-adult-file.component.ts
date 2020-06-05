import { ValidatorsUtils } from '../../../../../@uea/components/form/validators-utils';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit, Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { AddProfileComponent } from '../add-profile-main/add-profile.component';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { UserService } from '@tod/uea-auth-lib';
import { NbMomentDateService } from '@nebular/moment';
import {
  DicDataService,
  NationDataInitService,
  AdministrativeService,
  ProfileService,
  ProfileDataService,
  ProfileChangeService,
  SelfProfileService,
  DateUtils
} from '@tod/svs-common-lib';
import * as moment from 'moment';

@Component({
  selector: 'ngx-tab-add-adult-file',
  templateUrl: './tab-add-adult-file.component.html',
  styleUrls: ['./tab-add-adult-file.component.scss'],
  providers: [NbMomentDateService]
})
export class TabAddAdultFileComponent implements OnInit, OnDestroy {
  profile: FormGroup;
  // 自助建档编号
  selfProfile: any;

  loading = false;
  // 自助数据
  selfProfileData: any;

  /**
   * 当前日期
   */
    // currentDate = moment();
  currentDate = new Date(DateUtils.formatEndDate(new Date()));

  @Output()
  readonly showLoading = new EventEmitter();
  changeFileType = new EventEmitter();
  @Input() operationUpdate = false;

  // 民族选项
  nationOptions = [];
  // 证件类型选项
  idCardTypeOptions = [];

  // 扫描身份证信息
  @Input()
  scanIdCardInfo: any;

  // 性别选项
  genderOptions = [];

  // 行政区划数据选项
  geoCodeData = [];

  // 待更新的数据
  updateData: any;

  // 叫号成功传递过来的姓名
  callNumberData: string;

  // 用户登陆信息
  userInfo: any;
  // pov - 2, app - 0, wx - 1
  private readonly PROFILE_SOURCE_TYPE_POV = '2';

  private readonly subscription: Subscription[] = [];

  /**
   * 省市区预选择数据
   */
  province: string;
  city: string;
  district: string;

  constructor(
    private ref: NbDialogRef<AddProfileComponent>,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private dicSvc: DicDataService,
    private nationSvc: NationDataInitService,
    private adminSvc: AdministrativeService,
    private profileSvc: ProfileService,
    private userSvc: UserService,
    private profileDataSvc: ProfileDataService,
    private profileChangeDataSvc: ProfileChangeService,
    private momentSvc: NbMomentDateService,
    private SelfProfileSvc: SelfProfileService
  ) {
    this.profileChangeDataSvc.getCallNumberProfileName().subscribe(data => {
      if (data) {
        this.callNumberData = data;
      }
    });
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      if (user) {
        const pov = user.pov;
        this.province = pov.substr(0, 2) + '0000';
        this.city = pov.substr(0, 4) + '00';
        this.district = pov.substr(0, 6);
      }

    });
  }

  ngOnInit(): void {
    let sub = this.profileDataSvc.getProfileData().subscribe(resp => {
      if (resp && this.operationUpdate) {
        this.updateData = resp;
      }
    });
    this.subscription.push(sub);
    this.genderOptions = this.dicSvc.getDicDataByKey('genderCode');
    // console.log(this.genderOptions);
    this.idCardTypeOptions = this.dicSvc.getDicDataByKey('idCardType');
    this.nationOptions = this.nationSvc.getNationData();
    this.geoCodeData = this.adminSvc.getAdministrativeData();

    // 成人基本信息
    this.profile = this.fb.group({
      name: [
        this.callNumberData ? this.callNumberData['profileName'] : null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          ValidatorsUtils.validateInputName('name')
        ]
      ],
      gender: ['m', [Validators.required]],
      birthDate: [null, [Validators.required]],
      idCardNo: [null, [ValidatorsUtils.validateIdCardNo('idCardNo')]],
      idCardType: ['01', [Validators.required]],
      contactPhone: [
        null,
        [Validators.required, ValidatorsUtils.validatePhoneNo('contactPhone')]
      ],
      nationCode: ['01', [Validators.required]],
      liveAddr: [this.province ? [this.province, this.city, this.district] : []],
      liveProvCode: [this.province ? this.province : null], // 家庭住址 - 省
      liveCityCode: [this.city ? this.city : null], // 家庭住址 - 市
      liveDistrictCode: [this.district ? this.district : null], // 家庭住址 - 区县
      liveDetail: [null], // 家庭住址 - 详细
      createBy: [null, [Validators.required]],
      createPov: [null, [Validators.required]],
      createSource: [null, [Validators.required]],
      uploadStatusCode: [null, [Validators.required]],
      vaccinationPovCode: [null, [Validators.required]]
    });

    if (this.updateData) {
      for (const key in this.updateData) {
        if (this.profile.get(key)) {
          if (key === 'birthDate') {
            const birthDateStr = DateUtils.getFormatDateTime(
              this.updateData[key]
            );
            // const birthDate = this.momentSvc.parse(birthDateStr, 'YYYY/MM/DD');
            this.profile.get(key).setValue(birthDateStr);
          } else {
            this.profile.get(key).setValue(this.updateData[key]);
          }
        }
      }
      if (
        this.updateData['liveProvCode'] &&
        this.updateData['liveCityCode'] &&
        this.updateData['liveDistrictCode']
      ) {
        const liveProvCode = this.updateData['liveProvCode'];
        const liveCityCode = this.updateData['liveCityCode'];
        const liveDistrictCode = this.updateData['liveDistrictCode'];
        this.profile
          .get('liveAddr')
          .setValue([liveProvCode, liveCityCode, liveDistrictCode]);
      }
    }

    const sub3 = this.profile.get('idCardNo').valueChanges.subscribe(_ => {
      if (this.selfProfile) {
        return;
      } else {
        this.onIdCardInputChange();
      }
    });
    this.subscription.push(sub3);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  filterDate = (d: Date) => {
    return d > this.currentDate;
  }

  onSubmit() {
    this.fullfillAddress();
    this.fullfillForm();
    // console.log(this.profile);
    if (!this.profile) return;
    const formGroupVal = this.profile.controls;
    for (const controlKey in formGroupVal) {
      if (formGroupVal[controlKey]) {
        const formVal: any = formGroupVal[controlKey];
        const v = formVal.value;
        if (!v || v.toString().trim() === '') {
          this.profile.get(controlKey).setValue(null);
        }
        if (formVal.invalid) {
          this.profile.get(controlKey).markAsDirty();
          this.profile.get(controlKey).markAsTouched();
        }
      }
    }
    if (this.profile.invalid) {
      this.msg.warning('表单填写不完整或填写有误，请检查');
      return;
    }
    if (this.operationUpdate) {
      this.updateProfile();
    } else {
      this.saveProfile();
    }
  }

  updateProfile() {
    this.showLoading.emit(true);
    const profile = JSON.parse(JSON.stringify(this.profile.value));
    profile['birthDate'] = DateUtils.getFormatDateTime(
      this.profile.get('birthDate').value
    );
    // profile['birthDate'] = DateUtils.getFormatDateTime(this.profile.get('birthDate').value);
    profile['profileCode'] = this.updateData['profileCode'];
    if (profile['createDate']) {
      profile['createDate'] = null;
    }
    if (profile['uploadDate']) {
      profile['uploadDate'] = null;
    }
    if (profile['lastModifyDate']) {
      profile['lastModifyDate'] = null;
    }
    // console.log('update', profile);
    this.profileSvc.updateAdultProfile(profile, resp => {
      this.showLoading.emit(false);
      console.log(resp);
      if (resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data !== 1) {
        this.msg.error('更新档案失败，请重试');
        return;
      }
      this.ref.close(true);
      this.msg.success('更新档案成功');
    });
  }

  saveProfile() {
    this.showLoading.emit(true);
    const profile = JSON.parse(JSON.stringify(this.profile.value));
    const birthDate = this.profile.get('birthDate').value;
    // profile['birthDate'] = birthDate.format('YYYY-MM-DD HH:mm:ss');
    profile['birthDate'] = DateUtils.getFormatDateTime(birthDate);
    profile['profileStatusCode'] = '1';
    console.log('save', profile);
    this.profileSvc.saveAdultProfile(profile, resp => {
      this.showLoading.emit(false);
      console.log(resp);
      if (resp.code !== 0) {
        this.msg.error('成人档案建档失败，请重试');
        return;
      }
      let p = resp.data;
      if (this.callNumberData) {
        p['globalRecordNumber'] = this.callNumberData['globalRecordNumber'];
      }
      this.msg.success('建档成功');
      this.profileDataSvc.setProfileData(p);
      this.ref.close(true);
      this.changeSelfProfile();
    });
  }

  /**
   * 填写其他信息
   */
  fullfillForm() {
    if (this.operationUpdate) return;
    this.profile.get('createBy').setValue(this.userInfo.userCode);
    this.profile.get('createPov').setValue(this.userInfo.pov);
    this.profile.get('createSource').setValue(this.PROFILE_SOURCE_TYPE_POV); // 2 - POV 建档
    this.profile.get('uploadStatusCode').setValue('0');
    this.profile.get('vaccinationPovCode').setValue(this.userInfo.pov);
  }

  /**
   * 填写地址信息
   */
  fullfillAddress() {
    const liveAddr = this.profile.get('liveAddr').value;
    if (liveAddr.length > 0) {
      this.profile.get('liveProvCode').setValue(liveAddr[0]);
      this.profile.get('liveCityCode').setValue(liveAddr[1]);
      this.profile.get('liveDistrictCode').setValue(liveAddr[2]);
    }
  }

  onIdCardInputChange() {
    const idCardType = this.profile.get('idCardType').value;
    // 如果证件类型是身份证，则自动获取出生日期和性别
    if (idCardType === '01' && this.profile.get('idCardNo').valid) {
      const idCardNoValue = this.profile.get('idCardNo').value;
      if (!idCardNoValue) {
        return;
      }
      const idCardNo = idCardNoValue + '';
      const birthStr = idCardNo.substring(6, 14);
      // const birthDate = this.momentSvc.parse(birthStr, 'YYYY/MM/DD');
      const birthDate = DateUtils.getFormatDateTime(birthStr);
      this.profile.get('birthDate').setValue(birthDate);
      const genderStr = Number(idCardNo.substring(16, 17));
      if (genderStr % 2 === 0) {
        this.profile.get('gender').setValue('f');
      } else {
        this.profile.get('gender').setValue('m');
      }
    }
  }

  /*
   * 添加自助建档信息
   * */
  searchProfile(id: string) {
    if (this.loading) return;
    if (!id || id.trim() === '') return;
    this.loading = true;
    let params = {
      checkCode: id,
      checkStatus: ['0']
    };
    this.SelfProfileSvc.querySelfProfile(params, resp => {
      console.log(resp);
      this.loading = false;
      if (
        resp &&
        resp.code === 0 &&
        resp.hasOwnProperty('data') &&
        resp.data.length !== 0
      ) {
        this.selfProfileData = resp.data[0];
        console.log(this.selfProfileData);
        this.profile.get('gender').setValue(this.selfProfileData.gender);
        const birthDateStr = DateUtils.getFormatDateTime(
          this.selfProfileData.birthDate
        );
        // this.profile.get('birthDate').setValue(this.momentSvc.parse(birthDateStr, 'YYYY/MM/DD'));
        this.profile.get('birthDate').setValue(birthDateStr);
        this.profile.get('name').setValue(this.selfProfileData.profileName);
        this.profile
          .get('liveDetail')
          .setValue(this.selfProfileData['liveDetail']); // 家庭详细地址
        if (
          this.selfProfileData['liveProvCode'] &&
          this.selfProfileData['liveCityCode'] &&
          this.selfProfileData['liveDistrictCode']
        ) {
          const liveProvCode = this.selfProfileData['liveProvCode'];
          const liveCityCode = this.selfProfileData['liveCityCode'];
          const liveDistrictCode = this.selfProfileData['liveDistrictCode'];
          this.profile.get('liveProvCode').setValue(liveProvCode); // 省
          this.profile.get('liveCityCode').setValue(liveCityCode); // 市
          this.profile.get('liveDistrictCode').setValue(liveDistrictCode); // 区
          this.profile
            .get('liveAddr')
            .setValue([liveProvCode, liveCityCode, liveDistrictCode]); // 居住地址
        }
        if (this.selfProfileData.contactPhone) {
          this.profile
            .get('contactPhone')
            .setValue(this.selfProfileData.contactPhone);
        }
        if (this.selfProfileData.nationCode) {
          this.profile
            .get('nationCode')
            .setValue(this.selfProfileData.nationCode);
        }
        if (this.selfProfileData.idCardNo) {
          this.profile.get('idCardNo').setValue(this.selfProfileData.idCardNo);
        }
      }
    });
  }

  /*
   * 修改自助建档信息
   * */
  changeSelfProfile() {
    if (this.loading) return;
    if (this.selfProfileData) {
      let params = {
        checkStatus: 1,
        id: this.selfProfileData.id,
      };
      this.SelfProfileSvc.updateSelfProfileCheckStatus(params, resp => {
        this.loading = false;
        if (resp.code === 0) {
          console.warn('修改自助建档成功');
        }
      });
    }
  }
}

import { ConfirmDialogComponent } from '../../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { ValidatorsUtils } from '../../../../../@uea/components/form/validators-utils';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit, Output
} from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { AddProfileComponent } from '../add-profile-main/add-profile.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddProfileDetailDialogComponent } from '../add-profile-detail-dialog/add-profile-detail-dialog.component';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { UserService } from '@tod/uea-auth-lib';
import { ConfigService } from '@ngx-config/core';
import { NbMomentDateService } from '@nebular/moment';
import {
  ProfileService, ProfileDataService, NationDataInitService,
  CommunityDataService, AdministrativeService, DicDataService,
  ProfileChangeService, SelfProfileService, DateUtils, TransformUtils
} from '@tod/svs-common-lib';
import { SelectHospitalComponent } from '../../common/select-hospital/select-hospital.component';

import * as moment from 'moment';
import {ModifyDialogComponent} from '../../common/modify-dialog/modify-dialog.component';


@Component({
  selector: 'ngx-tab-add-child-file',
  templateUrl: './tab-add-child-file.component.html',
  styleUrls: ['./tab-add-child-file.component.scss'],
  providers: [NbMomentDateService]
})
export class TabAddChildFileComponent implements OnInit, OnDestroy {
  private readonly UploadStatusFalse = '0';

  private readonly CreateSourcePov = '2';

  profile: FormGroup;
  // 自助建档编号
  selfFileCode: string;
  loading = false;
  // 自助建档数据
  selfProfileData: any;
  // 获取旧字典表的信息
  oldDictionaryInfo: any;
  // 选择医院的code码
  hospitalCode: any;
  // 删除第二监护人信息，0 - 否，1 - 是
  deleteSecondGuardian = '0';

  // 当前日期
  // currentDate = moment();
  currentDate = new Date(DateUtils.formatEndDate(new Date()));

  @Output()
  readonly showLoading = new EventEmitter();

  changeFileType = new EventEmitter();

  @Input() operationUpdate = false;
  updateData: any;

  genderOptions = [];

  /**
   * 是否新生儿
   */
  isNewBornOptions = [
    { label: '否', value: '0' },
    { label: '是', value: '1' }
  ];

  idCardTypeOptions = [];

  // 民族选项
  nationOptions = [];

  // 行政区划数据选项
  geoCodeData = [];

  // 建档类型数据选项
  profileType = [];

  // 户口类型选项
  idType = [];

  // 居住属性
  residentialType = [];

  // 在册状态
  profileStatus = [];

  // 所属区块
  communityOptions = [];

  // 建档来源
  profileSourceType = [];

  // 取消观察者对象队列
  subscribeArr: Subscription[] = [];

  // 叫号成功之后传递过来的建档对象，自动填写名字 和 globalRecordNumber
  callNumberName: any;
  // 叫号传递过来的对象
  callNumberData: any;
  // 用户信息
  userInfo: any;

  /**
   * 户口地址预选项
   */
  idCardProvince: string;
  idCardCity: string;
  idCardDistrict: string;
  /**
   * 居住地址预选项
   */
  liveProvince: string;
  liveCity: string;
  liveDistrict: string;

  // 默认为手动输入
  radioValue = '手动输入';
  // 选择免疫卡号填写的类型
  selectTypes = [
    {label: '手动输入', value: 'hand'},
    {label: '扫码输入', value: 'scan'},
  ];

  constructor(
    private ref: NbDialogRef<AddProfileComponent>,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private dialog: NbDialogService,
    private msg: NzMessageService,
    private profileDataService: ProfileDataService,
    private nationSvc: NationDataInitService,
    private communitySvc: CommunityDataService,
    private adminSvc: AdministrativeService,
    private dicSvc: DicDataService,
    private profileChangeDataSvc: ProfileChangeService,
    private userSvc: UserService,
    private configSvc: ConfigService,
    private momentSvc: NbMomentDateService,
    private SelfProfileSvc: SelfProfileService
  ) {
    this.profileChangeDataSvc.getCallNumberProfileName().subscribe(data => {
      if (data) {
        this.callNumberName = data['profileName'];
        this.callNumberData = data;
      }
    });

    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      if (user) {
        const pov = user.pov;
        this.idCardProvince = pov.substr(0, 2) + '0000';
        this.liveProvince = pov.substr(0, 2) + '0000';
        this.idCardCity = pov.substr(0, 4) + '00';
        this.liveCity = pov.substr(0, 4) + '00';
        this.idCardDistrict = pov.substr(0, 6);
        this.liveDistrict = pov.substr(0, 6);
      }
    });
  }

  ngOnInit(): void {
    this.geoCodeData = this.adminSvc.getAdministrativeData();
    this.nationOptions = this.nationSvc.getNationData();
    this.profileType = this.dicSvc.getDicDataByKey('profileType');
    this.idType = this.dicSvc.getDicDataByKey('idType');
    this.residentialType = this.dicSvc.getDicDataByKey('residentialType');
    this.profileStatus = this.dicSvc.getDicDataByKey('profileStatus');
    this.communityOptions = this.communitySvc.getCommunityData();
    this.genderOptions = this.dicSvc.getDicDataByKey('genderCode');
    this.idCardTypeOptions = this.dicSvc.getDicDataByKey('idCardType');
    this.profileSourceType = this.dicSvc.getDicDataByKey('profileSourceType');
    // 儿童基本信息
    // 在后端中生成的有：id,profileCode,
    this.profile = this.fb.group({
      idCardNo: [null, [ValidatorsUtils.validateIdCardNo('idCardNo')]],
      idCardType: ['01', [Validators.required]],
      birthCardNo: [null],
      name: [
        this.callNumberName ? this.callNumberName : null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          ValidatorsUtils.validateInputName('name')
        ]
      ],
      gender: ['m', [Validators.required]],
      birthDate: [null, [Validators.required]],
      birthHospitalCode: [null],
      birthWeight: [null, [Validators.min(0)]],
      createDate: [null], // 建档日期，后期补完
      createBy: [null], // 创建人，后期补完
      createPov: [null], // 创建单位，后期补完
      createSource: [null], // 建档渠道，后期补完，微信还是pov建档
      liveAddr: [this.liveProvince ? [this.liveProvince, this.liveCity, this.liveDistrict] : null],
      liveProvCode: [this.liveProvince ? this.liveProvince : null], // 家庭住址 - 省
      liveCityCode: [this.liveCity ? this.liveCity : null], // 家庭住址 - 市
      liveDistrictCode: [this.liveDistrict ? this.liveDistrict : null], // 家庭住址 - 区县
      liveDetail: [null, [Validators.maxLength(50)]], // 家庭住址 - 详细
      idCardAddr: [this.idCardProvince ? [this.idCardProvince, this.idCardCity, this.idCardDistrict] : null, [Validators.required]], // 身份证地址 - 必填
      idCardProvCode: [this.idCardProvince ? this.idCardProvince : null, [Validators.required]], // 身份证地址 - 省
      idCardCityCode: [this.idCardCity ? this.idCardCity : null, [Validators.required]], // 身份证地址 - 市
      idCardDistrictCode: [this.idCardDistrict ? this.idCardDistrict : null, [Validators.required]], // 身份证地址 - 区县
      idCardDetail: [null, [Validators.required, Validators.maxLength(50)]], // 身份证地址 - 详细
      nationCode: ['01', [Validators.required]],
      parity: [1, [Validators.required, Validators.min(1)]],
      profileStatusCode: ['1', [Validators.required]], // 在册状态
      idTypeCode: ['1'], // 户口类型
      residentialTypeCode: ['1', [Validators.required]], // 居住类型
      community: [this.communityOptions.length > 0 ? this.communityOptions[0].communityCode : null, [Validators.required]], // 所属区块
      lastModifyDate: [null],
      vaccinationPovCode: ['1', [Validators.required]],
      uploadStatusCode: [null],
      uploadDate: [null],
      memo: [null],
      contactPhone: [null],
      motherName: [
        null,
        [Validators.required, ValidatorsUtils.validateInputName('motherName')]
      ], // 监护人信息，只保存一个，如有其它的则需要在弹出层进行新增
      motherContactPhone: [
        null,
        [
          Validators.required,
          ValidatorsUtils.validatePhoneNo('motherContactPhone')
        ]
      ],
      motherIdCardType: ['01', [Validators.required]],
      motherIdCardNo: [
        null,
        [
          Validators.required,
          ValidatorsUtils.validateIdCardNo('motherIdCardNo')
        ]
      ],
      immunityVacCard: [null, [Validators.minLength(10), Validators.maxLength(20), ValidatorsUtils.validateImmuVacCard('immunityVacCard')]], // 免疫接种卡号
      fatherName: [null, [ValidatorsUtils.validateInputName('fatherName')]], // 监护人信息，只保存一个，如有其它的则需要在弹出层进行新增
      fatherContactPhone: [
        null,
        [ValidatorsUtils.validatePhoneNo('fatherContactPhone')]
      ],
      fatherIdCardType: ['01', [Validators.required]],
      fatherIdCardNo: [
        null,
        [ValidatorsUtils.validateIdCardNo('fatherIdCardNo')]
      ],
      fatherGuardianCode: [null],
      isNewBorn: ['0', Validators.required],
      selectType: ['hand', null]
    });

    const sub2 = this.profileDataService.getProfileData().subscribe(resp => {
      if (resp && this.operationUpdate) {
        this.updateData = resp;
        for (const key in this.updateData) {
          if (this.profile.get(key)) {
            if (key === 'birthDate') {
              const birthDateStr = DateUtils.getFormatDateTime(
                this.updateData[key]
              );
              // console.log('生日', birthDateStr);
              /*const birthDate = this.momentSvc.parse(
                birthDateStr,
                'YYYY/MM/DD'
              );*/
              this.profile.get(key).setValue(birthDateStr);
            } else {
              this.profile.get(key).setValue(this.updateData[key]);
            }
          }
        }
        // 户口地址
        if (
          this.updateData['idCardProvCode'] &&
          this.updateData['idCardCityCode'] &&
          this.updateData['idCardDistrictCode']
        ) {
          const idCardProvCode = this.updateData['idCardProvCode'];
          const idCardCityCode = this.updateData['idCardCityCode'];
          const idCardDistrictCode = this.updateData['idCardDistrictCode'];
          this.profile
            .get('idCardAddr')
            .setValue([idCardProvCode, idCardCityCode, idCardDistrictCode]);
        }
        // 居住地址
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
    });
    this.subscribeArr.push(sub2);
    this.oldDictionaryInfo = this.configSvc.getSettings('oldDictionary');
    const sub3 = this.profile.get('idCardNo').valueChanges.subscribe(idCardNo => {
      if (this.selfFileCode) {
        return;
      } else {
        // console.log('监听证件发生变化的值', idCardNo);
        this.onIdCardInputChange();
      }
    });
    this.subscribeArr.push(sub3);
    // 监听表单中的胎次值的变化
    /*const sub4 = this.profile.get('parity').valueChanges.subscribe(value => {
      // console.log('胎次', value);
      /!*if (value === 0) {
        this.profile.get('parity').setValue(1);
      }*!/
      /!*if (value < 0) {
        this.profile.get('parity').setValue('');
      }*!/
    });
    this.subscribeArr.push(sub4);*/
  }

  ngOnDestroy(): void {
    this.subscribeArr.forEach(subscription => subscription.unsubscribe());
  }

  filterDate = (d: Date) => {
    return d > this.currentDate;
  }

  /**
   * 自动补完剩下的必要的信息
   */
  onSubmit() {
    this.profile.get('createBy').setValue(this.userInfo.userCode);
    this.profile.get('createPov').setValue(this.userInfo.pov);
    this.profile.get('createSource').setValue(this.CreateSourcePov); // 2 - POV 建档
    this.profile.get('uploadStatusCode').setValue(this.UploadStatusFalse);
    this.profile.get('vaccinationPovCode').setValue(this.userInfo.pov);
    this.fullfillProvinceAndCity();
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
      this.msg.warning('表单填写不完整或有误，请检查');
      return;
    }
    if (!this.operationUpdate) {
      this.saveChildProfile();
    } else {
      this.updateChildProfile();
    }
    // }
  }

  saveChildProfile() {
    if (this.profile.get('birthWeight').value && this.profile.get('birthWeight').value < 0) {
      this.msg.warning('出生体重不可为负数，请重新填写');
      return;
    }
    // formatDate
    let profile = JSON.parse(JSON.stringify(this.profile.value));
    const birthDate = this.profile.get('birthDate').value;
    // profile['birthDate'] = birthDate.format('YYYY-MM-DD HH:mm:ss');
    profile['birthDate'] = DateUtils.getFormatDateTime(birthDate);
    profile['birthHospitalCode'] = this.hospitalCode;
    this.showLoading.emit(true);
    this.profileService.saveProfile(profile, result => {
      // console.log(result);
      this.showLoading.emit(false);
      if (result.code === 0) {
        this.msg.success('档案创建成功');
        let p = result.data;
        // 如果是叫号过程中需要建档数据，则添加globalRecordNumber 字段，用以区分叫号之后的建档和非叫号的建档
        if (this.callNumberData) {
          p['globalRecordNumber'] = this.callNumberData['globalRecordNumber'];
        }
        // 更新自助建档
        this.changeSelfProfile();
        this.profileDataService.setProfileData(p);
        this.dialog.open(AddProfileDetailDialogComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false
        }).onClose.subscribe(() => this.profileDataService.setProfileData(p));
        this.ref.close(true);
      }
    });
  }

  updateChildProfile() {
    // formatDate
    let profile = JSON.parse(JSON.stringify(this.profile.value));
    const birthDate = this.profile.get('birthDate').value;
    // profile['birthDate'] = birthDate.format('YYYY-MM-DD HH:mm:ss');
    profile['birthDate'] = DateUtils.getFormatDateTime(birthDate);
    // profile['birthDate'] = DateUtils.getFormatDateTime(this.profile.get('birthDate').value);
    profile['profileCode'] = this.updateData['profileCode'];
    profile['birthHospitalCode'] = this.hospitalCode;
    if (profile['uploadDate']) {
      profile['uploadDate'] = null;
    }
    if (profile['lastModifyDate']) {
      profile['lastModifyDate'] = null;
    }
    if (profile['createDate']) {
      profile['createDate'] = null;
    }
    this.showLoading.emit(true);
    console.log('待更新的儿童档案为', profile);
    this.profileService.updateChildProfile(profile, resp => {
      this.showLoading.emit(false);
      // console.log('更新后儿童档案信息', resp);
      if (resp.code !== 0) {
        this.msg.error('更新档案失败，请重试');
        return;
      }
      this.ref.close(true);
      this.msg.success('更新档案成功');
    });
  }

  /**
   * 根据输入的身份证号自动设置出生日期和性别
   */
  onIdCardInputChange() {
    if (
      this.profile.get('idCardType').value === '01' &&
      this.profile.get('idCardNo').valid
    ) {
      const idCardNoValue = this.profile.get('idCardNo').value;
      if (!idCardNoValue) {
        return;
      }
      const idCardNo = idCardNoValue + '';
      const birthStr = idCardNo.substring(6, 14);
      // const birthDate = this.momentSvc.parse(birthStr, 'YYYY/MM/DD');
      // console.log('自动计算生日日期', birthStr); // 20180206
      const year = birthStr.substr(0, 4);
      const month = Number(birthStr.substr(4, 2)) - 1;
      const date = Number(birthStr.substr(6, 2));
      const birthDate = new Date(Number(year), month, date);
      // console.log('birthDate', birthDate);
      // 佐罗的时间赋值格式为birthDate: Tue Feb 06 2018 00:00:00 GMT+0800 (中国标准时间) 或者2018-02-06
      this.profile.get('birthDate').setValue(birthDate);
      const genderStr = Number(idCardNo.substring(16, 17));
      console.log('sex', this.profile.get('gender').value);
      if (genderStr % 2 === 0) {
        this.profile.get('gender').setValue('f');
      } else {
        this.profile.get('gender').setValue('m');
      }
    }
  }

  /**
   * 自动补全居住地址或者户口地址
   */
  fullfillProvinceAndCity() {
    if (this.profile.get('idCardAddr').valid) {
      const idCardAddr = this.profile.get('idCardAddr').value;
      this.profile.get('idCardProvCode').setValue(idCardAddr[0]);
      this.profile.get('idCardCityCode').setValue(idCardAddr[1]);
      this.profile.get('idCardDistrictCode').setValue(idCardAddr[2]);
    }
    if (!!this.profile.get('liveAddr').value) {
      const liveAddr = this.profile.get('liveAddr').value;
      this.profile.get('liveProvCode').setValue(liveAddr[0]);
      this.profile.get('liveCityCode').setValue(liveAddr[1]);
      this.profile.get('liveDistrictCode').setValue(liveAddr[2]);
    }
  }

  /**
   * 证件类型发生变化，需要重置证件号码的值
   * @param ev
   */
  onIdCardTypeChange(key) {
    this.profile.get(key).patchValue(null);
  }

  changeBirthDate(e) {
    const ageInfo = TransformUtils.getAgeFromBirthDate(e['birthDate']);
    if (!!ageInfo && ageInfo.age >= 16) {
      this.dialog
        .open(ConfirmDialogComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: {
            title: '提示',
            content: '您输入的年龄大于等于16岁，是否转到【成人档案】页面？'
          }
        })
        .onClose.subscribe(resp => {
        if (resp) {
          this.changeFileType.emit('adult');
        }
      });
    }
  }

  /*
   * 选择出生医院
   * */
  selectPovAndHospital(index: boolean) {
    this.dialog
      .open(SelectHospitalComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          flag: index
        }
      })
      .onClose.subscribe(resp => {
      if (resp) {
        this.hospitalCode = resp.value;
        this.profile.get('birthHospitalCode').setValue(resp.label);
      }
    });
  }

  /*
   * 自助建档信息
   * */
  searchSelfProfile() {
    if (this.loading) return;
    if (!this.selfFileCode || this.selfFileCode.trim() === '' || this.selfFileCode === null) return;
    this.loading = true;
    /*this.profileService.queryChildSelfProfile(id, resp => {
      if (resp && resp.hasOwnProperty('data')) {
        this.selfProfileData = resp.data;
        if (this.selfProfileData['gender'] === '1') {
          this.profile.get('gender').setValue('m');
        } else {
          this.profile.get('gender').setValue('f');
        }
        console.log(this.selfProfileData['birthday']);
        let birthStr = this.selfProfileData['birthday'].toString().substring(0, 10);
        const year = birthStr.substring(0, 4);
        const month = Number(birthStr.substring(5, 7)) - 1;
        const date = birthStr.substring(8);
        const birthDate = new Date(year, month, date);
        this.profile.get('birthDate').setValue(birthDate);
        this.profile.get('name').setValue(this.selfProfileData['childname']);
        this.profile.get('memo').setValue(this.selfProfileData['remarks']);
        this.profile.get('birthCardNo').setValue(this.selfProfileData['birthcode']); // 出生证号
        this.profile.get('idTypeCode').setValue(OldDicTransformUtil.transformIdTypeCode(this.selfProfileData['properties'], this.idType, this.oldDictionaryInfo)); // 户口类型
        this.profile.get('residentialTypeCode').setValue(this.selfProfileData['reside']); // 居住属性
        if (this.selfProfileData['situation']) {
          this.profile.get('profileStatusCode').setValue(OldDicTransformUtil.getProfileStatus(this.selfProfileData['situation'], this.profileStatus, this.oldDictionaryInfo)); // 在册状态
        }
        if (this.selfProfileData['nation']) {
          this.profile.get('nationCode').setValue(OldDicTransformUtil.transformNationCode(this.selfProfileData['nation'], this.nationOptions, this.oldDictionaryInfo)); // 民族
        }
        this.profile.get('motherName').setValue(this.selfProfileData['motherName']); // 监护人名字
        this.profile.get('motherContactPhone').setValue(this.selfProfileData['guardianmobile']); // 监护人联系方式
        this.profile.get('motherIdCardNo').setValue(this.selfProfileData['guardianidentificationnumber']); // 监护人证件号
        this.profile.get('community').setValue(this.selfProfileData['community']); // 社区
        this.profile.get('birthHospitalCode').setValue(this.selfProfileData['birthhostipal']); // 出生医院
        this.profile.get('birthWeight').setValue(this.selfProfileData['birthweight']); // 体重
        this.profile.get('parity').setValue(this.selfProfileData['childorder']); // 胎次
        this.profile.get('createDate').setValue(this.selfProfileData['createdate']); // 建档日期
        this.profile.get('idCardDetail').setValue(this.selfProfileData['add']); // 户口详细地址
        if (this.selfProfileData['pr'] && this.selfProfileData['ci'] && this.selfProfileData['co']) {
          const idCardProvCode = this.selfProfileData['pr'] + '000000';
          const idCardCityCode = this.selfProfileData['ci'] + '000000';
          const idCardDistrictCode = this.selfProfileData['co'] + '000000';
          this.profile.get('idCardProvCode').setValue(idCardProvCode); // 省
          this.profile.get('idCardCityCode').setValue(idCardCityCode); // 市
          this.profile.get('idCardDistrictCode').setValue(idCardDistrictCode); // 区
          this.profile.get('idCardAddr').setValue([idCardProvCode, idCardCityCode, idCardDistrictCode]); // 户口地址
        }
        this.profile.get('liveDetail').setValue(this.selfProfileData['address']); // 家庭详细地址
        if (this.selfProfileData['province'] && this.selfProfileData['city'] && this.selfProfileData['county']) {
          const liveProvCode = this.selfProfileData['province'] + '000000';
          const liveCityCode = this.selfProfileData['city'] + '000000';
          const liveDistrictCode = this.selfProfileData['county'] + '000000';
          this.profile.get('liveProvCode').setValue(liveProvCode); // 省
          this.profile.get('liveCityCode').setValue(liveCityCode); // 市
          this.profile.get('liveDistrictCode').setValue(liveDistrictCode); // 区
          this.profile.get('liveAddr').setValue([liveProvCode, liveCityCode, liveDistrictCode]); // 户口地址
        }
      }
    });*/
    let params = {
      checkCode: this.selfFileCode,
      checkStatus: ['0']
    };
    this.SelfProfileSvc.querySelfProfile(params, resp => {
      this.loading = false;
      console.log(resp);
      if (
        resp &&
        resp.code === 0 &&
        resp.hasOwnProperty('data') &&
        resp.data.length !== 0
      ) {
        this.selfProfileData = resp.data[0];
        console.log(this.selfProfileData);
        this.profile.get('gender').setValue(this.selfProfileData.gender);
        let birthStr = DateUtils.getFormatDateTime(
          this.selfProfileData.birthDate
        );
        console.log('出生日期', birthStr);
        // let birthDate = this.momentSvc.parse(birthStr, 'YYYY/MM/DD'); nebular中的日期组件的转换
        this.profile.get('birthDate').setValue(birthStr);
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
        this.profile
          .get('idCardDetail')
          .setValue(this.selfProfileData['idCardDetail']); // 户口详细地址
        if (
          this.selfProfileData['idCardProvCode'] &&
          this.selfProfileData['idCardCityCode'] &&
          this.selfProfileData['idCardDistrictCode']
        ) {
          const idCardProvCode = this.selfProfileData['idCardProvCode'];
          const idCardCityCode = this.selfProfileData['idCardCityCode'];
          const idCardDistrictCode = this.selfProfileData['idCardDistrictCode'];
          this.profile.get('idCardProvCode').setValue(idCardProvCode); // 省
          this.profile.get('idCardCityCode').setValue(idCardCityCode); // 市
          this.profile.get('idCardDistrictCode').setValue(idCardDistrictCode); // 区
          this.profile
            .get('idCardAddr')
            .setValue([idCardProvCode, idCardCityCode, idCardDistrictCode]); // 户口地址
        }
        this.profile
          .get('motherContactPhone')
          .setValue(this.selfProfileData.motherContactPhone);
        this.profile
          .get('motherIdCardNo')
          .setValue(this.selfProfileData.motherIdCardNo);
        this.profile
          .get('motherName')
          .setValue(this.selfProfileData.motherName);
        if (this.selfProfileData.nationCode) {
          this.profile
            .get('nationCode')
            .setValue(this.selfProfileData.nationCode);
        }
        if (this.selfProfileData.immunityVacCard) {
          this.profile
            .get('immunityVacCard')
            .setValue(this.selfProfileData.immunityVacCard);
        }
        if (this.selfProfileData.idCardNo) {
          this.profile.get('idCardNo').setValue(this.selfProfileData.idCardNo);
        }
        if (this.selfProfileData.birthCardNo) {
          this.profile
            .get('birthCardNo')
            .setValue(this.selfProfileData.birthCardNo); // 出生证编号
        }
        if (this.selfProfileData.birthHospitalCode) {
          this.profile
            .get('birthHospitalCode')
            .setValue(this.selfProfileData.birthHospitalCode);
        }
        if (this.selfProfileData.birthWeight) {
          this.profile
            .get('birthWeight')
            .setValue(this.selfProfileData.birthWeight);
        }
        if (this.selfProfileData.parity) {
          this.profile.get('parity').setValue(this.selfProfileData.parity);
        }
        if (this.selfProfileData.idTypeCode) {
          this.profile
            .get('idTypeCode')
            .setValue(this.selfProfileData.idTypeCode);
        }
        if (this.selfProfileData.memo) {
          this.profile.get('memo').setValue(this.selfProfileData.memo);
        }
        if (this.selfProfileData.fatherIdCardNo) {
          this.profile.get('fatherIdCardNo').setValue(this.selfProfileData.fatherIdCardNo);
        }
        if (this.selfProfileData.fatherName) {
          this.profile.get('fatherName').setValue(this.selfProfileData.fatherName);
        }
        if (this.selfProfileData.fatherContactPhone) {
          this.profile.get('fatherContactPhone').setValue(this.selfProfileData.fatherContactPhone);
        }
        if (this.selfProfileData.residentialTypeCode) {
          this.profile.get('residentialTypeCode').setValue(this.selfProfileData.residentialTypeCode);
        }
      }
      this.selfFileCode = null;
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
      console.log('params', params);
      this.SelfProfileSvc.updateSelfProfileCheckStatus(params, resp => {
        console.log(resp);
        this.loading = false;
        if (resp.code === 0) {
          // console.warn('自助建档修改成功');
        }
      });
    }
  }

  // 免疫卡号切换radio
  changeRadio(event) {
    console.log('切换radio', event);
    if (event === 'scan') {
      this.profile.get('immunityVacCard').setValue('');
      this.profile.get('immunityVacCard').clearValidators();
      this.profile.get('immunityVacCard').updateValueAndValidity();
      // this.validateForm.controls[i].updateValueAndValidity();
      this.dialog.open(ModifyDialogComponent, {}).onClose.subscribe(resp => {
        // console.log('扫苗的结果', resp);
        this.profile.get('immunityVacCard').markAsDirty();
        this.profile.get('immunityVacCard').markAsTouched();
        if (resp && resp.hasOwnProperty('immunizationNum')) {
          const immunizationNum = resp['immunizationNum'];
          // console.log('免疫卡号', immunizationNum);
          if (immunizationNum.length === 12) {
            this.profileService.decodeImmunityVacCard(immunizationNum, res => {
              // console.log('解密结果', res);
              if (res && res.code === 0 && res.data) {
                this.profile.get('immunityVacCard').setValue(res.data);
              }
            });
          } else {
            this.profile.get('immunityVacCard').setValue(immunizationNum);
          }
        } else {
          this.profile.get('selectType').setValue('hand');
        }
      });
    } else {
      this.profile.get('immunityVacCard').setValue('');
    }
  }

  // 切换性别
  changeSexRadio(event) {
    // console.log('sex', event);
  }
}

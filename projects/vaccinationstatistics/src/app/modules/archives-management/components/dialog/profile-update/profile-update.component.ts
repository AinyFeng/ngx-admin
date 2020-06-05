import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { DicDataService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent implements OnInit {

  @Input()
  tabIndex: number;
  @Input()
  profiledata: any;

  // 性别
  genderOptions: any;
  saveForm: any;

  isChild = true;

  @Output()
  readonly tabIndexChange = new EventEmitter();

  constructor(
    private modalService: NzModalService,
    private dicSvc: DicDataService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    // 性别
    this.genderOptions = this.dicSvc.getDicDataByKey('genderCode');
    this.isChild = this.profiledata.isChild;
    this.saveForm = this.fb.group({
      profileCode: [this.profiledata ? this.profiledata.profileCode : null], // 儿童编码
      name: [this.profiledata ? this.profiledata.name : null], // 儿童姓名
      birthCardNo: [this.profiledata ? this.profiledata.birthCardNo : null], // 出生证号
      idCardNo: [this.profiledata ? this.profiledata.idCardNo : null], // 身份证号
      gender: [this.profiledata ? this.profiledata.gender : null], // 性别
      birthDate: [this.profiledata ? this.profiledata.birthDate : null], // 出生日期
      birthHospitalCode: [this.profiledata ? this.profiledata.birthHospitalCode : null], // 出生医院编码
      birthWeight: [this.profiledata ? this.profiledata.birthWeight : null], // 出生体重(kg)
      motherName: [this.profiledata ? this.profiledata.motherName : null], // 母亲姓名
      motherContactPhone: [this.profiledata ? this.profiledata.motherContactPhone : null], // 母亲手机
      motherIdCardNo: [this.profiledata ? this.profiledata.motherIdCardNo : null], // 母亲身份证
      parity: [this.profiledata ? this.profiledata.parity : null], // 孩次
      createBy: [this.profiledata ? this.profiledata.createBy : null], // 创建者
      createDate: [this.profiledata ? this.profiledata.createDate : null], // 创建日期
      liveProvCode: [this.profiledata ? this.profiledata.liveProvCode : null], // 省(居住)
      liveCityCode: [this.profiledata ? this.profiledata.liveCityCode : null], // 市(居住)
      liveDistrictCode: [this.profiledata ? this.profiledata.liveDistrictCode : null], // 县(居住)
      liveDetail: [this.profiledata ? this.profiledata.liveDetail : null], // 详细地址(居住)
      idCardProvCode: [this.profiledata ? this.profiledata.idCardProvCode : null], // 省(户口)
      idCardCityCode: [this.profiledata ? this.profiledata.idCardCityCode : null], // 市(户口)
      idCardDistrictCode: [this.profiledata ? this.profiledata.idCardDistrictCode : null], // 县(户口)
      idCardDetail: [this.profiledata ? this.profiledata.idCardDetail : null], // 详细地址(户口)
      idTypeCode: [this.profiledata ? this.profiledata.idTypeCode : null], // 户口属性
      residentialTypeCode: [this.profiledata ? this.profiledata.residentialTypeCode : null], // 居住属性
      community: [this.profiledata ? this.profiledata.community : null], // 区域划分
      contactAddress: [this.profiledata ? this.profiledata.contactAddress : null], // 通讯地址
      nationCode: [this.profiledata ? this.profiledata.nationCode : null], // 民族编码
      profileStatusCode: [this.profiledata ? this.profiledata.profileStatusCode : null], // 在册情况
      vaccinatePovCode: [this.profiledata ? this.profiledata.vaccinatePovCode : null], // 接种单位编码
      fatherName: [this.profiledata ? this.profiledata.fatherName : null], // 父亲姓名
      fatherContactPhone: [this.profiledata ? this.profiledata.fatherContactPhone : null], // 父亲手机
      fatherIdCardNo: [this.profiledata ? this.profiledata.fatherIdCardNo : null], // 父亲身份证号
      profileCodeTopTen: [this.profiledata ? this.profiledata.profileCodeTopTen : null], // 儿童编码前十位【不确定】
      checkCode: [this.profiledata ? this.profiledata.checkCode : null], // 建档编号
      memo: [this.profiledata ? this.profiledata.memo : null], // 备注
    });
    console.log('之后', this.profiledata);
    if (this.isChild) {
      this.saveForm.get('name').setValidators(Validators.required);
      this.saveForm.get('profileCode').setValidators(Validators.required);
      this.saveForm.get('gender').setValidators(Validators.required);
      this.saveForm.get('birthDate').setValidators(Validators.required);
      this.saveForm.get('motherName').setValidators(Validators.required);
      this.saveForm.get('motherContactPhone').setValidators(Validators.required);
      this.saveForm.get('motherIdCardNo').setValidators(Validators.required);
      this.saveForm.get('liveProvCode').setValidators(Validators.required);
      this.saveForm.get('liveCityCode').setValidators(Validators.required);
      this.saveForm.get('idCardProvCode').setValidators(Validators.required);
      this.saveForm.get('idCardCityCode').setValidators(Validators.required);
      this.saveForm.get('UpdateDate').setValidators(Validators.required);
      this.saveForm.updateValueAndValidity();
    } else {
      this.saveForm.get('birthCardNo').setValidators(Validators.required);
      this.saveForm.updateValueAndValidity();
    }
  }


  submitForm() {
    // 检查表单必填项填写
    for (const i in this.saveForm.controls) {
      if (this.saveForm.controls[i]) {
        this.saveForm.controls[i].markAsDirty();
        this.saveForm.controls[i].updateValueAndValidity();
      }
    }
    console.log(this.saveForm);
    if (this.saveForm.invalid) {
      this.modalService.warning({
        nzTitle: '提示',
        nzContent: `<p>表格填写不完整，请检查</p>`,
        nzMaskClosable: true
      });
      return;
    }
  }

  close() {
    this.tabIndexChange.emit(0);
  }

}

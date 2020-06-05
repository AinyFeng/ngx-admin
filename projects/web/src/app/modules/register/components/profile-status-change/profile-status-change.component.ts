import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';
import { ProfileDataService, ProfileService, DicDataService, ProfileStatusChangeService, CommunityDataService, DateUtils } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-f-registered-status-change',
  templateUrl: './profile-status-change.component.html',
  styleUrls: ['./profile-status-change.component.scss']
})
export class ProfileStatusChangeComponent implements OnInit {
  form: FormGroup;
  loading = false;

  profile: any;

  // 所属区块 或 区域划分
  communityOptions = [];

  // 居住属性选项
  residentialOptions = [];

  // 在册状态变更选项
  profileStatusChangeOptions = [];

  // 在册状态变更原因
  profileStatusChangeReason = [];

  // 档案中用于显示的档案在册状态，包括：在册、离册等
  profileStatusDisplayOptions = [];

  showRequired = false;
  // 用户信息
  userInfo: any;

  constructor(
    private ref: NbDialogRef<ProfileStatusChangeComponent>,
    private profileDataSvc: ProfileDataService,
    private fb: FormBuilder,
    private profileSvc: ProfileService,
    private dicDataSvc: DicDataService,
    private changeSvc: ProfileStatusChangeService,
    private msg: NzMessageService,
    private userSvc: UserService,
    private communitySvc: CommunityDataService
  ) { }

  ngOnInit() {
    this.residentialOptions = this.dicDataSvc.getDicDataByKey(
      'residentialType'
    );
    this.profileStatusChangeOptions = this.dicDataSvc.getDicDataByKey(
      'profileStatusChange'
    );
    this.profileStatusChangeReason = this.dicDataSvc.getDicDataByKey(
      'profileStatusChangeReason'
    );
    this.communityOptions = this.communitySvc.getCommunityData();
    this.profileStatusDisplayOptions = this.dicDataSvc.getDicDataByKey(
      'profileStatus'
    );
    this.form = this.fb.group({
      community: [null, [Validators.required]], // 所属区划
      residentialTypeCode: [null, [Validators.required]], // 居住属性
      curProfileStatus: [null, [Validators.required]], // 在册变更选项的值，变更后在册状态
      preProfileStatus: [null, [Validators.required]], // 变更前在册状态
      memo: [null],
      changeReason: [null] // 变更原因
    });
    this.profileDataSvc.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
        this.form
          .get('community')
          .setValue(this.profile['community']);
        this.form
          .get('residentialTypeCode')
          .setValue(this.profile['residentialTypeCode']);
        this.form
          .get('preProfileStatus')
          .setValue(this.profile['profileStatusCode']);
        const v = this.profile['profileStatusCode'] + '';
        this.form.get('curProfileStatus').setValue(v);
        this.changeOption(this.getProfileStatusValByStatusKey(v));
      }
    });
    this.userSvc.getUserInfoByType().subscribe(user => (this.userInfo = user));
  }

  onClose() {
    this.ref.close();
  }

  onSubmit() {
    if (
      !this.profile ||
      this.form.untouched ||
      this.form.pristine ||
      !this.userInfo
    )
      return;
    // 添加变更时间
    // console.log(this.form);
    for (const key in this.form.controls) {
      if (this.form.controls[key].invalid) {
        this.form.controls[key].markAsDirty();
        this.form.controls[key].markAsTouched();
      }
    }
    if (this.form.invalid) {
      this.msg.warning('表单内容填写有误或未选择，请检查');
      return;
    }
    let save = {
      record: {
        changeDate: DateUtils.getNewDateTime(),
        changeReason: this.form.get('changeReason').value,
        memo: this.form.get('memo').value,
        changeBy: this.userInfo.userCode,
        curPov: this.userInfo.pov,
        preProfileStatus: this.form.get('preProfileStatus').value,
        curProfileStatus: this.form.get('curProfileStatus').value,
        profileCode: this.profile['profileCode']
      },
      residentialTypeCode: this.form.get('residentialTypeCode').value,
      community: this.form.get('community').value
    };
    // console.log(save);
    this.loading = true;
    this.changeSvc.insertRecord(save, resp => {
      this.loading = false;
      // console.log(resp);
      if (resp.code !== 0) {
        this.msg.error('在册变更操作失败，请重试');
        return;
      }
      this.ref.close(true);
    });
  }

  changeProfileStatus(e) {
    this.showRequired = false;
    this.form.get('memo').clearValidators();
    this.form.get('changeReason').clearValidators();
    const key = this.getProfileStatusValByStatusKey(e);
    this.changeOption(key);
  }

  changeOption(key: string) {
    if (key === '外地转来') {
      this.form
        .get('changeReason')
        .disable({ onlySelf: true, emitEvent: false });
      this.form.get('changeReason').setValue(null);
      this.form.get('memo').disable({ onlySelf: true, emitEvent: false });
      this.form.get('memo').setValue(null);
    } else if (key === '临时外转' || key === '迁出') {
      this.form.get('changeReason').enable({ onlySelf: true });
      this.form
        .get('changeReason')
        .setValue(this.profileStatusChangeReason[0].value);
      this.form.get('changeReason').setValidators(Validators.required);
      this.form.get('changeReason').updateValueAndValidity();
      this.form.get('memo').enable({ onlySelf: true });
      this.form.get('memo').setValidators(Validators.required);
      this.form.get('memo').updateValueAndValidity();
      this.showRequired = true;
    } else {
      this.form.get('changeReason').enable({ onlySelf: true });
      this.form
        .get('changeReason')
        .setValue(this.getProfileStatusValueByStatusLabel());
      this.form
        .get('changeReason')
        .disable({ onlySelf: true, emitEvent: false });
      this.form.get('memo').enable({ onlySelf: true });
    }
  }

  /**
   * 根据相应的数值code 获取中文label
   * @param key
   */
  getProfileStatusValByStatusKey(key: string) {
    for (let i = 0; i < this.profileStatusChangeOptions.length; i++) {
      if (key === this.profileStatusChangeOptions[i].value) {
        return this.profileStatusChangeOptions[i].label;
      }
    }
  }

  /**
   * 根据选项中变更原因的中文label 获取对应变更原因的数值 code
   * @param label
   */
  getProfileStatusValueByStatusLabel(label = '其它') {
    for (let i = 0; i < this.profileStatusChangeReason.length; i++) {
      if (label === this.profileStatusChangeReason[i].label.trim()) {
        return this.profileStatusChangeReason[i].value;
      }
    }
  }
}

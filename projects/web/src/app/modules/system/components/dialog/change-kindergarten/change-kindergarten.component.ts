import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { NbDialogRef } from '@nebular/theme';
import { UserService } from '@tod/uea-auth-lib';
import { SchoolBaseInfoService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-change-kindergarten',
  templateUrl: './change-kindergarten.component.html',
  styleUrls: ['../../system.common.scss']
})
export class ChangeKindergartenComponent implements OnInit {
  schoolForm: FormGroup;
  updateData: any;
  userInfo: any;

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private ref: NbDialogRef<ChangeKindergartenComponent>,
    private schoolSvc: SchoolBaseInfoService,
  ) {
  }

  ngOnInit() {
    this.schoolForm = this.fb.group({
      schoolCode: [
        this.updateData ? this.updateData.schoolCode : null,
        [Validators.required]
      ], // 幼儿园编码
      unitFullName: [this.updateData ? this.updateData.name : null],
      // unitName: [this.updateData ? this.updateData.name : null, [Validators.required]],
      address: [this.updateData ? this.updateData.address : null, [Validators.required]],
      contact: [this.updateData ? this.updateData.principal : null],
      contactNumber: [this.updateData ? this.updateData.principalPhone : null],
      // telphone: [this.updateData ? this.updateData.principalPhone : null],
      memo: [this.updateData ? this.updateData.memo : null]
    });
  }

  onClose() {
    this.ref.close();
  }

  // 保存修改
  saveInfo() {
    if (!this.updateData) return;
    if (this.schoolForm.invalid) {
      this.msg.warning('表单填写不完整或有误，请检查');
      return;
    }
    let params = JSON.parse(JSON.stringify(this.schoolForm.value));
    params.id = this.updateData.id;
    params.belongPovCode = this.userInfo.pov;
    params.schoolType = this.updateData.schoolType;
    console.log(params);
    this.schoolSvc.updateSchoolBaseInfo(params, resp => {
      console.log(resp);
      if (resp && resp.code === 0 && resp.hasOwnProperty('data')) {
        this.msg.warning('更新学校数据成功');
        this.ref.close();
      }
    });
  }
}

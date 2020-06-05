import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HospitalBaseInfoService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-add-hospital',
  templateUrl: './add-hospital.component.html',
  styleUrls: ['../../system.common.scss']
})
export class AddHospitalComponent implements OnInit {
  // 需要修改的数据
  updateData: any;

  hospitalForm: FormGroup;

  constructor(
    private ref: NbDialogRef<AddHospitalComponent>,
    private fb: FormBuilder,
    private hospitalSvc: HospitalBaseInfoService,
    private msg: NzMessageService
  ) { }

  ngOnInit() {
    this.hospitalForm = this.fb.group({
      hospitalCode: [
        this.updateData ? this.updateData.hospitalCode : null,
        [Validators.required]
      ], // 医院编码
      hospitalName: [
        this.updateData ? this.updateData.hospitalName : null,
        [Validators.required]
      ], // 医院名称
      memo: [this.updateData ? this.updateData.memo : null] // 备注
      // sort: [this.updateData ? this.updateData.sort : 1, null], // 排序
    });
  }

  // 修改保存医院信息
  saveHospitalInfo() {
    if (!this.updateData) return;
    if (this.hospitalForm.invalid) {
      this.msg.warning('表单填写不完整或有误，请检查');
      return;
    }
    let params = JSON.parse(JSON.stringify(this.hospitalForm.value));
    params.id = this.updateData.id;
    console.log('参数', params);
    this.hospitalSvc.updateHospitalBaseInfo(params, resp => {
      console.log(resp);
      if (resp && resp.code === 0 && resp.hasOwnProperty('data')) {
        this.msg.warning('更新门诊信息成功');
        this.ref.close();
      }
    });
  }

  onClose() {
    this.ref.close();
  }
}

import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { PovInfoService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-pov-dialog',
  templateUrl: './pov-dialog.component.html',
  styleUrls: ['../../system.common.scss']
})
export class PovDialogComponent implements OnInit {
  addPovForm: FormGroup;
  // 改变的数据
  updateData: any;

  constructor(
    private ref: NbDialogRef<PovDialogComponent>,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private povService: PovInfoService
  ) { }

  ngOnInit() {
    this.addPovForm = this.fb.group({
      povCode: [this.updateData ? this.updateData.povCode : null, [Validators.required]], // 门诊编码
      povShort: [this.updateData ? this.updateData.name : null, [Validators.required]], // 门诊简称
      fullName: [this.updateData ? this.updateData.fullName : null, [Validators.required]], // 门诊全称
      memo: [this.updateData ? this.updateData.memo : null], // 备注
    });
  }

  // 关闭
  onClose() {
    this.ref.close();
  }

  // 保存
  savePovInfo() {
    if (this.updateData) {
      if (this.addPovForm.invalid) {
        this.msg.warning('表单填写不完整或有误，请检查');
        return;
      }
      let params = JSON.parse(JSON.stringify(this.addPovForm.value));
      params.id = this.updateData.id;
      this.povService.updatePovInfo(params, resp => {
        if (resp && resp.code === 0 && resp.hasOwnProperty('data')) {
          this.msg.warning('更新门诊信息成功');
          this.ref.close();
        }
      });
    } else {
      /*let params = JSON.parse(JSON.stringify(this.addPovForm.value));
      this.povService.addPovInfo(params, resp => {
        console.log(resp);
        if (resp && resp.code === 0 && resp.hasOwnProperty('data')) {
          this.msg.warning('添加门诊信息成功');
          this.ref.close();
        }
      });*/
    }
  }
}

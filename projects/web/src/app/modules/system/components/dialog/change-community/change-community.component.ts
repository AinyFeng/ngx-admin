import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { CommunityBaseInfoService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-change-community',
  templateUrl: './change-community.component.html',
  styleUrls: ['../../system.common.scss']
})
export class ChangeCommunityComponent implements OnInit {
  communityForm: FormGroup;

  // 需要修改数据
  updateData: any;

  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<ChangeCommunityComponent>,
    private msg: NzMessageService,
    private communitySvc: CommunityBaseInfoService
  ) { }

  ngOnInit() {
    this.communityForm = this.fb.group({
      communityCode: [
        this.updateData ? this.updateData.communityCode : null,
        [Validators.required]
      ], // 社区编码
      communityName: [
        this.updateData ? this.updateData.communityName : null,
        [Validators.required]
      ], // 社区名称
      memo: [this.updateData ? this.updateData.memo : null]
    });
  }

  // 关闭
  onClose() {
    this.ref.close();
  }

  // 保存
  saveCommunity() {
    if (!this.updateData) return;
    if (this.communityForm.invalid) {
      this.msg.warning('表单填写不完整或有误，请检查');
      return;
    }
    let params = JSON.parse(JSON.stringify(this.communityForm.value));
    params.id = this.updateData.id;
    this.communitySvc.updateCommunityBaseInfo(params, resp => {
      if (resp && resp.code === 0 && resp.hasOwnProperty('data')) {
        this.msg.warning('更新社区数据成功');
        this.ref.close();
      }
    });
  }
}

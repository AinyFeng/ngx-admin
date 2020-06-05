import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiSystemWorkingTimeService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-sys-working-time-add',
  templateUrl: './sys-working-time-add.component.html',
  styleUrls: ['../system.common.scss']
})
export class SysWorkingTimeAddComponent implements OnInit {

  addWorkingTimeForm: FormGroup;
  loading = false;
  userInfo: any;
  /**
   * 工作日选项
   */
  workingDayOptions = [
    { label: '星期日', value: 0 },
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 }
  ];

  /**
   * 工作时间段类型选项
   */
  workingRoundOptions = [
    { label: '周', value: '0', disabled: false },
    { label: '单双周', value: '1', disabled: true },
    { label: '月', value: '2', disabled: true }
  ];

  useAbleOptions = [
    { label: '可用', value: '1' },
    { label: '不可用', value: '0' }
  ];

  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<SysWorkingTimeAddComponent>,
    private userSvc: UserService,
    private msg: NzMessageService,
    private sysWorkingTimeApiSvc: ApiSystemWorkingTimeService,
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.addWorkingTimeForm = this.fb.group({
      workingTime: [null, [Validators.required]], // 工作时间段
      workingDay: [0, [Validators.required]], // 工作日
      workingRound: ['0', [Validators.required]], // 工作周期 0 - 周，1 - 单双周， 2 - 月
      reservationCount: [10, [Validators.required, Validators.min(0), Validators.max(100)]], // 可预约人数
      useAble: ['1', [Validators.required]], // 可用状态
      createBy: [null, [Validators.required]], // 创建人
      povCode: [null, [Validators.required]]
    });
  }
  /**
   * 保存工作时间
   */
  saveWorkingTime() {
    this.addWorkingTimeForm.get('createBy').setValue(this.userInfo.userCode);
    this.addWorkingTimeForm.get('povCode').setValue(this.userInfo.pov);
    console.log(this.addWorkingTimeForm);
    if (this.addWorkingTimeForm.invalid) {
      this.msg.info('表单填写不正确，请检查');
      return;
    }
    this.sysWorkingTimeApiSvc.insertWorkingTime(this.addWorkingTimeForm.value, resp => {
      if (resp.code === 0) {
        this.ref.close(true);
      } else {
        this.msg.warning('保存失败，请重试');
      }
    });
  }
  // 关闭弹窗
  close() {
    this.ref.close();
  }
}

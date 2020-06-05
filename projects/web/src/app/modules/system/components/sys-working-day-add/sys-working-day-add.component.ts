import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DicDataService, ApiSystemWorkingDayService } from '@tod/svs-common-lib';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-sys-working-day-add',
  templateUrl: './sys-working-day-add.component.html',
  styleUrls: ['../system.common.scss']
})
export class SysWorkingDayAddComponent implements OnInit {
  workingDayForm: FormGroup;

  workingRoundOptions = [];
  loading = false;

  userInfo: any;

  useAbleOptions = [
    { label: '可用', value: '1' },
    { label: '不可用', value: '0' }
  ];

  constructor(
    private dicSvc: DicDataService,
    private fb: FormBuilder,
    private ref: NbDialogRef<SysWorkingDayAddComponent>,
    private msg: NzMessageService,
    private thisApiService: ApiSystemWorkingDayService,
    private userSvc: UserService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
    console.log('userInfo===', this.userInfo);
  }

  ngOnInit() {
    this.workingRoundOptions = this.dicSvc.getDicDataByKey('workingRound');
    this.workingRoundOptions.forEach(w => {
      w.disabled = w.label !== '0';
    });
    this.workingDayForm = this.fb.group({
      workingDay: [null,
        [Validators.required]
      ],
      workingRound: ['0', [Validators.required]], // 周期
      povCode: [null, [Validators.required]],
      useAble: ['1', [Validators.required]],
      createBy: [null, [Validators.required]]
    });
  }

  onClose() {
    this.ref.close();
  }

  onSubmit() {
    if (!this.userInfo) return;
    this.workingDayForm.get('createBy').setValue(this.userInfo.userCode);
    this.workingDayForm.get('povCode').setValue(this.userInfo.pov);
    if (this.workingDayForm.invalid) {
      this.msg.warning('表单内容填写有误或未选择，请检查');
      return;
    }
    // console.log("保存工作日信息",workingDayJson);
    this.thisApiService.insertWorkingDay(this.workingDayForm.value, data => {
      if (data && data.code === 0) {
        this.msg.info(data.msg);
        this.ref.close(true);
      } else {
        this.msg.warning(data.msg);
      }
    });
  }
}

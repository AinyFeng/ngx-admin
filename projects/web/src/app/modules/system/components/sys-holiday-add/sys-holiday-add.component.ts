import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DicDataService, ApiSystemHolidayDayService, DateUtils } from '@tod/svs-common-lib';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-sys-holiday-add',
  templateUrl: './sys-holiday-add.component.html',
  styleUrls: ['../system.common.scss'],
  providers: [
    ApiSystemHolidayDayService
  ],
})
export class SysHolidayAddComponent implements OnInit {
  holidayForm: FormGroup;

  workingRoundOptions = [];
  loading = false;

  userInfo: any;
  holidayTypeOptions = [
    { label: '公历节假日', value: '1' },
    { label: '农历节假日', value: '2' }
  ];
  useAbleOptions = [
    { label: '可用', value: '1' },
    { label: '不可用', value: '0' }
  ];
  legalOptions = [
    { label: '是', value: '1' },
    { label: '否', value: '0' }
  ];

  constructor(
    private dicSvc: DicDataService,
    private fb: FormBuilder,
    private ref: NbDialogRef<SysHolidayAddComponent>,
    private msg: NzMessageService,
    private thisApiService: ApiSystemHolidayDayService,
    private userSvc: UserService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.workingRoundOptions = this.dicSvc.getDicDataByKey('workingRound');
    this.workingRoundOptions.forEach(w => {
      w.disabled = w.label !== '0';
    });
    this.holidayForm = this.fb.group({
      year: [new Date().getFullYear(), [Validators.required]], // 年份
      holidayName: [null, [Validators.required]], // 节日名称
      holidayDate: [null, [Validators.required]], // 具体日期
      useAble: ['1', [Validators.required]],
      legal: ['1', [Validators.required]],
      holidayType: ['1', [Validators.required]],
      povCode: [null, [Validators.required]],
      createBy: [null, [Validators.required]]
    });
  }

  onClose() {
    this.ref.close();
  }

  // 提交新增
  onSubmit() {
    if (!this.userInfo) return;
    this.holidayForm.get('createBy').setValue(this.userInfo.userCode);
    this.holidayForm.get('povCode').setValue(this.userInfo.pov);
    if (this.holidayForm.invalid) {
      this.msg.warning('表单内容填写有误或未选择，请检查');
      return;
    }
    let param = {
      year: this.holidayForm.value.year, // 年份
      holidayName: this.holidayForm.value.holidayName, // 节日名称
      holidayDate: DateUtils.formatToDate(this.holidayForm.get('holidayDate').value), // 具体日期
     /* useAble: this.holidayForm.value.useAble,*/
      legal: this.holidayForm.value.legal,
      holidayType: this.holidayForm.value.holidayType,
      povCode: this.holidayForm.value.povCode,
      createBy: this.holidayForm.value.createBy
    };
    console.log('保存节假日信息', param);
    this.thisApiService.insertHoliday(param, data => {
      if (data && data.code === 0) {
        this.msg.info(data.msg);
        this.ref.close(true);
      } else {
        this.msg.warning(data.msg);
      }
    });
  }
}

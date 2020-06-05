import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ImmunizationService, ProfileDataService, DateUtils } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-immunization-add',
  templateUrl: './immunization-add.component.html',
  styleUrls: ['./immunization-add.component.scss']
})
export class ImmunizationAddComponent implements OnInit {
  profile: any;
  loading = false;
  @Input() cardListData: any;

  private checkCardNo$ = new Subject();

  form: FormGroup;
  cardStatusOptions = [
    { label: '启用', value: '1' },
    { label: '停用', value: '0' }
  ];

  cardNoExist = false;

  constructor(
    private ref: NbDialogRef<ImmunizationAddComponent>,
    private immuSvc: ImmunizationService,
    private profileDataSvc: ProfileDataService,
    private fb: FormBuilder,
    private msg: NzMessageService
  ) {
    this.profileDataSvc.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
      }
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      immuVacCardNo: [null, [Validators.required, Validators.minLength(8)]], // 免疫卡号
      issueDate: [new Date(), [Validators.required]], // 发卡日期
      memo: [null],
      vacCardStatus: ['1', [Validators.required]] // 免疫卡状态，1 - 启用，0 - 停用
    });
    // 根据用户输入的卡号查询数据库是否存在相同卡号的免疫卡
    this.checkCardNo$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(searchTerms =>
          this.immuSvc.countImmuCard({
            condition: [
              { key: 'immuVacCardNo', value: searchTerms + '', logic: '=' }
            ]
          })
        )
      )
      .subscribe(resp => {
        // console.log('查询是否存在重复的卡号', resp);
        if (resp.code !== 0 || !resp.hasOwnProperty('data')) {
          return;
        }
        this.cardNoExist = resp['data'][0]['total'] !== 0;
      });
  }

  onClose() {
    this.ref.close();
  }

  onSubmit() {
    if (!this.profile) return;
    if (this.cardNoExist) {
      this.msg.warning('该卡号已经存在，请重新输入');
      return;
    }
    for (const key in this.form.controls) {
      if (this.form.controls[key].invalid) {
        this.form.controls[key].markAsDirty();
      }
    }
    if (this.form.invalid) {
      this.msg.warning('表格填写不完整，请检查');
      return;
    }
    this.loading = true;
    let save = {
      immuVacCardNo: this.form.get('immuVacCardNo').value,
      issueDate: DateUtils.getFormatDateTime(this.form.get('issueDate').value),
      memo: this.form.get('memo').value,
      vacCardStatus: this.form.get('vacCardStatus').value,
      profileCode: this.profile['profileCode']
    };
    const valid = this.form.get('vacCardStatus').value === '1';
    let update = {};
    if (valid) {
      for (let i = 0; i < this.cardListData.length; i++) {
        const cardInfo = this.cardListData[i];
        if (cardInfo['vacCardStatus'] === '1') {
          update['immuCardRecordCode'] = cardInfo['immuCardRecordCode'];
          update['vacCardStatus'] = '0';
        }
      }
    }
    const params = {
      save: save,
      update: valid ? update : null
    };
    // console.log(params);
    this.immuSvc.saveAndUpdateImmuCardRecord(params, resp => {
      this.loading = false;
      console.log(resp);
      if (resp.code !== 0 || !resp.hasOwnProperty('data')) {
        this.msg.error('操作失败，请重试');
        return;
      }
      this.onClose();
    });
  }

  checkCardExistByCardNo(ev) {
    if (!ev) {
      return;
    }
    if (ev.length < 8) {
      return;
    }
    this.checkCardNo$.next(ev);
  }
}

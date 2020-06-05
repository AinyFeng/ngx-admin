import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { VaccinateService } from '@tod/svs-common-lib';

@Component({
  selector: 'vaccinate-memo-dialog',
  templateUrl: './vaccinate-memo-dialog.component.html',
  styleUrls: ['./vaccinate-memo-dialog.component.scss']
})
export class VaccinateMemoDialogComponent implements OnInit {
  // 接种人状态Form
  vaccinatePersonForm: FormGroup;

  currentVaccinateRecord;

  userCode;

  constructor(
    protected ref: NbDialogRef<VaccinateMemoDialogComponent>,
    private vaccinateService: VaccinateService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.vaccinatePersonForm = this.fb.group({
      feverStatus: ['no'],
      fluStatus: ['no'],
      diarrheaStatus: ['no'],
      vaccinatePartStatus: [null, [Validators.required]],
      // isVaccinate: [null, [Validators.required]],
      memo: ['']
    });
  }

  /**
   * 获取接种人状态Form表单数据
   */
  getVaccinatePersonStatusData(): any {
    let eventContent = {
      feverStatus: this.vaccinatePersonForm.controls['feverStatus'].value,
      fluStatus: this.vaccinatePersonForm.controls['fluStatus'].value,
      diarrheaStatus: this.vaccinatePersonForm.controls['diarrheaStatus'].value,
      vaccinatePartStatus: this.vaccinatePersonForm.controls[
        'vaccinatePartStatus'
      ].value,
      // isVaccinate: this.vaccinatePersonForm.controls['isVaccinate'].value,
      memo: this.vaccinatePersonForm.controls['memo'].value
    };
    return {
      globalRecordNumber: this.currentVaccinateRecord.globalRecordNumber,
      registerRecordNumber: this.currentVaccinateRecord.registerRecordNumber,
      operationType: 'add VaccinatePersonStatus',
      operationUserCode: this.userCode,
      eventContent: JSON.stringify(eventContent)
    };
  }

  save() {
    // const isVaccinate = this.vaccinatePersonForm.controls['isVaccinate'].value;
    // if (isVaccinate === 'no') {
    //   this.saveConfirm(isVaccinate);
    // } else {
    //   this.saveData(isVaccinate);
    // }
    this.saveConfirm('no');
  }

  saveConfirm(isVaccinate) {
    this.modalService.confirm({
      nzTitle: '<i>接种取消确认</i>',
      nzContent: '<b>' + '确认取消接种该疫苗?' + '</b>',
      nzOkText: '确认',
      nzCancelText: '返回',
      nzOnOk: () => this.saveData(isVaccinate)
    });
  }

  saveData(isVaccinate) {
    const data = this.getVaccinatePersonStatusData();
    // 添加操作操作流水记录
    this.addVaccinateOperateRecord(data);
    let result = {};
    result['memo'] = data.eventContent;
    if (isVaccinate === 'yes') {
      result['status'] = '3';
      this.ref.close(result);
    } else if (isVaccinate === 'no') {
      result['status'] = '99';
      this.ref.close(result);
    }
  }

  /**
   * 消息提示
   * @param type
   * @param message
   */
  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  /**
   * 插入接种记录操作流水
   * @param data
   */
  addVaccinateOperateRecord(data) {
    this.vaccinateService.addVaccinateOperateRecord(data, resp => { });
  }

  closeDialog() {
    this.ref.close();
  }
}

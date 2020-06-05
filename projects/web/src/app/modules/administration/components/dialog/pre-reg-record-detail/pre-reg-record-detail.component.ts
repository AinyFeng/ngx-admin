import {Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

import {SystemPreliminaryClinicalService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-pre-reg-record-detail',
  templateUrl: './pre-reg-record-detail.component.html',
  styleUrls: ['./pre-reg-record-detail.component.scss']
})
export class PreRegRecordDetailComponent implements OnInit {

  listOfData: any = [];
  loading = false;

  // 接收传过来的参数
  preData: any;

  constructor(
    private ref: NbDialogRef<PreRegRecordDetailComponent>,
    private sysPreSvc: SystemPreliminaryClinicalService
  ) {
  }

  ngOnInit() {
    console.log('', this.preData);
    this.getPreDetail();
  }

  // 获取预诊详情
  getPreDetail() {
    if (this.loading) return;
    this.loading = true;
    const params = {
      preDiagnosisSerial: this.preData.preDiagnosisSerial
    };
    this.sysPreSvc.queryPreRegRecordDetailAndCount(params, resp => {
      console.log('resp', resp);
      this.loading = false;
      if (resp && resp[0].code === 0 && resp[0].hasOwnProperty('data') && resp[0].data.length !== 0) {
        this.listOfData = resp[0].data;
        this.listOfData.forEach(item => {
          item.options = [
            {label: '是', value: '是'},
            {label: '否', value: '否'}
          ];
          if (item.recordValue === '1') {
            item.checked = '是';
          } else {
            item.checked = '否';
          }
        });
      }

    });
  }

  onClose() {
    this.ref.close();
  }

}

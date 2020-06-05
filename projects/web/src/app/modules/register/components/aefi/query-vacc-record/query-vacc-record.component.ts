import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { AefiService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-query-vacc-record',
  templateUrl: './query-vacc-record.component.html',
  styleUrls: ['./query-vacc-record.component.scss']
})
export class QueryVaccRecordComponent implements OnInit {
  @Input() profile: any;

  vaccSettings = {
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    noDataMessage: '暂无数据',
    columns: {
      vaccinateTime: {
        title: '接种日期',
        type: 'number',
        valuePrepareFunction: date => {
          // const raw = new Date(date);
          return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm');
        }
      },
      vaccineProductName: {
        title: '接种疫苗',
        type: 'string'
      },
      vaccinateInjectNumber: {
        title: '接种针次',
        type: 'number'
      }
    }
  };
  data = [];
  loading = false;
  isError = false;

  constructor(
    private ref: NbDialogRef<QueryVaccRecordComponent>,
    private aefiSvr: AefiService,
    private msg: NzMessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getVaccRecord();
  }

  getVaccRecord() {
    this.loading = true;
    this.isError = false;
    // console.log('查询接种记录');
    const profileCode = this.profile['profileCode'];
    this.aefiSvr.queryVaccRecord(profileCode, resp => {
      // console.log(resp);
      this.loading = false;
      if (resp.code !== 0) {
        this.isError = true;
        this.msg.error('获取接种数据失败，请重试');
      }
      if (resp.code === 0 && resp.hasOwnProperty('data')) {
        this.data = resp.data;
      }
    });
  }

  onClose() {
    this.ref.close();
  }

  selectVaccRecord(item: any) {
    // console.log(item.data);
    this.ref.close(item.data);
  }
}

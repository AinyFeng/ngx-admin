import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'report-reserve-management',
  templateUrl: './report-reserve-management.component.html',
  styleUrls: ['./../report.common.scss']
})
export class ReportReserveManagementComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  reserveDataSet = {
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    noDataMessage: '暂无数据',
    columns: {
      number: {
        title: '序号',
        type: 'string'
      },
      childCode: {
        title: '儿童编码',
        type: 'string'
      },
      childName: {
        title: '儿童姓名',
        type: 'string'
      },
      gender: {
        title: '儿童性别',
        type: 'string'
      },
      idCardMom: {
        title: '证件号码（母）',
        type: 'string'
      },
      phone: {
        title: '联系电话',
        type: 'string'
      },
      address: {
        title: '家庭住址',
        type: 'string'
      },
      officeName: {
        title: '医疗机构',
        type: 'string'
      },
      remarks: {
        title: '备注',
        type: 'string'
      }
    }
  };

  vaccines: [
    { name: '卡介'; code: '0101' },
    { name: '乙肝酿酒'; code: '0201' },
    { name: '乙肝汉逊'; code: '0202' },
    { name: '乙肝CHO'; code: '0203' },
    { name: '脊灰减毒'; code: '0301' },
    { name: '脊灰灭活'; code: '0306' }
  ];
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'uea-archives-statistics',
  templateUrl: './archives-statistics.component.html',
  styleUrls: ['./archives-statistics.component.scss']
})
export class ArchivesStatisticsComponent implements OnInit {

  queryForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  dataSet = [
    {
      vacProductName: '111111',
      vacType: '111111',
      vacCompany: '111111',
      batchCode: '111111',
      batchNO: '111111',
      specifications: '111111',
      dose: '111111',
      effectiveDate: '111111',
      count: '111111',
      outboundPrice: '111111',
      inboundPrice: '111111',
    }, {
      vacProductName: '111111',
      vacType: '111111',
      vacCompany: '111111',
      batchCode: '111111',
      batchNO: '111111',
      specifications: '111111',
      dose: '111111',
      effectiveDate: '111111',
      count: '111111',
      outboundPrice: '111111',
      inboundPrice: '111111',
    },
  ];
  nodes = [
    {
      title: '0-0',
      key: '0-0',
      children: [
        {
          title: '0-0-0',
          key: '0-0-0',
          children: [
            {title: '0-0-0-0', key: '0-0-0-0', isLeaf: true},
            {title: '0-0-0-1', key: '0-0-0-1', isLeaf: true},
            {title: '0-0-0-2', key: '0-0-0-2', isLeaf: true}
          ]
        },
        {
          title: '0-0-1',
          key: '0-0-1',
          children: [
            {title: '0-0-1-0', key: '0-0-1-0', isLeaf: true},
            {title: '0-0-1-1', key: '0-0-1-1', isLeaf: true},
            {title: '0-0-1-2', key: '0-0-1-2', isLeaf: true}
          ]
        },
        {
          title: '0-0-2',
          key: '0-0-2',
          isLeaf: true
        }
      ]
    },
    {
      title: '0-1',
      key: '0-1',
      children: [
        {title: '0-1-0-0', key: '0-1-0-0', isLeaf: true},
        {title: '0-1-0-1', key: '0-1-0-1', isLeaf: true},
        {title: '0-1-0-2', key: '0-1-0-2', isLeaf: true}
      ]
    },
    {
      title: '0-2',
      key: '0-2',
      isLeaf: true
    }
  ];

  ngOnInit(): void {
    this.queryForm = this.fb.group({
      address: [null], // 地区
      creatDays: [null], // 建档及时天数
      birthDayStart: [null], // 出生日期
      birthDayEnd: [null], // 出生日期
      creatDayStart: [null], // 建档日期
      creatDayEnd: [null], // 建档日期
    });
  }

}

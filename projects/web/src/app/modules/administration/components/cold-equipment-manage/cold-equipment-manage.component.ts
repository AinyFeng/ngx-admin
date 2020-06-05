import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uea-cold-equipment-manage',
  templateUrl: './cold-equipment-manage.component.html',
  styleUrls: ['../admin.common.scss']
})
export class ColdEquipmentManageComponent implements OnInit {
  listOfData: any[] = [];

  childDataSet = {
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
        type: 'number'
      },
      equipmentCode: {
        title: '设备编码',
        type: 'string'
      },
      areaCounty: {
        title: '所在县区',
        type: 'string'
      },
      placeUnit: {
        title: '所在单位',
        type: 'string'
      },
      fundingSource: {
        title: '经费来源',
        type: 'string'
      },
      equipmentType: {
        title: '设备类型',
        type: 'string'
      },
      equipmentBrand: {
        title: '设备品牌',
        type: 'string'
      },
      equipmentModel: {
        title: '设备型号',
        type: 'string'
      },
      equipmentSize: {
        title: '设备规格',
        type: 'string'
      },
      prodDate: {
        title: '生产日期',
        type: 'string'
      },
      startDate: {
        title: '启用日期',
        type: 'string'
      },
      electronStartTime: {
        title: '电子监管启用日期',
        type: 'string'
      },
      storageVolume: {
        title: '冷藏容积',
        type: 'number'
      },
      coldVolume: {
        title: '冷冻容积',
        type: 'number'
      },
      currentState: {
        title: '当前运转状态',
        type: 'string'
      },
      entering: {
        title: '录入者',
        type: 'string'
      },
      operation: {
        title: '操作',
        type: 'string'
      }
    }
  };

  constructor() {}

  ngOnInit() {}
}

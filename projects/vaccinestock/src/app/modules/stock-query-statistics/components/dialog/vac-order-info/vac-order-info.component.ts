import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {
  VaccineSubclassInitService,
  VaccManufactureDataService,
  QueryStatisticsService
} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-vac-order-info',
  templateUrl: './vac-order-info.component.html',
  styleUrls: ['./vac-order-info.component.scss']
})
export class VacOrderInfoComponent implements OnInit {
  @Input()
  orderConditions: any;

  queryForm: FormGroup;
  listOfData: any = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  // 疫苗小类
  vacSubClassData = [];
  // 生产企业
  manufactureData = [];

  constructor(
    private fb: FormBuilder,
    private vacSubClassSvc: VaccineSubclassInitService,
    private manufaSvc: VaccManufactureDataService,
    private api: QueryStatisticsService
  ) {
  }

  ngOnInit() {
    // 获取小类编码
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取生产企业
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();

    this.queryForm = this.fb.group({
      grade: [this.orderConditions ? this.orderConditions.grade : null],
      areaCoding: [this.orderConditions ? this.orderConditions.areaCoding : null],
      batchNo: [this.orderConditions ? this.orderConditions.batchNo : null], // 疫苗批号
      vaccineSubclassCode: [this.orderConditions ? this.orderConditions.vaccineSubclassCode : null], // 疫苗名称
      manufactureCode: [this.orderConditions ? this.orderConditions.manufactureCode : null], // 生产企业
      outboundDate: [this.orderConditions ? this.orderConditions.outboundDate : null], // 出入库起始时间
      outboundDateBreak: [this.orderConditions ? this.orderConditions.outboundDateBreak : null], // 出入库截止时间
    });
    this.queryData();
  }

  // 查询数据
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    const params = {
      grade: null,
      vaccineSubclassCode: this.queryForm.get('vaccineSubclassCode').value ? this.queryForm.get('vaccineSubclassCode').value : null,
      manufactureCode: this.queryForm.get('manufactureCode').value ? this.queryForm.get('manufactureCode').value : null,
      batchno: this.queryForm.get('batchNo').value ? this.queryForm.get('batchNo').value : null,
      areaCoding: this.queryForm.get('areaCoding').value ? this.queryForm.get('areaCoding').value : null,
      outboundDate: this.queryForm.get('outboundDate').value ? this.queryForm.get('outboundDate').value : null,
      outboundDateBreak: this.queryForm.get('outboundDateBreak').value ? this.queryForm.get('outboundDateBreak').value : null,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      },
    };
    if (this.queryForm.get('grade').value) {
      const grade = this.queryForm.get('grade').value;
      let range = [];
      grade.filter(item => item.checked === true).forEach(item => {
        if (item.value.length > 2) {
          range.push(item.value.substr(0, 2));
          range.push(item.value.substr(3));
        } else {
          range.push(item.value);
        }
      });
      params['grade'] = range;
    }
    console.log('参数', params);
    this.listOfData = [];
    this.api.queryAreaInOutDetailAndCount(params, resp => {
      console.log('结果', resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) {
        return;
      }
      this.listOfData = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data')) {
        return;
      }
      this.total = resp[1].data[0].count;
    });
  }

  // 重置
  resetForm() {
    this.queryForm.reset({
      range: []
    });
  }

}

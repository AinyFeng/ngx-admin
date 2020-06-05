import { Component, OnInit } from '@angular/core';
import { DicDataService, VaccineSubclassInitService, VaccManufactureDataService, StockService } from '@tod/svs-common-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import {UserService} from '@tod/uea-auth-lib';
import * as moment from 'moment';
import {Moment} from 'moment';
import {NbDialogService} from '@nebular/theme';
import {VaccUsedDetailComponent} from '../dialog/vacc-used-detail/vacc-used-detail.component';

@Component({
  selector: 'uea-vaccine-detail',
  templateUrl: './vaccine-detail.component.html',
  styleUrls: ['../admin.common.scss'],
})
export class VaccineDetailComponent implements OnInit {
  vaccineFrom: FormGroup;
  loading = false;
  listOfData: any[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  // 疫苗小类名称
  vacSubClassData = [];
  // 疫苗类型
  vaccineTypeData = [];
  // 疫苗厂商
  manufactureData = [];
  userInfo: any;
  /**
   * 当前日期
   */
  currentDate = moment();
  constructor(
    private user: UserService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private dicSvc: DicDataService,
    private manufaSvc: VaccManufactureDataService,
    private stockService: StockService,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
    });
  }

  ngOnInit() {
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    this.vaccineTypeData = this.dicSvc.getDicDataByKey('vaccineType');
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();
    console.log('manufactureData>>>>>>>>>>>>>>>>>>>>>>>', this.manufactureData);
    this.vaccineFrom = this.fb.group({
      subClassData: [[]], // 疫苗小类多选 疫苗编码
      prodBatchCode: [],
      manufacturerCode: [],
      type: [],
      acceptanceDate: [moment(new Date())],
      acceptanceDateBreak: [moment(new Date())],
    });
    this.serachData();
  }

  // 查询
  serachData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    const params = {
      povCode: this.userInfo.pov,
      vaccineSubclassCode: this.vaccineFrom.value.subClassData,
      prodBatchCode: this.vaccineFrom.value.prodBatchCode === '' ? null : this.vaccineFrom.value.prodBatchCode,
      manufacturerCode: this.vaccineFrom.value.manufacturerCode,
      type: this.vaccineFrom.value.type,
      acceptanceDate: this.vaccineFrom.get('acceptanceDate').value.format('YYYY-MM-DD') + ' 00:00:00',
      acceptanceDateBreak: this.vaccineFrom.get('acceptanceDateBreak').value.format('YYYY-MM-DD') + ' 23:59:59',
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('param', params);
    this.loading = true;
    this.stockService.vaccinateUseDetail(params, resp => {
      console.log('疫苗使用详情===', resp);
      this.loading = false;
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      } else {
        this.listOfData = [];
      }
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
      } else {
        this.total = 0;
      }
    });
  }
  // 重置
  reset() {
    this.vaccineFrom = this.fb.group({
      subClassData: [[]], // 疫苗小类多选 疫苗编码
      prodBatchCode: [],
      manufacturerCode: [],
      type: [],
      acceptanceDate: [moment(new Date())],
      acceptanceDateBreak: [moment(new Date())],
    });
  }
  // 查看疫苗的具体使用详情
  showDetail(data: any) {
    this.dialogService.open(VaccUsedDetailComponent, {
      context: {
        vaccinetInfo: data
      },
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        // 在入库页面点击确定后的回调
        console.log('疫苗详情--查看具体使用回调' + result);
        // this.searchData();
      }
    });
  }
  /**
   * 过滤修改日期 - 起
   * @param d
   */
  filterStartDate = (d: Moment) => {
    const endDate = this.vaccineFrom.get('acceptanceDateBreak').value;
    if (endDate) {
      return d <= endDate;
    }
    return d <= this.currentDate;
  }
  /**
   * 过滤修改日期 - 止
   * @param d
   */
  filterEndDate = (d: Moment) => {
    const startDate = this.vaccineFrom.get('acceptanceDate').value;
    if (startDate) {
      return d >= startDate && d <= this.currentDate;
    }
    return d <= this.currentDate;
  }
}

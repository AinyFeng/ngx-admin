import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import {
  DateUtils,
  DicDataService, VaccBroadHeadingDataService,
  VaccineSubclassInitService,
  VaccManufactureDataService,
  VaccStockApiService
} from '@tod/svs-common-lib';
import { NzModalRef } from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-vaccine-stock-info',
  templateUrl: './vaccine-stock-info.component.html',
  styleUrls: ['./vaccine-stock-info.component.scss']
})
export class VaccineStockInfoComponent implements OnInit, OnDestroy {

  stockSearchForm: FormGroup;
  @Input()
  title = '';
  /**
   * 疫苗小类
   */
  subclassCodeOptions = [];
  /**
   * 容器类型选项
   */
  containerTypeOptions = [];
  /**
   * 生产厂家选项
   */
  manufactureOptions = [];
  // 疫苗大类名称
  vacBroadHeadingData = [];
  /**
   * 疫苗库存信息
   */
  vaccineData = [];
  loading = false;
  pageIndex = 1;
  total = 0;
  /**
   * 已选择疫苗,从页面传值
   */
  selectedVacData = [];
  vaccType: any;
  userInfo = null;

  @Input('selectedVacData')
  set setSelectedVacData(val: any) {
    this.selectedVacData$.next(val);
  }

  readonly selectedVacData$ = new BehaviorSubject<any>([]);
  readonly vaccineData$ = new BehaviorSubject<any>([]);

  constructor(
    private subclassCodeSvc: VaccineSubclassInitService, private fb: FormBuilder,
    private manufactureSvc: VaccManufactureDataService,
    private dicSvc: DicDataService,
    private vacStocApiSvc: VaccStockApiService,
    private modal: NzModalRef,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private userSvc: UserService
  ) {
    // 获取疫苗大类
    this.vacBroadHeadingData = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    // 疫苗小类疫苗（名称）
    this.subclassCodeOptions = subclassCodeSvc.getVaccineSubClassData();
    this.stockSearchForm = fb.group({
      vaccineSubclassCode: [null], // 疫苗小类编码，疫苗名称
      broadHeadingCode: [null], // 疫苗大类
      manufactureCode: [], // 生产厂家编码
      batchNo: [], // 疫苗批号
      type: [], // 疫苗类型，一类 - 0, 二类 - 1
      batchType: [], // 容器类型
      isLoseEfficacy: [], // 失效: 1 - 失效  0 - 未失效
      startDate: [], // 起始有效期
      endDate: [], // 截止有效期
    });
    this.manufactureOptions = manufactureSvc.getVaccProductManufactureData();
    this.containerTypeOptions = dicSvc.getDicDataByKey('batchType');
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
    });
  }

  ngOnInit() {
    this.queryStock();
    this.selectedVacData$.next(this.selectedVacData);
    combineLatest([this.selectedVacData$.asObservable(), this.vaccineData$.asObservable()])
      .subscribe(([selectedData, vaccineData]) => {
        this.vaccineData = [];
        for (let i = 0; i < selectedData.length; i++) {
          const sd = selectedData[i];
          for (let j = 0; j < vaccineData.length; j++) {
            const vd = vaccineData[j];
            if (vd['inventorySerialCode'] === sd['inventorySerialCode']) {
              vd['checked'] = true;
              vd['disabled'] = true;
            }
          }
        }
        this.vaccineData = vaccineData;
        /*  console.log('回显已选中的====', this.vaccineData);*/
      });
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  queryStock(page = 1) {
    this.pageIndex = page;
    this.vaccineData = [];
    this.loading = true;
    const query = {
      storeCode: this.userInfo.pov,
      vaccineType: this.vaccType ? this.vaccType : this.stockSearchForm.value.type,
      vaccineSubclassCode: this.stockSearchForm.value.vaccineSubclassCode,
      batchNo: this.stockSearchForm.value.batchNo,
      manufactureCode: this.stockSearchForm.value.manufactureCode,
      broadHeadingCode: this.stockSearchForm.value.broadHeadingCode,
      batchType: this.stockSearchForm.value.batchType,
      isLoseEfficacy: this.stockSearchForm.value.isLoseEfficacy,
      startDate: DateUtils.formatStartDate(this.stockSearchForm.value.startDate),
      endDate: DateUtils.formatEndDate(this.stockSearchForm.value.endDate),
      pageEntity: {
        page: page,
        pageSize: 10
      }
    };
    this.vacStocApiSvc.queryStockAndCount(query, ([queryData, countData]) => {
      console.log('疫苗库存量结果 + params', queryData.data, query);
      this.loading = false;
      if (queryData.code === 0) {
        this.vaccineData$.next(queryData.data);
      }
      if (countData.code === 0) {
        this.total = countData.data[0]['count'];
      }
    });
  }

  closeDialog() {
    this.modal.close(this.selectedVacData);
  }

  /**
   * 添加疫苗信息
   * @param ev
   * @param d
   */
  addVaccine(ev, d) {
    if (ev) {
      this.selectedVacData.push(d);
    } else {
      this.selectedVacData = this.selectedVacData.filter(v => v['inventorySerialCode'] !== d['inventorySerialCode']);
    }
  }

  /**
   * 过滤开始日期
   * @param d
   */
  disabledStartDate = (d: Date) => {
    if (this.stockSearchForm.value.endDate) {
      return d > this.stockSearchForm.value.endDate;
    } else {
      return false;
    }
  }
  /**
   * 过滤开始日期
   * @param d
   */
  disabledEndDate = (d: Date) => {
    if (this.stockSearchForm.value.startDate) {
      return d < this.stockSearchForm.value.startDate;
    } else {
      return false;
    }
  }

  reset() {
    this.stockSearchForm.reset();
  }
}

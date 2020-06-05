import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
  DicDataService,
  VaccineSubclassInitService,
  VaccManufactureDataService,
  VacStockBatchApi
} from '@tod/svs-common-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-vaccine-batch-info',
  templateUrl: './vaccine-batch-info.component.html',
  styleUrls: ['./vaccine-batch-info.component.scss']
})
export class VaccineBatchInfoComponent implements OnInit, OnDestroy {

  @Input()
  isAliPlatform = false;

  batchSearchForm: FormGroup;
  @Input()
  title = '疫苗批次号管理';
  /**
   * 疫苗小类
   */
  subclassCodeOptions = [];
  /**
   * 容器类型选项
   */
  containerTypeOptions = [];

  /**
   * 疫苗有效期选项
   */
  outBoundDateOptions = [
    { label: '超期2年', value: '2' },
    { label: '超期1年', value: '1' },
    { label: '正常', value: '3' },
    { label: '全部', value: '' }
  ];
  /**
   * 生产厂家选项
   */
  manufactureOptions = [];
  /**
   * 疫苗总数
   */
  total = 0;
  /**
   * 疫苗批号信息
   */
  vaccineData = [];

  loading = false;

  pageIndex = 1;

  userInfo: any;
  /**
   * 已选择疫苗
   */
  @Input()
  selectedVacData = [];

  readonly selectedVacData$ = new BehaviorSubject<any>([]);
  readonly vaccineData$ = new BehaviorSubject<any>([]);

  constructor(private subclassCodeSvc: VaccineSubclassInitService, private fb: FormBuilder,
              private manufactureSvc: VaccManufactureDataService,
              private dicSvc: DicDataService,
              private vacStockBatchApiSvc: VacStockBatchApi,
              private modal: NzModalRef,
              private userSvc: UserService) {
    this.subclassCodeOptions = subclassCodeSvc.getVaccineSubClassData();
    this.batchSearchForm = fb.group({
      vaccineSubclassCode: [null], // 疫苗小类编码，疫苗名称
      manufactureCode: [], // 生产厂家编码
      batchNo: [], // 疫苗批号
      type: [], // 疫苗类型，一类 - 0, 二类 - 1
       batchType: [], // 容器类型
      isValid: [], // 有效期: 1 - 超期1年，2 - 超期2年，3 - 正常， null - 全部
    });
    this.manufactureOptions = manufactureSvc.getVaccProductManufactureData();
    this.containerTypeOptions = dicSvc.getDicDataByKey('batchType');
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.queryBatch();
    this.selectedVacData$.next(this.selectedVacData);
    combineLatest([this.selectedVacData$.asObservable(), this.vaccineData$.asObservable()])
      .subscribe(([selectedData, vaccineData]) => {
        console.log('选择的数据', selectedData, vaccineData);
        this.vaccineData = [];
        for (let i = 0; i < selectedData.length; i++) {
          const sd = selectedData[i];
          for (let j = 0; j < vaccineData.length; j++) {
            const vd = vaccineData[j];
            if (vd['batchSerialCode'] === sd['batchSerialCode']) {
              vd['checked'] = true;
              vd['disabled'] = true;
            }
          }
        }
        this.vaccineData = vaccineData;
        console.log('疫苗', this.vaccineData);
      });
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  queryBatch(page = 1) {
    this.pageIndex = page;
    this.vaccineData = [];
    this.loading = true;
    const pageEntity = {
      page: page,
      pageSize: 10
    };
    const query = this.batchSearchForm.value;
    query['pageEntity'] = pageEntity;
    if (this.isAliPlatform) {
      // 扫描入库只需要传povCode
      const list = {
        localCode: this.userInfo.pov,
        effectiveDate: this.batchSearchForm.value.isValid,
        prepnTypeDesc: this.batchSearchForm.value. batchType,
        batchNo: this.batchSearchForm.value.batchNo
      };
      console.log('阿里查询修改', list);
      this.vacStockBatchApiSvc.queryBatchAndCountFromAli(list, res => {
        console.log('扫描入库', res);
        this.loading = false;
        if (res.code === 0) {
          this.vaccineData$.next(res.data);
          this.total = res.data.length;
        }
      });
    } else {
      console.log('正常批号查询', query);
      this.vacStockBatchApiSvc.queryBatchAndCount(query, ([queryData, countData]) => {
        console.log('疫苗批号查询结果', countData);
        this.loading = false;
        if (queryData.code === 0) {
          this.vaccineData$.next(queryData.data);
        }
        if (countData.code === 0) {
          this.total = countData.data[0]['count'];
        }
      });
    }
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
    if (this.isAliPlatform) {
      const transformVaccineInfo = JSON.parse(JSON.stringify(d));
      transformVaccineInfo['vaccName'] = d.physicName;
      transformVaccineInfo['manufactureName'] = d.entName;
      transformVaccineInfo['outBoundDate'] = d.expireDate;
      transformVaccineInfo['batchNo'] = d.batchNo;
      transformVaccineInfo['spec'] = d.pkgSpecCrit;
      transformVaccineInfo['dose'] = d.prepnSpec;
      // packageCode
      transformVaccineInfo['ailhealthPackageCode'] = d.packageCode;
      if (ev) {
        this.selectedVacData.push(transformVaccineInfo);
      } else {
        this.selectedVacData = this.selectedVacData.filter(v => v['serialCode'] !== d['serialCode']);
      }
    } else {
      if (ev) {
        this.selectedVacData.push(d);
      } else {
        this.selectedVacData = this.selectedVacData.filter(v => v['serialCode'] !== d['serialCode']);
      }
    }
  }

  reset() {
    this.batchSearchForm.reset();
  }

}

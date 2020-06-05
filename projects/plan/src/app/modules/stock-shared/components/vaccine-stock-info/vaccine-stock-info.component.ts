import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {
  DicDataService, VaccBroadHeadingDataService,
  VaccineSubclassInitService,
  VaccManufactureDataService,
} from '@tod/svs-common-lib';
import {NzModalRef} from 'ng-zorro-antd';
import {PlanConfigService} from '../../../services/plan-config.service';

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
   * 剂型选项
   */
  doseTypeOptions = [];
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
    private planService: PlanConfigService,
    private modal: NzModalRef,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService
  ) {
    // 获取疫苗大类
    this.vacBroadHeadingData = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    // 疫苗小类疫苗（名称）
    this.subclassCodeOptions = subclassCodeSvc.getVaccineSubClassData();
    this.stockSearchForm = fb.group({
      vaccineSubclassCode: ['null'], // 疫苗小类编码，疫苗名称
      manufactureCode: ['null'], // 生产厂家编码
      containerType: ['null'], // 容器类型
      dose: ['null'], // 剂量
      doseType: ['null'], // 剂型
    });
    this.manufactureOptions = manufactureSvc.getVaccProductManufactureData();
    this.containerTypeOptions = dicSvc.getDicDataByKey('containerType');
    this.doseTypeOptions = dicSvc.getDicDataByKey('dosageForm');

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
            if (vd['id'] === sd['id']) {
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
      vaccineSubclassCode: this.stockSearchForm.value.vaccineSubclassCode === 'null' ? null : this.stockSearchForm.value.vaccineSubclassCode,
      manufactureCode: this.stockSearchForm.value.manufactureCode === 'null' ? null : this.stockSearchForm.value.manufactureCode,
      containerType: this.stockSearchForm.value.containerType === 'null' ? null : this.stockSearchForm.value.containerType,
      dose: this.stockSearchForm.value.dose === 'null' ? null : this.stockSearchForm.value.dose,
      doseType: this.stockSearchForm.value.doseType === 'null' ? null : this.stockSearchForm.value.doseType,
      type: '2',
      pageEntity: {
        page: page,
        pageSize: 10,
        sortBy: ['vaccine_subclass_code,ASC']
      }
    };
    this.planService.queryVaccine(query, ([queryData, countData]) => {
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
      d['sellPrice'] = 0;
      d['planNumYear'] = 0;
      d['monthNum'] = 3;
      this.selectedVacData.push(d);
    } else {
      this.selectedVacData = this.selectedVacData.filter(v => v['id'] !== d['id']);
    }
  }
}

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';
import {
  DicDataService,
  StockService,
  BatchInfoService,
  EleSuperviseCodeService,
  VaccineProductService,
  DateUtils,
  VaccBroadHeadingDataService
} from '@tod/svs-common-lib';
import {VaccinatePlatformService} from '../vaccinate-platform-new/vaccinate-platform.service';

@Component({
  selector: 'uea-vaccinate-breakage',
  templateUrl: './vaccinate-breakage.component.html',
  styleUrls: ['./vaccinate-breakage.component.scss']
})
export class VaccinateBreakageComponent implements OnInit, OnChanges {

  /**
   * 报损表单
   */
  breakageForm: FormGroup;

  /**
   * 是否可见
   */
  @Input()
  breakageVisible = false;

  @Output()
  readonly breakageVisibleChange = new EventEmitter();

  /**
   * 报损类型、报损方式
   */
  breakTypeOptions = [];

  /**
   * 用户信息
   */
  userInfo: any;


  /**
   * 疫苗电子监管码信息下拉框选项，不是必填项
   */
  @Input()
  eleSuperviseCodeOptions = [];

  /**
   * 疫苗批号信息选项
   */
  @Input()
  vaccineBatchOptions = [];

  /**
   * 疫苗产品表信息，下拉框选项
   */
  @Input()
  vaccineProductOptions = [];

  /**
   * 报损疫苗所在冷藏设备编码
   */
  @Input()
  facilityCodeOptions = [];

  /**
   * 传入需要对报损表单进行初始化的值
   */
  _breakageObj;
  @Input()
  set breakageObj(value: any) {
    if (value) {
      this._breakageObj = value;
      this.initBreakageForm();
    }
  }

  get breakageObj() {
    return this._breakageObj;
  }

  vacBroadHeadingOptions: any[] = [];

  // 下拉框选项中需要展示的疫苗大类编码
  broadHeadingCodeArr = [
    '01',
    '02',
    '03',
    '04',
    '06',
    '22',
    '23',
    '28',
    '49',
    '53',
    '54',
    '55',
    '19',
    '25',
    '17'
  ];

  /**
   * 当报损成功时触发的报损成功实践
   */
  @Output()
  readonly _onBreakageSuccess = new EventEmitter<void>();


  constructor(private msg: NzMessageService,
              private modalService: NzModalService,
              private platformService: VaccinatePlatformService,
              private stockService: StockService,
              private userSvc: UserService,
              private fb: FormBuilder,
              private vacBroadHeadingSvc: VaccBroadHeadingDataService,
              private dicDataService: DicDataService,
              private batchInfoService: BatchInfoService,
              private eleSuperviseCodeService: EleSuperviseCodeService,
              private vaccineProductService: VaccineProductService) {
  }

  ngOnInit() {
    this.initVaccBroadHeadingOptions();
    this.initBreakageForm();
    this.loadBreakType();
    // this.loadVaccineProductInfo();
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    // if (changes.hasOwnProperty('breakageObj') && changes['breakageObj'].currentValue) {
    //   this.initBreakageForm();
    // }
  }

  /**
   * 不可选择的日期
   * @param current
   */
  disableDate = (current: Date) => {
    const now = new Date();
    return current > now;
  }

  /**
   * 初始化报损表单
   */
  initBreakageForm() {
    if (this.breakageObj) {
      this.breakageForm.controls['broadHeadingCode'].setValue(this.breakageObj.broadHeadingCode);
      this.breakageForm.controls['vaccProductCode'].setValue(this.breakageObj.vaccProductCode);
      this.breakageForm.controls['prodBatchCode'].setValue(this.breakageObj.prodBatchCode);
      this.breakageForm.controls['eleSuperviseCode'].setValue(this.breakageObj.eleSuperviseCode);
      this.breakageForm.controls['facilityCode'].setValue(this.breakageObj.facilityCode);
      this.breakageForm.controls['count'].setValue(this.breakageObj.count);
      this.breakageForm.controls['breakType'].setValue(this.breakageObj.breakType);
      this.breakageForm.controls['reportTime'].setValue(this.breakageObj.reportTime);
      this.breakageForm.controls['memo'].setValue(this.breakageObj.memo);
    } else {
      this.resetForm();
    }
    console.log('breakageForm', this.breakageForm.value);
  }

  /**
   * 第一步，加载疫苗产品信息
   */
  loadVaccineProductInfo() {
    const params = {};
    this.vaccineProductService.queryVaccineProduct(params, resp => {
      console.log('1. 报损查询到的疫苗产品返回值', resp);
      if (resp.code === 0 && this.vaccineProductOptions.length === 0) {
        this.vaccineProductOptions = resp.data;
      }
    });
  }

  /**
   * 第二步，根据疫苗产品编码加载批号信息
   * @param productCode
   */
  loadBatchInfoByProduct(productCode?: string) {
    const params = {
      vaccineProductCode: productCode
    };
    this.batchInfoService.queryBatchInfo(params, resp => {
      console.log('2.报损查询到的批次号返回值', resp);
      if (resp.code === 0 && this.vaccineBatchOptions.length === 0) {
        this.vaccineBatchOptions = resp.data;
        if (resp.data.length > 0) {
          this.breakageForm.controls['prodBatchCode'].setValue(
            resp.data[0].batchNo
          );
        }
      }
    });
  }

  /**
   * 第三步，根据疫苗产品编码加载批号信息
   * @param batchNo
   */
  loadEleSuperviseCodeByBatchNo(batchNo?: string) {
    const params = {};
    if (batchNo) {
      params['batchNo'] = batchNo['batchNo'];
    }
    this.eleSuperviseCodeService.queryEleSuperviseCode(params, resp => {
      console.log('3.报损查询到的电子监管码返回值', resp);
      if (resp.code === 0 && resp.data.length > 0) {
        this.eleSuperviseCodeOptions = resp.data;
      } else {
        this.eleSuperviseCodeOptions = [];
      }
    });
  }

  /**
   * 加载报损类型字典数据
   */
  loadBreakType() {
    this.breakTypeOptions = this.dicDataService.getDicDataByKey('breakType');
    if (this.facilityCodeOptions.length === 0) {
      this.facilityCodeOptions = this.breakTypeOptions;
    }
    console.log(this.breakTypeOptions);
  }

  /**
   * 执行报损的方法
   */
  breakage() {
    if (this.breakageForm.invalid) {
      this.warning('表单填写不完整或有误，请检查');
      return;
    }
    // console.log(this.breakageForm.controls['prodBatchCode'].value);
    const reportTime = this.breakageForm.controls['reportTime'].value;
    const params = {
      facilityCode: this.breakageForm.controls['facilityCode'].value,
      vaccProductCode: this.breakageForm.controls['vaccProductCode'].value,
      prodBatchCode: this.breakageForm.controls['prodBatchCode'].value,
      eleSuperviseCode: this.breakageForm.controls['eleSuperviseCode'].value,
     /* count: this.breakageForm.controls['count'].value,*/
      breakType: this.breakageForm.controls['breakType'].value,
      breakTime: DateUtils.getFormatDateTime(reportTime),
      memo: this.breakageForm.controls['memo'].value,
      povCode: this.userInfo.pov,
      departmentCode: this.platformService.selectedDepartmentCode,
      stockBy: this.userInfo.userCode
    };
    if (this.breakageObj) {
      // 多剂次
      params['count'] = null;
      params['dosageByEachNum'] = this.breakageForm.controls['count'].value;
    } else {
      // 单剂次
      params['dosageByEachNum'] = null;
      params['count'] = this.breakageForm.controls['count'].value;
    }
    this.stockService.breakage(params, resp => {
      if (resp.code !== 0) {
        this.error(resp['msg']);
      } else {
        this.success('报损成功！');
        this.resetBreakageObj();
        // this.initBreakageForm();
        this._onBreakageSuccess.emit();
      }
    });
  }

  /**
   * 重置报损表单页面
   */
  resetBreakageObj() {
    this.breakageObj = null;
    this.resetForm();
    this.eleSuperviseCodeOptions = [];
    this.vaccineBatchOptions = [];
    this.vaccineProductOptions = [];
  }

  resetForm(broadHeadingCode?: string) {
    this.breakageForm = this.fb.group({
      broadHeadingCode: [broadHeadingCode ? broadHeadingCode : null, [Validators.required]],
      vaccProductCode: [ null, [Validators.required]],
      prodBatchCode: [ null, [Validators.required]],
      eleSuperviseCode: [null],
      facilityCode: [null,  [Validators.required]],
      count: [null,  [Validators.required, Validators.min(0)]],
      breakType: [null,  [Validators.required]],
      reportTime: [null, [Validators.required]],
      memo: [ null]
    });
  }

  /**
   * 关闭报损页面
   */
  close() {
    console.log('close');
    this.resetBreakageObj();
    this.breakageVisible = !this.breakageVisible;
    this.breakageVisibleChange.emit(this.breakageVisible);
  }

  /**
   * 初始化疫苗大类选项
   */
  initVaccBroadHeadingOptions() {
    this.vacBroadHeadingOptions = this.vacBroadHeadingSvc
      .getVaccBoradHeadingData()
      .filter(b => this.broadHeadingCodeArr.includes(b['broadHeadingCode']));
  }

  /**
   * 根据疫苗大类获取相应疫苗产品
   * @param event
   */
  getVaccProduct(event) {
    this.resetForm(event);
    const queryParam = [];
    let o = {
      povCode: this.userInfo.pov,
      vaccineSubclassCode: event
    };
    queryParam.push(o);
    this.stockService.queryVaccineInventory(queryParam, resp => {
      if (resp.code === 0 && resp.data.length > 0) {
        let temp = [];
        let productMap = new Map();
        resp.data.forEach(product => {
          productMap.set(product.vaccineProductCode, product);
          product.disabled = Number(product.inventoryCount) <= 0;
        });
        productMap.forEach(value => temp.push(value));
        this.vaccineProductOptions = temp;
        this.vaccineBatchOptions = resp.data;
        if (this.breakageObj) {

        } else {
          this.breakageForm.controls['vaccProductCode'].setValue(temp[0].vaccineProductCode);
          this.breakageForm.controls['prodBatchCode'].setValue(resp.data[0].batchNo);
          this.breakageForm.controls['eleSuperviseCode'].setValue(null);
        }
      } else {
        this.platformService.warning('所选疫苗没有库存，请确认选择的疫苗！');
      }
    });
  }

  error(content, func?: Function) {
    this.modalService.error(
      {
        nzTitle: '错误',
        nzContent: content,
        nzOnOk: instance => {
          if (typeof func === 'function') {
            func(instance);
          }
        }
      }
    );
  }

  warning(content, func?: Function) {
    this.modalService.warning(
      {
        nzTitle: '警告',
        nzContent: content,
        nzOnOk: instance => {
          if (typeof func === 'function') {
            func(instance);
          }
        }
      }
    );
  }

  success(content, func?: Function) {
    this.modalService.success(
      {
        nzTitle: '成功',
        nzContent: content,
        nzOnOk: instance => {
          if (typeof func === 'function') {
            func(instance);
          }
        }
      }
    );
  }
}

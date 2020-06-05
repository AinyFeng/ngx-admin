import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {NbDialogRef} from '@nebular/theme';
import {DateUtils, DepartmentInitService, DicDataService, StockService} from '@tod/svs-common-lib';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-update-inventory-record',
  templateUrl: './update-inventory-record.component.html',
  styleUrls: ['./update-inventory-record.component.scss']
})
export class UpdateInventoryRecordComponent implements OnInit {

  loading = false;
  modifyFrom: FormGroup;
  // 编辑需要传入数据
  record: any;
  // 经费来源options
  sourceCodeOptions: any;
  // 设备状态options
  facilityStatusOptions: any;
  // 科室信息
  departmentOptions = [];
  userInfo: any;

  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<UpdateInventoryRecordComponent>,
    private msg: NzMessageService,
    private stockService: StockService,
    private user: UserService,
    private departmentSvc: DepartmentInitService,
    private dicSvc: DicDataService,
  ) {
  }

  ngOnInit() {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
    // 获取科室
    this.departmentOptions = this.departmentSvc.getDepartmentData();
    // 获取经费来源
    this.sourceCodeOptions = this.dicSvc.getDicDataByKey('fixedAssetsSource');
    // 获取设备状态
    this.facilityStatusOptions = this.dicSvc.getDicDataByKey('facilityStatus');

    console.log('需要编辑的数据==', this.record);
    if (this.record || this.record != null) {
      // 编辑
      this.modifyFrom = this.fb.group({
        reportDate: [DateUtils.getFormatTime(this.record.reportDate, 'YYYY-MM-DD'), [Validators.required]], // 盘点日期
        prodBatchCode: [this.record.prodBatchCode, [Validators.required]],
        productName: [this.record.vaccineProductName, [Validators.required]],
        manufacturerName: [this.record.manufacturerName, [Validators.required]],
        breakageOut: [this.record.breakageOut, [Validators.required]],
        closingStock: [this.record.closingStock, [Validators.required]],
        beginningStock: [this.record.beginningStock, [Validators.required]],
        allotIn: [this.record.allotIn, [Validators.required]],
        allotOut: [this.record.allotOut, [Validators.required]],
        massVaccinateOut: [this.record.massVaccinateOut, [Validators.required]],
        massVaccinateIn: [this.record.massVaccinateIn, [Validators.required]],
        cdcOut: [this.record.cdcOut, [Validators.required]],
        cdcIn: [this.record.cdcIn, [Validators.required]],
        otherIn: [this.record.otherIn, [Validators.required]],
        otherOut: [this.record.otherOut, [Validators.required]],
        vaccinateOut: [this.record.vaccinateOut, [Validators.required]],
        memo: [this.record.memo]
      });
    } else {
      // 数据有误
      this.msg.warning('数据有误，请检查');
    }
  }

  // 关闭弹窗
  onClose() {
    this.ref.close();
  }

  // 编辑修改保存
  save() {
    const formGroupVal = this.modifyFrom.controls;
    for (const controlKey in formGroupVal) {
      if (formGroupVal[controlKey]) {
        const formVal: any = formGroupVal[controlKey];
        if (formVal.invalid) {
          this.modifyFrom.get(controlKey).markAsDirty();
          this.modifyFrom.get(controlKey).markAsTouched();
        }
      }
    }
    if (this.modifyFrom.invalid) {
      this.msg.warning('表单填写不完整或有误，请检查');
      return;
    }
    this.loading = true;
    const updateParams = {
      serialCode: this.record.serialCode,
      breakageOut: this.modifyFrom.value.breakageOut,
      closingStock: this.modifyFrom.value.closingStock,
      beginningStock: this.modifyFrom.value.beginningStock,
      allotIn: this.modifyFrom.value.allotIn,
      allotOut: this.modifyFrom.value.allotOut,
      massVaccinateOut: this.modifyFrom.value.massVaccinateOut,
      massVaccinateIn: this.modifyFrom.value.massVaccinateIn,
      cdcOut: this.modifyFrom.value.cdcOut,
      cdcIn: this.modifyFrom.value.cdcIn,
      otherIn: this.modifyFrom.value.otherIn,
      otherOut: this.modifyFrom.value.otherOut,
      vaccinateOut: this.modifyFrom.value.vaccinateOut,
      memo: this.modifyFrom.value.memo,
    };
    this.stockService.updateStockInventoryRecord(updateParams, res => {
      this.loading = false;
      console.log('修改====', res);
      if (res && res.code === 0) {
        this.msg.info(res.msg);
        this.ref.close(true);
      } else {
        this.msg.warning(`${res.msg}`);
      }
    });
  }
}


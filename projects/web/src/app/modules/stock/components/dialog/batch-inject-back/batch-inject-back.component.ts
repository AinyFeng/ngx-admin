import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NbDialogRef} from '@nebular/theme';
import {
  DateUtils,
  DepartmentInitService,
  DicDataService, PovStaffInitService,
  StockCommonService,
  StockService,
  VaccRecordTransformService
} from '@tod/svs-common-lib';
import {NzMessageService} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-batch-inject-back',
  templateUrl: './batch-inject-back.component.html',
  styleUrls: ['../../stock.common.scss'],
  providers: [StockCommonService]
})
export class BatchInjectBackComponent implements OnInit {
  // 需要批量退回的疫苗信息
  vaccinateInfo: any;
  loading = false;
  backFrom: FormGroup;
 /* // 需要入库的数据(从入库页面中带入)
  discussInfo: any;*/
  userInfo: any;
  // 操作人
  staffOption = [];
  staffOptionSelected = [];
  // 部门(科室)
  departmentOptions = [];
  departmentSelect = [];
  // 冰箱设备
  facilityOptions = [];
  /**
   * 当前日期
   */
  currentDate = new Date();
  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<BatchInjectBackComponent>,
    private vaccRecordTransformService: VaccRecordTransformService,
    private msg: NzMessageService,
    private stockService: StockService,
    private user: UserService,
    private dicSvc: DicDataService,
    private stockCommon: StockCommonService,
    private departmentSvc: DepartmentInitService,
    private povStaffDataInit: PovStaffInitService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    // 获取科室
    this.departmentOptions = this.departmentSvc.getDepartmentData();
    // 过滤科室信息
    this.departmentOptions.forEach( d => {
      if ( d.type === '1' || d.type === '4') {
        this.departmentSelect.push(d);
      }
    });
    // 获取操作人信息
    this.staffOption = this.povStaffDataInit.getPovStaffData();
   /* console.log('staffOption==', this.staffOption);*/
    // 过滤number是null的数据
    this.staffOption.forEach( d => {
      if ( d.number && d.number !== '') {
        this.staffOptionSelected.push(d);
      }
    });
    /*console.log('需要批量接种退回的数据==', this.vaccinateInfo);*/
    this.backFrom = this.fb.group({
      // 用于展示要回退的信息
      /*vaccineProductCode: [this.vaccinateInfo.vaccineProductCode, [Validators.required]],*/
      vaccinateCount: [this.vaccinateInfo.vaccinateCount, [Validators.required]],
      prodBatchCode: [this.vaccinateInfo.vaccineBatchNo, [Validators.required]],
      beVaccinateUnits: [this.vaccinateInfo.beVaccinateUnits, [Validators.required]],
      departmentCode: [null, [Validators.required]],
      facilityCode: [null, [Validators.required]],
      backCount: [null, [Validators.required]],
      stockBy: [null, [Validators.required]],
      backTime: [null, [Validators.required]],  // 时间
      memo: [null]
    });
  }
  // 关闭弹窗
  onClose() {
    this.ref.close();
  }
  // 修改
  modify() {
    const formGroupVal = this.backFrom.controls;
    for (const controlKey in formGroupVal) {
      if (formGroupVal[controlKey]) {
        const formVal: any = formGroupVal[controlKey];
        if (formVal.invalid) {
          this.backFrom.get(controlKey).markAsDirty();
          this.backFrom.get(controlKey).markAsTouched();
        }
      }
    }
    if (this.backFrom.invalid) {
      this.msg.warning('表单填写不完整或有误，请检查');
      return;
    }
    const params = {
      povCode: this.userInfo.pov,
      batchVaccinateRecordNo: this.vaccinateInfo.batchVaccinateRecordNo, // 记录表流水号
      vaccProductCode: this.vaccinateInfo.vaccineProductCode,
      prodBatchCode: this.vaccinateInfo.vaccineBatchNo,
      inFacilityCode: this.backFrom.value.facilityCode,
      inDepartmentCode: this.backFrom.value.departmentCode,
      returnCount: this.backFrom.value.backCount,
      stockInBy: this.backFrom.value.stockBy,
      stockInTime: DateUtils.getTimestamp(this.backFrom.value.backTime),
      memo: this.backFrom.value.memo
    };
    console.log('回退参数==', params);
    this.loading = true;
    this.stockService.massReturn(params, res => {
      this.loading = false;
      console.log('回退====', res);
      if (res && res.code === 0) {
        this.msg.info(res.msg);
        this.ref.close(true);
      } else {
        this.msg.warning(`${res.msg}`);
      }
    });
  }

  /**
   *  获取部门下的设备
   * @param ev
   */
  departmentChange(ev) {
    if (!ev) {
      return;
    }
    this.facilityOptions = [];
    const params = {
      belongPovCode: this.userInfo.pov,
      belongDepartmentCode: ev
    };
    this.stockCommon.getFacilityOptions(params, res => {
      this.loading = false;
      if (res && res.code === 0 && res.data.length > 0) {
        this.facilityOptions = res.data;
        setTimeout(() => {
          this.backFrom.get('facilityCode').setValue(this.facilityOptions[0].value);
        }, 50);
      } else {
        this.backFrom.get('facilityCode').setValue(null);
      }
    });
  }
  /**
   * 过滤处理日期
   * @param d
   */
  filterHandleDate = (d: Date) => {
      return d > new Date();
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';
import {
  DepartmentInitService,
  StockService,
  DicDataService,
  StockCommonService,
  PovStaffInitService
} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-allot-inpov-dialog',
  templateUrl: './allot-inpov-dialog.component.html',
  styleUrls: ['../../stock.common.scss'],
  providers: [StockCommonService]
})
export class AllotInpovDialogComponent implements OnInit {
  // 需要调剂的数据(从入库页面中带入)
  allotInfo: any;
  loading = false;
  allotFrom: FormGroup;
  userInfo: any;
  allotTypeData: any;
  // 部门(科室)
  departmentOptions = [];
  departmentSelect = [];
  // 冰箱设备
  facilityOptions = [];
  // 操作人
  staffOption = [];
  staffOptionSelected = [];
  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<AllotInpovDialogComponent>,
    private departmentSvc: DepartmentInitService,
    private msg: NzMessageService,
    private stockService: StockService,
    private user: UserService,
    private dicSvc: DicDataService,
    private stockCommon: StockCommonService,
    private povStaffDataInit: PovStaffInitService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    // 门诊内调剂类型
    this.allotTypeData = this.dicSvc.getDicData().allotType;
    // 部门数据
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
    console.log('allot的数据======', this.departmentOptions);
    this.allotFrom = this.fb.group({
      vaccineProductCode: [this.allotInfo.vacc_product_code, [Validators.required]],
      prodBatchCode: [this.allotInfo.prod_batch_code, [Validators.required]],
      count: [this.allotInfo.count, [Validators.required]],
      outDepartmentCode: [this.allotInfo.department_code], // 部门
      outFacilityCode: [this.allotInfo.facility_code], // 出库冷藏设备
      inDepartmentCode: [null, [Validators.required]],
      allotCount: [null, [Validators.required]],
      allotType: ['1', [Validators.required]], // 调拨类型
      inFacilityCode: [null, [Validators.required]], // 入库冷藏设备
      stockBy: [null, [Validators.required]],
      reason: [null],
      memo: [null],
    });
  }
  // 关闭弹窗
  onClose() {
    this.ref.close();
  }
  // 修改
  modify() {
    const formGroupVal = this.allotFrom.controls;
    for (const controlKey in formGroupVal) {
      if (formGroupVal[controlKey]) {
        const formVal: any = formGroupVal[controlKey];
        if (formVal.invalid) {
          this.allotFrom.get(controlKey).markAsDirty();
          this.allotFrom.get(controlKey).markAsTouched();
        }
      }
    }
    if (this.allotFrom.value.allotCount > this.allotInfo.count) {
      this.msg.warning('调拨数量不能大于现有库存！');
      return;
    }
    if (this.allotFrom.invalid) {
      this.msg.warning('请正确填写合议信息！');
      return;
    }
    // 调拨入参
    const params = {
      povCode: this.userInfo.pov,
      acceptanceSerial: this.allotInfo.acceptance_serial,
      allotType: this.allotFrom.value.allotType,
      outFacilityCode: this.allotInfo.facility_code,
      inFacilityCode: this.allotFrom.value.inFacilityCode,
      vaccProductCode: this.allotInfo.vacc_product_code,
      prodBatchCode: this.allotInfo.prod_batch_code,
      inDepartmentCode: this.allotFrom.value.inDepartmentCode,
      outDepartmentCode: this.allotInfo.department_code,
      count: this.allotFrom.value.allotCount, // 出库数量
      stockBy: this.allotFrom.value.stockBy,
      reason: this.allotFrom.value.reason,
      memo: this.allotFrom.value.memo,
    };
    console.log('allot参数==', params);
    this.loading = true;
    this.stockService.allotInPov(params, res => {
      this.loading = false;
      console.log('allot====', res);
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
      if (res && res.code === 0  && res.data.length > 0) {
        this.facilityOptions = res.data;
        setTimeout(() => {
          this.allotFrom.get('inFacilityCode').setValue(this.facilityOptions[0].value);
        }, 100);
       /* console.log('设备====', params, this.facilityOptions);*/
      } else {
        this.allotFrom.get('inFacilityCode').setValue(null);
      }
    });
  }

}

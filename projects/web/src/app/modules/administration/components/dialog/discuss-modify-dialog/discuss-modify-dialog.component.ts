import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import {
  StockCommonService,
  StockService,
  VaccRecordTransformService,
  DicDataService,
  PovStaffInitService
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';


@Component({
  selector: 'uea-discuss-modify-dialog',
  templateUrl: './discuss-modify-dialog.component.html',
  styleUrls: ['../../admin.common.scss'],
  providers: [StockCommonService]
})
export class DiscussModifyDialogComponent implements OnInit {
  loading = false;
  modifyFrom: FormGroup;
  // 需要入库的数据(从入库页面中带入)
  discussInfo: any;
  userInfo: any;
  modifyOptionData: any;
  // 操作人
  staffOption = [];
  staffOptionSelected = [];
  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<DiscussModifyDialogComponent>,
    private vaccRecordTransformService: VaccRecordTransformService,
    private msg: NzMessageService,
    private stockService: StockService,
    private user: UserService,
    private dicSvc: DicDataService,
    private povStaffDataInit: PovStaffInitService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    // 合议项
    this.modifyOptionData = this.dicSvc.getDicData().modifyOption;
    // 获取操作人信息
    this.staffOption = this.povStaffDataInit.getPovStaffData();
    /* console.log('staffOption==', this.staffOption);*/
    // 过滤number是null的数据
    this.staffOption.forEach( d => {
      if ( d.number && d.number !== '') {
        this.staffOptionSelected.push(d);
      }
    });
    console.log('需要合议的数据==', this.discussInfo);
    this.modifyFrom = this.fb.group({
      vaccineProductCode: [this.discussInfo.vaccineProductName, [Validators.required]],
      vaccineSpecification: [this.discussInfo.vaccineSpecification, [Validators.required]],
      manufacturerCode: [this.vaccRecordTransformService.transformManufacture(this.discussInfo.manufacturerCode), [Validators.required]],
      prodBatchCode: [this.discussInfo.batchNo, [Validators.required]],
      count: [this.discussInfo.count, [Validators.required]],
      departmentCode: [this.discussInfo.departmentCode], // 部门
      countInOrOut: [null, [Validators.required]],
      modifyOption: ['1', [Validators.required]], // 合议项
      modifyBy: [null, [Validators.required]],
      memo: [null],
    });
  }
  // 关闭弹窗
  onClose() {
    this.ref.close();
  }
  // 修改
  modify() {
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
    const params = {
      povCode: this.userInfo.pov,
      acceptanceSerial: this.discussInfo.acceptance_serial, // 入库单号
      stockChangeSerial: this.discussInfo.stockChangeSerial,
      stockChangeEvent: this.discussInfo.stockChangeEvent,
      stockEventSerial: this.discussInfo.stockEventSerial,
      facilityCode: this.discussInfo.facilityCode,
      vaccProductCode: this.discussInfo.vacc_product_code,
      prodBatchCode: this.discussInfo.batchNo,
      count: this.modifyFrom.value.countInOrOut, // 合议的值
      modifyOption: this.modifyFrom.value.modifyOption,
      formerValue: this.discussInfo.count, // 合议修改前的值
      modifyBy: this.modifyFrom.value.modifyBy, // 修改人
      isStockIn: this.discussInfo.isStockIn,
      memo: this.modifyFrom.value.memo
    };
    console.log('合议参数==', params);
    this.loading = true;
    this.stockService.discussModify(params, res => {
      this.loading = false;
      console.log('合议====', res);
      if (res && res.code === 0) {
        this.msg.info(res.msg);
        this.ref.close(true);
      } else {
        this.msg.warning(`${res.msg}`);
      }
    });
  }
}

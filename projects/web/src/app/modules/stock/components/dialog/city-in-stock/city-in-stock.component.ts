import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';
import {StockService, StockCommonService, PovStaffInitService, DepartmentInitService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-city-in-stock',
  templateUrl: './city-in-stock.component.html',
  styleUrls: ['../../stock.common.scss'],
  providers: [StockCommonService]
})
export class CityInStockComponent implements OnInit {
  loading = false;
  instockFrom: FormGroup;
  // 需要入库的数据(从入库页面中带入)
  instockInfo: any;
  userInfo: any;
  // 操作人
  staffOption = [];
  staffOptionSelected = [];
  // 部门(科室)
  departmentOptions = [];
  departmentSelect = [];
  // 冰箱设备
  facilityOptions = [];
  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<CityInStockComponent>,
    private msg: NzMessageService,
    private stockService: StockService,
    private user: UserService,
    private stockCommon: StockCommonService,
    private povStaffDataInit: PovStaffInitService,
    private departmentSvc: DepartmentInitService
  ) { }

  ngOnInit() {
    // 获取操作人信息
    this.staffOption = this.povStaffDataInit.getPovStaffData();
    /* console.log('staffOption==', this.staffOption);*/
    // 过滤number是null的数据
    this.staffOption.forEach( d => {
      if ( d.number && d.number !== '') {
        this.staffOptionSelected.push(d);
      }
    });
    // 获取科室
    this.departmentOptions = this.departmentSvc.getDepartmentData();
    // 过滤科室信息
    this.departmentOptions.forEach(d => {
      if (d.type === '4') {
        this.departmentSelect.push(d);
      }
    });
    this.instockFrom = this.fb.group({
      auditor: [null, [Validators.required]], // 审核人
      receiver: [null, [Validators.required]], // 收料人
      sheetComparison: ['1', [Validators.required]], // 与出库单、运输单比较  默认符合
      numberComparision: ['1', [Validators.required]], // 批号数量检查 默认符合
      temperatureRecord: ['1', [Validators.required]], // 冷链运输温度记录 默认符合
      departmentCode: [], // 部门编码
      facilityCode: [], // 设备
    });
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }
  // 关闭弹窗
  onClose() {
    this.ref.close();
  }
  // 提交入库
  onSubmit() {
    const formGroupVal = this.instockFrom.controls;
    for (const controlKey in formGroupVal) {
      if (formGroupVal[controlKey]) {
        const formVal: any = formGroupVal[controlKey];
        if (formVal.invalid) {
          this.instockFrom.get(controlKey).markAsDirty();
          this.instockFrom.get(controlKey).markAsTouched();
        }
      }
    }
    if (this.instockFrom.invalid) {
      this.msg.warning('请正确填写入库信息');
      return;
    }
    const params = {
      // 测试
      /* povCode: '3406030301',*/
      povCode: this.userInfo.pov,
      acceptanceSerial: this.instockInfo.acceptanceSerial,
      stockInSerial: this.instockInfo.stockInSerial,
      auditor: this.instockFrom.value.auditor,
      receiver: this.instockFrom.value.receiver,
      sheetComparison: this.instockFrom.value.sheetComparison,
      numberComparision: this.instockFrom.value.numberComparision,
      temperatureRecord: this.instockFrom.value.temperatureRecord,
      userCode: this.userInfo.employee,
      departmentCode: this.instockFrom.value.departmentCode, // 部门编码
      facilityCode: this.instockFrom.value.facilityCode // 设备
    };
    console.log('需要入库的数据参数==', params);
    this.loading = true;
    this.stockService.confirmVaccineStorage(params, res => {
      this.loading = false;
      console.log('入库====', res);
      if (res && res.code === 0 && res.data) {
        this.msg.success(`入库成功！`);
        this.ref.close(true);
      } else {
        this.msg.error(`入库失败！`);
      }
    });
  }
  /**
   *  获取部门下的设备
   * @param ev
   */
  departmentChange(ev) {
    console.log('部门====', ev);
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
        this.instockFrom.get('facilityCode').setValue(this.facilityOptions[0].value);
        /*console.log('设备====', params, this.facilityOptions);*/
      } else {
        this.instockFrom.get('facilityCode').setValue(null);
      }
    });
  }


}


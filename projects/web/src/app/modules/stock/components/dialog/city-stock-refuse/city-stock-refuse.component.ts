import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';
import {PovStaffInitService, StockCommonService, StockService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-city-stock-refuse',
  templateUrl: './city-stock-refuse.component.html',
  styleUrls: ['../../stock.common.scss'],
  providers: [StockCommonService]
})
export class CityStockRefuseComponent implements OnInit {
  loading = false;
  instockFrom: FormGroup;
  // 需要入库的数据(从入库页面中带入)
  instockInfo: any;
  userInfo: any;
  // 操作人
  staffOption = [];
  staffOptionSelected = [];
  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<CityStockRefuseComponent>,
    private msg: NzMessageService,
    private stockService: StockService,
    private user: UserService,
    private povStaffDataInit: PovStaffInitService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

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
    this.instockFrom = this.fb.group({
      auditor: [null, [Validators.required]], // 审核人
      receiver: [null, [Validators.required]], // 收料人
      sheetComparison: ['0', [Validators.required]], // 与出库单、运输单比较
      numberComparision: ['0', [Validators.required]], // 批号数量检查
      temperatureRecord: ['0', [Validators.required]], // 冷链运输温度记录
    });
  }
  // 关闭弹窗
  onClose() {
    this.ref.close();
  }
  // 提交拒收
  doRefuse() {
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
      this.msg.warning('请正确填写表单信息');
      return;
    }
    const params = {
      // 测试
      povCode: this.userInfo.pov,
      /*povCode: this.userInfo.pov,*/
      acceptanceSerial: this.instockInfo.acceptanceSerial,
      stockInSerial: this.instockInfo.stockInSerial,
      auditor: this.instockFrom.value.auditor,
      receiver: this.instockFrom.value.receiver,
      sheetComparison: this.instockFrom.value.sheetComparison,
      numberComparision: this.instockFrom.value.numberComparision,
      temperatureRecord: this.instockFrom.value.temperatureRecord,
      userCode: this.userInfo.employee
    };
    console.log('拒收数据参数==', params);
    this.loading = true;
    this.stockService.refused(params, res => {
      this.loading = false;
      console.log('入库====', res);
      if (res && res.code === 0 && res.data) {
        this.msg.success(`拒收成功！`);
        this.ref.close(true);
      } else {
        this.msg.error(`拒收失败！`);
      }
    });
  }
}

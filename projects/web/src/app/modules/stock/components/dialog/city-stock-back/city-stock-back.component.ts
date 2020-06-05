import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { NbDialogRef } from '@nebular/theme';
import {PovStaffInitService, StockCommonService, StockService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-city-stock-back',
  templateUrl: './city-stock-back.component.html',
  styleUrls: ['../../stock.common.scss'],
  providers: [StockCommonService]
})
export class CityStockBackComponent implements OnInit {
  sendBackForm: FormGroup;
  // 需要退回市平台的数据
  sendBackInfo: any;
  // 操作人
  staffOption = [];
  staffOptionSelected = [];
  loading = false;
  userInfo: any;
  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private stockService: StockService,
    private ref: NbDialogRef<CityStockBackComponent>,
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
    this.sendBackForm = this.fb.group({
      stockBy: [null, [Validators.required]],
      reason: [null, [Validators.required]],
      memo: [null]
    });
  }
  // 执行回退
  sendBack() {
    const formGroupVal = this.sendBackForm.controls;
    for (const controlKey in formGroupVal) {
      if (formGroupVal[controlKey]) {
        const formVal: any = formGroupVal[controlKey];
        if (formVal.invalid) {
          this.sendBackForm.get(controlKey).markAsDirty();
          this.sendBackForm.get(controlKey).markAsTouched();
        }
      }
    }
    if (this.sendBackForm.invalid) {
      this.msg.warning('请正确填写表单信息');
      return;
    }
    const params = {
      // 测试
      povCode: this.userInfo.pov,
      acceptanceSerial: this.sendBackInfo.acceptanceSerial,
      stockBy: this.sendBackForm.value.stockBy,
      reason: this.sendBackForm.value.reason,
      memo: this.sendBackForm.value.memo

    };
    console.log('回退数据参数==', params);
    this.loading = true;
    this.stockService.stockedBack(params, res => {
      this.loading = false;
      if (res && res.code === 0 && res.data) {
        this.msg.success(`回退成功！`);
        this.ref.close(true);
      } else {
        this.msg.error(`回退失败！`);
      }
    });
  }
  // 关闭弹窗
  onClose() {
    this.ref.close();
  }
}



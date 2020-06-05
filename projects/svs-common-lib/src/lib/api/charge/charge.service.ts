import { Injectable } from '@angular/core';
// import { ApiService } from '../api.service';
import { CHARGE_URLS } from '../url-params.const';
import { zip } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable()
export class ChargeService {
  constructor(private api: ApiService) { }

  /**
   *  发票统计发票数据和总金额数
   */
  inventoryTotal(params: any, func: Function) {
    this.api.post(CHARGE_URLS.invoiceTotal, params)
      .subscribe(result => func(result));
  }

  /**
   * 发票统计和count二合一接口
   * @author ainy
   * @params:
   * @date 2019/11/14
   */
  inventoryAndCount(params: any, func: Function) {
    zip(
      this.api.post(CHARGE_URLS.invoice, params),
      this.api.post(CHARGE_URLS.invoiceAndCount, params)
    ).subscribe(result => func(result));
  }

  /**
   *  网上支付统计
   */
  payType(params: any, func: Function) {
    this.api
      .post(CHARGE_URLS.payType, params)
      .subscribe(result => func(result));
  }

  /**
   *  对账管理
   */
  orderManager(params: any, func: Function) {
    this.api
      .post(CHARGE_URLS.orderManager, params)
      .subscribe(result => func(result));
  }

  /**
   *  报表明细
   */
  reportManager(params: any, func: Function) {
    this.api
      .post(CHARGE_URLS.reportManager, params)
      .subscribe(result => func(result));
  }

  /**
   * 报表日明细和count
   * @author ainy
   * @params:
   * @date 2019/12/3 0003
   */
  reportManagerAndCount(params: any, func: Function) {
    zip(
      this.api.post(CHARGE_URLS.reportManager, params),
      this.api.post(CHARGE_URLS.reportManagerAndCount, params)
    ).subscribe(result => func(result));
  }
}

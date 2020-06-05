import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import {PAYMENT_URLS, REGIST_RECORD_URLS} from '../url-params.const';
import { QueryEntity } from '../entity/profile.entity';

@Injectable()
export class RegistRecordService {
  constructor(private api: ApiService) {
  }

  /**
   * 存储登记记录信息
   * @param params
   * @param func
   */
  saveRegistRecord(params: any, func: Function) {
    this.api
      .post(REGIST_RECORD_URLS.saveRegistRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 批量存储登记记录信息，并不存储登记记录
   * @param params
   * @param func
   */
  saveRegistRecordBatch(params: any, func: Function) {
    this.api
      .post(REGIST_RECORD_URLS.saveRegistRecordBatch, params)
      .subscribe(result => func(result));
  }

  /**
   * 存储登记记录和签字信息
   * @param params
   * @param func
   */
  saveRegistRecordAndSignatureList(params: any, func: Function) {
    this.api
      .post(REGIST_RECORD_URLS.saveRegistRecordAndSignature, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询登记记录
   * @param params
   * @param func
   */
  queryRegistRecord(params: any, func: Function) {
    this.api
      .post(REGIST_RECORD_URLS.queryRegistRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 更新登记记录
   * @param params
   * @param func
   */
  updateRegistRecord(params: any, func: Function) {
    this.api
      .put(REGIST_RECORD_URLS.updateRegistRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 取消登记记录
   * @param params
   * @param func
   */
  cancelRegRecord(params: any, func: Function) {
    this.api
      .put(REGIST_RECORD_URLS.cancelRegRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 统计登记记录的数量
   * @param params
   * @param func
   */
  countRegistRecord(params: any, func: Function) {
    this.api.post(REGIST_RECORD_URLS.countRegistRecord, params).subscribe(result => func(result));
  }

  /**
   * 批量更新登记记录订单状态为已付款
   * @param params
   * @param func
   */
  updateRecordOrderStatusByOrderSerial(params: any[], func: Function) {
    this.api.post(REGIST_RECORD_URLS.updateRecordOrderStatusByOrderSerial, params).subscribe(result => func(result));
  }

  /**
   * 批量更新登记记录订单状态为已取消
   * @param params
   * @param func
   */
  cancelRecordOrderStatusByOrderSerial(params: string[], func: Function) {
    this.api.post(REGIST_RECORD_URLS.cancelRecordOrderStatusByOrderSerial, params).subscribe(result => func(result));
  }

  /**
   * 根据订单号改变订单状态
   * @param params
   * @param func
   */
  updateOrderStatus(params: any, func: Function) {
    this.api.post(PAYMENT_URLS.changeOrderStatus, params).subscribe(result => func(result));
  }
}

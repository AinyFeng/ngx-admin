/**
 * Created by Administrator on 2019/7/10.
 */
import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {PAYMENT_URLS, VACCINATE_URLS} from '../url-params.const';
import {forkJoin, Observable} from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(private api: ApiService) {
  }

  /**
   * 生成订单信息
   * @param params
   * @param func
   */
  generateOrder(params: any, func: Function) {
    this.api
      .post(PAYMENT_URLS.generateOrder, params)
      .subscribe(result => func(result));
  }

  /**
   * 支付订单
   * @param params
   * @param func
   */
  payOrder(params: any, func: Function) {
    this.api
      .post(PAYMENT_URLS.payOrder, params)
      .subscribe(result => func(result));
  }

  /**
   * 取消订单
   * @param orderSerial
   * @param func
   */
  cancelOrder(orderSerial: string, func: Function) {
    this.api
      .del(PAYMENT_URLS.cancelOrder + '/' + orderSerial)
      .subscribe(result => func(result));
  }

  /**
   * 根据全局流水号获取订单列表
   * @param globalSerial
   * @param func
   */
  queryListByGlobalSerial(globalSerial: string, func: Function) {
    this.api
      .get(PAYMENT_URLS.queryListByGlobalSerial + '/' + globalSerial)
      .subscribe(result => func(result));
  }

  /**
   * 根据订单流水号获取订单列表
   * @param orderSerial
   * @param func
   */
  queryByOrderSerial(orderSerial: string, func: Function) {
    this.api
      .get(PAYMENT_URLS.queryByOrderSerial + '/' + orderSerial)
      .subscribe(result => func(result));
  }

  /**
   * 根据条件查询订单
   * @param params
   * @param func
   */
  queryByCondition(params: any, func: Function) {
    this.api
      .post(PAYMENT_URLS.queryByCondition, params)
      .subscribe(result => func(result));
  }

  /**
   * 根据条件统计订单数量
   * @param params
   * @param func
   */
  countByCondition(params: any, func: Function) {
    this.api
      .post(PAYMENT_URLS.countByCondition, params)
      .subscribe(result => func(result));
  }

  /**
   * 根据条件查询和统计订单数量
   * @param params
   * @param func
   */
  queryAndCountOrderByCondition(params: any, func: Function) {
    forkJoin([
      this.api
        .post(PAYMENT_URLS.queryByCondition, params),
      this.api
        .post(PAYMENT_URLS.countByCondition, params)
    ]).subscribe(([query, count]) => {
      func([query, count]);
    });
  }

  /**
   * 根据订单流水号生成打印发票信息
   * @param orderSerial
   * @param func
   */
  issueInvoice(orderSerial: string, func: Function) {
    this.api
      .get(PAYMENT_URLS.issueInvoice + '/' + orderSerial)
      .subscribe(result => func(result));
  }

  /**
   * 根据订单流水号更新打印发票状态
   * @param orderSerial
   * @param func
   */
  updateInvoiceStatus(orderSerial: string, func: Function) {
    this.api
      .get(PAYMENT_URLS.updateInvoiceStatus + '/' + orderSerial)
      .subscribe(result => func(result));
  }

  /**
   * 根据订单流水号更新打印发票状态的开票人
   * @param orderSerial 订单号
   * @param invoiceBy 开票人
   * @param func
   */
  updateInvoiceBy(orderSerial: string, invoiceBy: string, func: Function) {
    this.api
      .get(PAYMENT_URLS.updateInvoiceBy + '/' + orderSerial + '/' + invoiceBy)
      .subscribe(result => func(result));
  }

  /**
   * 根据订单流水号作废发票
   * @param invoiceSerial
   * @param func
   */
  invalidInvoice(invoiceSerial: string, func: Function) {
    this.api
      .del(PAYMENT_URLS.invoiceInvalid + '/' + invoiceSerial)
      .subscribe(result => func(result));
  }

  /**
   * 批量缴费订单
   * @param params
   * @param func
   */
  payOrderList(params: any[], func: Function) {
    this.api.post(PAYMENT_URLS.payOrderList, params).subscribe(result => func(result));
  }

  /**
   * 批量取消订单
   * @param params
   * @param func
   */
  cancelOrderList(params: string[], func: Function) {
    this.api.post(PAYMENT_URLS.cancelOrderList, params).subscribe(result => func(result));
  }

  /**
   * 根据订单序列号删除订单，同时根据已有的免费苗生成新的订单，然后将新的订单号码更新到已有的登记记录中
   * @param params
   * @param func
   */
  cancelOrderByOrderSerialListAndGeneFree(params: string[], func: Function) {
    this.api.post(PAYMENT_URLS.cancelOrderByOrderSerialListAndGeneFree, params).subscribe(result => func(result));
  }

  /**
   * 选择移动支付(支付宝支付)付款缴费
   * @param params
   * @param func
   */
  payByAlipay(params: any, func: Function) {
    this.api.post(PAYMENT_URLS.payOrderAlipay, params).subscribe(result => func(result));
  }

  /**
   * 查询移动支付（付款缴费的结果是否成功）
   * @param params
   * @param func
   */
  queryPayByAlipayResult(params: any, func: Function) {
    this.api.post(PAYMENT_URLS.queryPayOrderAlipay, params).subscribe(result => func(result));
  }

}

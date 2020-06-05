import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { QUEUE } from '../url-params.const';
import { HttpClient, HttpParams } from '@angular/common/http';

/**
 * 队列接口操作类
 */
@Injectable()
// @ts-ignore
export class QueueApiService {
  constructor(private api: ApiService, private httpClient: HttpClient) {
  }

  /**
   * 自助机取号
   */
  retrieve(params: any, func: Function) {
    this.api.post(QUEUE.retrieve, params).subscribe(result => func(result));
  }

  /**
   * 儿童接种取号之前查询档案信息
   * @param params
   * @param func
   */
  queryProfileBeforeRetrieve(params: any, func: Function) {
    this.api.post(QUEUE.queryProfileBeforeRetrieve, params).subscribe(result => func(result));
  }

  /**
   * iot设备重复叫号，并不修改排号信息的状态
   * @param params
   * @param func
   */
  repeatCallQueueCode(params: any, func: Function) {
    this.api
      .post(QUEUE.repeatCallQueueCode, params)
      .subscribe(result => func(result));
  }

  /**
   * 登记台直接叫号
   * @param params
   * @param func
   */
  callQueueCode(params: any, func: Function) {
    this.api
      .post(QUEUE.callQueueCode, params)
      .subscribe(result => func(result));
  }

  /**
   * 叫下一号，同时修改上一个数据和当前叫号数据的状态
   * @param params
   * @param func
   */
  callNextQueueCode(params: any, func: Function) {
    this.api
      .post(QUEUE.callNextQueueCode, params)
      .subscribe(result => func(result));
  }

  /**
   * 初始化消息队列列表
   * @param povCode
   * @param nameSpace
   * @param sharedTopic
   * @param monitorTopic
   * @param func
   */
  initQueueList(
    povCode: string,
    nameSpace: string,
    sharedTopic: string,
    monitorTopic: string,
    func: Function
  ) {
    // 使用http params 的好处是避免 url encode 的问题
    const params = new HttpParams()
      .set('sharedTopic', sharedTopic)
      .set('monitorTopic', monitorTopic)
      .set('nameSpace', nameSpace);
    this.api
      .get(QUEUE.initQueueCode + '/' + povCode, params)
      .subscribe(result => func(result));
  }

  /**
   * 初始化消息队列列表
   * @param params
   * @param func
   */
  addToPayQueueOrVaccinateQueue(params: any, func: Function) {
    this.api
      .post(QUEUE.addToPayQueueOrVaccinateQueue, params)
      .subscribe(result => func(result));
  }

  /**
   * 向接种台公共队列推送消息
   * @param params
   * @param func
   */
  addToVaccinationFromPayQueue(params: any, func: Function) {
    this.api
      .post(QUEUE.addToVaccinationFromPayQueue, params)
      .subscribe(result => func(result));
  }

  /**
   * 收银台取消订单
   * @param params
   * @param func
   */

  /*cancelPayOrder(params: any, func: Function) {
    this.api.post(QUEUE.cancelPayOrder, params).subscribe(result => func(result));
  }*/
  cancelPayOrder(params: any, func: Function) {
    this.api
      .post(QUEUE.cancelPayOrder, params)
      .subscribe(result => func(result));
  }

  vaccineCallNextNumber(params, func: Function) {
    this.api
      .post(QUEUE.vaccineCallNextNumber, params)
      .subscribe(result => func(result));
  }

  vaccinateFinished(params, func: Function) {
    this.api
      .post(QUEUE.vaccinateFinished, params)
      .subscribe(result => func(result));
  }

  vaccinateUnqualified(params, func: Function) {
    this.api
      .post(QUEUE.vaccinateUnqualified, params)
      .subscribe(result => func(result));
  }

  vaccinateCallNumber(params, func: Function) {
    this.api
      .post(QUEUE.vaccineCallNumber, params)
      .subscribe(result => func(result));
  }

  vaccinatePassNumber(params, func: Function) {
    this.api
      .post(QUEUE.vaccinePassNumber, params)
      .subscribe(result => func(result));
  }

  /**
   * 登记台已叫号队列更新队列信息
   * @param params
   * @param func
   */
  updateQueueItemInfoOnRegister(params: any, func: Function) {
    this.api.post(QUEUE.updateQueueItemInfoOnRegister, params).subscribe(result => func(result));
  }

  /**
   * 登记台已叫号队列更新队列信息
   * @param povCode
   * @param nameSpace
   * @param sharedTopic
   * @param monitorTopic
   * @param messageIdOrGlobalRecordNumber
   * @param func
   */
  deleteQueueItem( povCode: string,
                   nameSpace: string,
                   sharedTopic: string,
                   monitorTopic: string,
                   messageIdOrGlobalRecordNumber: string,
                   func: Function) {
    // 使用http params 的好处是避免 url encode 的问题
    const params = new HttpParams()
      .set('sharedTopic', sharedTopic)
      .set('monitorTopic', monitorTopic)
      .set('nameSpace', nameSpace)
      .set('messageIdOrGlobalRecordNumber', messageIdOrGlobalRecordNumber);
    this.api.del(QUEUE.deleteQueueItem + '/' + povCode, params).subscribe(result => func(result));
  }

  /**
   * 向接种台公共队列推送消息（只推送不添加记录）
   * @param params
   * @param func
   */
  addToVaccinationOnlyFromPayQueue(params: any, func: Function) {
    this.api
      .post(QUEUE.addToVaccinationOnlyFromPayQueue, params)
      .subscribe(result => func(result));
  }
}

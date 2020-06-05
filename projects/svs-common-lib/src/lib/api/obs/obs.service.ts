/**
 * Created by Administrator on 2019/7/10.
 */
import { Injectable } from '@angular/core';
// import { ApiService } from '../api.service';
import { OBSERVE_URLS } from '../url-params.const';
import { ApiService } from '../api.service';

@Injectable()
export class ObserveService {
  constructor(private api: ApiService) { }

  /**
   * 生成留观记录
   * @param params
   * @param func
   */
  addObserveRecord(params: any, func: Function) {
    this.api
      .post(OBSERVE_URLS.addObserveRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改留观记录
   * @param params
   * @param func
   */
  updateObserveRecord(params: any, func: Function) {
    this.api
      .put(OBSERVE_URLS.updateObserveRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除留观记录
   * @param params
   * @param func
   */
  deleteObserveRecord(id, func: Function) {
    this.api
      .del(OBSERVE_URLS.deleteObserveRecord + '/' + id)
      .subscribe(result => func(result));
  }

  /**
   * 查询留观记录
   * @param params
   * @param func
   */
  queryObserveRecord(params: any, func: Function) {
    this.api
      .post(OBSERVE_URLS.queryObserveRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询留观记录
   * @param params
   * @param func
   */
  queryObserveRecordCount(params: any, func: Function) {
    this.api
      .post(OBSERVE_URLS.queryObserveRecordCount, params)
      .subscribe(result => func(result));
  }
}

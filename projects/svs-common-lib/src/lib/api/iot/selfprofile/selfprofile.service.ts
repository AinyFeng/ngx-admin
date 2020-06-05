/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { IOT_URLS } from '../../url-params.const';
import { Observable, zip } from 'rxjs';

@Injectable()
export class SelfProfileService {
  constructor(private api: ApiService) { }

  /**
   * 查询自助建档数据
   * @param params
   * @param func
   */
  querySelfProfile(params: any, func: Function) {
    this.api
      .post(IOT_URLS.querySelfProfile, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询自助建档数据Count
   * @param params
   * @param func
   */
  querySelfProfileCount(params: any, func: Function) {
    this.api
      .post(IOT_URLS.querySelfProfileCount, params)
      .subscribe(result => func(result));
  }

  /**
   *合二为一查询自助建档数据
   */
  querySelfProfileAndCount(params: any, func: Function) {
    zip(
      this.api.post(IOT_URLS.querySelfProfile, params),
      this.api.post(IOT_URLS.querySelfProfileCount, params)
    ).subscribe(([queryData, countData]) => func(queryData, countData));
  }

  /**
   * 添加自助建档数据
   * @param params
   * @param func
   */
  addSelfProfile(params: any, func: Function) {
    this.api
      .get(IOT_URLS.addSelfProfile, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改自助建档数据
   * @param params
   * @param func
   */
  updateSelfProfile(params: any, func: Function) {
    this.api
      .put(IOT_URLS.updateSelfProfile, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改自助建档数据核验码状态
   * @param params
   * @param func
   */
  updateSelfProfileCheckStatus(params: any, func: Function) {
    this.api
      .put(IOT_URLS.updateSelfProfileCheckStatus, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除自助建档信息
   * @param id
   * @param func
   */
  deleteSelfProfile(id: number, func: Function) {
    this.api
      .del(IOT_URLS.deleteSelfProfile + '/' + id)
      .subscribe(result => func(result));
  }

  /**
   * 查询自助建档犬伤记录
   * @param params
   * @param func
   */
  querySelfRabiesRecord(params: any, func: Function) {
    this.api
      .post(IOT_URLS.querySelfRabiesRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改自助建档犬伤记录
   * @param params
   * @param func
   */
  updateSelfRabiesRecord(params: any, func: Function) {
    this.api
      .post(IOT_URLS.updateSelfRabiesRecord, params)
      .subscribe(result => func(result));
  }
}

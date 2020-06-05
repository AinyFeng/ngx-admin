import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { PROFILE_URLS } from '../url-params.const';
import { QueryEntity } from '../entity/profile.entity';
import { Observable, zip } from 'rxjs';

@Injectable()

/**
 * 免疫接种卡操作接口service
 */
export class ImmunizationService {
  constructor(private api: ApiService) { }

  /**
   * 查询接种免疫卡列表
   * @param queryParams
   * @param func
   */
  getImmunizationList(queryParams: QueryEntity, func: Function) {
    this.api
      .post(PROFILE_URLS.queryImmuCardList, queryParams)
      .subscribe(result => func(result));
  }

  /**
   * 根据查询参数统计接种卡数量
   * @param queryParams
   * @param func
   */
  countImmunization(queryParams: QueryEntity, func: Function) {
    this.api
      .post(PROFILE_URLS.countImmuCardList, queryParams)
      .subscribe(result => func(result));
  }

  /**
   * 用于查询符合条件的接种卡数量
   * @param queryParams
   */
  countImmuCard(queryParams: QueryEntity): Observable<any> {
    return this.api.post(PROFILE_URLS.countImmuCardList, queryParams);
  }

  /**
   * 查询和统计二合一接口
   * @param queryParams
   * @param func
   */
  queryAndCountImmuCard(queryParams: QueryEntity, func: Function) {
    zip(
      this.api.post(PROFILE_URLS.queryImmuCardList, queryParams),
      this.api.post(PROFILE_URLS.countImmuCardList, queryParams)
    ).subscribe(([queryData, countData]) => func(queryData, countData));
  }

  /**
   * 存储接种免疫卡信息
   * @param params
   * @param func
   */
  saveImmunizationCard(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.saveImmuCardList, params)
      .subscribe(result => func(result));
  }

  /**
   * 根据免疫接种卡编码删除免疫接种卡信息
   * @param vacCode
   * @param func
   */
  deleteImmunizationCard(vacCode: string, func: Function) {
    this.api
      .del(PROFILE_URLS.deleteImmuCardRecord + '/' + vacCode)
      .subscribe(result => func(result));
  }

  /**
   * 同时更新和插入一条接种卡数据
   * @param params
   * @param func
   */
  saveAndUpdateImmuCardRecord(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.saveAndUpdateImmuCardRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 激活接种卡
   * @param params 待激活的接种卡信息和被取消激活的接种卡信息
   * @param func
   */
  activateImmuCard(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.activateImmuCard, params)
      .subscribe(result => func(result));
  }
}

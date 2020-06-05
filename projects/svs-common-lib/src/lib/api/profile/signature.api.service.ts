import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import {PROFILE_URLS, VACCINATE_URLS} from '../url-params.const';

@Injectable()
export class SignatureApiService {
  constructor(private api: ApiService) {}

  /**
   * 查询单个签字信息
   * @param params
   * @param func
   */
  querySignature(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.querySignature, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询多个签字信息
   * @param params
   * @param func
   */
  querySignatureBatch(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.querySignatureBatch, params)
      .subscribe(result => func(result));
  }

  /**
   * 插入单条签字信息
   * @param params
   * @param func
   */
  insertSignature(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.insertSignature, params)
      .subscribe(result => func(result));
  }

  /**
   * 批量插入签字信息
   * @param params
   * @param func
   */
  insertSignatureBatch(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.insertSignatureBatch, params)
      .subscribe(result => func(result));
  }

  /**
   * 更新单条签字信息
   * @param params
   * @param func
   */
  updateSignature(params: any, func: Function) {
    this.api
      .put(PROFILE_URLS.updateSignature, params)
      .subscribe(result => func(result));
  }

  /**
   * 批量更新签字信息
   * @param params
   * @param func
   */
  updateSignatureBatch(params: any, func: Function) {
    this.api
      .put(PROFILE_URLS.updateSignatureBatch, params)
      .subscribe(result => func(result));
  }

  /**
   * 根据登记流水号来查询接种记录签字信息
   * @param registerRecordNumber 登记流水号
   * @param func
   */
  queryVacRecordSignatureInfo(registerRecordNumber: string, func: Function) {
    this.api.get(VACCINATE_URLS.queryVacRecordSignatureInfo + '/' + registerRecordNumber).subscribe(result => func(result));
  }
}

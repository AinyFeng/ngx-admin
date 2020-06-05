/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';

@Injectable()
export class NationBaseInfoService {
  constructor(private api: ApiService) {}

  /**
   * 查询民族表数据
   * @param params
   * @param func
   */
  queryNationBaseInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryNationBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询民族表数据Count
   * @param params
   * @param func
   */
  queryNationBaseInfoCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryNationBaseInfoCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询民族表数据
   * @param params
   * @param func
   */
  queryNationBaseInfoByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryNationBaseInfoByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加民族表数据
   * @param params
   * @param func
   */
  addNationBaseInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addNationBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改民族表数据
   * @param params
   * @param func
   */
  updateNationBaseInfo(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateNationBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除民族表数据
   * @param params
   * @param func
   */
  deleteNationBaseInfo(params: any, func: Function) {
    this.api
      .del(MASTER_URLS.deleteNationBaseInfo, params)
      .subscribe(result => func(result));
  }
}

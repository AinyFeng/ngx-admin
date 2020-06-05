/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';

@Injectable()
export class ManufacturerBaseInfoService {
  constructor(private api: ApiService) { }

  /**
   * 查询厂商基础表数据
   * @param params
   * @param func
   */
  queryManufacturerBaseInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryManufacturerBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询厂商基础表数据Count
   * @param params
   * @param func
   */
  queryManufacturerBaseInfoCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryManufacturerBaseInfoCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询厂商基础表数据
   * @param params
   * @param func
   */
  queryManufacturerBaseInfoByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryManufacturerBaseByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加厂商基础表数据
   * @param params
   * @param func
   */
  addManufacturerBaseInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addManufacturerBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改厂商基础表数据
   * @param params
   * @param func
   */
  updateManufacturerBaseInfo(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateManufacturerBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除厂商基础表数据
   * @param params
   * @param func
   */
  deleteManufacturerBaseInfo(params: any, func: Function) {
    this.api
      .del(MASTER_URLS.deleteManufacturerBaseInfo, params)
      .subscribe(result => func(result));
  }
}

/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';

@Injectable()

/**
 * 查询疫苗批号的信息
 */
export class ColdStorageFacilityService {
  constructor(private api: ApiService) { }

  /**
   * 查询设备表数据
   * @param params
   * @param func
   */
  queryColdStorageFacilityInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryColdStorageFacilityInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询设备表数据Count
   * @param params
   * @param func
   */
  queryColdStorageFacilityInfoCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryColdStorageFacilityInfoCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询设备表数据
   * @param params
   * @param func
   */
  queryColdStorageFacilityInfoByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryColdStorageFacilityByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加设备表数据
   * @param params
   * @param func
   */
  addColdStorageFacilityInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addColdStorageFacilityInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改设备表数据
   * @param params
   * @param func
   */
  updateColdStorageFacilityInfo(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateColdStorageFacilityInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除设备表数据
   * @param params
   * @param func
   */
  deleteColdStorageFacilityInfo(params: any, func: Function) {
    this.api
      .del(MASTER_URLS.deleteColdStorageFacilityInfo, params)
      .subscribe(result => func(result));
  }
}

/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';

@Injectable()
export class VaccineSubclassService {
  constructor(private api: ApiService) {}

  /**
   * 查询小类表数据
   * @param params
   * @param func
   */
  queryVaccineSubclass(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryVaccineSubclass, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询小类表数据Count
   * @param params
   * @param func
   */
  queryVaccineSubclassCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryVaccineSubclassCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询小类表数据
   * @param params
   * @param func
   */
  queryVaccineSubclassByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryBatchByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加小类表数据
   * @param params
   * @param func
   */
  addVaccineSubclass(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addVaccineSubclass, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改小类表数据
   * @param params
   * @param func
   */
  updateVaccineSubclass(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateVaccineSubclass, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除小类表数据
   * @param params
   * @param func
   */
  deleteVaccineSubclass(params: any, func: Function) {
    this.api
      .del(MASTER_URLS.deleteVaccineSubclass, params)
      .subscribe(result => func(result));
  }
}

/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';

@Injectable()
export class VaccineBroadHeadingService {
  constructor(private api: ApiService) {}

  /**
   * 查询大类表数据
   * @param params
   * @param func
   */
  queryVaccineBroadHeading(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryVaccineBroadHeading, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询大类表数据Count
   * @param params
   * @param func
   */
  queryVaccineBroadHeadingCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryVaccineBroadHeadingCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询大类表数据
   * @param params
   * @param func
   */
  queryVaccineBroadHeadingByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryVaccineBroadHeadingByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加大类表数据
   * @param params
   * @param func
   */
  addVaccineBroadHeading(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addVaccineBroadHeading, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改大类表数据
   * @param params
   * @param func
   */
  updateVaccineBroadHeading(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateVaccineBroadHeading, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除大类表数据
   * @param params
   * @param func
   */
  deleteVaccineBroadHeading(params: any, func: Function) {
    this.api
      .del(MASTER_URLS.deleteVaccineBroadHeading, params)
      .subscribe(result => func(result));
  }
}

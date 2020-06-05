/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';
import { Observable, zip } from 'rxjs';

@Injectable()
export class HospitalBaseInfoService {
  constructor(private api: ApiService) {
  }

  /**
   * 查询医院基础表数据
   * @param params
   * @param func
   */
  queryHospitalBaseInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryHospitalBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询医院名称
   * @param params
   */
  queryHospitalNameForPipe(params: any): Observable<any> {
    return this.api.post(MASTER_URLS.queryHospitalBaseInfo, params);
  }

  /**
   * 查询医院基础表数据Count
   * @param params
   * @param func
   */
  queryHospitalBaseInfoCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryHospitalBaseInfoCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询医院和统计数量二合一接口
   * @param params
   * @param func
   */
  queryHospitalAndCount(params: any, func: Function) {
    zip(
      this.api.post(MASTER_URLS.queryHospitalBaseInfo, params),
      this.api.post(MASTER_URLS.queryHospitalBaseInfoCount, params)
    ).subscribe(result => func(result));
  }

  /**
   * 查询医院基础表数据
   * @param params
   * @param func
   */
  queryHospitalBaseInfoByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryHospitalBaseByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加医院基础表数据
   * @param params
   * @param func
   */
  addHospitalBaseInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addHospitalBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改医院基础表数据
   * @param params
   * @param func
   */
  updateHospitalBaseInfo(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateHospitalBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除医院基础表数据
   * @param params
   * @param func
   */
  deleteHospitalBaseInfo(id: number, func: Function) {
    this.api
      .del(MASTER_URLS.deleteHospitalBaseInfo + '/' + id)
      .subscribe(result => func(result));
  }
}

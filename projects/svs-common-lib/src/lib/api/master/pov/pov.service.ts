/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';
import { Observable, zip } from 'rxjs';

@Injectable()
/**
 * 基础数据 - pov 接种门诊信息调用接口
 */
export class PovInfoService {
  constructor(private api: ApiService) { }

  /**
   * 查询pov表数据
   * @param params
   * @param func
   */
  queryPovInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryPovInfo, params)
      .subscribe(result => func(result));
  }

  queryPovInfoForPipe(params: any): Observable<any> {
    return this.api.post(MASTER_URLS.queryPovInfo, params);
  }

  /**
   * 查询pov表数据Count
   * @param params
   * @param func
   */
  queryPovInfoCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryPovInfoCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询和统计二合一接口
   * @param params
   * @param func
   */
  queryPovAndCount(params: any, func: Function) {
    zip(
      this.api.post(MASTER_URLS.queryPovInfo, params),
      this.api.post(MASTER_URLS.queryPovInfoCount, params)
    ).subscribe(resp => func(resp));
  }

  /**
   * 查询pov表数据
   * @param params
   * @param func
   */
  queryPovInfoByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryPovByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加pov表数据
   * @param params
   * @param func
   */
  addPovInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addPovInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改pov表数据
   * @param params
   * @param func
   */
  updatePovInfo(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updatePovInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除pov表数据
   * @param params
   * @param func
   */
  deletePovInfo(id: any, func: Function) {
    this.api.del(MASTER_URLS.deletePovInfo + '/' + id).subscribe(result => func(result));
  }
}

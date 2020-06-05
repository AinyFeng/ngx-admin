/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';
import { Observable } from 'rxjs';

@Injectable()
export class AdministrativeDivisionService {
  constructor(private api: ApiService) { }

  /**
   * 查询行政区划表数据
   * @param params
   * @param func
   */
  queryAdministrativeDivision(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryAdministrativeDivision, params)
      .subscribe(result => func(result));
  }

  queryAdministrativeDivisionForPipe(params: any): Observable<any> {
    return this.api.post(MASTER_URLS.queryAdministrativeDivision, params);
  }

  /**
   * 查询行政区划表数据Count
   * @param params
   * @param func
   */
  queryAdministrativeDivisionCount(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryAdministrativeDivisionCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询行政区划树形结构数据
   * @param func
   */
  queryAdministrativeDivisionTreeData(func: Function) {
    this.api
      .get(MASTER_URLS.queryAdministrativeDivisionTreeData)
      .subscribe(result => func(result));
  }

  /**
   * 查询行政区划树形线结构数据
   * @param func
   */
  queryAdministrativeDivisionTreeLineData(func: Function) {
    this.api
      .get(MASTER_URLS.queryAdministrativeDivisionTreeLineData)
      .subscribe(result => func(result));
  }

  /**
   * 查询行政区划表数据
   * @param params
   * @param func
   */
  queryAdministrativeDivisionByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryAdministrativeDivisionByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加行政区划表数据
   * @param params
   * @param func
   */
  addAdministrativeDivision(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addAdministrativeDivision, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改行政区划表数据
   * @param params
   * @param func
   */
  updateAdministrativeDivision(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateAdministrativeDivision, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除行政区划表数据
   * @param params
   * @param func
   */
  deleteAdministrativeDivision(params: any, func: Function) {
    this.api
      .del(MASTER_URLS.deleteAdministrativeDivision, params)
      .subscribe(result => func(result));
  }
}

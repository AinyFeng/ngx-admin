/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';
import { Observable, zip } from 'rxjs';

@Injectable()
export class DepartmentInfoService {
  constructor(private api: ApiService) { }

  /**
   * 查询部门表数据
   * @param params
   * @param func
   */
  queryDepartmentInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryDepartmentInfo, params)
      .subscribe(result => func(result));
  }

  // 查询部门的pipe
  queryDepartmentInfoForPipe(params: any): Observable<any> {
    return this.api.post(MASTER_URLS.queryDepartmentInfo, params);
  }

  /**
   * 查询部门表数据Count
   * @param params
   * @param func
   */
  queryDepartmentInfoCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryDepartmentInfoCount, params)
      .subscribe(result => func(result));
  }

  /*
   * 二合一接口
   * */
  queryDepartmentInfoAndCount(params: any, func: Function) {
    zip(
      this.api.post(MASTER_URLS.queryDepartmentInfo, params),
      this.api.post(MASTER_URLS.queryDepartmentInfoCount, params)
    ).subscribe(result => func(result));
  }

  /**
   * 查询部门表数据
   * @param params
   * @param func
   */
  queryDepartmentInfoByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryDepartmentByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加部门表数据
   * @param params
   * @param func
   */
  addDepartmentInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addDepartmentInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改部门表数据
   * @param params
   * @param func
   */
  updateDepartmentInfo(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateDepartmentInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除部门表数据
   * @param id
   * @param func
   */
  deleteDepartmentInfo(id: number, func: Function) {
    this.api
      .del(MASTER_URLS.deleteDepartmentInfo + '/' + id)
      .subscribe(result => func(result));
  }
}

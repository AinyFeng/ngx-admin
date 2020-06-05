/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';
import { Observable, zip } from 'rxjs';

@Injectable()
export class PovStaffApiService {
  constructor(private api: ApiService) {
  }

  /**
   * 查询职员信息表数据
   * @param params
   * @param func
   */
  queryPovStaff(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryPovStaff, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询职员信息表数据Count
   * @param params
   * @param func
   */
  queryPovStaffCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryPovStaffCount, params)
      .subscribe(result => func(result));
  }

  // 二合一
  queryPovStaffAndCount(params: any, func: Function) {
    zip(
      this.api.post(MASTER_URLS.queryPovStaff, params),
      this.api.post(MASTER_URLS.queryPovStaffCount, params)
    ).subscribe(resp => func(resp));
  }

  /**
   * 查询职员信息表数据
   * @param params
   * @param func
   */
  queryPovStaffByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryBatchByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加职员信息表数据
   * @param params
   * @param func
   */
  addPovStaff(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addPovStaff, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改职员信息表数据
   * @param params
   * @param func
   */
  updatePovStaff(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updatePovStaff, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除职员信息表数据
   * @param id
   * @param func
   */
  deletePovStaff(id: number, func: Function) {
    this.api
      .del(MASTER_URLS.deletePovStaff + '/' + id)
      .subscribe(result => func(result));
  }

  /**
   * 查询职员信息 - pipe
   * @param params
   */
  queryPovStaffForPipe(params: any): Observable<any> {
    return this.api.post(MASTER_URLS.queryPovStaff, params);
  }
}

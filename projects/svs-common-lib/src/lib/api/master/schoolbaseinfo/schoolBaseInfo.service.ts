/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';
import { Observable, zip } from 'rxjs';

@Injectable()
export class SchoolBaseInfoService {
  constructor(private api: ApiService) {}

  /**
   * 查询学校基础表数据
   * @param params
   * @param func
   */
  querySchoolBaseInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.querySchoolBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询学校基础表数据Count
   * @param params
   * @param func
   */
  querySchoolBaseInfoCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.querySchoolBaseInfoCount, params)
      .subscribe(result => func(result));
  }

  querySchoolBaseInfoAndCount(params: any, func: Function) {
    zip(
      this.api.post(MASTER_URLS.querySchoolBaseInfo, params),
      this.api.post(MASTER_URLS.querySchoolBaseInfoCount, params)
    ).subscribe(resp => func(resp));
  }

  /**
   * 查询学校基础表数据
   * @param params
   * @param func
   */
  querySchoolBaseInfoByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.querySchoolBaseInfoByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加学校基础表数据
   * @param params
   * @param func
   */
  addSchoolBaseInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addSchoolBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改学校基础表数据
   * @param params
   * @param func
   */
  updateSchoolBaseInfo(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateSchoolBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除学校基础表数据
   * @param id
   * @param func
   */
  deleteSchoolBaseInfo(id: any, func: Function) {
    this.api
      .del(MASTER_URLS.deleteSchoolBaseInfo + '/' + id)
      .subscribe(result => func(result));
  }
}

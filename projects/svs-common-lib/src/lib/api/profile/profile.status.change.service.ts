import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { QueryEntity } from '../entity/profile.entity';
import { PROFILE_URLS } from '../url-params.const';
import { Observable, zip } from 'rxjs';

@Injectable()

/**
 * 在册状态变更调用接口
 */
export class ProfileStatusChangeService {
  constructor(private api: ApiService) { }

  /**
   * 查询在册状态变更记录
   * @param params
   * {
   *     condition: [
   *         { key:"birthDate", value: "", ... }, 出生日期
   *         { key: "changeDate", value: "", ... }, 变更日期
   *         { key: "changeReason", value:"", ...}, 变更原因
   *         { key: "changeDep", value:"", ..}, 变更部门
   *         { key: "preProfileStatus", value: "", ...} 变更前状态
   *         { key: "curProfileStatus", value:"", ...} 当前状态
   *         { key: "memo", value:"", ...} 变更备注
   *     ],
   *     page: 1, 默认第1页
   *     pageSize: 10 默认查10条数据
   * }
   * @param func
   */
  queryRecord(params: QueryEntity, func: Function) {
    this.api
      .post(PROFILE_URLS.queryProfileStatusChange, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询在册状态变更记录的数量
   * @param 参数同 queryRecord 接口一致
   */
  countRecord(params: QueryEntity, func: Function) {
    this.api
      .post(PROFILE_URLS.countProfileStatusChange, params)
      .subscribe(result => func(result));
  }

  /**
   * 二合一接口，查询和统计数量合并
   * @param params 参数查询
   * @param func
   */
  queryRecordAndCountRecord(params: any, func: Function) {
    zip(
      this.api.post(PROFILE_URLS.queryProfileStatusChange, params),
      this.api.post(PROFILE_URLS.countProfileStatusChange, params)
    ).subscribe(([a, b]) => func([a, b]));
  }

  /**
   * 插入单条在册变更记录
   * @param params
   * @param func
   */
  insertRecord(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.insertProfileStatusChange, params)
      .subscribe(result => func(result));
  }
}

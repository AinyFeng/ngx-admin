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
export class BatchInfoService {
  constructor(private api: ApiService) { }

  /**
   * 查询批次表数据
   * @param params
   * @param func
   */
  queryBatchInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryBatchInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询批次表数据
   * @param params
   * @param func
   */
  queryBatchInfo2(params: any) {
    return this.api
      .post(MASTER_URLS.queryBatchInfo, params);
  }

  /**
   * 查询批次表数据Count
   * @param params
   * @param func
   */
  queryBatchInfoCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryBatchInfoCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询批次表数据
   * @param params
   * @param func
   */
  queryBatchInfoByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryBatchByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加批次表数据
   * @param params
   * @param func
   */
  addBatchInfo(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addBatchInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改批次表数据
   * @param params
   * @param func
   */
  updateBatchInfo(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateBatchInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除批次表数据
   * @param params
   * @param func
   */
  deleteBatchInfo(params: any, func: Function) {
    this.api
      .del(MASTER_URLS.deleteBatchInfo, params)
      .subscribe(result => func(result));
  }
}

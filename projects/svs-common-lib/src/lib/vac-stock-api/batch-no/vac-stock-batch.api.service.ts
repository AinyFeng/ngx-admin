import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { PlatFormUrl } from '../api.url.params';
import { forkJoin } from 'rxjs';

@Injectable()
/**
 * 疫苗出入库 - 批号查询
 */
export class VacStockBatchApi {

  constructor(private api: ApiService) {
  }

  /**
   * 查询批号信息
   * @param params
   * @param func
   */
  queryBatch(params: any, func: Function) {
    this.api.post(PlatFormUrl.queryBatch, params).subscribe(res => func(res));
  }

  /**
   * 统计批号信息
   * @param params
   * @param func
   */
  queryBatchCount(params: any, func: Function) {
    this.api.post(PlatFormUrl.queryBatchCount, params).subscribe(res => func(res));
  }

  /**
   * 查询疫苗批号和统计批号信息
   * @param params
   * @param func
   */
  queryBatchAndCount(params: any, func: Function) {
    forkJoin([this.api.post(PlatFormUrl.queryBatch, params), this.api.post(PlatFormUrl.queryBatchCount, params)])
      .subscribe(([queryData, countData]) => func([queryData, countData]));
  }

  /**
   * 扫码入库
   * @param params
   * @param func
   */
  queryBatchAndCountFromAli(params: any, func: Function) {
    this.api.post(PlatFormUrl.queryStockBatchFromAli, params).subscribe(res => func(res));
  }
}

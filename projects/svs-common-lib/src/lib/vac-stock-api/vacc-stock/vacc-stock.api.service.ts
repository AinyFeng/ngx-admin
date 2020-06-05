import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { PlatFormUrl, VacStockCheckUrl } from '../api.url.params';
import { forkJoin } from 'rxjs';

@Injectable()
/**
 * 疫苗出入库 - 库存量查询
 */
export class VaccStockApiService {

  constructor(private api: ApiService) {
  }

  /**
   * 查询库存量
   * @param params
   * @param func
   */
  queryStock(params: any, func: Function) {
    this.api.post(PlatFormUrl.queryStock, params).subscribe(res => func(res));
  }

  /**
   * 统计库存余量信息
   * @param params
   * @param func
   */
  queryStockCount(params: any, func: Function) {
    this.api.post(PlatFormUrl.queryStockCount, params).subscribe(res => func(res));
  }

  /**
   * 查询库存量和库存余量信息
   * @param params
   * @param func
   */
  queryStockAndCount(params: any, func: Function) {
    forkJoin([this.api.post(PlatFormUrl.queryStock, params), this.api.post(PlatFormUrl.queryStockCount, params)])
      .subscribe(([queryData, countData]) => func([queryData, countData]));
  }

  /**
   * 库存盘点查询库存和统计库存
   */
  queryCheckStockAndCount(params: any, func: Function) {
    forkJoin([this.api.post(VacStockCheckUrl.stockCheck, params),
      this.api.post(VacStockCheckUrl.stockCheckCount, params)])
      .subscribe(([queryData, countData]) => {
        func([queryData, countData]);
      });
  }

  /**
   * 疫苗出入库 - 疫苗盘点 - 修改疫苗库存数量
   * @param params
   * @param func
   */
  modifyStockAmount(params: any, func: Function) {
    this.api.post(VacStockCheckUrl.stockCheckModify, params).subscribe(res => func(res));
  }

  /**
   * 疫苗出入库 - 疫苗盘点 - 修改二类苗价格
   * @param params
   * @param func
   */
  stockUpdatePrice(params: any, func: Function) {
    this.api.post(VacStockCheckUrl.updateStockPrice, params).subscribe(res => func(res));
  }

  /**
   * 查询盘点计划和数据量
   * @param params
   * @param func
   */
  queryInventoryPlanAndCount(params: any, func: Function) {
    forkJoin([this.api.post(VacStockCheckUrl.queryInventoryPlan, params), this.api.post(VacStockCheckUrl.queryInventoryPlanCount, params)])
      .subscribe(([queryData, countData]) => func([queryData, countData]));
  }

  /**
   * 查询盘点计划详情和数据量
   * @param params
   * @param func
   */
  queryPlanDetailAndCount(params: any, func: Function) {
    forkJoin([this.api.post(VacStockCheckUrl.queryPlanDetail, params), this.api.post(VacStockCheckUrl.queryPlanDetailCount, params)])
      .subscribe(([queryData, countData]) => func([queryData, countData]));
  }

  /**
   * 删除盘点计划
   * @param params
   * @param func
   */
  deleteStockPlan(params: any, func: Function) {
    this.api.post(VacStockCheckUrl.deleteStockPlan, params).subscribe(res => func(res));
  }
}

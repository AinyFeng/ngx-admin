import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { VacStockCheckUrl } from '../api.url.params';
import { forkJoin } from 'rxjs';

@Injectable()
/**
 * 疫苗出入库 - 盘点计划相关接口
 */
export class VacStockCheckPlanApiService {

  constructor(private api: ApiService) {
  }

  /**
   * 新增盘点计划
   * @param params
   * @param func
   */
  addStockCheckPlan(params: any, func: Function) {
    this.api.post(VacStockCheckUrl.addStockCheckPlan, params).subscribe(res => func(res));
  }

  /**
   * 查询和统计盘点记录
   * @param params
   * @param func
   */
  queryCheckPlanRecordAndCount(params: any, func: Function) {
    forkJoin([this.api.post(VacStockCheckUrl.queryCheckPlanRecord, params),
      this.api.post(VacStockCheckUrl.countCheckPlanRecord, params)])
      .subscribe(([queryData, countData]) => {
        func([queryData, countData]);
      });
  }

  /**
   * 进销存报表查询和统计
   * @param params
   * @param func
   */
  queryInAndOutReportAndCount(params: any, func: Function) {
    forkJoin([this.api.post(VacStockCheckUrl.queryInAndOutReport, params),
      this.api.post(VacStockCheckUrl.countInAndOutReport, params)])
      .subscribe(res => func(res));
  }

  /**
   * 进销存报表明细查询和统计
   * @param params
   * @param func
   */
  queryInAndOutReportDetailAndCount(params: any, func: Function) {
    forkJoin([this.api.post(VacStockCheckUrl.queryInAndOutReportDetail, params),
      this.api.post(VacStockCheckUrl.countInAndOutReportDetail, params)])
      .subscribe(res => func(res));
  }
}

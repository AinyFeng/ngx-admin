import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { VACCINATE_STRATEGY_URLS } from '../url-params.const';
import { zip } from 'rxjs';

@Injectable()

/**
 * 接种策略访问接口
 * 1. 根据档案查询可接种疫苗
 */
export class VaccinateStrategyApiService {
  constructor(private api: ApiService) {
  }

  /**
   * 根据档案编码和pov编码查询该受种人的可推荐疫苗列表
   * @param povCode
   * @param profileCode
   * @param params 成人疫苗编码
   * @param func
   */
  getRecommendedVaccine(povCode: string, profileCode: string, params: any, func: Function) {
    this.api
      .post(VACCINATE_STRATEGY_URLS.queryRecommendedVaccine + '/' + povCode + '/' + profileCode, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询疫苗策略不接种说明列表
   * @param profileCode
   * @param func
   */
  queryPersonalizeConf(profileCode: string, func: Function) {
    this.api.post(VACCINATE_STRATEGY_URLS.queryPersonalizeConf + '/' + profileCode, {}).subscribe(result => func(result));
  }

  /**
   * 插入单条疫苗不接种说明
   * @param params
   * @param func
   */
  insertPersonalizeConf(params: any, func: Function) {
    this.api.post(VACCINATE_STRATEGY_URLS.insertPersonalizeConf, params).subscribe(result => func(result));
  }

  /**
   * 查询可预约的接种策略疫苗列表
   * @param params
   * @param func
   */
  queryRecommendInAppointment(params: any, func: Function) {
    this.api.post(VACCINATE_STRATEGY_URLS.queryRecommendInAppointment, params).subscribe(result => func(result));
  }

  /**
   * 查询门诊批号
   * @author ainy
   * @params:
   * @date 2019/11/4
   */
  queryPovBatchInfo(povCode: string, func: Function) {
    this.api.post(VACCINATE_STRATEGY_URLS.queryPovBatch + '/' + povCode, {}).subscribe(result => func(result));
  }

  /**
   * 查询门诊批号和count 二合一接口
   * @author ainy
   * @params:
   * @date 2019/11/5 0005
   */
  queryPovBatchInfoAndCount(params: any, func: Function) {
    zip(
      this.api.post(VACCINATE_STRATEGY_URLS.queryPovBatch, params),
      this.api.post(VACCINATE_STRATEGY_URLS.queryPovBatchCount, params)
    ).subscribe(result => func(result));
  }


  /**
   * @author ainy
   * @params:
   * @date 2019/11/4 0004
   */
  updatePovBatchInfo(params: any, func: Function) {
    this.api.put(VACCINATE_STRATEGY_URLS.updatePovBatch, params).subscribe(result => func(result));
  }

  /**
   * 刷新单个受种人的接种策略模型
   * @param profileCode
   * @param func
   */
  flushVaccineModel(profileCode: string, func: Function) {
    this.api.get(VACCINATE_STRATEGY_URLS.flushVaccineModel + '/' + profileCode).subscribe(result => func(result));
  }

  /**
   * 查询打印注射单信息
   * @param profileCode 档案编码
   * @param programCode
   * @param checkInDate 日期(字符串, 格式"2020-01-15")
   * @param func
   */
  queryInjectPrintInfo(profileCode: string, programCode: string, checkInDate: string, func: Function) {
    this.api.get(VACCINATE_STRATEGY_URLS.queryInjectInfo + '/' + profileCode + '/' + programCode + '/' + checkInDate).subscribe(result => func(result));
  }
}

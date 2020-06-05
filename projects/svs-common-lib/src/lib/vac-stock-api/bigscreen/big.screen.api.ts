import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { BIG_SCREEN_URLS } from '../api.url.params';
import { forkJoin } from 'rxjs';

@Injectable()
/**
 * 大屏展现查询接口
 */
export class BigScreenApi {

  constructor(private api: ApiService) {
  }

  /**
   * 查询档案重卡率
   * @param params
   * @param func
   */
  queryDupProfile(params: any, func: Function) {
    this.api.post(BIG_SCREEN_URLS.queryDupProfile, params).subscribe(res => func(res));
  }

  /**
   * 查询档案信息完整率
   * @param params
   * @param func
   */
  queryProfileComplete(params: any, func: Function) {
    this.api.post(BIG_SCREEN_URLS.queryProfileComplete, params).subscribe(res => func(res));
  }

  /**
   * 查询门诊实时业务量
   * @param params
   * @param func
   */
  queryVaccBusinessVolume(params: any, func: Function) {
    this.api.post(BIG_SCREEN_URLS.queryVaccBusinessVolume, params).subscribe(res => func(res));
  }

  /**
   * 统计接种率
   * @param params
   * @param func
   */
  queryVaccinatedRate(params: any, func: Function) {
    this.api.post(BIG_SCREEN_URLS.queryVaccinatedRate, params).subscribe(res => func(res));
  }

  /**
   * 查询疫苗库存
   * @param params
   * @param func
   */
  queryVaccInventory(params: any, func: Function) {
    this.api.post(BIG_SCREEN_URLS.queryVaccInventory, params).subscribe(res => func(res));
  }

  /**
   * 查询门诊七天|一个月前十 业务量
   * @param params
   * @param func
   */
  queryportfolio(params: any, func: Function) {
    this.api.post(BIG_SCREEN_URLS.queryportfolio, params).subscribe(res => func(res));
  }

  /**
   * 按照市编码统计Pov的数量
   * @param params
   * @param func
   */
  povCount(params: any, func: Function) {
    this.api.post(BIG_SCREEN_URLS.povCount, params).subscribe(res => func(res));
  }

  /**
   * 追溯接种全流程
   * @param params globalNumber 接种记录的全局流水号
   * @param func
   */
  queryVaccinateReview(params: any, func: Function) {
    this.api.post(BIG_SCREEN_URLS.queryVaccinateReview, params).subscribe(result => func(result));
  }

  /**
   * 追溯疫苗从厂家到接种的全流程(疫苗全流程)
   * @param params globalNumber 接种记录的全局流水号
   * @param func
   */
  queryVaccineReview(params: any, func: Function) {
    this.api.post(BIG_SCREEN_URLS.queryVaccineReview, params).subscribe(result => func(result));
  }

  /**
   * 根据参数查询每个大类编码的库存量
   * @param params
   * @param func
   */
  queryBroadHeadingInventory(params: any, func: Function) {
    this.api.post(BIG_SCREEN_URLS.queryBroadHeadingInventory, params).subscribe(res => func(res));
  }

  /**
   * 根据地区参数查询当前区域的分地区库存，分疫苗库存，分一类二类的库存
   * @param params
   * @param func
   */
  queryVaccInventoryAll(params: string, func: Function) {
    forkJoin([this.api.post(BIG_SCREEN_URLS.queryBroadHeadingInventory, params),
      this.api.post(BIG_SCREEN_URLS.queryVaccInventory, params),
    this.api.post(BIG_SCREEN_URLS.queryVaccineStockByType, params)])
      .subscribe(([broadHeadingInventory, vaccInventory, typeStock]) => {
        func([broadHeadingInventory, vaccInventory, typeStock]);
      });
  }
}

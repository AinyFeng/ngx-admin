import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { STOCK_URLS, SYSTEM_URLS } from '../url-params.const';
import { forkJoin } from 'rxjs';

@Injectable()
export class StockCommonService {
  constructor(private api: ApiService) {}

  /**
   * 根据大类获取产品
   * @param workingDayJson
   * @param param2
   */
  getVaccProduct(param, func: Function) {
    this.api
      .post(STOCK_URLS.getVaccProduct, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 根据产品获取批号
   * @param workingDayJson
   * @param param2
   */
  getProdBatchOptions(param, func: Function) {
    this.api
      .post(STOCK_URLS.getProdBatchOptions, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 获取冰箱设备
   * @param workingDayJson
   * @param param2
   */
  getFacilityOptions(param, func: Function) {
    this.api
      .post(STOCK_URLS.getFacilityOptions, param)
      .subscribe(resp => {
        func(resp);
      });
  }
}

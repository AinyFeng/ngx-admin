import { Injectable } from '@angular/core';

import { forkJoin } from 'rxjs';
import {ApiService} from '../api/api.service';
import {HISTORY_DATA_URLS} from './coldchain-url-params.const';

@Injectable()
export class HistoryDataService {
  constructor(private api: ApiService) {}

  /**
   * 查询历史数据 --- 历史数据查询
   */
  queryHistoryData(params: any, func: Function) {
    const url = HISTORY_DATA_URLS.queryHistoryData;
    const countUrl = HISTORY_DATA_URLS.queryHistoryDataCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('queryHistoryData complete')
    });
  }

  /**
   * 历史数据 --- 温度统计图
   */
  queryTempChart(params: any, func: Function) {
    this.api
      .post(HISTORY_DATA_URLS.queryTempChart, params)
      .subscribe(resp => {
        func(resp);
      });
  }

  /**
   * 历史数据 ---湿度统计图
   */
  queryHumiChart(params: any, func: Function) {
    this.api
      .post(HISTORY_DATA_URLS.queryHumiChart, params)
      .subscribe(resp => {
        func(resp);
      });
  }

  /**
   * 历史数据查询页面中 传感器的下拉选
   */
  querySeneorOptions(params: any, func: Function) {
    this.api
      .post(HISTORY_DATA_URLS.querySeneorOptions, params)
      .subscribe(resp => {
        func(resp);
      });
  }
}

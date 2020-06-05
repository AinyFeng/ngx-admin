import { Injectable } from '@angular/core';

import { forkJoin } from 'rxjs';
import {ApiService} from '../api/api.service';
import {DEVICE_URLS, MONOIOR_DEVICE_URLS, REALTIME_DATA_URLS} from './coldchain-url-params.const';

@Injectable()
export class RealtimeDataService {
  constructor(private api: ApiService) {}

  /**
   * 查询仪表温度数据
   */
  queryRealDataChart(params: any, func: Function) {
    this.api
      .post(REALTIME_DATA_URLS.queryRealDataChart, params)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 查询温湿度数据表格(目前没有接口)
   */
  queryRealData(params: any, func: Function) {
    const url = REALTIME_DATA_URLS.queryRealData;
    const countUrl = REALTIME_DATA_URLS.queryRealDataCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('queryRealData complete')
    });
  }


}

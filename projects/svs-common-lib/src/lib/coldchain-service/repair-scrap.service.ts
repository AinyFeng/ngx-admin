import { Injectable } from '@angular/core';

import { forkJoin } from 'rxjs';
import {ApiService} from '../api/api.service';
import {REPAIR_SCRAP_URLS, SENSOR_DEVICE_URLS} from './coldchain-url-params.const';

/**
 * 维修 报废 管理页面访问接口
 */
@Injectable()
export class RepairScrapService {
  constructor(private api: ApiService) {}

  /**
   * 维修管理查询
   */
  queryRepairData(params: any, func: Function) {
    const url = REPAIR_SCRAP_URLS.queryRepairData;
    const countUrl = REPAIR_SCRAP_URLS.queryRepairDataCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('queryRepairData complete')
    });
  }

  /**
   * 新增维修设备
   * @param param2
   */
  insertRepairData(param, func: Function) {
    this.api
      .post(REPAIR_SCRAP_URLS.insertRepairData, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 编辑维修设备
   * @param param2
   */
  updateRepairData(param, func: Function) {
    this.api
      .put(REPAIR_SCRAP_URLS.updateRepairData, param)
      .subscribe(resp => {
        func(resp);
      });
  }

  /**
   * 报废管理查询
   */
  queryScrapData(params: any, func: Function) {
    const url = REPAIR_SCRAP_URLS.queryScrapData;
    const countUrl = REPAIR_SCRAP_URLS.queryScrapDataCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('queryScrapData complete')
    });
  }

  /**
   * 新增维修设备
   * @param param2
   */
  insertScrapData(param, func: Function) {
    this.api
      .post(REPAIR_SCRAP_URLS.insertScrapData, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 编辑维修设备
   * @param param2
   */
  updateScrapData(param, func: Function) {
    this.api
      .put(REPAIR_SCRAP_URLS.updateScrapData, param)
      .subscribe(resp => {
        func(resp);
      });
  }

}

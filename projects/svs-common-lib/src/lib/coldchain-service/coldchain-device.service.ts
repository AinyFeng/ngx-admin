import { Injectable } from '@angular/core';

import { forkJoin } from 'rxjs';
import {ApiService} from '../api/api.service';
import {DEVICE_URLS} from './coldchain-url-params.const';

@Injectable()
export class ColdchainDeviceService {
  constructor(private api: ApiService) {}

  /**
   * 查询冷链设备
   */
  queryDeviceInfo(params: any, func: Function) {
    const url = DEVICE_URLS.queryPlatformDeviceInfo;
    const countUrl = DEVICE_URLS.queryPlatformDeviceInfoCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('queryPlatformDeviceInfo complete')
    });
  }
  /**
   * 新增冷链设备
   * @param workingDayJson
   * @param param2
   */
  insertColdChainDevice(param, func: Function) {
    this.api
      .post(DEVICE_URLS.insertPlatformDeviceInfo, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 编辑冷链设备
   * @param workingDayJson
   * @param param2
   */
  updateColdChainDevice(param, func: Function) {
    this.api
      .put(DEVICE_URLS.updatePlatformDeviceInfo, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 删除冷链设备
   * @param workingDayJson
   * @param param2
   */
  deleteColdChainDevice(param, func: Function) {
    this.api
      .put(DEVICE_URLS.deletePlatformDeviceInfo, param)
      .subscribe(resp => {
        func(resp);
      });
  }
}

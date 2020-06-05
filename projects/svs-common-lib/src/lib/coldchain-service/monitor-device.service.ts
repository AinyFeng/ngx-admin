import { Injectable } from '@angular/core';

import { forkJoin } from 'rxjs';
import {ApiService} from '../api/api.service';
import {MONOIOR_DEVICE_URLS} from './coldchain-url-params.const';

@Injectable()
export class MonitorDeviceService {
  constructor(private api: ApiService) {}

  /**
   * 查询监控设备信息
   */
  queryMonitoDeviceInfo(params: any, func: Function) {
    const url = MONOIOR_DEVICE_URLS.queryPlatformMonitorInfo;
    const countUrl = MONOIOR_DEVICE_URLS.queryPlatformMonitorInfoCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('queryMonitoDeviceInfo complete')
    });
  }
  /**
   * 新增监控设备
   * @param param2
   */
  insertMonitoDevice(param, func: Function) {
    this.api
      .post(MONOIOR_DEVICE_URLS.insertPlatformMonitorInfo, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 编辑监控设备
   * @param param2
   */
  updateMonitoDevice(param, func: Function) {
    this.api
      .put(MONOIOR_DEVICE_URLS.updatePlatformMonitorInfo, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 删除监控设备
   * @param param2
   */
  deleteMonitorDevice(param, func: Function) {
    this.api
      .put(MONOIOR_DEVICE_URLS.deletePlatformMonitorInfo, param)
      .subscribe(resp => {
        func(resp);
      });
  }


}

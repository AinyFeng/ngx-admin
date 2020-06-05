import { Injectable } from '@angular/core';

import { forkJoin } from 'rxjs';
import {ApiService} from '../api/api.service';
import {SENSOR_DEVICE_URLS} from './coldchain-url-params.const';

@Injectable()
export class SensorDeviceService {
  constructor(private api: ApiService) {}

  /**
   * 查询传感器设备信息
   */
  querySensorDeviceInfo(params: any, func: Function) {
    const url = SENSOR_DEVICE_URLS.queryPlatformSensorInfo;
    const countUrl = SENSOR_DEVICE_URLS.queryPlatformSensorInfoCount;
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
   * 新增传感器设备
   * @param param2
   */
  insertSensorDevice(param, func: Function) {
    this.api
      .post(SENSOR_DEVICE_URLS.insertPlatformSensorInfo, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 编辑传感器设备
   * @param param2
   */
  updateSensorDevice(param, func: Function) {
    this.api
      .put(SENSOR_DEVICE_URLS.updatePlatformSensorInfo, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 删除传感器设备
   * @param param2
   */
  deleteSensorDevice(param, func: Function) {
    this.api
      .put(SENSOR_DEVICE_URLS.deletePlatformSensorInfo, param)
      .subscribe(resp => {
        func(resp);
      });
  }

  /**
   * 查询冷链设备下拉选
   * @param param2
   */
  queryFacilityOptions(param, func: Function) {
    this.api
      .post(SENSOR_DEVICE_URLS.queryFacilityOptions, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 查询监测设备下拉选
   * @param param2
   */
  queryMonitorOptions(param, func: Function) {
    this.api
      .post(SENSOR_DEVICE_URLS.queryMonitorOptions, param)
      .subscribe(resp => {
        func(resp);
      });
  }
}

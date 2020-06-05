import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import {DEPARTMENT_CONFIG, DEVICE_TYPE_URLS, MASTER_URLS, STOCK_URLS} from '../../url-params.const';
import { forkJoin } from 'rxjs';

@Injectable()
export class DevicetypeService {
  constructor(private api: ApiService) {}

  /**
   * 获取设备类型(分页)
   * @param workingDayJson
   * @param param2
   */
  getDeviceType(param, func: Function) {
    const url = DEVICE_TYPE_URLS.queryDeviceType;
    const countUrl = DEVICE_TYPE_URLS.queryDeviceTypeCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, param),
      this.api.post(countUrl, param)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('search DeviceType complete')
    });
  }
  /**
   * 获取设备类型
   * @param workingDayJson
   * @param param2
   */
  queryDeviceType(param, func: Function) {
    this.api
      .post(DEVICE_TYPE_URLS.queryDeviceTypeOptions, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 插入设备类型
   * @param workingDayJson
   * @param param2
   */
  insert(param, func: Function) {
    this.api
      .post(DEVICE_TYPE_URLS.insertDeviceType, param)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 删除
   * @param workingDayJson
   * @param param2
   */
  delete(id: number, func: Function) {
    this.api
      .del(DEVICE_TYPE_URLS.deleteDeviceType + '/' + id, id)
      .subscribe(resp => {
        func(resp);
      });
  }
  /**
   * 编辑设备类型
   * @param workingDayJson
   * @param param2
   */
  update(param, func: Function) {
    this.api
      .put(DEVICE_TYPE_URLS.editDeviceType, param)
      .subscribe(resp => {
        func(resp);
      });
  }
}

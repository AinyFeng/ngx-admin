/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
// import { ApiService } from '../../api.service';
import { IOT_URLS } from '../../url-params.const';
import { Observable } from 'rxjs/';
import { ApiService } from '../../api.service';

@Injectable()
export class IotFacilityQueue {
  constructor(private api: ApiService) { }

  /**
   * 查询Iot设备队列信息
   * @param params
   * @param func
   */
  queryIotFacilityQueue(params: any, func: Function) {
    this.api
      .post(IOT_URLS.queryIotFacilityQueue, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询Iot设备队列信息Count
   * @param params
   * @param func
   */
  queryIotFacilityQueueCount(params: any, func: Function) {
    this.api
      .post(IOT_URLS.queryIotFacilityQueueCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加Iot设备队列信息
   * @param params
   * @param func
   */
  addIotFacilityQueue(params: any, func: Function) {
    this.api
      .post(IOT_URLS.addIotFacilityQueue, params)
      .subscribe(result => func(result));
  }

  /**
   * 批量添加Iot设备队列信息
   * @param params
   * @param func
   */
  addIotFacilityQueueBatch(params: any, func: Function) {
    this.api
      .post(IOT_URLS.addIotFacilityQueueBatch, params)
      .subscribe(result => func(result));
  }

  /**
   * 更新Iot设备队列信息
   * @param params
   * @param func
   */
  updateIotFacilityQueue(params: any, func: Function) {
    this.api
      .put(IOT_URLS.updateIotFacilityQueue, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除Iot设备队列信息
   * @param id
   * @param func
   */
  deleteIotFacilityQueue(id: number, func: Function) {
    this.api
      .del(IOT_URLS.deleteIotFacilityQueue + '/' + id)
      .subscribe(result => func(result));
  }

  /**
   * 批量删除Iot设备队列信息
   * @param params
   * @param func
   */
  deleteIotFacilityQueueBatch(params: any, func: Function) {
    this.api
      .post(IOT_URLS.deleteIotFacilityQueueBatch, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询叫号屏设备
   * @author AXF
   * @params:
   * @date 2019/12/5 0005
   */
  queryScreenIotInfo(params: any, func: Function) {
    this.api.post(IOT_URLS.queryScreenIotInfo, params).subscribe(result => func(result));
  }
}

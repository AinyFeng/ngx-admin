import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {QueryEntity} from '../entity/profile.entity';
import {RESERVATION_URLS} from '../url-params.const';
import {forkJoin, Observable, zip} from 'rxjs';

@Injectable()
export class ReservationRecordService {
  constructor(private api: ApiService) {
  }

  /**
   * 根据输入参数查询预约记录
   * @param query 输入参数
   * @param func 回调方法
   */
  queryReservationRecord(query: any, func: Function) {
    this.api
      .post(RESERVATION_URLS.queryReservationRecord, query)
      .subscribe(result => func(result));
  }

  /**
   * 根据输出参数统计预约记录数目
   * @param query
   * @param func
   */
  countReservationRecord(query: any, func: Function) {
    this.api
      .post(RESERVATION_URLS.countReservationRecord, query)
      .subscribe(result => func(result));
  }

  /**
   * 查询和统计预约记录二合一接口
   * @param query
   * @param func
   */
  queryAndCountReservationRecord(query: any, func: Function) {
    zip(
      this.api.post(RESERVATION_URLS.queryReservationRecord, query),
      this.api.post(RESERVATION_URLS.countReservationRecord, query)
    ).subscribe(([queryData, countData]) => func(queryData, countData));
  }

  /**
   * 插入单条预约记录
   * @param params 预约记录
   * @param func 回调函数
   */
  saveReservationRecord(params: any, func: Function) {
    this.api
      .post(RESERVATION_URLS.saveReservationRecord, params, params)
      .subscribe(result => func(result));
  }

  /**
   * 根据预约时段查询已预约人数
   * ['workingTimeSerial1', 'workingTimeSerial2']
   * @param params  时段段流水号数组 e.g.['98277245155541568','2']
   * @param func
   */
  countByWorkingTime(params: any, func: Function) {
    this.api
      .post(RESERVATION_URLS.countByWorkingTime, params, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询所有的预约记录明细信息
   * @param params
   * @param func
   */
  queryRecordDetail(params: any, func: Function) {
    this.api
      .post(RESERVATION_URLS.queryReservationRecordDetail, params)
      .subscribe(result => func(result));
  }

  /**
   * 取消预约记录
   * @param params
   * @param func
   * */
  cancelReservationRecord(params: any, func: Function) {
    this.api
      .post(RESERVATION_URLS.cancelReservation, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询预约记录
   * @param params
   * @param func
   */
  queryRecordWithDetail(params: any, func: Function) {
    this.api.post(RESERVATION_URLS.queryReservationRecordWithDetail, params).subscribe(res => func(res));
  }

  /**
   * 统计预约记录
   * @param params
   * @param func
   */
  countRecordWithDetail(params: any, func: Function) {
    this.api.post(RESERVATION_URLS.countReservationRecordWithDetail, params).subscribe(res => func(res));
  }

  /**
   * 查询和统计数量
   * @param params
   * @param func
   */
  queryAndCountRecordWithDetail(params: any, func: Function) {
    forkJoin([this.api.post(RESERVATION_URLS.queryReservationRecordWithDetail, params),
      this.api.post(RESERVATION_URLS.countReservationRecordWithDetail, params)])
      .subscribe(([queryData, countData]) => {
        func([queryData, countData]);
      });
  }

  /**
   * 根据预约记录编码删除预约记录
   * @param serialCode
   * @param func
   */
  deleteReservationRecord(serialCode: string, func: Function) {
    this.api.del(RESERVATION_URLS.deleteReservationByCode + '/' + serialCode).subscribe(res => func(res));
  }

  /**
   * 根据预约记录编码删除预约记录
   * @param serialCode
   * @param func
   */
  deleteReservationDetailByCode(serialCode: string, func: Function) {
    this.api.del(RESERVATION_URLS.deleteReservationDetailByCode + '/' + serialCode).subscribe(res => func(res));
  }
}

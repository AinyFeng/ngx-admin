import { Injectable } from '@angular/core';
import { SYSTEM_URLS } from '../url-params.const';
import { ApiService } from '../api.service';
import { forkJoin } from 'rxjs';

@Injectable()
export class ApiSystemWorkingTimeService {
  constructor(private api: ApiService) {
  }

  /**
   * 预约记录查询
   * @param func
   * @arther fuxin
   * @date 2019-07-08
   */
  searchDateAndCount(param, func: Function) {
    const url = SYSTEM_URLS.searchWorkingTime;
    const countUrl = SYSTEM_URLS.countWorkingTime;

    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, param),
      this.api.post(countUrl, param)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('searchWorkingTime complete')
    });
  }

  /**
   * 根据工作日查询可用工作时段接口
   * @param param condition.key=workingDaySerial 工作日流水号
   * @param func
   */
  queryUseAbleWorkingTime(param: any, func: Function) {
    this.api.post(SYSTEM_URLS.searchWorkingTime, param).subscribe(resp => {
      func(resp);
    });
  }

  /**
   * 查询工作时间段
   * @param param
   */
  queryWorkingTimeForPipe(param: any) {
    return this.api.post(SYSTEM_URLS.searchWorkingTime, param);
  }

  /**
   * 根据工作日查询工作时段
   * @param params
   * @param func
   */
  queryWorkingTimeByDate(params: any, func: Function) {
    this.api
      .post(SYSTEM_URLS.queryWorkingTimeByDate, params)
      .subscribe(resp => {
        func(resp);
      });
  }

  /**
   * 插入一条工作时间段数据
   * @param params
   * @param func
   */
  insertWorkingTime(params: any, func: Function) {
    this.api.post(SYSTEM_URLS.insertWorkingTime, params).subscribe(result => func(result));
  }
}

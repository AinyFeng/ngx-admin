import { Injectable } from '@angular/core';
import { SYSTEM_URLS } from '../url-params.const';
import { ApiService } from '../api.service';
import { forkJoin } from 'rxjs';

@Injectable()
export class ApiSystemHolidayDayService {
  constructor(private api: ApiService) {}

  /**
   * 查询记录、count
   * @param param
   * @param func
   * @arther fuxin
   * @date 2019-07-08
   */
  searchDateAndCount(param, func: Function) {
    const url = SYSTEM_URLS.searchHoliday;
    const countUrl = SYSTEM_URLS.countHoliday;

    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, param),
      this.api.post(countUrl, param)
    ]).subscribe({
      next: data => func(data),
      complete: () => {}
    });
  }

  /**
   * 更新是否可用属性
   * @param param
   * @param func
   */
  setUseAble(param, func: Function) {
    this.api
      .post(SYSTEM_URLS.countHolidaySetUseAble, param, param)
      .subscribe(resp => {
        func(resp);
      });
  }

  /**
   * 新增工作日
   * @param workingDayJson
   * @param param2
   */
  insertHoliday(param, func: Function) {
    this.api
      .post(SYSTEM_URLS.insertHoliday, param, param)
      .subscribe(resp => {
        func(resp);
      });
  }
}

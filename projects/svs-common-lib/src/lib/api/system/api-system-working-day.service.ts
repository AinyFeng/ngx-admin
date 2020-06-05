import { Injectable } from '@angular/core';
import { SYSTEM_URLS } from '../url-params.const';
import { ApiService } from '../api.service';
import { forkJoin } from 'rxjs';

@Injectable()
export class ApiSystemWorkingDayService {
  constructor(private api: ApiService) {}

  /**
   * 查询记录、count
   * @param param
   * @param func
   * @arther fuxin
   * @date 2019-07-08
   */
  searchDateAndCount(param, func: Function) {
    const url = SYSTEM_URLS.searchWorkingDay;
    const countUrl = SYSTEM_URLS.countWorkingDay;

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
      .post(SYSTEM_URLS.workingDaySetUseAble, param, param)
      .subscribe(resp => {
        func(resp);
      });
  }

  /**
   * 新增工作日
   * @param workingDayJson
   * @param param2
   */
  insertWorkingDay(param, func: Function) {
    this.api
      .post(SYSTEM_URLS.insertWorkingDay, param, param)
      .subscribe(resp => {
        func(resp);
      });
  }

  /**
   * 查询可用工作日
   * @param param condition.key=povCode 门诊编码
   * @param func
   */
  queryUseAbleWorkingDay(param, func: Function) {
    if (!param.condition) {
      param.condition = [];
    }
    param.condition.push({ key: 'useAble', logic: '=', value: '1' });
    param.page = null;
    this.api.post(SYSTEM_URLS.searchWorkingDay, param).subscribe(resp => {
      func(resp);
    });
  }
}

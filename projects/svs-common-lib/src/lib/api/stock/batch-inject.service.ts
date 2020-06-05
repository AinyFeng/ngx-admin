import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { STOCK_URLS, SYSTEM_URLS } from '../url-params.const';
import { forkJoin } from 'rxjs';

@Injectable()
export class BatchInjectService {
  constructor(private api: ApiService) {}

  /**
   * 查询批量接种记录信息
   */
  queryBatchVaccinateRecord(params: any, func: Function) {
    const url = STOCK_URLS.queryBatchVaccinateRecord;
    const countUrl = STOCK_URLS.queryBatchVaccinateRecordCount;

    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('searchBatchVaccinateRecord complete')
    });
  }
  /**
   * 新增批量接种信息
   * @param workingDayJson
   * @param param2
   */
  insertBatchInject(param, func: Function) {
    this.api
      .post(STOCK_URLS.stockMassOut, param)
      .subscribe(resp => {
        func(resp);
      });
  }
}

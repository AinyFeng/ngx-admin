import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { REPORT_URLS } from '../url-params.const';

@Injectable()
export class ReportSubmitRecordService {
  constructor(private api: ApiService) { }

  /**
   * 根据输入参数查询报表上报记录
   * @param query 输入参数
   * @param func 回调方法
   */
  queryReportSubRecords(query: any, func: Function) {
    this.api
      .post(REPORT_URLS.queryReportSubRecord, query)
      .subscribe(result => func(result));
  }
}

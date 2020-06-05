import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { REPORT_URLS } from '../url-params.const';

@Injectable()

/**
 * 报表管理 接口
 */
export class ApiReportService {
  requestOptions = {};

  constructor(private api: ApiService) {}

  /**
   * 获取报表列表的名称
   * @param func 回调函数
   */
  getReportNameList(func: Function) {
    const url = REPORT_URLS.getReportNameList;
    this.api.get(url).subscribe(resp => {
      func(resp);
    });
  }
}

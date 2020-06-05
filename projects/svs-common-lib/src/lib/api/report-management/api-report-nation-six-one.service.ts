import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { REPORT_URLS } from '../url-params.const';
import { zip } from 'rxjs';

// import { HttpHeaders } from '@angular/common/http';

@Injectable()

/**
 * 报表管理 - 报表6-1 service
 */
export class ApiReportNationSixOneService {
  constructor(private api: ApiService) {
  }

  /**
   * 获取报表列表的名称
   * @param func 回调函数
   */
  public queryDateList(params: any, func: Function) {
    const url = REPORT_URLS.getReportNationSixOne;
    this.api.post(url, params).subscribe(resp => {
      func(resp);
    });
  }

  /**
   * 6-1报表统计
   * @param params
   * @param func
   */
  statisticsSixOneData(params: any, func: Function) {
    this.api.post(REPORT_URLS.insertReportNationSixOne, params).subscribe(result => func(result));
  }

  /**
   * 6-1报表汇总统计
   * 获取报表列表的名称
   * @param param 参数
   * @param func 回调函数
   */
  public queryDateSumList(param: any, func: Function) {
    const url = REPORT_URLS.getReportNationSixOneSum;
    this.api.post(url, param, param).subscribe(resp => {
      func(resp);
    });
  }

  /**
   * 国家报表6-1上报记录
   * @author AXF
   * @params:
   * @date 2019/12/9
   */
  querySixOneReport(params: any, func: Function) {
    this.api.post(REPORT_URLS.querySixOneReport, params).subscribe(result => func(result));
  }

  /**
   * 国家报表6-1导出
   * @author AXF
   * @params:
   * @date 2019/12/9
   */
  querySixOneExport(params: any, func: Function) {
    // 返回类型 指定为 blob 或者 arraybuffer 都可以
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(REPORT_URLS.querySixOneExport, params, options).subscribe(result => func(result));
  }

  /**
   * 6-1汇总导出
   * @param params
   * @param func
   */
  querySixOneExportSum(params: any, func: Function) {
    // 返回类型 指定为 blob 或者 arraybuffer 都可以
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(REPORT_URLS.querySixOneExportSum, params, options).subscribe(result => func(result));
  }

  /**
   * 应种个案详情
   * @param params
   * @param func
   */
  queryShCaseDetail(params: any, func: Function) {
    this.api.post(REPORT_URLS.queryShCaseDetail, params).subscribe(result => func(result));
  }

  /**
   * 应种个案详情和Count
   * @param params
   * @param func
   */
  queryShCaseDetailAndCount(params: any, func: Function) {
    zip(
      this.api.post(REPORT_URLS.queryShCaseDetail, params),
      this.api.post(REPORT_URLS.queryShCaseDetailCount, params)
    ).subscribe(result => func(result));
  }

  /**
   * 实种个案详情
   * @param params
   * @param func
   */
  queryReCaseDetail(params: any, func: Function) {
    this.api.post(REPORT_URLS.queryReCaseDetail, params).subscribe(result => func(result));
  }

  /**
   * 实种个案详情和Count
   * @param params
   * @param func
   */
  queryReCaseDetailAndCount(params: any, func: Function) {
    zip(
      this.api.post(REPORT_URLS.queryReCaseDetail, params),
      this.api.post(REPORT_URLS.queryReCaseDetailCount, params)
    ).subscribe(result => func(result));
  }

  /**
   * 应种未种个案详情
   * @param params
   * @param func
   */
  queryShAndNotCaseDetail(params: any, func: Function) {
    this.api.post(REPORT_URLS.queryShAndNotCaseDetail, params).subscribe(result => func(result));
  }

  /**
   * 应种未种个案详情和Count
   * @param params
   * @param func
   */
  queryShAndNotCaseDetailAndCount(params: any, func: Function) {
    zip(
      this.api.post(REPORT_URLS.queryShAndNotCaseDetail, params),
      this.api.post(REPORT_URLS.queryShAndNotCaseDetailCount, params)
    ).subscribe(result => func(result));

  }

}

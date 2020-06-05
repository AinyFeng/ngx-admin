import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {REPORT_URLS} from '../url-params.const';

@Injectable()

/**
 * 报表管理 - 报表6-2 service
 */
export class ApiReportNationSixTwoService {
  constructor(private api: ApiService) {
  }

  /**
   * 获取报表列表的名称
   * @param param 参数
   * @param func 回调函数
   */
  public queryDateList(param: any, func: Function) {
    const url = REPORT_URLS.getReportNationSixTwo;
    this.api.post(url, param).subscribe(resp => {
      func(resp);
    });
  }

  /**
   * 6-2报表统计
   * @param params
   * @param func
   */
  statisticsSixTwoData(params: any, func: Function) {
    this.api.post(REPORT_URLS.insertReportNationSixTwo, params).subscribe(result => func(result));
  }

  /**
   * 获取报表列表的名称
   * @param func 回调函数
   */
  public queryDateSumList(param: any, func: Function) {
    const url = REPORT_URLS.getReportNationSixTwoSum;
    this.api.post(url, param).subscribe(resp => {
      func(resp);
    });
  }

  /**
   * 国家报表6-2上报记录
   * @author AXF
   * @params:
   * @date 2019/12/9
   */
  querySixTowReport(params: any, func: Function) {
    this.api.post(REPORT_URLS.querySixTowReport, params).subscribe(resp => {
      func(resp);
    });
  }

  /**
   * 国家报表6-2导出记录
   * @author AXF
   * @params:
   * @date 2019/12/9
   */
  querySixTwoExport(params: any, func: Function) {
    // 指点返回的类型
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(REPORT_URLS.querySixTwoExport, params, options).subscribe(result => {
      func(result);
    });
  }

  /**
   * 国家报表6-2的疫苗数据
   * @param params
   * @param func
   */
  queryVaccTypeInfo(params: any, func: Function) {
    this.api.post(REPORT_URLS.querySixTwoVacType, params).subscribe(result => func(result));
  }
}

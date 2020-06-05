import {Injectable} from '@angular/core';
import {PLATFORM_REPORT_STATISTICS_URL} from '../platform.report.api.url.params';
import {ApiService} from '../../api/api.service';

// 查询常用接种率报表汇总接口
@Injectable({
  providedIn: 'root'
})
export class VacReportStatisticsApiService {

  constructor(
    private api: ApiService,
  ) {
  }

  /**
   * 6-1接种率汇总统计
   * @author AXF
   * @params:
   * @date 2019/12/16 0016
   */
  querySixOneSum(params: any, func: Function) {
    this.api.post(PLATFORM_REPORT_STATISTICS_URL.querySixOneSum, params).subscribe(result => func(result));
  }

  /**
   * 6-2接种率汇总统计
   * @author AXF
   * @params:
   * @date 2019/12/16 0016
   */
  querySixTwoSum(params: any, func: Function) {
    this.api.post(PLATFORM_REPORT_STATISTICS_URL.querySixTwoSum, params).subscribe(result => func(result));
  }


}

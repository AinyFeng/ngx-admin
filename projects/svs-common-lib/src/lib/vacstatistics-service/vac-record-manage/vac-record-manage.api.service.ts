import {Injectable} from '@angular/core';
import {PLATFORM_VAC_RECORD_MANAGE_URL} from '../platform.report.api.url.params';
import {ApiService} from '../../api/api.service';
import {DEVICE_URLS} from '../../coldchain-service/coldchain-url-params.const';
import {forkJoin} from 'rxjs';

// 接种记录管理查询接口
@Injectable({
  providedIn: 'root'
})
export class VacRecordManageApiService {

  constructor(
    private api: ApiService,
  ) {
  }

  /**
   * 接种记录查询 -- 成人接种记录
   * @author AXF
   * @params:
   * @date 2019/12/16 0016
   */
  queryAdultVacRecord(params: any, func: Function) {
    const url = PLATFORM_VAC_RECORD_MANAGE_URL.queryAdultVacRecord;
    const countUrl = PLATFORM_VAC_RECORD_MANAGE_URL.queryAdultVacRecordCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('queryAdultVacRecord complete')
    });
  }

}

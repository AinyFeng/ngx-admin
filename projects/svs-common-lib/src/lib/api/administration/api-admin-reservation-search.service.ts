import { Injectable } from '@angular/core';
import { REPORT_URLS_ADMIN } from '../url-params.const';
import { ApiService } from '../api.service';
import { forkJoin } from 'rxjs';

@Injectable()
export class ApiAdminReservationSearchService {
  constructor(private api: ApiService) { }

  /**
   * 预约记录查询
   * @param func
   * @arther fuxin
   * @date 2019-07-08
   */
  searchReservation(param, func: Function) {
    const url = REPORT_URLS_ADMIN.searchReservation;
    const countUrl = REPORT_URLS_ADMIN.countReservation;

    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, param),
      this.api.post(countUrl, param)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('searchReservation complete')
    });
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { SYSTEM_URLS } from '../url-params.const';
import { forkJoin } from 'rxjs';

@Injectable()
export class ApiSystemConfigService {
  constructor(private api: ApiService) {}

  /**
   *
   * @param param
   * @param func
   * @arther liuguozhao
   * @date 2019-10-24 19:42
   */
  searchData(param, func: Function) {
    const dictUrl = SYSTEM_URLS.searchDict;
    const confUrl = SYSTEM_URLS.searchConf;
    forkJoin([
      this.api.post(dictUrl, param),
      this.api.post(confUrl, param)
    ]).subscribe({
      next: data => func(data),
      complete: () => {}
    });
  }

  searchSysConf(param, func: Function) {
    this.api.post(SYSTEM_URLS.searchConf, param).subscribe(resp => func(resp));
  }

  countSysConf(param, func: Function) {
    this.api.post(SYSTEM_URLS.countConf, param).subscribe(resp => func(resp));
  }

  insertAndModify(param, func: Function) {
    this.api
      .post(SYSTEM_URLS.insertAndModifyConf, param)
      .subscribe(resp => func(resp));
  }

  getConf(param, func: Function) {
    this.api
      .get(SYSTEM_URLS.getConf + `/${param}`)
      .subscribe(resp => func(resp));
  }
}

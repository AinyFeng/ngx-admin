import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { SYSTEM_URLS } from '../url-params.const';
import { forkJoin } from 'rxjs';

@Injectable()
export class ApiSystemDictionaryService {
  constructor(private api: ApiService) {}

  /**
   *
   * @param param
   * @param func
   * @arther liuguozhao
   * @date 2019-10-23 21:28
   */
  searchDataAndCount(param, func: Function) {
    const url = SYSTEM_URLS.searchDict;
    const countUrl = SYSTEM_URLS.countDict;
    forkJoin([this.api.post(url, param)]).subscribe({
      next: data => func(data),
      complete: () => {}
    });
  }

  searchSysConfDictionary(param, func: Function) {
    this.api.post(SYSTEM_URLS.searchDict, param).subscribe(resp => func(resp));
  }

  countSysConfDictionary(param, func: Function) {
    this.api.post(SYSTEM_URLS.countDict, param).subscribe(resp => func(resp));
  }

  insertSysConfDictionary(param, func: Function) {
    this.api.post(SYSTEM_URLS.insertDict, param).subscribe(resp => func(resp));
  }

  updateSysConfDictionary(param, func: Function) {
    this.api.put(SYSTEM_URLS.updateDict, param).subscribe(resp => func(resp));
  }

  deleteSysConfDictionary(param, func: Function) {
    this.api
      .del(SYSTEM_URLS.deleteDict + `/${param}`)
      .subscribe(resp => func(resp));
  }
}

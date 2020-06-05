import { Injectable } from '@angular/core';
import { SYSTEM_URLS } from '../url-params.const';
import { ApiService } from '../api.service';
import { forkJoin } from 'rxjs';

@Injectable()
export class ApiSystemUserService {
  constructor(private api: ApiService) {}

  /**
   * 预约记录查询
   * @param param
   * @param func
   * @arther fuxin
   * @date 2019-07-08
   */
  searchDataAndCount(param, func: Function) {
    const url = SYSTEM_URLS.searchUser;
    const countUrl = SYSTEM_URLS.countUser;

    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, param),
      this.api.post(countUrl, param)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('searchUser complete')
    });
  }

  insertSysUser(param, func: Function) {
    const url = SYSTEM_URLS.insertUser;
    this.api.post(url, param).subscribe(resp => func(resp));
  }

  updateSysUser(param, func: Function) {
    const url = SYSTEM_URLS.updateUser;
    this.api.put(url, param).subscribe(resp => func(resp));
  }

  deleteSysUser(param, func: Function) {
    const url = SYSTEM_URLS.deleteUser;
    this.api.del(url, param).subscribe(resp => func(resp));
  }
}

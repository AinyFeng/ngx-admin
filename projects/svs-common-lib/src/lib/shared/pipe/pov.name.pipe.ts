import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PovInfoService } from '../../api/master/pov/pov.service';
import { LOCAL_STORAGE } from '../../base/localStorage.base';

@Pipe({
  name: 'povNamePipe'
})
/**
 * 根据pov 编码获取pov名称
 * 先从localstorage中查找，如果有则不发请求
 */
export class PovNamePipe implements PipeTransform {
  constructor(
    private povSvc: PovInfoService,
    private localSt: LocalStorageService
  ) {
  }

  transform(value: string): any {
    if (!value || value.trim() === '') return of(value);
    const reg = new RegExp(/^[\u4e00-\u9fa5]{2,}\d?/);
    if (value.match(reg)) return of(value);
    const povName = this.localSt.retrieve(LOCAL_STORAGE.VACC_POV + value);
    if (povName !== null) {
      return new Promise(resolve => {
        resolve(povName);
      });
    }
    return this.queryPovName(value).pipe(
      map(resp => {
        if (
          resp.code === 0 &&
          resp.hasOwnProperty('data') &&
          resp['data'].length !== 0
        ) {
          this.localSt.store(
            LOCAL_STORAGE.VACC_POV + value,
            resp.data[0]['name']
          );
          return resp.data[0]['name'];
        } else {
          this.localSt.store(LOCAL_STORAGE.VACC_POV + value, value);
          return value;
        }
      })
    );
  }

  queryPovNameByCode(povCode: string, func: Function) {
    const query = {
      povCode: povCode
    };
    this.povSvc.queryPovInfo(query, resp => {
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp.data.length === 0
      ) {
        func(null);
        return;
      }
      func(resp.data[0]['name']);
    });
  }

  queryPovName(povCode: string): Observable<any> {
    let query = {
      povCode: povCode
    };
    return this.povSvc.queryPovInfoForPipe(query);
  }
}

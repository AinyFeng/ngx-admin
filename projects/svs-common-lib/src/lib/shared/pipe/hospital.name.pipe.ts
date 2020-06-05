import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LOCAL_STORAGE } from '../../base/localStorage.base';
import { HospitalBaseInfoService } from '../../api/master/hospital/hospital.base.info.service';

@Pipe({
  name: 'hospitalNamePipe'
})
/**
 * 根据pov 编码获取pov名称
 * 先从localstorage中查找，如果有则不发请求
 */
export class HospitalNamePipe implements PipeTransform {

  hospitalName = 'hospitalName';

  constructor(
    private hosApiSvc: HospitalBaseInfoService,
    private localSt: LocalStorageService
  ) {
  }

  transform(value: string): any {
    if (!value || value.trim() === '') return;
    const reg = new RegExp(/^[\u4e00-\u9fa5]{2,}\d?/);
    if (value.match(reg)) return of(value);
    const hospitalName = this.localSt.retrieve(LOCAL_STORAGE.HOSTPITAL_NAME + value);
    if (hospitalName !== null) {
      return new Promise((resolve, reject) => {
        resolve(hospitalName);
      });
    }
    return this.queryHospitalName(value).pipe(
      map(resp => {
        if (
          resp.code === 0 &&
          resp.hasOwnProperty('data') &&
          resp['data'].length !== 0
        ) {
          this.localSt.store(
            LOCAL_STORAGE.HOSTPITAL_NAME + value,
            resp.data[0][this.hospitalName]
          );
          return resp.data[0][this.hospitalName];
        } else {
          this.localSt.store(LOCAL_STORAGE.HOSTPITAL_NAME + value, value);
          return value;
        }
      })
    );
  }

  queryHospitalName(hospitalCode: string): Observable<any> {
    let query = {
      hospitalCode: hospitalCode
    };
    return this.hosApiSvc.queryHospitalNameForPipe(query);
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { __values } from 'tslib';
import { AdministrativeDivisionService } from '../../api/master/administrativedivision/administrativeDivision.service';
import { LOCAL_STORAGE } from '../../base/localStorage.base';

@Pipe({
  name: 'administrativePipe'
})
/**
 * 行政区划数据异步pipe
 */
export class AdministrativePipe implements PipeTransform {
  constructor(
    private adminSvc: AdministrativeDivisionService,
    private localSt: LocalStorageService
  ) { }

  transform(value: string): any {
    if (!value || value.trim() === '') return of('');
    // if (value.length === 6) {
    //   value = value + '000000';
    // }
    const administrativeName = this.localSt.retrieve(
      LOCAL_STORAGE.ADMINISTRATIVE_DATA + value
    );
    if (administrativeName !== null) {
      return new Promise(resolve => {
        resolve(administrativeName);
      });
    }
    return this.getAdministrativeName(value).pipe(
      map(resp => {
        console.log('resp', resp);
        if (
          resp.code === 0 &&
          resp.hasOwnProperty('data') &&
          resp['data'].length !== 0
        ) {
          this.localSt.store(
            LOCAL_STORAGE.ADMINISTRATIVE_DATA + value,
            resp.data[0]['name']
          );
          return resp.data[0]['name'];
        } else {
          this.localSt.store(LOCAL_STORAGE.ADMINISTRATIVE_DATA + value, value);
          return value;
        }
      })
    );
  }

  getAdministrativeName(code: string): Observable<any> {
    const query = {
      code: code
    };
    return this.adminSvc.queryAdministrativeDivisionForPipe(query);
  }
}

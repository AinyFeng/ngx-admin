import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LOCAL_STORAGE } from '../../base/localStorage.base';
import { map } from 'rxjs/operators';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { FixedassetsService } from '../../api/master/fixedassets/fixedassets.service';

@Pipe({
  name: 'fixedNamePipe'
})

export class FixedAssetsName implements PipeTransform {

  name = 'fixedAssetsName';

  constructor(private localSt: LocalStorageService,
              private fixedApi: FixedassetsService) {
  }

  /**
   * fixedAssetsCode
   * @param fixedAssetsCode
   */
  transform(fixedAssetsCode: string): any {
    if (!fixedAssetsCode || fixedAssetsCode.trim() === '') return;
    const fixedAssetsName = this.localSt.retrieve(LOCAL_STORAGE.FIXED_ASSETS + fixedAssetsCode);
    if (fixedAssetsName !== null) {
      return new Promise((resolve, reject) => {
        resolve(fixedAssetsName);
      });
    }
    return this.queryFixedAssetsName(fixedAssetsCode).pipe(
      map(resp => {
        if (
          resp.code === 0 &&
          resp.hasOwnProperty('data') &&
          resp['data'].length !== 0
        ) {
          this.localSt.store(
            LOCAL_STORAGE.FIXED_ASSETS + fixedAssetsCode,
            resp.data[0][this.name]
          );
          return resp.data[0][this.name];
        } else {
          this.localSt.store(LOCAL_STORAGE.FIXED_ASSETS + fixedAssetsCode, fixedAssetsCode);
          return fixedAssetsCode;
        }
      })
    );
  }

  queryFixedAssetsName(fixedAssetsCode: string): Observable<any> {
    let query = {
      fixedAssetsCode: fixedAssetsCode
    };
    return this.fixedApi.queryFixedAssetsNameByCode(query);
  }

}



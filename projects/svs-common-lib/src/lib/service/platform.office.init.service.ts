import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
/**
 * 市平台用户归属office 初始化
 */
export class PlatformOfficeInit {
  private officeData = [];

  constructor(private localSt: LocalStorageService) {
    const povData = this.localSt.retrieve(LOCAL_STORAGE.PLATFORM_OFFICE);
    if (povData !== null) {
      this.setOfficeData(povData);
    }
  }

  setOfficeData(data: any) {
    if (data === null || !data) return;
    this.officeData = data;
  }

  getOfficeData() {
    return this.officeData;
  }

  getOfficeDataAsObservable(): Observable<any> {
    return of(this.officeData);
  }
}

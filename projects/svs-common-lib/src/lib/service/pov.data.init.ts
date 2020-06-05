import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
export class PovDataInit {
  private povData = [];

  constructor(private localSt: LocalStorageService) {
    const povData = this.localSt.retrieve(LOCAL_STORAGE.VACC_POV);
    if (povData !== null) {
      this.setPovData(povData);
    }
  }

  setPovData(data: any) {
    if (data === null || !data) return;
    this.povData = data;
  }

  getPovData() {
    return this.povData;
  }

  getPovDataAsObservable(): Observable<any> {
    return of(this.povData);
  }
}

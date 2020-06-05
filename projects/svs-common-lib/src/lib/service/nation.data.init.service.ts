import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
export class NationDataInitService {
  private nationData = [];

  constructor(private localSt: LocalStorageService) {
    const nationData = this.localSt.retrieve(LOCAL_STORAGE.NATION_DATA);
    if (nationData !== null) {
      this.setNationData(nationData);
    }
  }

  setNationData(data: any) {
    if (data === null || !data) return;
    this.nationData = data;
  }

  getNationData() {
    return this.nationData;
  }
}

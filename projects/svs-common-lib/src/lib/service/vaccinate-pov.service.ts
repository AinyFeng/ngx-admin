import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
export class VaccinatePovService {
  povData: any;

  constructor(private localSt: LocalStorageService) {
    const povData = this.localSt.retrieve(LOCAL_STORAGE.VACC_POV);
    if (povData !== null) {
      this.setVaccPovData(povData);
    }
  }

  setVaccPovData(data) {
    this.povData = data;
  }

  getVaccPovData() {
    return this.povData;
  }
}

import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
export class VaccManufactureDataService {
  manufactureData: any;

  constructor(private localSt: LocalStorageService) {
    const nationData = this.localSt.retrieve(
      LOCAL_STORAGE.VACC_PRODUCT_MANUFACTURE
    );
    if (nationData !== null) {
      this.setVaccProductManufactureData(nationData);
    }
  }

  setVaccProductManufactureData(data) {
    this.manufactureData = data;
  }

  getVaccProductManufactureData() {
    return this.manufactureData;
  }
}

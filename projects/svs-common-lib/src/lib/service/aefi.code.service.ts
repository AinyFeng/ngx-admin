import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
export class AefiCodeService {
  private aefiData: any;

  constructor(private localSt: LocalStorageService) {
    const data = localSt.retrieve(LOCAL_STORAGE.AEFI_DATA);
    if (data !== null) {
      this.setAefiData(data);
    }
  }

  setAefiData(data: any) {
    this.aefiData = data;
  }

  getAefiData() {
    return this.aefiData;
  }
}

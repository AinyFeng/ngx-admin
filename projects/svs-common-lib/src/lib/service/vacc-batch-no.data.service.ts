import { Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '../base/localStorage.base';
import { LocalStorageService } from '@tod/ngx-webstorage';

@Injectable()
export class VaccBatchNoDataService {
  batchNoData: any;

  constructor(private localSt: LocalStorageService) {
    const nationData = this.localSt.retrieve(
      LOCAL_STORAGE.VACC_PRODUCT_BATCH_NO
    );
    if (nationData !== null) {
      this.setVaccProductBatchNo(nationData);
    }
  }

  setVaccProductBatchNo(data) {
    this.batchNoData = data;
  }

  getVaccProductBatchNo() {
    return this.batchNoData;
  }

  private reformatBatchNo(data: []) {
    let batch = [];
    data.forEach(item => {
      batch.push({ label: item['batchNo'], value: item['batchNo'] });
    });
    return batch;
  }
}

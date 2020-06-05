import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
/**
 * 告知书模板 数据存储和共享 service
 */
export class AgreementService {
  data: any;

  constructor(private localSt: LocalStorageService) {
    const data = this.localSt.retrieve(LOCAL_STORAGE.AGREEMENT_MODAL);
    if (data !== null) {
      this.setAgreementData(data);
    }
  }

  setAgreementData(data: any) {
    this.data = data;
  }

  getAgreementData() {
    return this.data;
  }

  /**
   * 根据code 查询告知书模板
   * @param code
   */
  getAgreementByCode(code: string) {
    return this.data.filter(model => model['code'] === code);
  }
}

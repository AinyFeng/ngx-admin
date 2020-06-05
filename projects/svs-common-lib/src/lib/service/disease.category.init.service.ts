import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
/**
 * 疾病大类数据初始化
 */
export class DiseaseCategoryInitService {

  diseaseCategoryData: any[] = [];

  constructor(private localSt: LocalStorageService) {
    const diseaseCategoryData = this.localSt.retrieve(LOCAL_STORAGE.DISEASE_CATEGORY);
    if (diseaseCategoryData !== null) {
      this.setDiseaseCategoryData(diseaseCategoryData);
    }
  }

  setDiseaseCategoryData(data) {
    this.diseaseCategoryData = data;
  }

  getDiseaseCategoryData(userCode?: string) {
    return userCode ? this.diseaseCategoryData.filter(staff => staff.number === userCode) : this.diseaseCategoryData;
  }
}

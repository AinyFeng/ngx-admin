import { Injectable } from '@angular/core';
import { FieldNameUtils } from '../utils/field.name.utils';
import { LOCAL_STORAGE } from '../base/localStorage.base';
import { LocalStorageService } from '@tod/ngx-webstorage';

@Injectable()
export class DicDataService {
  private dicData: any;

  constructor(private localSt: LocalStorageService) {
    const dicData = this.localSt.retrieve(LOCAL_STORAGE.DIC_DATA);
    if (dicData !== null) {
      this.setDicData(dicData);
    }
  }

  setDicData(data: any[]) {
    if (data === null || !data) return;
    this.dicData = this.rebuildDicData(data);
  }

  getDicData() {
    return this.dicData;
  }

  rebuildDicData(data: any[]) {
    let dic = {};
    data.forEach(item => {
      const dicType = FieldNameUtils.toHump(item['dictType']);
      if (!dic.hasOwnProperty(dicType)) {
        dic[dicType] = [];
        dic[dicType].push({ value: item.dictKey, label: item.dictValue });
      } else {
        dic[dicType].push({ value: item.dictKey, label: item.dictValue });
      }
    });
    return dic;
  }

  getDicDataByKey(key: string) {
    if (key.trim() === '' || !key) return;
    return this.dicData ? this.dicData[key] : this.dicData;
  }

  getDicDataByKeyAndValue(key: string, value: string) {
    let result = '';
    if (key.trim() === '' || !key) return result;
    this.dicData[key].forEach(item => {
      if (item.value === value) {
        result = item.label;
      }
    });
    return result;
  }
}

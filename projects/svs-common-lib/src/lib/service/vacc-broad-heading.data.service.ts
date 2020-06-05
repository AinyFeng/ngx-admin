import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()

/**
 * 疫苗大类数据
 */
export class VaccBroadHeadingDataService {
  vacBroadData: any;

  constructor(private localSt: LocalStorageService) {
    const vacBroadData = this.localSt.retrieve(
      LOCAL_STORAGE.VACC_BROAD_HEADING
    );
    if (vacBroadData !== null) {
      this.setVaccBoradHeadingData(vacBroadData);
    }
  }

  setVaccBoradHeadingData(data) {
    this.vacBroadData = data;
  }

  getVaccBoradHeadingData() {
    return this.vacBroadData;
  }

  /**
   * broadHeadingCode: "01"
   broadHeadingEngName: "BCG"
   broadHeadingFullName: "卡介苗"
   broadHeadingName: "卡介苗"
   * @param code
   */
  getVaccBroadHeadingNameByBroadHeadingCode(code: string) {
    if (code === '' || code === null || code === 'undefined' || this.vacBroadData.length === 0) return '';
    return this.vacBroadData.filter(v => v.broadHeadingCode === code)[0][
      'broadHeadingFullName'
    ];
  }
}

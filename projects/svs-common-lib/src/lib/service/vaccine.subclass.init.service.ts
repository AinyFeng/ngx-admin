import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
export class VaccineSubclassInitService {
  private vaccineSubClassData = [];

  constructor(private localSt: LocalStorageService) {
    const vacSubClassData = this.localSt.retrieve(
      LOCAL_STORAGE.VACCINE_SUBCLASS
    );
    if (vacSubClassData !== null) {
      this.setVaccineSubClassData(vacSubClassData);
    }
  }

  setVaccineSubClassData(data: any) {
    if (data === null || !data) return;
    this.vaccineSubClassData = this.reformatVaccineSubClassData(data);
  }

  getVaccineSubClassData() {
    return this.vaccineSubClassData;
  }

  reformatVaccineSubClassData(data: any[]) {
    let vacSubClassData = [];
    data.forEach(item => {
      vacSubClassData.push({
        label: item['vaccineSubclassName'],
        value: item['vaccineSubclassCode'],
        isLiveVaccine: item['isLiveVaccine'],
        memo: item['memo'],
        vaccineSubclassFullName: item['vaccineSubclassFullName']
      });
    });
    return vacSubClassData;
  }

  /**
   * 根据小类编码获取小类名称
   * @param subclassCode
   */
  getSubclassNameByCode(subclassCode: string) {
    if (!subclassCode) {
      return undefined;
    }
    return this.vaccineSubClassData.find(vsc => vsc.value === subclassCode);
  }
}

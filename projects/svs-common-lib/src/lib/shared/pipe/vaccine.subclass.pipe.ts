import { Pipe, PipeTransform } from '@angular/core';
import { VaccineSubclassInitService } from '../../service/vaccine.subclass.init.service';

@Pipe({
  name: 'vaccineSubClassPipe',
  pure: true
})

/**
 * 禁忌症 过敏症 病史症 专用 pipe
 */
export class VaccineSubclassPipe implements PipeTransform {
  vaccineSubClassData: any;

  constructor(private vscSvc: VaccineSubclassInitService) {
    this.vaccineSubClassData = this.vscSvc.getVaccineSubClassData();
  }

  transform(value: string): any {
    if (!value || value.trim() === '') {
      return;
    }
    value = value.substring(1, value.length - 1);
    value = value.replace(/\"/g, '');
    let arr = value.split(',');
    if (!this.vaccineSubClassData) {
      return;
    }
    let result = '';
    let count = 0;
    for (let i = 0; i < this.vaccineSubClassData.length; i++) {
      const vac = this.vaccineSubClassData[i];
      for (let j = 0; j < arr.length; j++) {
        const code = arr[j];
        if (code === vac['value']) {
          result += vac['label'] + ',';
          ++count;
        }
      }
      if (count === arr.length) break;
    }
    // console.log(result);
    if (result === '') return value;
    return result.substring(0, result.length - 1);
  }
}

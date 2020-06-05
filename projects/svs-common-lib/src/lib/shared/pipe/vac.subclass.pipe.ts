import { Pipe, PipeTransform } from '@angular/core';
import { VaccineSubclassInitService } from '../../service/vaccine.subclass.init.service';

@Pipe({
  name: 'vacSubclassPipe'
})

/**
 * 根据疫苗小类编码查询疫苗小类名称
 */
export class VacSubclassPipe implements PipeTransform {
  vacSubclassData: any;

  constructor(private vacSubclassSvc: VaccineSubclassInitService) {
    this.vacSubclassData = this.vacSubclassSvc.getVaccineSubClassData();
  }
  transform(value: string): any {
    if (!value || value.trim() === '') return;
    for (let i = 0; i < this.vacSubclassData.length; i++) {
      if (value === this.vacSubclassData[i]['value']) {
        return this.vacSubclassData[i]['label'];
      }
    }
    return value;
  }
}

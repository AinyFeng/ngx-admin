import { Pipe, PipeTransform } from '@angular/core';
import { VaccBroadHeadingDataService } from '../../service/vacc-broad-heading.data.service';

@Pipe({
  name: 'vacBroadHeadingPipe'
})
/**
 * 根据疫苗大类编码获取疫苗大类名称
 */
export class VacBroadHeadingPipe implements PipeTransform {
  vacBroadHeadingData: any;

  constructor(private vacBroadHeadingSvc: VaccBroadHeadingDataService) {
    this.vacBroadHeadingData = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
  }

  transform(value: string): any {
    if (!value || value.trim() === '') return;
    for (let i = 0; i < this.vacBroadHeadingData.length; i++) {
      if (value === this.vacBroadHeadingData[i]['broadHeadingCode']) {
        return this.vacBroadHeadingData[i]['broadHeadingFullName'];
      }
    }
    return value;
  }
}

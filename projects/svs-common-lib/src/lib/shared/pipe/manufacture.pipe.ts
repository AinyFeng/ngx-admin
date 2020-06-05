import { Pipe, PipeTransform } from '@angular/core';
import { VaccManufactureDataService } from '../../service/vacc-manufacture.data.service';

@Pipe({
  name: 'manufacturePipe',
  pure: true
})
export class ManufacturePipe implements PipeTransform {
  manufactureData: any;

  constructor(private manuSvc: VaccManufactureDataService) {
    this.manufactureData = this.manuSvc.getVaccProductManufactureData();
  }

  transform(value: string): any {
    if (!value || value.trim() === '') return '';
    for (let i = 0; i < this.manufactureData.length; i++) {
      if (value === this.manufactureData[i]['code']) {
        return this.manufactureData[i]['name'];
      }
    }
    return value;
  }
}

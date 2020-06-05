import { Pipe, PipeTransform } from '@angular/core';
import { NationDataInitService } from '../../service/nation.data.init.service';

@Pipe({
  name: 'nationPipe',
  pure: true
})
export class NationPipe implements PipeTransform {
  nationData = [];

  constructor(private nationSvc: NationDataInitService) {
    this.nationData = this.nationSvc.getNationData();
  }

  transform(value: string): any {
    if (!value || value.trim() === '') {
      return;
    }
    for (let i = 0; i < this.nationData.length; i++) {
      const item = this.nationData[i];
      if (value.trim() === item['code'].trim()) {
        return item['name'].trim();
      }
    }
  }
}

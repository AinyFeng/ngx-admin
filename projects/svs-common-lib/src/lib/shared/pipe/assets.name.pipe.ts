import {Pipe, PipeTransform} from '@angular/core';
import {FixedAssetsDataService} from '../../service/fixed-assets.data.service';

@Pipe({
  name: 'assetsNamePipe',
  pure: true
})
export class AssetsNamePipe implements PipeTransform {
  assetsData: any;

  constructor(private assetsSvc: FixedAssetsDataService) {
    this.assetsData = this.assetsSvc.getFixedAssetsData();
  }

  transform(value: string): any {
    if (!value || value.trim() === '') return '';
    for (let i = 0; i < this.assetsData.length; i++) {
      if (value === this.assetsData[i]['fixedAssetsCode']) {
        return this.assetsData[i]['fixedAssetsName'];
      }
    }
    return value;
  }
}

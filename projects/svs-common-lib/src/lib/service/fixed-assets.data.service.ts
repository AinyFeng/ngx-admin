import {Injectable} from '@angular/core';
import {LocalStorageService} from '@tod/ngx-webstorage';
import {LOCAL_STORAGE} from '../base/localStorage.base';

@Injectable()
export class FixedAssetsDataService {
  fixedAssets: any;

  constructor(private localSt: LocalStorageService) {
    const fixedAsset = this.localSt.retrieve(
      LOCAL_STORAGE.FIXED_ASSETS
    );
    if (fixedAsset !== null) {
      this.setFixedAssetsData(fixedAsset);
    }
  }

  setFixedAssetsData(data) {
    this.fixedAssets = data;
  }

  getFixedAssetsData() {
    return this.fixedAssets;
  }
}

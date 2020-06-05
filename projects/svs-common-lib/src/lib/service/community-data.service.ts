import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
export class CommunityDataService {
  private communityData = [];

  constructor(private localSt: LocalStorageService) {
    const communityData = this.localSt.retrieve(LOCAL_STORAGE.COMMUNITY_DATA);
    if (communityData !== null) {
      this.setCommunityData(communityData);
    }
  }

  setCommunityData(data: any) {
    if (data === null || !data) return;
    this.communityData = data;
  }

  getCommunityData() {
    return this.communityData;
  }
}

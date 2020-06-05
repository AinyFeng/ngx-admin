import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '@tod/uea-auth-lib';
import { CommunityBaseInfoService } from '../../api/master/community/community.service';
import { LOCAL_STORAGE } from '../../base/localStorage.base';

@Pipe({
  name: 'communityNamePipe'
})
/*
 * 根据community编码获取community名称
 * 先从localstorage中查找，如果有则不发请求
 * */
export class CommunityNamePipe implements PipeTransform {
  private userInfo;

  constructor(
    private localSt: LocalStorageService,
    private communitySvc: CommunityBaseInfoService,
    private userSvc: UserService
  ) {
    this.userSvc.getUserInfoByType().subscribe(resp => (this.userInfo = resp));
  }

  transform(value: any): any {
    if (!this.userInfo) return;
    const povCode = this.userInfo.pov;
    if (!value || value.trim() === '') return of('');
    const communityName = this.localSt.retrieve(
      LOCAL_STORAGE.COMMUNITY_DATA + povCode + value
    );
    if (communityName !== null) {
      return new Promise(resolve => {
        resolve(communityName);
      });
    }
    return this.queryName(value).pipe(
      map(x => {
        if (
          x.code === 0 &&
          x.hasOwnProperty('data') &&
          x['data'].length !== 0
        ) {
          this.localSt.store(
            LOCAL_STORAGE.COMMUNITY_DATA + value,
            x['data'][0]['communityName']
          );
          return x['data'][0]['communityName'];
        } else {
          this.localSt.store(LOCAL_STORAGE.COMMUNITY_DATA + povCode + value, value);
          return value;
        }
      })
    );
  }

  queryName(communityCode: string): Observable<any> {
    const query = {
      povCode: this.userInfo['pov'],
      communityCode: communityCode
    };
    return this.communitySvc.queryCommunityBaseInfoForPipe(query);
  }
}

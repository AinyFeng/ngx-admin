import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileService } from '../../api/profile/profile.service';

@Pipe({
  name: 'isHaveLocalProfilePipe'
})
/**
 * -1 = 系统没有数据，0 = 档案离册， 1 = 档案在册, 10 = 省平台删除
 */
export class IsHaveLocalProfilePipe implements PipeTransform {
  constructor(private profileService: ProfileService) { }
  transform(value: any, ...args: any[]): Observable<number> {
    if (!value || value.trim() === '') return of(-1);
    return this.getProfile(value).pipe(
      map(resp => {
        let status = -1;
        if (
          resp.code === 0 &&
          resp.hasOwnProperty('data') &&
          resp['data'].length !== 0
        ) {
          status = Number(resp.data[0].profileStatusCode);
        }
        // console.log('status====================', status);
        return status;
      })
    );
  }

  getProfile(profileCode: string): Observable<any> {
    const param = {
      profileCode: profileCode
    };
    return this.profileService.queryProfile2(param);
  }
}

import { OAuthService } from 'angular-oauth2-oidc';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import mappet from '../base/mappet';
import { profileSchema, UserProfile } from './uea.user.profile';

const mapper = mappet(profileSchema);

@Injectable({ providedIn: 'root' })
export class UserService {
  private userInfoSubject$ = new BehaviorSubject<Partial<UserProfile>>({});
  public userInfo$ = this.userInfoSubject$.asObservable();
  constructor(private oauthService: OAuthService) {

    const userProfile = this.oauthService.getIdentityClaims();
    // console.log('user.service.constructor-------userProfile--%o', userProfile);
    const userInfo = this.convert(userProfile);
    // this.userInfoSubject$.next(userInfo);
    this.userInfoSubject$.next({
      'name': '妲护士',
      'userCode': '54831456448',
      'department': '98277245155541270',
      'pov': '3406040802',
      'status': '在线'
    });
  }

  public convert(obj: any): Partial<UserProfile> {
    const res = mapper<UserProfile>(obj);
    return res;
  }

  getUserInfoByType() {
    return this.userInfo$;
  }
}

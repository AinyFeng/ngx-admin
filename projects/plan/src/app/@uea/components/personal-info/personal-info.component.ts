import { UserService } from '@tod/uea-auth-lib';
import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'uea-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent {
  profile: any;
  constructor(private userService: UserService) {
    this.profile = this.userService.userInfo$;
  }
}

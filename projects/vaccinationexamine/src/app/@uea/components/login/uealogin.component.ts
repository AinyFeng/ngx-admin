import { Component, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-login-component',
  templateUrl: './uealogin.component.html',
  styleUrls: ['./uealogin.component.scss']
})
export class UeaLoginComponent {
  loginFailed: boolean = false;
  userProfile: object;

  isPwdLogin = true;
  loginForm: FormGroup;
  rememberMe: boolean = false;

  constructor(
    private authService: AuthService,
    protected cd: ChangeDetectorRef,
    protected router: Router
  ) { }

  login() {
    this.authService.login();
  }
}

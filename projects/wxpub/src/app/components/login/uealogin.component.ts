import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@tod/uea-auth-lib';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'uea-login-component',
  templateUrl: './uealogin.component.html',
  styleUrls: ['./uealogin.component.less']
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
    protected router: Router,
    private fb: FormBuilder
  ) {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      console.log('登录状态', isAuthenticated);
      if (isAuthenticated) {
        console.log(1, this.authService);
        this.router.navigateByUrl('/wxpub/wxhome');
      }
    });

    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      rememberMe: [false]
    });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}

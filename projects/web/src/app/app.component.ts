import { AppStateService } from './@uea/service/app.state.service';
import { OnInit } from '@angular/core';
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@tod/uea-auth-lib';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'uea-app',
  template: `
    <router-outlet></router-outlet>
    <notifier-container></notifier-container>
  `
})
export class AppComponent implements OnInit {

  isAuthenticated: Observable<boolean>;
  isDoneLoading: Observable<boolean>;
  canActivateProtectedRoutes: Observable<boolean>;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private appStateService: AppStateService,
    private authService: AuthService
  ) {
    this.authService.runInitialLoginSequence();
  }

  elem;

  ngOnInit() {

    this.elem = document.documentElement;
    this.appStateService.getFullScreen().subscribe(
      (tryExpandFull) => {
        if (!tryExpandFull) {
          this.openFullscreen();
        } else {
          this.closeFullscreen();
        }
      }
    );
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }
}

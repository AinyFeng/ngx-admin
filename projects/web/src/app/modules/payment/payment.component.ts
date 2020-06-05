import { AppStateService } from './../../@uea/service/app.state.service';
/**
 * Created by Administrator on 2019/5/20.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'uea-payment-manage',
  template: `
    <router-outlet></router-outlet>
  `
})
export class PaymentComponent implements OnInit, OnDestroy {
  constructor(
    private appStateService: AppStateService,
    iconLibraries: NbIconLibraries) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconLibraries.setDefaultPack('fas');
  }

  ngOnInit(): void {
    this.appStateService.setSubTitle('收银台');
  }

  ngOnDestroy() {
    this.appStateService.clearSubTitle();
  }
}

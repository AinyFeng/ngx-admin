import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { AppStateService } from '../../@uea/service/app.state.service';
@Component({
  selector: 'mds-print-frame-component',
  template: '<router-outlet></router-outlet>'
})
export class PrintFrameComponent implements OnInit, OnDestroy {
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

  ngOnInit() {
    this.appStateService.setSubTitle('打印中心');
  }

  ngOnDestroy() {
    this.appStateService.clearSubTitle();
  }
}

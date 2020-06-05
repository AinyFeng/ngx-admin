import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { AppStateService } from '../../@uea/service/app.state.service';

@Component({
  selector: 'mds-administration',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit, OnDestroy {
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
    this.appStateService.setSubTitle('日常管理');
  }

  ngOnDestroy() {
    this.appStateService.clearSubTitle();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { AppStateService } from '../../@uea/service/app.state.service';
@Component({
  selector: 'mds-report-component',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {
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
    this.appStateService.setSubTitle('统计与报表');
  }

  ngOnDestroy() {
    this.appStateService.clearSubTitle();
  }
}

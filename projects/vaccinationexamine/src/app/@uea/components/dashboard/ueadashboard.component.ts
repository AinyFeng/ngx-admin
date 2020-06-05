import { AppStateService } from './../../service/app.state.service';
import { NbIconLibraries } from '@nebular/theme';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  UeaDashboardOptions,
  UEA_DASHBOARD_OPTIONS,
  defaultDashboardOptions
} from './uea.options';

@Component({
  selector: 'uea-dashboard',
  styleUrls: ['./ueadashboard.component.scss'],
  templateUrl: './ueadashboard.component.html'
})
export class UeaDashboardComponent implements OnInit, OnDestroy {
  private localoptions: UeaDashboardOptions;

  constructor(
    private appStateService: AppStateService,
    iconLibraries: NbIconLibraries,
    @Inject(UEA_DASHBOARD_OPTIONS)
    private config: UeaDashboardOptions = defaultDashboardOptions
  ) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconLibraries.setDefaultPack('fas');
    this.localoptions = config;
  }

  getCards() {
    return this.localoptions.cards
      .filter(card => !card.hidden)
      .filter(card => !card.group);
  }

  ngOnInit() {
    // console.log('this.localoptions--------%s', JSON.stringify(this.localoptions));
    this.appStateService.setSubTitle(this.localoptions.title);
  }

  ngOnDestroy() {
    this.appStateService.clearSubTitle();
  }
}

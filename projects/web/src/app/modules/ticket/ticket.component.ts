import { style } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { AppStateService } from '../../@uea/service/app.state.service';

@Component({
  selector: 'mds-ticket-component',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit, OnDestroy {
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
    this.appStateService.setSubTitle('自助取号');
  }

  ngOnDestroy() {
    this.appStateService.clearSubTitle();
  }
}

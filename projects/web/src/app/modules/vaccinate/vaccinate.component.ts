import {AppStateService} from '../../@uea/service/app.state.service';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {NbIconLibraries} from '@nebular/theme';
import {VaccinatePlatformService} from './components/vaccinate-platform-new/vaccinate-platform.service';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'uea-vaccinate-management',
  template: `
      <router-outlet></router-outlet>
  `,
  styleUrls: ['./vaccinate.component.scss']
})
export class VaccinateComponent implements OnInit, OnDestroy {
  constructor(private modalService: NzModalService,
              private appStateService: AppStateService,
              private platformService: VaccinatePlatformService,
              iconLibraries: NbIconLibraries) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', {iconClassPrefix: 'ion'});
    iconLibraries.setDefaultPack('fas');
  }

  ngOnInit() {
    this.appStateService.setSubTitle('接种台');
  }

  ngOnDestroy() {
    this.appStateService.clearSubTitle();
    this.modalService.closeAll();
    this.platformService.reset();
  }
}

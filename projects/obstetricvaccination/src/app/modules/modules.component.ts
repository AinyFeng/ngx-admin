import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { MODULE_MENU_ITEMS } from './modules-menu';
import { NbIconLibraries } from '@nebular/theme';

import { StartupService } from '@tod/svs-common-lib';

@Component({
  selector: 'app-modules-component',
  styleUrls: ['modules.component.scss'],
  template: `
    <uea-page-portal [showSidebar]="false">
      <router-outlet></router-outlet>
    </uea-page-portal>
  `,
})
export class ModulesComponent implements OnInit {
  menuItems = MODULE_MENU_ITEMS;

  constructor(
    private localSt: LocalStorageService,
    private iconLibraries: NbIconLibraries,
    private startupSvc: StartupService
  ) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    this.iconLibraries.setDefaultPack('fas');
  }

  ngOnInit(): void {
    this.startupSvc.start();
  }
}

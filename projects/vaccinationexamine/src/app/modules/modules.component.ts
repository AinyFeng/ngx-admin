import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { NbIconLibraries, NbMenuItem } from '@nebular/theme';
import { LOCAL_STORAGE } from '@tod/svs-common-lib';
import { MODULES_MENU_ITEMS } from './modules-menu';

@Component({
  selector: 'mds-modules-component',
  styleUrls: ['modules.component.scss'],
  template: `
    <uea-page-portal [sidemenus]="menuItems">
      <router-outlet></router-outlet>
    </uea-page-portal>
  `
})
export class ModulesComponent implements OnInit {

  menuItems: NbMenuItem[] = MODULES_MENU_ITEMS;

  constructor(
    private localSt: LocalStorageService,
    private iconLibraries: NbIconLibraries
  ) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    this.iconLibraries.setDefaultPack('fas');

    this.localSt.store(LOCAL_STORAGE.SYSTEM_NOTICE, false);
  }

  ngOnInit(): void {
    // this.startSvc.start();
  }
}

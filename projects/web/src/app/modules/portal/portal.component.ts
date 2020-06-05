import { Component } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'mds-portal-component',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent {
  constructor(iconLibraries: NbIconLibraries) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconLibraries.setDefaultPack('fas');
  }
}

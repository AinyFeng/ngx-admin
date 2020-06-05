import { Component } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { Router } from '@angular/router';
@Component({
  selector: 'uea-not-found-component',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {
  constructor(private router: Router, iconLibraries: NbIconLibraries) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconLibraries.setDefaultPack('fas');
  }

  goToHome() {
    this.router.navigateByUrl('/modules/dashboard');
  }
}

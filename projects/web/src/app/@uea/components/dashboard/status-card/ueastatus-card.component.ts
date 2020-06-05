import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NB_WINDOW, NbIconLibraries } from '@nebular/theme';
import { CardSettings } from '../uea.options';

@Component({
  selector: 'uea-status-card',
  styleUrls: ['./ueastatus-card.component.scss'],
  templateUrl: './ueastatus-card.component.html'
})
export class UeaStatusCardComponent {
  @Input() card: CardSettings;

  private thiswindow: any;

  constructor(
    private router: Router,
    @Inject(NB_WINDOW) window,
    private iconLibraries: NbIconLibraries
  ) {
    this.thiswindow = window;

    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    this.iconLibraries.setDefaultPack('fas');
  }

  doClick() {
    if (this.card.on) {
      if (this.card.link) {
        this.router.navigate([this.card.link]);
      } else if (this.card.url) {
        this.thiswindow.open(this.card.url, '_blank');
      }
    }
  }
}

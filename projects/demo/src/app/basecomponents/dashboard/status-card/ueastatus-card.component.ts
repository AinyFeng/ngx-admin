import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
// import { NB_WINDOW, NbIconLibraries } from '@nebular/theme';
import { CardSettings } from '../uea.options';

@Component({
  selector: 'uea-status-card',
  styleUrls: ['./ueastatus-card.component.scss'],
  templateUrl: './ueastatus-card.component.html'
})
export class UeaStatusCardComponent {
  @Input() card: CardSettings;

  constructor(private router: Router) {
  }

  doClick() {
    if (this.card.on) {
      if (this.card.link) {
        this.router.navigate([this.card.link]);
      } else if (this.card.url) {
        // this.thiswindow.open(this.card.url, '_blank');
        window.open(this.card.url, '_blank');
      }
    }
  }
}

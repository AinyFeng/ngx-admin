import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuItem, NbIconLibraries } from '@nebular/theme';
import { AppStateService } from '../../service/app.state.service';

@Component({
  selector: 'uea-page-portal',
  templateUrl: './page-portal.component.html',
  // styleUrls: ['./page-portal.component.scss']
})
export class PagePortalComponent implements OnInit {
  @Input() sidemenus: NbMenuItem[] = [];
  @Input() showHeadFoot = true;
  @Input() showSidebar = true;

  constructor(
    // private router: Router,
    // private appStateService: AppStateService,
    iconLibraries: NbIconLibraries
  ) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconLibraries.setDefaultPack('fas');

    // this.appStateService.getFullScreen().subscribe(display => {
    //   // this.showHeadFoot = !display;
    // });
  }

  ngOnInit() { }
}

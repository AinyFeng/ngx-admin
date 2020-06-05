import { Component, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'uea-tools-component',
  template: `
    <uea-page-portal [showSidebar]="false">
      <router-outlet></router-outlet>
    </uea-page-portal>
  `,
})
export class ToolsPortalComponent {
  menuItems = [];
}

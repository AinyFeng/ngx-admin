import { NgModule } from '@angular/core';
import { NZ_ICONS } from 'ng-zorro-antd';

// import {
//   MenuFoldOutline,
//   MenuUnfoldOutline,
//   FormOutline,
//   DashboardOutline
// } from '@ant-design/icons-angular/icons';

// const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline];

import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
const antDesignIcons = AllIcons as { [key: string]: IconDefinition; };
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);




@NgModule({
  providers: [
    { provide: NZ_ICONS, useValue: icons }
  ]
})
export class IconsProviderModule {
}

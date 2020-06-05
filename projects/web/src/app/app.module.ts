/**
 * @license
 * Copyright TOD. All Rights Reserved.
 * Licensed under the Commercial License. See License.txt in the project root for license information.
 */

import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbDatepickerModule,
  NbDialogModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { NgZorroAntdModule, NzNotificationModule, NZ_ICON_DEFAULT_TWOTONE_COLOR, NZ_ICONS } from 'ng-zorro-antd';
import { NgxWebstorageModule } from '@tod/ngx-webstorage';
import { environment } from '../environments/environment';
import { UeaModule } from './@uea/uea.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UeaAuthModule } from '@tod/uea-auth-lib';
import { ThemeModule } from './@uea/theme/theme.module';
import { UeaDashboardModule } from './@uea/components/dashboard/ueadashboard.module';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

const antDesignIcons = AllIcons as { [key: string]: IconDefinition; };
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

const APQLink = createPersistedQueryLink().concat(
  createHttpLink({ uri: 'http://localhost:4000/graphql' })
);
export function APOLLO_OPTIONS_FACTORY() {
  return {
    cache: new InMemoryCache(),
    link: APQLink
  };
}


/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'middle',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 200,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 3000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: false,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

const APP_IMPORTS = [
  BrowserAnimationsModule,
  FormsModule,
  HttpClientModule,
  AppRoutingModule,
  NgbModule,
  UeaModule,
  UeaDashboardModule.forRoot(),
  UeaAuthModule.forRoot(),

  ApolloModule,
  HttpLinkModule,

  NbEvaIconsModule,
  FontAwesomeModule,
  NbSidebarModule.forRoot(),
  NbMenuModule.forRoot(),
  NbDatepickerModule.forRoot(),
  NbWindowModule.forRoot(),
  NbDialogModule.forRoot(),
  NbToastrModule.forRoot(),
  NgZorroAntdModule,
  NbLayoutModule,
  ThemeModule.forRoot(),
  NgxWebstorageModule.forRoot({ prefix: 'svs', separator: '.', caseSensitive: true }),
  NzNotificationModule,

  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: environment.production
  }),
  NotifierModule.withConfig(customNotifierOptions)
];

const APP_PROVIDERS = [
  { provide: LOCALE_ID, useValue: 'zh-CN' },
  { provide: LocationStrategy, useClass: PathLocationStrategy },
  {
    provide: APOLLO_OPTIONS,
    useFactory: APOLLO_OPTIONS_FACTORY,
    deps: [HttpLink]
  },
  // { provide: NZ_ICON_DEFAULT_TWOTONE_COLOR, useValue: '#00ff00' }, // 不提供的话，即为 Ant Design 的主题蓝色
  { provide: NZ_ICONS, useValue: icons }
];


@NgModule({
  declarations: [AppComponent],
  entryComponents: [AppComponent],
  imports: [...APP_IMPORTS],
  bootstrap: [AppComponent],
  providers: [...APP_PROVIDERS]
})
export class AppModule { }

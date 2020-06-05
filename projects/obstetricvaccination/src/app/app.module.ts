import { UeaDashboardModule } from './@uea/components/dashboard/ueadashboard.module';
/**
 * @license
 * Copyright TOD. All Rights Reserved.
 * Licensed under the Commercial License. See License.txt in the project root for license information.
 */

import { LocationStrategy, PathLocationStrategy, APP_BASE_HREF } from '@angular/common';
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
import { NgZorroAntdModule, NzNotificationModule } from 'ng-zorro-antd';
import { NgxWebstorageModule } from '@tod/ngx-webstorage';
import { environment } from '../environments/environment';
import { UeaModule } from './@uea/uea.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UeaAuthModule } from '@tod/uea-auth-lib';
import { ThemeModule } from './@uea/theme/theme.module';
import { NotifierModule } from 'angular-notifier';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);

const APQLink = createPersistedQueryLink().concat(
  createHttpLink({ uri: 'http://localhost:4000/graphql' })
);

export function APOLLO_OPTIONS_FACTORY() {
  return {
    cache: new InMemoryCache(),
    link: APQLink
  };
}

const APP_IMPORTS = [
  BrowserAnimationsModule,
  FormsModule,
  HttpClientModule,
  AppRoutingModule,
  NgbModule,
  UeaModule,
  UeaAuthModule.forRoot(),
  UeaDashboardModule.forRoot(),

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
  NotifierModule.withConfig({
    behaviour: {
      autoHide: 3000
    },
    position: {
      horizontal: {
        position: 'middle',
      },
      vertical: {
        distance: 400,
        position: 'top'
      }
    },
    animations: {
      show: {
        preset: 'fade'
      }
    }
  })
];

const APP_PROVIDERS = [
  { provide: APP_BASE_HREF, useValue: '/pov/obstetric/' },
  { provide: LOCALE_ID, useValue: 'zh-CN' },
  { provide: LocationStrategy, useClass: PathLocationStrategy },
  {
    provide: APOLLO_OPTIONS,
    useFactory: APOLLO_OPTIONS_FACTORY,
    deps: [HttpLink]
  }
];

@NgModule({
  declarations: [AppComponent],
  entryComponents: [AppComponent],
  imports: [...APP_IMPORTS, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  bootstrap: [AppComponent],
  providers: [...APP_PROVIDERS]
})
export class AppModule {
}

import { appDashboardOptions } from './app.dashboard';
import { HttpClientModule } from '@angular/common/http';
import { UeaAuthModule } from '@tod/uea-auth-lib';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FrameComponent } from './components/frame/frame.component';
import { WeblistComponent } from './components/weblist/weblist.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { UeaDashboardModule } from './basecomponents/dashboard/ueadashboard.module';


// import { IconDefinition } from '@ant-design/icons-angular';
// import * as AllIcons from '@ant-design/icons-angular/icons';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import zh from '@angular/common/locales/zh';
import { IconsProviderModule } from './icons-provider.module';
registerLocaleData(zh);

// const antDesignIcons = AllIcons as { [key: string]: IconDefinition; };
// const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

@NgModule({
  declarations: [
    AppComponent,
    FrameComponent,
    WeblistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    UeaAuthModule.forRoot(),
    NzDividerModule,
    UeaDashboardModule.forRoot(appDashboardOptions),
    IconsProviderModule,
    BrowserAnimationsModule,
    /** 导入 ng-zorro-antd 模块 **/
    NgZorroAntdModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/incubation/demo/' },
    { provide: NZ_I18N, useValue: zh_CN },
    // { provide: NZ_ICONS, useValue: icons }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignaturePadModule } from 'angular2-signaturepad';
import { AddArchivesComponent } from './components/add-archives/add-archives.component';
import { AddInjectFeedbackComponent } from './components/add-inject-feedback/add-inject-feedback.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentSignComponent } from './components/appointment-sign/appointment-sign.component';
import { ArchivesListComponent } from './components/archives-list/archives-list.component';
import { AssociaChildComponent } from './components/associa-child/associa-child.component';
import { ChangeAppointmentComponent } from './components/change-appointment/change-appointment.component';
import { InjectFeedbackListComponent } from './components/inject-feedback-list/inject-feedback-list.component';
import { KnowledgeDetailComponent } from './components/knowledge-detail/knowledge-detail.component';
import { KnowledgeComponent } from './components/knowledge/knowledge.component';
import { MyAttentionComponent } from './components/my-attention/my-attention.component';
import { WxOauthComponent } from './components/wx-oauth/wx-oauth.component';
import { WxHomeComponent } from './components/wxhome/wx.home.component';
import { WxComponent } from './wx.component';
import { WxRoutingModule } from './wx-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import {NbToastrModule, NbThemeModule} from '@nebular/theme';
import { UeaAuthModule } from '@tod/uea-auth-lib';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AdministrativeService } from '@tod/svs-common-lib';
import {NzAddOnModule, NzMessageService, NzNotificationModule} from 'ng-zorro-antd';
// import {NgxWebstorageModule} from '@tod/ngx-webstorage';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { UeaLoginComponent } from './components/login/uealogin.component';
import {UeaAuthComponent} from './components/layout/ueaauth.component';
// ngx-weui
import { WeUiModule, PickerModule } from 'ngx-weui';
import { SignatureComponent } from './components/signature/signature.component';
// import { DataPickerComponent } from 'ng-data-picker';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { ArchiveDetailComponent } from './components/archive-detail/archive-detail.component';

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
    autoHide: 1000,
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

@NgModule({
  declarations: [
    WxComponent,
    UeaAuthComponent,
    UeaLoginComponent,
    AssociaChildComponent,
    AddArchivesComponent,
    AppointmentListComponent,
    AppointmentSignComponent,
    WxHomeComponent,
    ChangeAppointmentComponent,
    InjectFeedbackListComponent,
    AddInjectFeedbackComponent,
    MyAttentionComponent,
    WxOauthComponent,
    ArchivesListComponent,
    KnowledgeComponent,
    KnowledgeDetailComponent,
    SignatureComponent,
    ArchiveDetailComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    WxRoutingModule,

    WeUiModule,
    PickerModule,
    UeaAuthModule.forRoot(),
    // NbThemeModule.forRoot(),
    // NbToastrModule.forRoot(),
    // NgxWebstorageModule.forRoot(),
    // NgZorroAntdMobileModule.forRoot(),
    // NgZorroAntdModule,
    /** 导入 ng-zorro-antd 模块 **/
    NgZorroAntdModule,
    SignaturePadModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NzAddOnModule,
    NzNotificationModule,
    NotifierModule.withConfig(customNotifierOptions)

  ],
  bootstrap: [WxComponent],
  entryComponents: [WxComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/wxpub/' },
    HttpClient,
    NzMessageService,
    // AdministrativeService
  ]

})
export class WxModule {
}

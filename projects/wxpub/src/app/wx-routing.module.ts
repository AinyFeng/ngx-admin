import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

import { AddArchivesComponent } from './components/add-archives/add-archives.component';
import { AddInjectFeedbackComponent } from './components/add-inject-feedback/add-inject-feedback.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentSignComponent } from './components/appointment-sign/appointment-sign.component';
import { ArchivesListComponent } from './components/archives-list/archives-list.component';
import { ArchiveDetailComponent } from './components/archive-detail/archive-detail.component';
import { AssociaChildComponent } from './components/associa-child/associa-child.component';
import { ChangeAppointmentComponent } from './components/change-appointment/change-appointment.component';
import { InjectFeedbackListComponent } from './components/inject-feedback-list/inject-feedback-list.component';
import { KnowledgeDetailComponent } from './components/knowledge-detail/knowledge-detail.component';
import { KnowledgeComponent } from './components/knowledge/knowledge.component';
import { MyAttentionComponent } from './components/my-attention/my-attention.component';
import { WxOauthComponent } from './components/wx-oauth/wx-oauth.component';
import { WxComponent } from './wx.component';
import { WxHomeComponent } from './components/wxhome/wx.home.component';
import { UeaAuthComponent } from './components/layout/ueaauth.component';
import { UeaLoginComponent } from './components/login/uealogin.component';
import { UeaAuthGuardService } from '@tod/uea-auth-lib';

const routes: Routes = [
  {
    path: 'auth',
    component: UeaAuthComponent,
    children: [
      { path: 'login', component: UeaLoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    canActivate: [UeaAuthGuardService],
    component: WxComponent,
    children: [
      {
        path: 'wxHome',
        component: WxHomeComponent
      },
      {
        path: 'wxOauth',
        component: WxOauthComponent
      },
      {
        path: 'myAttention',
        component: MyAttentionComponent
      },
      {
        path: 'associaChild',
        component: AssociaChildComponent
      },
      {
        path: 'addArchives',
        component: AddArchivesComponent
      },
      {
        path: 'archivesList',
        component: ArchivesListComponent
      },
      {
        path: 'archiveDetail/:archive',
        component: ArchiveDetailComponent
      },
      {
        path: 'appointmentList',
        component: AppointmentListComponent
      },
      {
        path: 'appointmentSign/:appoint',
        component: AppointmentSignComponent
      },
      {
        path: 'changeAppointment/:appoint',
        component: ChangeAppointmentComponent
      },
      {
        path: 'injectFeedbackList',
        component: InjectFeedbackListComponent
      },
      {
        path: 'addInjectFeedback',
        component: AddInjectFeedbackComponent
      },
      {
        path: 'knowledgeComponent',
        component: KnowledgeComponent
      },
      {
        path: 'knowledgeDetail/:detail',
        component: KnowledgeDetailComponent
      },
      {
        path: '',
        redirectTo: 'wxHome', pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'wxHome', pathMatch: 'full',
      }
    ]
    // loadChildren: './wx.module#WxModule'
  },
  { path: '', redirectTo: 'wxpub', pathMatch: 'full' }
];

const config: ExtraOptions = {
  useHash: false,
  // initialNavigation: 'disabled'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class WxRoutingModule {
}

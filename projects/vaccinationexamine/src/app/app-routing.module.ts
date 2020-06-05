import { PersonalInfoComponent } from './@uea/components/personal-info/personal-info.component';
import { NotFoundComponent } from './@uea/components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { UeaAuthComponent } from './@uea/components/layout/ueaauth.component';
import { UeaLoginComponent } from './@uea/components/login/uealogin.component';
import { UeaAuthGuardService } from '@tod/uea-auth-lib';
import { ToolsPortalComponent } from './@uea/components/portal/tools-portal.component';
import { NoticeComponent } from './modules/components/notice/notice.component';

const routes: Routes = [
  {
    path: 'modules',
    canActivate: [UeaAuthGuardService],
    loadChildren: () => import('./modules/modules.module').then(mod => mod.ModulesModule)
  },
  {
    path: 'tools',
    canActivate: [UeaAuthGuardService],
    component: ToolsPortalComponent,
    children: [
      {
        path: 'personalInfo',
        component: PersonalInfoComponent
      },
      {
        path: 'notice',
        component: NoticeComponent
      },
    ]
  },
  {
    path: 'auth',
    component: UeaAuthComponent,
    children: [
      { path: 'login', component: UeaLoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'modules', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

const config: ExtraOptions = {
  useHash: false
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

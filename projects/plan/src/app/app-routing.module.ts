import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { UeaAuthGuardService } from '@tod/uea-auth-lib';
import { UeaAuthComponent } from './@uea/components/layout/ueaauth.component';
import { UeaLoginComponent } from './@uea/components/login/uealogin.component';


const routes: Routes = [
  {
    path: 'modules',
    canActivate: [UeaAuthGuardService],
    loadChildren: () => import('./modules/modules.module').then(mod => mod.ModulesModule)
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
  { path: '**', redirectTo: 'modules' }
];

const config: ExtraOptions = {
  useHash: false
};
@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UeaDashboardComponent } from '../@uea/components/dashboard/ueadashboard.component';
import { ModulesComponent } from './modules.component';
import { NoticeComponent } from './components/notice/notice.component';
import { PersonalInfoComponent } from '../@uea/components/personal-info/personal-info.component';

/**
 * routes 编写这个routes 是有加载顺序的，redirectTo 要放在最后面
 */
const routes: Routes = [
  {
    path: '',
    component: ModulesComponent,
    children: [
      {
        path: 'dashboard',
        component: UeaDashboardComponent
      },
      {
        path: 'personalInfo',
        component: PersonalInfoComponent
      },
      {
        path: 'notice',
        component: NoticeComponent
      },
      {
        path: 'vaccexamine',
        loadChildren: () => import('./vaccinationexamine/vaccexamine.module').then(m => m.VaccExamineModule),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from '../@uea/components/not-found/not-found.component';
import { ModulesComponent } from './modules.component';
import { NoticeComponent } from './components/notice/notice.component';

/**
 * routes 编写这个routes 是有加载顺序的，path: '**' 要放在最后面
 */
const routes: Routes = [
  {
    path: '',
    component: ModulesComponent,
    children: [
      {
        path: 'vaccinate',
        loadChildren: () => import('./vaccinate/vaccinate.module').then(mod => mod.VaccinateModule)
      },
      { path: '', redirectTo: 'vaccinate', pathMatch: 'full' },
      // { path: '**', redirectTo: 'vaccinate', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule {
}

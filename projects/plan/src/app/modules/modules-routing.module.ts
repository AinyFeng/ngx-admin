import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from '../@uea/components/not-found/not-found.component';
import { ModulesComponent } from './modules.component';

/**
 * routes 编写这个routes 是有加载顺序的，redirectTo 要放在最后面
 */
const routes: Routes = [
  {
    path: '',
    component: ModulesComponent,
    children: [
      {
        path: 'plan',
        children: [
          { path: 'config', loadChildren: () => import('./plan-config/plan-config.module').then(mod => mod.PlanConfigModule), },
          { path: 'typeOne', loadChildren: () => import('./type-one/type-one.module').then(mod => mod.TypeOneModule), },
          { path: 'typeTwo', loadChildren: () => import('./type-two/type-two.module').then(mod => mod.TypeTwoModule), },
          { path: '', redirectTo: 'config', pathMatch: 'full' },
        ]
      },
      {
        path: 'portal',
        // loadChildren: './portal/portal.module#PortalModule'
        loadChildren: () => import('./portal/portal.module').then(m => m.PortalModule),
      },
      { path: '', redirectTo: 'plan', pathMatch: 'full' },
      { path: 'dashboard', redirectTo: 'plan', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule {
}

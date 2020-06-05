import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PlanConfigComponent} from './plan-config.component';

/**
 * routes 编写这个routes 是有加载顺序的，redirectTo 要放在最后面
 */
const routes: Routes = [
  {
    path: '',
    component: PlanConfigComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanConfigRoutingModule {
}

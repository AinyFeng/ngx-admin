import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from '../@uea/components/not-found/not-found.component';
import { ModulesComponent } from './modules.component';

/**
 * routes 编写这个routes 是有加载顺序的，path: '**' 要放在最后面
 */
const routes: Routes = [
  {
    path: '',
    component: ModulesComponent,
    children: [
      {
        path: 'stockapplication',
        loadChildren: './stock-application/stock-application.module#StockApplicationModule'
      },
      {
        path: 'stockapproval',
        loadChildren: './stock-approval/stock-approval.module#StockApprovalModule'
      },
      {
        path: 'stockcheck',
        loadChildren: './stock-check/stock-check.module#StockCheckModule'
      },
      {
        path: 'stockquerystatistics',
        loadChildren: './stock-query-statistics/stock-query-statistics.module#StockQueryStatisticsModule'
      },
      {
        path: 'stockorder',
        loadChildren: './stock-order/stock-order.module#StockOrderModule'
      },
      { path: '', redirectTo: 'stockapplication', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }

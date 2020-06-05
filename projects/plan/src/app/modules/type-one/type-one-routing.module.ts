import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TypeOneComponent} from './type-one.component';
import {TypeOneYearlyListComponent} from './type-one-yearly/type-one-yearly-list/type-one-yearly-list.component';
import {TypeOneYearlyFillInComponent} from './type-one-yearly/type-one-yearly-fill-in/type-one-yearly-fill-in.component';
import {TypeOneYearlyAuditComponent} from './type-one-yearly/type-one-yearly-audit/type-one-yearly-audit.component';
import {TypeOneSummaryComponent} from './type-one-summary/type-one-summary.component';
import {TypeOneMonthlyListComponent} from './type-one-monthly/type-one-monthly-list/type-one-monthly-list.component';
import {TypeOneMonthlyAuditComponent} from './type-one-monthly/type-one-monthly-audit/type-one-monthly-audit.component';

/**
 * routes 编写这个routes 是有加载顺序的，redirectTo 要放在最后面
 */
const routes: Routes = [
  {
    path: '',
    component: TypeOneComponent,
    children: [
      {
        path: 'yearly', children: [
          {path: 'list', component: TypeOneYearlyListComponent},
          {path: 'fillIn', component: TypeOneYearlyFillInComponent},
          {path: 'audit', component: TypeOneYearlyAuditComponent},
        ]
      },
      {
        path: 'monthly', children: [
          {path: 'list', component: TypeOneMonthlyListComponent},
          {path: 'audit', component: TypeOneMonthlyAuditComponent},
        ]
      },
      {
        path: 'summary', component: TypeOneSummaryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeOneRoutingModule {
}

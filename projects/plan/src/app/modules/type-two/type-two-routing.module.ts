import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {TypeTwoComponent} from './type-two.component';
import {TypeTwoYearlyListComponent} from './type-two-yearly/type-two-yearly-list/type-two-yearly-list.component';
import {TypeTwoYearlyFillInComponent} from './type-two-yearly/type-two-yearly-fill-in/type-two-yearly-fill-in.component';
import {TypeTwoYearlyAuditComponent} from './type-two-yearly/type-two-yearly-audit/type-two-yearly-audit.component';
import {TypeTwoMonthlyListComponent} from './type-two-monthly/type-two-monthly-list/type-two-monthly-list.component';
import {TypeTwoMonthlyAuditComponent} from './type-two-monthly/type-two-monthly-audit/type-two-monthly-audit.component';
import {TypeTwoSummaryComponent} from './type-two-summary/type-two-summary.component';


/**
 * routes 编写这个routes 是有加载顺序的，redirectTo 要放在最后面
 */
const routes: Routes = [
  {
    path: '',
    component: TypeTwoComponent,
    children: [
      {
        path: 'quarterly', children: [
          {path: 'list', component: TypeTwoYearlyListComponent},
          {path: 'fillIn', component: TypeTwoYearlyFillInComponent},
          {path: 'audit', component: TypeTwoYearlyAuditComponent},
        ]
      },
      {
        path: 'monthly', children: [
          {path: 'list', component: TypeTwoMonthlyListComponent},
          {path: 'audit', component: TypeTwoMonthlyAuditComponent},
        ]
      },
      {
        path: 'summary', component: TypeTwoSummaryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeTwoRoutingModule {
}

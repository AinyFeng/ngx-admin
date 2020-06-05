import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../../@uea/components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { StockCheckComponent } from './stock-check.component';
import { InventoryCheckComponent } from './components/inventory-check/inventory-check.component';
import { InOutReportComponent } from './components/in-out-report/in-out-report.component';
import { InventoryCheckRecordListComponent } from './components/inventory-check-record-list/inventory-check-record-list.component';
import { PriceAdjustmentComponent } from './components/price-adjustment/price-adjustment.component';
import { CheckPlanComponent } from './components/check-plan/check-plan.component';
import { CheckPlanDetailComponent } from './components/check-plan-detail/check-plan-detail.component';

const routes: Routes = [
  {
    path: '',
    component: StockCheckComponent,
    children: [
      {
        path: 'check',
        component: InventoryCheckComponent
      },
      {
        path: 'checkrecordlist',
        component: InventoryCheckRecordListComponent
      },
      {
        path: 'inoutreport',
        component: InOutReportComponent
      },
      {
        path: 'priceAdjustment',
        component: PriceAdjustmentComponent
      },
      {
        path: 'checkPlan',
        component: CheckPlanComponent
      },

      { path: '', redirectTo: 'check', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockCheckRoutingModule {
}

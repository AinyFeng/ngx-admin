/**
 * Created by Administrator on 2019/5/20.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentPlatformComponent } from './components/payment-platform/payment-platform.component';
import { ReportStatisticsComponent } from './components/report-statistics/report-statistics.component';
import { PaymentComponent } from './payment.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
    children: [
      { path: 'payment-platform', component: PaymentPlatformComponent },
      { path: 'report-statistics', component: ReportStatisticsComponent },
      { path: '', redirectTo: 'payment-platform', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }

import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from '../../@uea/components/not-found/not-found.component';
import {NgModule} from '@angular/core';
import {StockQueryStatisticsComponent} from './stock-query-statistics.component';
import {VaccInboundOutboundDetailsComponent} from './components/vacc-inbound-outbound-details/vacc-inbound-outbound-details.component';
import {AreaInOutDetailComponent} from './components/area-in-out-detail/area-in-out-detail.component';
import {VacInOutFlowComponent} from './components/vac-in-out-flow/vac-in-out-flow.component';
import {VaccineStatusEnquiryComponent} from './components/vaccine-status-enquiry/vaccine-status-enquiry.component';
import {AreaInOutStatisticsComponent} from './components/area-in-out-statistics/area-in-out-statistics.component';
import {AreaVacDetailComponent} from './components/dialog/area-vac-detail/area-vac-detail.component';

const routes: Routes = [
  {
    path: '',
    component: StockQueryStatisticsComponent,
    children: [
      {
        path: 'vacinboundoutbounddetail',
        component: VaccInboundOutboundDetailsComponent,
      },
      {
        path: 'detail',
        component: AreaVacDetailComponent
      },
      {
        path: 'areainboundoutbounddetail',
        component: AreaInOutDetailComponent
      },
      {
        path: 'vacinboundoutboundflow',
        component: VacInOutFlowComponent
      },
      {
        path: 'vaccinestatusenquiry',
        component: VaccineStatusEnquiryComponent
      },
      {
        path: 'areainboundoutboundstatistics',
        component: AreaInOutStatisticsComponent
      },
      {path: '', redirectTo: 'vacinboundoutbounddetail', pathMatch: 'full'},
      {path: '**', component: NotFoundComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockQueryStatisticsRoutingModule {
}

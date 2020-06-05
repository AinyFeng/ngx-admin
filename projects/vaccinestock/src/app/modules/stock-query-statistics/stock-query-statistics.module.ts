import {NgModule} from '@angular/core';
import {StockQueryStatisticsComponent} from './stock-query-statistics.component';

import {UeaModule} from '../../@uea/uea.module';
import {NgxEchartsModule} from 'ngx-echarts';
import {NgZorroAntdModule} from 'ng-zorro-antd';

import {StockQueryStatisticsRoutingModule} from './stock-query-statistics.routing.module';
import {VaccInboundOutboundDetailsComponent} from './components/vacc-inbound-outbound-details/vacc-inbound-outbound-details.component';
import {AreaInOutDetailComponent} from './components/area-in-out-detail/area-in-out-detail.component';
import {VacInOutFlowComponent} from './components/vac-in-out-flow/vac-in-out-flow.component';
import {VaccineStatusEnquiryComponent} from './components/vaccine-status-enquiry/vaccine-status-enquiry.component';
import {AreaInOutStatisticsComponent} from './components/area-in-out-statistics/area-in-out-statistics.component';
import {SelectAddressComponent} from './components/dialog/select-address/select-address.component';
import {VacOrderInfoComponent} from './components/dialog/vac-order-info/vac-order-info.component';
import {AreaVacDetailComponent} from './components/dialog/area-vac-detail/area-vac-detail.component';

const COMPONENTS = [
  StockQueryStatisticsComponent,
  VaccInboundOutboundDetailsComponent,
  AreaInOutDetailComponent,
  VacInOutFlowComponent,
  VaccineStatusEnquiryComponent,
  AreaInOutStatisticsComponent,
  SelectAddressComponent,
  VacOrderInfoComponent,
  AreaVacDetailComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    UeaModule,
    StockQueryStatisticsRoutingModule,
    NgxEchartsModule,
    NgZorroAntdModule
  ]
})
export class StockQueryStatisticsModule {
}

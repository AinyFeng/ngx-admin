import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TypeTwoComponent} from './type-two.component';
import {UeaModule} from '../../@uea/uea.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {UeaDashboardModule} from '../../@uea/components/dashboard/ueadashboard.module';
import {mdsDashboardOptions} from '../modules-dashboard';
import {PlanConfigService} from '../services/plan-config.service';
import {TypeTwoSummaryComponent} from './type-two-summary/type-two-summary.component';
import {TypeTwoMonthlyDetailsComponent} from './component/type-two-monthly-details/type-two-monthly-details.component';
import {TypeTwoYearlyDetailsComponent} from './component/type-two-yearly-details/type-two-yearly-details.component';
import {TypeTwoMonthlyAuditComponent} from './type-two-monthly/type-two-monthly-audit/type-two-monthly-audit.component';
import {TypeTwoMonthlyListComponent} from './type-two-monthly/type-two-monthly-list/type-two-monthly-list.component';
import {TypeTwoYearlyAuditComponent} from './type-two-yearly/type-two-yearly-audit/type-two-yearly-audit.component';
import {TypeTwoYearlyFillInComponent} from './type-two-yearly/type-two-yearly-fill-in/type-two-yearly-fill-in.component';
import {TypeTwoYearlyListComponent} from './type-two-yearly/type-two-yearly-list/type-two-yearly-list.component';
import {TypeTwoRoutingModule} from './type-two-routing.module';
import {StockSharedModule} from '../stock-shared/stock-shared.module';
import {PlanServiceModule} from '../services/plan-service.module';


@NgModule({
  declarations: [
    TypeTwoComponent,
    TypeTwoSummaryComponent,
    TypeTwoMonthlyDetailsComponent,
    TypeTwoYearlyDetailsComponent,
    TypeTwoMonthlyAuditComponent,
    TypeTwoMonthlyListComponent,
    TypeTwoYearlyAuditComponent,
    TypeTwoYearlyFillInComponent,
    TypeTwoYearlyListComponent
  ],
  imports: [
    UeaModule,
    CommonModule,
    TypeTwoRoutingModule,
    NgZorroAntdModule,
    UeaDashboardModule.forRoot(mdsDashboardOptions),
    StockSharedModule,
    PlanServiceModule,
  ],
  providers: [
    PlanConfigService,
  ]
})
export class TypeTwoModule {
}

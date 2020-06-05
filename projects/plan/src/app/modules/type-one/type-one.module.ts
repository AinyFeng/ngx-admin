import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TypeOneComponent} from './type-one.component';
import {TypeOneYearlyListComponent} from './type-one-yearly/type-one-yearly-list/type-one-yearly-list.component';
import {TypeOneYearlyAuditComponent} from './type-one-yearly/type-one-yearly-audit/type-one-yearly-audit.component';
import {TypeOneYearlyDetailsComponent} from './component/type-one-yearly-details/type-one-yearly-details.component';
import {TypeOneYearlyFillInComponent} from './type-one-yearly/type-one-yearly-fill-in/type-one-yearly-fill-in.component';
import {TypeOneMonthlyListComponent} from './type-one-monthly/type-one-monthly-list/type-one-monthly-list.component';
import {TypeOneMonthlyDetailsComponent} from './component/type-one-monthly-details/type-one-monthly-details.component';
import {TypeOneMonthlyAuditComponent} from './type-one-monthly/type-one-monthly-audit/type-one-monthly-audit.component';
import {UeaModule} from '../../@uea/uea.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {UeaDashboardModule} from '../../@uea/components/dashboard/ueadashboard.module';
import {mdsDashboardOptions} from '../modules-dashboard';
import {PlanConfigService} from '../services/plan-config.service';
import {TypeOneRoutingModule} from './type-one-routing.module';
import {TypeOneSummaryComponent} from './type-one-summary/type-one-summary.component';
import {StockSharedModule} from '../stock-shared/stock-shared.module';
import {PlanServiceModule} from '../services/plan-service.module';


@NgModule({
  declarations: [
    TypeOneComponent,
    TypeOneYearlyListComponent,
    TypeOneYearlyAuditComponent,
    TypeOneYearlyDetailsComponent,
    TypeOneYearlyFillInComponent,
    TypeOneMonthlyListComponent,
    TypeOneMonthlyDetailsComponent,
    TypeOneMonthlyAuditComponent,
    TypeOneSummaryComponent,
  ],
  imports: [
    UeaModule,
    CommonModule,
    NgZorroAntdModule,
    UeaDashboardModule.forRoot(mdsDashboardOptions),
    TypeOneRoutingModule,
    StockSharedModule,
    PlanServiceModule,
  ],
  exports: [
    TypeOneMonthlyDetailsComponent,
    TypeOneYearlyDetailsComponent
  ],
  providers: [
    PlanConfigService,
  ]
})
export class TypeOneModule {
}

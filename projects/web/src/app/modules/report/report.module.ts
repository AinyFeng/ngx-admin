import { NgModule } from '@angular/core';
import { UeaDashboardModule } from '../../@uea/components/dashboard/ueadashboard.module';
import { SharedModule } from '@tod/svs-common-lib';
import { FPickVaccineComponent } from './components/f-pick-vaccine/f-pick-vaccine.component';
import { ReportClassOnePreventionComponent } from './components/report-class-one-prevention/report-class-one-prevention.component';
import { ReportClassTwoPrePresaleComponent } from './components/report-class-two-pre-presale/report-class-two-pre-presale.component';
import { ReportClassTwoVaccineInvoicingComponent } from './components/report-class-two-vaccine-invoicing/report-class-two-vaccine-invoicing.component';
import { ReportFileIntegrityCheckComponent } from './components/report-file-integrity-check/report-file-integrity-check.component';
import { ReportLivelihoodImprovesHealthComponent } from './components/report-livelihood-improves-health/report-livelihood-improves-health.component';
import { ReportNationSixOneSumComponent } from './components/report-nation-six-one-sum/report-nation-six-one-sum.component';
import { ReportNationSixOneComponent } from './components/report-nation-six-one/report-nation-six-one.component';
import { ReportNationSixTwoSumComponent } from './components/report-nation-six-two-sum/report-nation-six-two-sum.component';
import { ReportNationSixTwoComponent } from './components/report-nation-six-two/report-nation-six-two.component';
import { ReportNewChildCountComponent } from './components/report-new-child-count/report-new-child-count.component';
import { ReportRecordIntegrityCheckComponent } from './components/report-record-integrity-check/report-record-integrity-check.component';
import { ReportReserveManagementComponent } from './components/report-reserve-management/report-reserve-management.component';
import { ReportSubmissionRecordComponent } from './components/report-submission-record/report-submission-record.component';
// import { ReportService } from './report.service';
import { mdsReportDashboardOptions } from './report-dashboard';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { UeaModule } from '../../@uea/uea.module';
import {DetailChildCaseComponent} from './components/dialog/detail-child-case/detail-child-case.component';

// 定义入口组件
const COMPONENTS = [
  ReportComponent,
  ReportReserveManagementComponent,
  ReportNationSixOneComponent,
  ReportNationSixTwoComponent,
  ReportNationSixOneSumComponent,
  FPickVaccineComponent,
  ReportNationSixTwoSumComponent,
  ReportClassTwoVaccineInvoicingComponent,
  ReportClassTwoPrePresaleComponent,
  ReportNewChildCountComponent,
  ReportClassOnePreventionComponent,
  ReportFileIntegrityCheckComponent,
  ReportRecordIntegrityCheckComponent,
  ReportLivelihoodImprovesHealthComponent,
  ReportSubmissionRecordComponent,
  DetailChildCaseComponent
];

@NgModule({
  imports: [
    UeaModule,
    ReportRoutingModule,
    UeaDashboardModule.forRoot(mdsReportDashboardOptions),
  ],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
  exports: [...COMPONENTS, UeaModule, ReportRoutingModule]
  // providers: [ReportService],
})
export class ReportModule { }

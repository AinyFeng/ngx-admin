import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UeaDashboardComponent } from './../../@uea/components/dashboard/ueadashboard.component';
import { ReportClassOnePreventionComponent } from './components/report-class-one-prevention/report-class-one-prevention.component';
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
import { ReportComponent } from './report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      { path: 'dashboard', component: UeaDashboardComponent },
      {
        path: 'reserve-management',
        component: ReportReserveManagementComponent
      },
      { path: 'nation-six-one', component: ReportNationSixOneComponent },
      { path: 'nation-six-one-sum', component: ReportNationSixOneSumComponent },
      { path: 'nation-six-two', component: ReportNationSixTwoComponent },
      { path: 'nation-six-two-sum', component: ReportNationSixTwoSumComponent },
      {
        path: 'class-two-vaccine-invoicing',
        component: ReportClassTwoVaccineInvoicingComponent
      },
      {
        path: 'class-two-pre-presale',
        component: ReportClassTwoVaccineInvoicingComponent
      },
      { path: 'new-child-count', component: ReportNewChildCountComponent },
      {
        path: 'class-one-prevention',
        component: ReportClassOnePreventionComponent
      },
      {
        path: 'file-integrity-check',
        component: ReportFileIntegrityCheckComponent
      },
      {
        path: 'record-integrity-check',
        component: ReportRecordIntegrityCheckComponent
      },
      {
        path: 'livelihood-improves-health',
        component: ReportLivelihoodImprovesHealthComponent
      },
      {
        path: 'report-submission-record',
        component: ReportSubmissionRecordComponent
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }

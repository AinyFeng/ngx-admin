import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../../@uea/components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { CaseInformationQueryComponent } from './components/case-information-query/case-information-query.component';
import { ArchivesStatisticsComponent } from './components/archives-statistics/archives-statistics.component';
import { ArchivesObstetricsComponent } from './components/archives-obstetrics/archives-obstetrics.component';
import { ArchivesManagementComponent } from './archives-management.component';
import { CaseInformationStatisticsComponent } from './components/case-information-statistics/case-information-statistics.component';
import { DistributionOfBirthComponent } from './components/distribution-of-birth/distribution-of-birth.component';
import { CaseDuplicateDeletionComponent } from './components/case-duplicate-deletion/case-duplicate-deletion.component';
import { CaseInformationCheckComponent } from './components/case-information-check/case-information-check.component';
import { CaseInformationQueryDeletedComponent } from './components/case-information-query-deleted/case-information-query-deleted.component';
import { DuplicateChildStatisticsComponent } from './components/duplicate-child-statistics/duplicate-child-statistics.component';
import { ChildFileInformationComponent } from './components/child-file-information/child-file-information.component';
import { VaccineInOutRecordComponent } from './components/vaccine-in-out-record/vaccine-in-out-record.component';
import { VacOrderInfoComponent } from './components/dialog/vac-order-info/vac-order-info.component';
import { ProfileUpdateComponent } from './components/dialog/profile-update/profile-update.component';

const routes: Routes = [
  {
    path: '',
    component: ArchivesManagementComponent,
    children: [
      {
        path: 'informationquery',
        component: CaseInformationQueryComponent
      },
      {
        path: 'archivesstatistics',
        component: ArchivesStatisticsComponent
      },
      {
        path: 'archivesobstetrics',
        component: ArchivesObstetricsComponent
      },
      {
        path: 'informatiionStatistics',
        component: CaseInformationStatisticsComponent
      },
      {
        path: 'distributionOfBirth',
        component: DistributionOfBirthComponent
      },
      {
        path: 'caseDuplicateDeletion',
        component: CaseDuplicateDeletionComponent
      },
      {
        path: 'caseInformationCheck',
        component: CaseInformationCheckComponent
      },
      {
        path: 'caseInformationQueryDeleted',
        component: CaseInformationQueryDeletedComponent
      },
      {
        path: 'duplicatechildstatistics',
        component: DuplicateChildStatisticsComponent
      },
      {
        path: 'childFileInformation',
        component: ChildFileInformationComponent
      },
      {
        path: 'vaccineInOutRecord',
        component: VaccineInOutRecordComponent
      },
      {
        path: 'vacOrderInfoComponent',
        component: VacOrderInfoComponent
      },
      {
        path: 'profileUpdate',
        component: ProfileUpdateComponent
      },


      {path: '', redirectTo: 'informationquery', pathMatch: 'full'},
      {path: '**', component: NotFoundComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivesManagementRoutingModule {
}

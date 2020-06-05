import { NgModule } from '@angular/core';
import { CaseInformationQueryComponent } from './components/case-information-query/case-information-query.component';
import { ArchivesStatisticsComponent } from './components/archives-statistics/archives-statistics.component';
import { ArchivesObstetricsComponent } from './components/archives-obstetrics/archives-obstetrics.component';
import { ArchivesManagementRoutingModule } from './archives-management.routing.module';
import { ArchivesManagementComponent } from './archives-management.component';
import { UeaModule } from '../../@uea/uea.module';
import { SelectSeedDialogComponent } from './components/dialog/select-seed-dialog/select-seed-dialog.component';
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
import { PrintChildrenBasicInfoComponent } from './components/dialog/print/print-children-basic-info/print-children-basic-info.component';


const COMPONENTS = [
  ArchivesManagementComponent,
  CaseInformationQueryComponent,
  ArchivesStatisticsComponent,
  SelectSeedDialogComponent,
  CaseInformationStatisticsComponent,
  DistributionOfBirthComponent,
  CaseDuplicateDeletionComponent,
  CaseInformationCheckComponent,
  CaseInformationQueryDeletedComponent,
  DuplicateChildStatisticsComponent,
  ChildFileInformationComponent,
  VaccineInOutRecordComponent,
  VacOrderInfoComponent,
  ProfileUpdateComponent,
  PrintChildrenBasicInfoComponent,
  ArchivesObstetricsComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    ArchivesManagementRoutingModule,
    UeaModule
  ]
})
export class ArchivesManagementModule {
}

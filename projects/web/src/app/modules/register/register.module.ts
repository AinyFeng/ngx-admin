import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { PrintModule } from '../print/print.module';
import { SharedModule } from '@tod/svs-common-lib';
import { AefiFeedbackComponent } from './components/aefi/aefi-feedback/aefi-feedback.component';
import { AefiListComponent } from './components/aefi/aefi-list/aefi-list.component';
import { QueryVaccRecordComponent } from './components/aefi/query-vacc-record/query-vacc-record.component';
import { SVaccionationAppointmentDetailComponent } from './components/common/s-vaccionation-appointment-detail/s-vaccionation-appointment-detail.component';
import { SelectHospitalComponent } from './components/common/select-hospital/select-hospital.component';
import { FFileComparisonComponent } from './components/f-file-comparison/f-file-comparison.component';
import { FFileImportComponent } from './components/f-file-import/f-file-import.component';
import { ImmunizationAddComponent } from './components/immunization/immunization-add/immunization-add.component';
import { ImmunizationListComponent } from './components/immunization/immunization-list/immunization-list.component';
import { ImmunizationModifyComponent } from './components/immunization/immunization-modify/immunization-modify.component';
import { AddIllnessComponent } from './components/medical-history/add-illness/add-illness.component';
import { IllnessListComponent } from './components/medical-history/illness-list/illness-list.component';
import { PrintAgreementDialogComponent } from './components/print-dialog/print-agreement-dialog/print-agreement-dialog.component';
import { PrintChildCaseComponent } from './components/print-dialog/print-child-case/print-child-case.component';
import { PrintProfileDialogComponent } from './components/print-dialog/print-profile-dialog/print-profile-dialog.component';
import { PrintVaccRecordDialogComponent } from './components/print-dialog/print-vacc-record-dialog/print-vacc-record-dialog.component';
import { SchoolAttendCertificationDialogComponent } from './components/print-dialog/school-attend-certification-dialog/school-attend-certification-dialog.component';
import { ProfileStatusChangeComponent } from './components/profile-status-change/profile-status-change.component';
import { AddProfileDetailDialogComponent } from './components/profile/add-profile-detail-dialog/add-profile-detail-dialog.component';
import { AddProfileComponent } from './components/profile/add-profile-main/add-profile.component';
import { TabAddAdultFileComponent } from './components/profile/tab-add-adult-file/tab-add-adult-file.component';
import { TabAddChildFileComponent } from './components/profile/tab-add-child-file/tab-add-child-file.component';
import { UpdateAdultProfileComponent } from './components/profile/update-adult-profile/update-adult-profile.component';
import { UpdateChildProfileComponent } from './components/profile/update-child-profile/update-child-profile.component';
import { CallNumberComponent } from './components/queue-number/call-number/call-number.component';
import { QueueListComponent } from './components/queue-number/queue-list/queue-list.component';
import { AdultVaccRecordComponent } from './components/rabies-record/adult-vacc-record/adult-vacc-record.component';
import { RabiesBittenListComponent } from './components/rabies-record/rabies-bitten-list/rabies-bitten-list.component';
import { RabiesBittenRecordComponent } from './components/rabies-record/rabies-bitten-record/rabies-bitten-record.component';
import { ReservationRecordListComponent } from './components/reservation/reservation-record-list/reservation-record-list.component';
// 声明的组件
import { BasicInfoTableComponent } from './components/show-profile-info/basic-info-table/basic-info-table.component';
import { RegistRecordListComponent } from './components/vaccinatable-vaccine/regist-record-list/regist-record-list.component';
import { RegistRecordComponent } from './components/vaccinatable-vaccine/regist-record/regist-record.component';
import { VaccinatableListComponent } from './components/vaccinatable-vaccine/vaccinatable-list/vaccinatable-list.component';
import { SingleDosageRecordComponent } from './components/vaccinated-record/single-dosage-record/single-dosage-record.component';
import { VaccinatedRecordListComponent } from './components/vaccinated-record/vaccinated-record-list/vaccinated-record-list.component';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { RejectVaccineComponent } from './components/vaccinatable-vaccine/reject-vaccine/reject-vaccine.component';
import { AddRejectVaccineComponent } from './components/vaccinatable-vaccine/add-reject-vaccine/add-reject-vaccine.component';
import { BatchDosageRecordComponent } from './components/vaccinated-record/batch-dosage-record/batch-dosage-record.component';
import { PrecheckDialogComponent } from './components/previewing/precheck-dialog/precheck-dialog.component';
import {
  QueueListService,
  VaccinateReservationDataService,
  VaccinateRecordsDataService,
  RecommendVaccineNotificationService,
  IdCardScanService
} from '@tod/svs-common-lib';
import { UeaModule } from '../../@uea/uea.module';
import { DateInputFormatDirective } from './components/vaccinated-record/batch-dosage-record/date.input.format.directive';
import { VaccinatedRecordListByDiseaseComponent } from './components/vaccinated-record/vaccinated-record-list-by-disease/vaccinated-record-list-by-disease.component';
import { SaveVaccinateRecordConfirmDialogComponent } from './components/vaccinated-record/save-vaccinate-record-confirm-dialog/save-vaccinate-record-confirm-dialog.component';
import { RegisterFrameComponent } from './register.frame.component';
import { SharedComponentModule } from '../sharedcomponent/shared.component.module';
import { ReservationListByVaccRecordComponent } from './components/reservation/reservation-management/reservation-list-by-vacc-record.component';
import { ReservationByVaccDetailListComponent } from './components/reservation/reservation-management-list/reservation-by-vacc-detail-list.component';
import { PreviewingRecordComponent } from './components/previewing/previewing-record/previewing-record.component';
import {AdministrationModule} from '../administration/administration.module';
import {ModifyDialogComponent} from './components/common/modify-dialog/modify-dialog.component';

const COMPONENTS = [
  RegisterFrameComponent,
  RegisterComponent,
  VaccinatableListComponent,
  AddProfileComponent,
  TabAddChildFileComponent,
  TabAddAdultFileComponent,
  BasicInfoTableComponent,
  VaccinatedRecordListComponent,
  CallNumberComponent,
  RegistRecordComponent,
  SVaccionationAppointmentDetailComponent,
  FFileImportComponent,
  ProfileStatusChangeComponent,
  SingleDosageRecordComponent,
  SelectHospitalComponent,
  FFileComparisonComponent,
  IllnessListComponent,
  AddIllnessComponent,
  AefiFeedbackComponent,
  RabiesBittenRecordComponent,
  AddProfileDetailDialogComponent,
  QueryVaccRecordComponent,
  RabiesBittenListComponent,
  AefiListComponent,
  UpdateAdultProfileComponent,
  UpdateChildProfileComponent,
  ImmunizationListComponent,
  ImmunizationAddComponent,
  QueueListComponent,
  RegistRecordListComponent,
  ReservationRecordListComponent,
  SchoolAttendCertificationDialogComponent,
  PrintProfileDialogComponent,
  PrintAgreementDialogComponent,
  PrintVaccRecordDialogComponent,
  AdultVaccRecordComponent,
  PrintChildCaseComponent,
  ImmunizationModifyComponent,
  RejectVaccineComponent,
  AddRejectVaccineComponent,
  BatchDosageRecordComponent,
  PrecheckDialogComponent,
  DateInputFormatDirective,
  VaccinatedRecordListByDiseaseComponent,
  SaveVaccinateRecordConfirmDialogComponent,
  ReservationListByVaccRecordComponent,
  ReservationByVaccDetailListComponent,
  PreviewingRecordComponent,
  ModifyDialogComponent
];

const PROVIDERS = [
  QueueListService,
  VaccinateReservationDataService,
  VaccinateRecordsDataService,
  RecommendVaccineNotificationService,
  IdCardScanService
];

@NgModule({
  imports: [UeaModule, RegisterRoutingModule, PrintModule, QRCodeModule, SharedModule, SharedComponentModule, AdministrationModule],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [...PROVIDERS]
})
export class RegisterModule {
}

import { NgModule } from '@angular/core';
import { mdsDashboardOptions } from './modules-dashboard';

import { UeaDashboardModule } from '../@uea/components/dashboard/ueadashboard.module';
import { ModulesRoutingModule } from './modules-routing.module';
import { ModulesComponent } from './modules.component';
import {
  ApiAdminDailyManagementService,
  ApiAdminReservationSearchService,
  AdministrativeDivisionService,
  BatchInfoService,
  ColdStorageFacilityService,
  DepartmentInfoService,
  DictionaryService,
  HospitalBaseInfoService,
  ManufacturerBaseInfoService,
  NationBaseInfoService,
  PovInfoService,
  PovStaffApiService,
  SchoolBaseInfoService,
  VaccineAgreementModelService,
  VaccineBroadHeadingService,
  VaccineProductService,
  VaccineSubclassService,
  CommunityBaseInfoService,
  AefiCodeService,
  WorkDatetimeService,
  IotInitService,
  SysConfInitService,
  MedicalStaffSignService,
  DepartmentConfigService,
  AefiService,
  BiteService,
  ImmunizationService,
  MedicalHistoryService,
  ProfileService,
  ProfileStatusChangeService,
  SignatureApiService,
  RegQueueService,
  RegistRecordService,
  ApiReportNationSixOneService,
  ApiReportNationSixTwoService,
  ApiReportService,
  ReportSubmitRecordService,
  ReservationRecordService,
  StockService,
  ApiSystemConfigService,
  ApiSystemDictionaryService,
  ApiSystemUserService,
  ApiSystemWorkingDayService,
  ApiSystemWorkingTimeService,
  SystemAnnouncementService,
  ApiSystemMessageInfoService,
  VaccinateService,
  WaitingSelfService,
  SelfProfileService,
  ChargeService,
  StartupService,
  AdministrativeService,
  ProfileDataService,
  ProfileChangeService,
  NationDataInitService,
  CommunityDataService,
  AgreementService,
  VaccRecordTransformService,
  VaccineSubclassInitService,
  VaccBroadHeadingDataService,
  VaccManufactureDataService,
  VaccBatchNoDataService,
  VaccinatePovService,
  DicDataService,
  PovDataInit,
  WorkingDayInitService,
  DepartmentInitService,
  PovStaffInitService,
  SmsModelDicInitService,
  VaccDepartmentManageService,
  DiseaseCategoryInitService,
  RegRecordDataService,
  SystemPreliminaryClinicalService, JoyusingSignpadService,
  FixedAssetsDataService, StockExportService,
  RabiesStrategyProgramService
} from '@tod/svs-common-lib';
import { UeaModule } from '../@uea/uea.module';
import { NoticeComponent } from './components/notice/notice.component';


const MDS_API_SERVICES = [
  // Administration
  ApiAdminDailyManagementService,
  ApiAdminReservationSearchService,

  // Master
  AdministrativeDivisionService,
  BatchInfoService,
  ColdStorageFacilityService,
  DepartmentInfoService,
  DictionaryService,
  HospitalBaseInfoService,
  ManufacturerBaseInfoService,
  NationBaseInfoService,
  PovInfoService,
  PovStaffApiService,
  SchoolBaseInfoService,
  VaccineAgreementModelService,
  VaccineBroadHeadingService,
  VaccineProductService,
  VaccineSubclassService,
  CommunityBaseInfoService,
  AefiCodeService,
  WorkDatetimeService,
  IotInitService,
  SysConfInitService,
  MedicalStaffSignService,
  DepartmentConfigService,

  // Profile
  AefiService,
  BiteService,
  ImmunizationService,
  MedicalHistoryService,
  ProfileService,
  ProfileStatusChangeService,
  SignatureApiService,

  // RegQueue
  RegQueueService,
  RegistRecordService,
  RegRecordDataService,

  // Report
  ApiReportNationSixOneService,
  ApiReportNationSixTwoService,
  ApiReportService,
  ReportSubmitRecordService,

  // Reservation
  ReservationRecordService,

  // Stock
  StockService,

  // System
  ApiSystemConfigService,
  ApiSystemDictionaryService,
  ApiSystemUserService,
  ApiSystemWorkingDayService,
  ApiSystemWorkingTimeService,
  SystemAnnouncementService,
  ApiSystemMessageInfoService,
  SystemPreliminaryClinicalService,

  // Vaccination
  VaccinateService,

  // Waiting
  WaitingSelfService,

  // iot
  SelfProfileService,

  // charge
  ChargeService,
  JoyusingSignpadService,
  StockExportService

];

// 数据初始化services
const MDS_COMMON_SERVICES = [
  StartupService,
  AdministrativeService,
  ProfileDataService,
  ProfileChangeService,
  NationDataInitService,
  CommunityDataService,
  AgreementService,
  VaccRecordTransformService,
  VaccineSubclassInitService,
  VaccBroadHeadingDataService,
  VaccManufactureDataService,
  VaccBatchNoDataService,
  VaccinatePovService,
  DicDataService,
  PovDataInit,
  WorkingDayInitService,
  DepartmentInitService,
  SmsModelDicInitService,
  VaccDepartmentManageService,
  PovStaffInitService,
  DiseaseCategoryInitService,
  FixedAssetsDataService,
  RabiesStrategyProgramService
];

@NgModule({
  imports: [UeaModule, ModulesRoutingModule,
    UeaDashboardModule.forRoot(mdsDashboardOptions),
  ],
  declarations: [ModulesComponent, NoticeComponent],
  providers: [...MDS_COMMON_SERVICES, ...MDS_API_SERVICES]
})
export class ModulesModule {
}

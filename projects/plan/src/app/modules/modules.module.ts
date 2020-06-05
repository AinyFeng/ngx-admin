import { NgModule } from '@angular/core';
import { mdsDashboardOptions } from './modules-dashboard';

import { UeaDashboardModule } from '../@uea/components/dashboard/ueadashboard.module';
import { ModulesRoutingModule } from './modules-routing.module';
import { ModulesComponent } from './modules.component';
import { UeaModule } from '../@uea/uea.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {
  AdministrativeDivisionService,
  AdministrativeService,
  AefiCodeService,
  AefiService,
  AgreementService,
  ApiAdminDailyManagementService,
  ApiAdminReservationSearchService,
  ApiReportNationSixOneService,
  ApiReportNationSixTwoService,
  ApiReportService,
  ApiSystemConfigService,
  ApiSystemDictionaryService,
  ApiSystemMessageInfoService,
  ApiSystemUserService,
  ApiSystemWorkingDayService,
  ApiSystemWorkingTimeService,
  BatchInfoService,
  BiteService,
  ChargeService,
  ColdStorageFacilityService,
  CommunityBaseInfoService,
  CommunityDataService,
  DepartmentConfigService,
  DepartmentInfoService, DepartmentInitService, DicDataService,
  DictionaryService, DiseaseCategoryInitService, FixedAssetsDataService,
  HospitalBaseInfoService,
  ImmunizationService,
  IotInitService,
  ManufacturerBaseInfoService,
  MedicalHistoryService,
  MedicalStaffSignService,
  NationBaseInfoService,
  NationDataInitService, PovDataInit,
  PovInfoService,
  PovStaffApiService, PovStaffInitService,
  ProfileChangeService,
  ProfileDataService,
  ProfileService,
  ProfileStatusChangeService,
  RegistRecordService,
  RegQueueService,
  RegRecordDataService,
  ReportSubmitRecordService,
  ReservationRecordService,
  SchoolBaseInfoService,
  SelfProfileService,
  SignatureApiService, SmsModelDicInitService,
  StartupService,
  StockService,
  SysConfInitService,
  SystemAnnouncementService,
  SystemPreliminaryClinicalService, TreeDataApi, VaccBatchNoDataService,
  VaccBroadHeadingDataService, VaccDepartmentManageService, VaccinatePovService,
  VaccinateService,
  VaccineAgreementModelService,
  VaccineBroadHeadingService,
  VaccineProductService,
  VaccineSubclassInitService,
  VaccineSubclassService, VaccManufactureDataService,
  VaccRecordTransformService,
  WaitingSelfService,
  WorkDatetimeService, WorkingDayInitService,
} from '@tod/svs-common-lib';

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

  TreeDataApi,

  FixedAssetsDataService
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
  IotInitService,
  SysConfInitService,
  DiseaseCategoryInitService
];

@NgModule({
  imports: [UeaModule, ModulesRoutingModule, NgZorroAntdModule,
    UeaDashboardModule.forRoot(mdsDashboardOptions),
  ],
  exports: [UeaModule, ModulesRoutingModule],
  declarations: [
    ModulesComponent
  ],
  providers: [...MDS_COMMON_SERVICES, ...MDS_API_SERVICES]
})
export class ModulesModule {
}

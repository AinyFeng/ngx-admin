import {NgModule} from '@angular/core';
import {mdsDashboardOptions} from './modules-dashboard';

import {UeaDashboardModule} from '../@uea/components/dashboard/ueadashboard.module';
import {ModulesRoutingModule} from './modules-routing.module';
import {ModulesComponent} from './modules.component';
import {UeaModule} from '../@uea/uea.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {
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
  SysConfInitService,
  VacstatStartupService,
  ApiAdminDailyManagementService,
  TreeDataApi,
  VacReportStatisticsApiService,
  AdministrativeDivisionService,
  PovInfoService,
  VacRecordManageApiService, InitPlatformTreenodeService
} from '@tod/svs-common-lib';
import {SelectAddressComponent} from './common/dialog/select-address/select-address.component';
import {VacProfileStatisticsApi} from '../../../../svs-common-lib/src/lib/vac-profile-api/information-statistics/vac-profile-statistics.api.service';
import {VaccineAefiManageComponent} from './vaccine-aefi-manage/vaccine-aefi-manage.component';
import {SharedModule} from '../../../../svs-common-lib/src/lib/shared/shared.module';
import {VaccineAefiAddComponent} from './vaccine-aefi-add/vaccine-aefi-add.component';

const MDS_API_SERVICES = [
  VacReportStatisticsApiService,
  VacRecordManageApiService
];

// 数据初始化services
const MDS_COMMON_SERVICES = [
  VacstatStartupService,
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
  ApiAdminDailyManagementService,
  SysConfInitService,
  AdministrativeDivisionService,
  PovInfoService,
  VacProfileStatisticsApi,
  TreeDataApi,
  InitPlatformTreenodeService
];

@NgModule({
  imports: [UeaModule, ModulesRoutingModule,
    NgZorroAntdModule,
    UeaDashboardModule.forRoot(mdsDashboardOptions), SharedModule,
  ],
  exports: [UeaModule, ModulesRoutingModule],
  declarations: [ModulesComponent, SelectAddressComponent, VaccineAefiManageComponent, VaccineAefiAddComponent],
  providers: [...MDS_COMMON_SERVICES, ...MDS_API_SERVICES]
})
export class ModulesModule {
}

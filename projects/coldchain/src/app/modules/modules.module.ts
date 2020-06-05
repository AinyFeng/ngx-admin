import { NgModule } from '@angular/core';
import { mdsDashboardOptions } from './modules-dashboard';

import { UeaDashboardModule } from '../@uea/components/dashboard/ueadashboard.module';
import { ModulesRoutingModule } from './modules-routing.module';
import { ModulesComponent } from './modules.component';
import { UeaModule } from '../@uea/uea.module';
import { NgxEchartsModule } from 'ngx-echarts';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {EntryComponent} from './entry.component';

import {
  AdministrativeService,
  AgreementService,
  CommunityDataService,
  DepartmentInitService,
  DicDataService,
  DiseaseCategoryInitService,
  NationDataInitService,
  PovDataInit, PovStaffInitService,
  ProfileChangeService,
  ProfileDataService,
  SmsModelDicInitService,
  SysConfInitService,
  VaccBatchNoDataService,
  VaccBroadHeadingDataService,
  VaccDepartmentManageService,
  VaccinatePovService,
  VaccineSubclassInitService,
  VaccManufactureDataService,
  VaccRecordTransformService,
  WorkingDayInitService,
  ColdchainStartupService,
  ColdchainDeviceService,
  ColdchainSelectedNodeService,
  InitPlatformTreenodeService,
  MonitorDeviceService,
  TreeDataApi,
  SensorDeviceService,
  RealtimeDataService,
  RepairScrapService,
  HistoryDataService
} from '@tod/svs-common-lib';




const MDS_API_SERVICES = [
  ColdchainDeviceService,
  ColdchainSelectedNodeService,
  InitPlatformTreenodeService,
  MonitorDeviceService,
  TreeDataApi,
  SensorDeviceService,
  RealtimeDataService,
  RepairScrapService,
  HistoryDataService
];

// 数据初始化services
const MDS_COMMON_SERVICES = [
  ColdchainStartupService,
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
  SysConfInitService
];

@NgModule({
  imports: [UeaModule, ModulesRoutingModule, NgxEchartsModule, NgZorroAntdModule,
    UeaDashboardModule.forRoot(mdsDashboardOptions),
  ],
  exports: [UeaModule, ModulesRoutingModule],
  declarations: [
    ModulesComponent,
    EntryComponent],
  providers: [...MDS_COMMON_SERVICES, ...MDS_API_SERVICES]
})
export class ModulesModule {
}

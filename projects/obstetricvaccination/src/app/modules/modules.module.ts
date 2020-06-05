import { NgModule } from '@angular/core';
import { mdsDashboardOptions } from './modules-dashboard';

import { UeaDashboardModule } from '../@uea/components/dashboard/ueadashboard.module';
import { ModulesRoutingModule } from './modules-routing.module';
import { UeaModule } from '../@uea/uea.module';
import { ModulesComponent } from './modules.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import {
  StartupService,
  AdministrativeService,
  NationDataInitService,
  VaccineSubclassInitService,
  VaccBroadHeadingDataService,
  VaccManufactureDataService,
  DicDataService,
  InitPlatformTreenodeService,
  TreeDataApi,
  PovInfoService,
  DepartmentInfoService,
  PovDataInit,
  VaccBatchNoDataService,
  VaccinatePovService,
  CommunityDataService,
  AgreementService,
  WorkingDayInitService,
  ProfileDataService,
  ProfileChangeService,
  VaccRecordTransformService,
  DepartmentInitService,
  SmsModelDicInitService,
  VaccDepartmentManageService,
  PovStaffInitService,
  DiseaseCategoryInitService, IotInitService, SysConfInitService, FixedAssetsDataService, SystemAnnouncementService,
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { NoticeComponent } from './components/notice/notice.component';



const MDS_API_SERVICES = [
  UserService,
  TreeDataApi,
  DepartmentInfoService,
  PovDataInit
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
  DiseaseCategoryInitService,
  FixedAssetsDataService,
  SystemAnnouncementService
];

@NgModule({
  imports: [UeaModule, ModulesRoutingModule, NgxEchartsModule, NgZorroAntdModule,
    UeaDashboardModule.forRoot(mdsDashboardOptions)
  ],
  exports: [UeaModule, ModulesRoutingModule],
  declarations: [ModulesComponent, NoticeComponent],
  providers: [...MDS_COMMON_SERVICES, ...MDS_API_SERVICES]
})
export class ModulesModule {
}

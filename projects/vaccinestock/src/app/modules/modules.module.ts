import { NgModule } from '@angular/core';
import { mdsDashboardOptions } from './modules-dashboard';

import { UeaDashboardModule } from '../@uea/components/dashboard/ueadashboard.module';
import { ModulesRoutingModule } from './modules-routing.module';
import { UeaModule } from '../@uea/uea.module';
import { ModulesComponent } from './modules.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import {
  AdministrativeService,
  NationDataInitService,
  VaccRecordTransformService,
  VaccineSubclassInitService,
  VaccBroadHeadingDataService,
  VaccManufactureDataService,
  DicDataService,
  VacstockStartupService,
  InitPlatformTreenodeService,
  TreeDataApi,
  VacStockBatchApi,
  VacStockApprovalApiService,
  VacStockStorageApi,
  VaccStockApiService,
  OrderService,
  PovInfoService,
  DepartmentInfoService,
  PovDataInit,
  QueryStatisticsService,
  LodopPrintService,
  PovStaffInitService,
  VacStockCheckPlanApiService,
  PlatformOfficeInit
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';


const MDS_API_SERVICES = [
  UserService,
  TreeDataApi,
  VacStockBatchApi,
  VacStockStorageApi,
  VaccStockApiService,
  VacStockApprovalApiService,
  OrderService,
  DepartmentInfoService,
  PovDataInit,
  QueryStatisticsService,
  VacStockCheckPlanApiService,
];

// 数据初始化services
const MDS_COMMON_SERVICES = [
  VacstockStartupService,
  AdministrativeService,
  NationDataInitService,
  VaccRecordTransformService,
  VaccineSubclassInitService,
  VaccBroadHeadingDataService,
  VaccManufactureDataService,
  DicDataService,
  InitPlatformTreenodeService,
  PovInfoService,
  LodopPrintService,
  PovStaffInitService,
  PlatformOfficeInit
];

@NgModule({
  imports: [UeaModule, ModulesRoutingModule, NgxEchartsModule, NgZorroAntdModule,
    UeaDashboardModule.forRoot(mdsDashboardOptions),
  ],
  exports: [UeaModule, ModulesRoutingModule],
  declarations: [ModulesComponent],
  providers: [...MDS_COMMON_SERVICES, ...MDS_API_SERVICES]
})
export class ModulesModule {
}

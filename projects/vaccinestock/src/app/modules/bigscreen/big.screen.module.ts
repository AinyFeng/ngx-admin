import { NgModule } from '@angular/core';
import { BigScreenFrame } from './big.screen.frame.component';
import { UeaModule } from '../../@uea/uea.module';
// @ts-ignore
import {SharedModule, BigScreenApi, ProfileService, ApiAdminDailyManagementService} from '@tod/svs-common-lib';
import { BigScreenRouting } from './big.screen.routing';
import { NgxEchartsModule } from 'ngx-echarts';
import { VaccinationDisplayComponent } from './components/vaccination-display/vaccination-display.component';
import { VaccinationTraceComponent } from './components/vaccination-trace/vaccination-trace.component';
import {
  ProfileDupComponentComponent
} from './components/profile-dup-component/profile.dup.component.component';
import { ProfileIncompleteComponent } from './components/profile-incomplete/profile-incomplete.component';
import { MapCenterComponent } from './components/map-center/map-center.component';
import { BusinessVolumeComponent } from './components/business-volume/business-volume.component';
import { VaccineInventoryComponent } from './components/vaccine-inventory/vaccine-inventory.component';
import { VaccinatedRateComponent } from './components/vaccinated-rate/vaccinated-rate.component';
import {AppointToObservationComponent} from './components/vaccine-trace/appoint-to-observation/appoint-to-observation.component';
import {VaccineProcessComponent} from './components/vaccine-trace/vaccine-process/vaccine-process.component';
import { BigScreenTitleComponent } from './components/big-screen-title/big-screen-title.component';
import {SearchResultComponent} from './components/vaccine-trace/search-result/search-result.component';
import { SearchResultMaskComponent } from './components/vaccine-trace/search-result-mask/search-result-mask.component';

import {
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
  PlatformOfficeInit,
  AdministrativeDivisionService
} from '@tod/svs-common-lib';

const COMP = [
  BigScreenFrame,
  VaccinationDisplayComponent,
  VaccinationTraceComponent,
  ProfileDupComponentComponent,
  ProfileIncompleteComponent,
  MapCenterComponent,
  AppointToObservationComponent,
  VaccineProcessComponent
];

const API = [
  // BigScreenApi
  BigScreenApi,
  ProfileService,
  ApiAdminDailyManagementService

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
  PlatformOfficeInit,
  AdministrativeDivisionService
];

@NgModule({
  declarations: [
    ...COMP,
    BusinessVolumeComponent,
    VaccineInventoryComponent,
    VaccinatedRateComponent,
    BigScreenTitleComponent,
    AppointToObservationComponent,
    VaccineProcessComponent,
    SearchResultComponent,
    SearchResultMaskComponent
  ],
  imports: [
    UeaModule,
    SharedModule,
    BigScreenRouting,
    NgxEchartsModule
  ],
  exports: [
    ...COMP
  ],
  providers: [
    ...API, ...MDS_COMMON_SERVICES
  ]
})
export class BigScreenModule {
}

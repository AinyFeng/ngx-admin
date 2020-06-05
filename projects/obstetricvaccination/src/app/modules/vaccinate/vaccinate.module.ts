/**
 * Created by Administrator on 2019/5/24.
 */
import { NgModule } from '@angular/core';
import { CountdownModule } from 'ngx-countdown';
import { VaccinateRoutingModule } from './vaccinate-routing.module';
import { VaccinateComponent } from './vaccinate.component';
import { VaccinateBreakageComponent } from './components/vaccinate-breakage/vaccinate-breakage.component';
import {
  DepartmentInitService,
  DictionaryPipe, IotInitService,
  QueueApiService,
  SharedModule, SysConfInitService,
  ProfileService,
  VaccinateService,
  RegQueueService,
  VaccineProductService,
  BatchInfoService,
  StockService,
  ColdStorageFacilityService,
  DicDataService,
  RegistRecordService,
  EleSuperviseCodeService,
  ObserveService,
  RegObstetricsService,
  DepartmentConfigService, AdministrativeDivisionService, VoiceService,
} from '@tod/svs-common-lib';
import { UeaModule } from '../../@uea/uea.module';
import { VaccinateCallBarComponent } from './components/vaccinate-platform/vaccinate-call-bar/vaccinate-call-bar.component';
import { VaccinateBaseInfoComponent } from './components/vaccinate-platform/vaccinate-base-info/vaccinate-base-info.component';
import { VaccinateQueueListComponent } from './components/vaccinate-platform/vaccinate-queue-list/vaccinate-queue-list.component';
import { VaccinateHistoryListComponent } from './components/vaccinate-platform/vaccinate-history-list/vaccinate-history-list.component';
import {VaccinatePlatformNewComponent} from './components/vaccinate-platform/vaccinate-platform-new.component';
import { VaccinateInjectionListComponent } from './components/vaccinate-platform/vaccinate-injection-list/vaccinate-injection-list.component';
import { VaccinateMultipleDosesListComponent } from './components/vaccinate-platform/vaccinate-multiple-doses-list/vaccinate-multiple-doses-list.component';
import {VaccinatePlatformService} from './components/vaccinate-platform/vaccinate-platform.service';
import {VaccinatingWebsocketService} from './components/vaccinate-platform/vaccinating-websocket.service';
import {WaitingWebsocketService} from './components/vaccinate-platform/waiting-websocket.service';
import {VaccinateMemoDialogComponent} from './components/vaccinate-memo-dialog/vaccinate-memo-dialog.component';
import {DeviceWebsocketService} from './components/vaccinate-platform/device-websocket.service';

const API_SERVICE = [
  DicDataService,
  QueueApiService,
  AdministrativeDivisionService,
  IotInitService,
  ProfileService,
  VaccinateService,
  RegQueueService,
  VaccineProductService,
  BatchInfoService,
  StockService,
  ColdStorageFacilityService,
  RegistRecordService,
  ObserveService,
  EleSuperviseCodeService,
  DepartmentConfigService,
  DepartmentInitService,
  SysConfInitService,
  DictionaryPipe,
  VaccinatePlatformService,
  VaccinatingWebsocketService,
  WaitingWebsocketService,
  DeviceWebsocketService,
  RegObstetricsService,
  VoiceService
];

const COMPONENTS = [
  VaccinateComponent,
  VaccinatePlatformNewComponent,
  VaccinateCallBarComponent,
  VaccinateQueueListComponent,
  VaccinateBaseInfoComponent,
  VaccinateHistoryListComponent,
  VaccinateInjectionListComponent,
  VaccinateMultipleDosesListComponent,
  VaccinateMemoDialogComponent,
];

@NgModule({
  imports: [UeaModule, VaccinateRoutingModule, CountdownModule, SharedModule],
  declarations: [...COMPONENTS, VaccinateBreakageComponent],
  entryComponents: [...COMPONENTS],
  exports: [...COMPONENTS, UeaModule, VaccinateRoutingModule],
  providers: [...API_SERVICE]
})
export class VaccinateModule {
}

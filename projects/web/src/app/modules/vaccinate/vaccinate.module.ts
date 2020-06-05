/**
 * Created by Administrator on 2019/5/24.
 */
import { NgModule } from '@angular/core';
import { CountdownModule } from 'ngx-countdown';
import { VaccinateLogComponent } from './components/vaccinate-log/vaccinate-log.component';
import { VaccinateMemoDialogComponent } from './components/vaccinate-memo-dialog/vaccinate-memo-dialog.component';
// import { VaccinatePlatformComponent } from './components/vaccinate-platform/vaccinate-platform.component';
import { VaccinateRoutingModule } from './vaccinate-routing.module';
import { VaccinateComponent } from './vaccinate.component';
import { VaccinateBreakageComponent } from './components/vaccinate-breakage/vaccinate-breakage.component';
import { DialogDepartmentComponent } from './components/vaccinate-department-dialog/department.dialog.template';
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
  DepartmentConfigService, WebsocketService, WebsocketPassService, VoiceService
} from '@tod/svs-common-lib';
import { UeaModule } from '../../@uea/uea.module';
import { VaccinateCallBarComponent } from './components/vaccinate-platform-new/vaccinate-call-bar/vaccinate-call-bar.component';
import { VaccinateBaseInfoComponent } from './components/vaccinate-platform-new/vaccinate-base-info/vaccinate-base-info.component';
import { VaccinateQueueListComponent } from './components/vaccinate-platform-new/vaccinate-queue-list/vaccinate-queue-list.component';
import { VaccinateHistoryListComponent } from './components/vaccinate-platform-new/vaccinate-history-list/vaccinate-history-list.component';
import { VaccinatePlatformNewComponent } from './components/vaccinate-platform-new/vaccinate-platform-new.component';
import { VaccinateInjectionListComponent } from './components/vaccinate-platform-new/vaccinate-injection-list/vaccinate-injection-list.component';
import { VaccinateMultipleDosesListComponent } from './components/vaccinate-platform-new/vaccinate-multiple-doses-list/vaccinate-multiple-doses-list.component';
import { VaccinatePlatformService } from './components/vaccinate-platform-new/vaccinate-platform.service';
import { VaccinatingWebsocketService } from './components/vaccinate-platform-new/vaccinating-websocket.service';
import { WaitingWebsocketService } from './components/vaccinate-platform-new/waiting-websocket.service';
import { DeviceWebsocketService } from './components/vaccinate-platform-new/device-websocket.service';
import { VaccinatePlatformComponent } from './components/vaccinate-platform/vaccinate-platform.component';

const API_SERVICE = [
  DicDataService,
  QueueApiService,
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
  VoiceService
];

const COMPONENTS = [
  VaccinateComponent,
  VaccinatePlatformComponent,
  VaccinateMemoDialogComponent,
  VaccinateLogComponent,
  DialogDepartmentComponent,
  VaccinatePlatformNewComponent,
  VaccinateCallBarComponent,
  VaccinateQueueListComponent,
  VaccinateBaseInfoComponent,
  VaccinateHistoryListComponent,
  VaccinateInjectionListComponent,
  VaccinateMultipleDosesListComponent
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

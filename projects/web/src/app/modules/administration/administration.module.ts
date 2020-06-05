import { NgModule } from '@angular/core';
import { UeaDashboardModule } from '../../@uea/components/dashboard/ueadashboard.module';
import { SharedModule } from '@tod/svs-common-lib';
import { mdsAdminDashboardOptions } from './admin-dashboard';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { BatchSearchComponent } from './components/batch-search/batch-search.component';
import { ColdEquipmentManageComponent } from './components/cold-equipment-manage/cold-equipment-manage.component';
import { ColdTemperatureManageComponent } from './components/cold-temperature-manage/cold-temperature-manage.component';
import { DuplicatedProfileSearchComponent } from './components/duplicated-profile-search/duplicated-profile-search.component';
import { ElectronCodeManageComponent } from './components/electron-code-manage/electron-code-manage.component';
import { InboundOutboundCollectComponent } from './components/inbound-outbound-collect/inbound-outbound-collect.component';
import { InboundOutboundDetailComponent } from './components/inbound-outbound-detail/inbound-outbound-detail.component';
import { MsgRecordComponent } from './components/msg-record/msg-record.component';
import { MsgTemplateManageComponent } from './components/msg-template-manage/msg-template-manage.component';
import { OtherManageComponent } from './components/other-manage/other-manage.component';
import { OverdueSpeciesStatisticsComponent } from './components/overdue-species-statistics/overdue-species-statistics.component';
import { ProfileChangeStatusSearchComponent } from './components/profile-change-status-search/profile-change-status-search.component';
import { PushNotificationComponent } from './components/push-notification/push-notification.component';
import { ReservationSearchComponent } from './components/reservation-search/reservation-search.component';
import { SearchProfileComponent } from './components/search-profile/search-profile.component';
import { ShouldInformExportComponent } from './components/should-inform-export/should-inform-export.component';
import { UploadFailedProfileComponent } from './components/upload-failed-profile/upload-failed-profile.component';
import { VacInventorySearchComponent } from './components/vac-inventory-search/vac-inventory-search.component';
import { VacRecordComponent } from './components/vac-record/vac-record.component';
import { VaccineDetailComponent } from './components/vaccine-detail/vaccine-detail.component';
import { VacBreakageOutComponent } from './components/dialog/vac-breakage-out/vac-breakage-out.component';
import { AddMessageTemplateComponent } from './components/dialog/add-message-template/add-message-template.component';
import { SmsBillingComponent } from './components/sms-billing/sms-billing.component';
import { InoculationYieldComponent } from './components/inoculation-yield/inoculation-yield.component';
import { InandoutCollectDetailComponent } from './components/dialog/inandout-collect-detail/inandout-collect-detail.component';
import { PovPriceManagementComponent } from './components/pov-price-management/pov-price-management.component';
import { UpdatePriceManageComponent } from './components/dialog/update-price-manage/update-price-manage.component';
import { DiscussModifyDialogComponent } from './components/dialog/discuss-modify-dialog/discuss-modify-dialog.component';
import { VacDepartmentDeployComponent } from './components/vac-department-deploy/vac-department-deploy.component';
import { ChooseVacDeployComponent } from './components/choose-vac-deploy/choose-vac-deploy.component';
import { PreviewingComponent } from './components/previewing/previewing.component';
import { UeaModule } from '../../@uea/uea.module';
import { VaccUsedDetailComponent } from './components/dialog/vacc-used-detail/vacc-used-detail.component';
import { DeviceTypeManageComponent } from './components/device-type-manage/device-type-manage.component';
import { DeviceTypeEditComponent } from './components/dialog/device-type-edit/device-type-edit.component';
import { FixedAssetAddComponent } from './components/dialog/fixed-asset-add/fixed-asset-add.component';
import { PreviewingRecordListComponent } from './components/previewing-record-list/previewing-record-list.component';
import { ReservationAddComponent } from '../sharedcomponent/components/reservation-add/reservation-add.component';
import { SharedComponentModule } from '../sharedcomponent/shared.component.module';
import {PreRegRecordDetailComponent} from './components/dialog/pre-reg-record-detail/pre-reg-record-detail.component';
import {InoculationRateDetailComponent} from './components/inoculation-rate-detail/inoculation-rate-detail.component';

const COMPONENTS = [
  SearchProfileComponent,
  AdministrationComponent,
  ProfileChangeStatusSearchComponent,
  DuplicatedProfileSearchComponent,
  UploadFailedProfileComponent,
  VacRecordComponent,
  VaccineDetailComponent,
  VacInventorySearchComponent,
  VacBreakageOutComponent,
  InboundOutboundCollectComponent,
  InboundOutboundDetailComponent,
  InandoutCollectDetailComponent,
  ReservationSearchComponent,
  ShouldInformExportComponent,
  OverdueSpeciesStatisticsComponent,
  BatchSearchComponent,
  ElectronCodeManageComponent,
  ColdEquipmentManageComponent,
  ColdTemperatureManageComponent,
  MsgTemplateManageComponent,
  MsgRecordComponent,
  OtherManageComponent,
  PushNotificationComponent,
  AddMessageTemplateComponent,
  SmsBillingComponent,
  InoculationYieldComponent,
  PovPriceManagementComponent,
  UpdatePriceManageComponent,
  DiscussModifyDialogComponent,
  VacDepartmentDeployComponent,
  ChooseVacDeployComponent,
  PreviewingComponent,
  VacBreakageOutComponent,
  VaccUsedDetailComponent,
  DeviceTypeManageComponent,
  DeviceTypeEditComponent,
  FixedAssetAddComponent,
  PreviewingRecordListComponent,
  PreRegRecordDetailComponent,
  InoculationRateDetailComponent
];

@NgModule({
  imports: [
    UeaModule,
    AdministrationRoutingModule,
    UeaDashboardModule.forRoot(mdsAdminDashboardOptions),
    SharedModule,
    SharedComponentModule
  ],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
  exports: [...COMPONENTS, UeaModule, AdministrationRoutingModule]
})
export class AdministrationModule {
}

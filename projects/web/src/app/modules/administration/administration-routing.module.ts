import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UeaDashboardComponent } from './../../@uea/components/dashboard/ueadashboard.component';
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
import { SmsBillingComponent } from './components/sms-billing/sms-billing.component';
import { InoculationYieldComponent } from './components/inoculation-yield/inoculation-yield.component';
import { PovPriceManagementComponent } from './components/pov-price-management/pov-price-management.component';
import { VacDepartmentDeployComponent } from './components/vac-department-deploy/vac-department-deploy.component';
import { PreviewingComponent } from './components/previewing/previewing.component';
import { DeviceTypeManageComponent } from './components/device-type-manage/device-type-manage.component';
import {PreviewingRecordListComponent} from './components/previewing-record-list/previewing-record-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    children: [
      { path: 'dashboard', component: UeaDashboardComponent },
      { path: 'profile', component: SearchProfileComponent },
      { path: 'profileStatus', component: ProfileChangeStatusSearchComponent },
      {
        path: 'duplicatedProfile',
        component: DuplicatedProfileSearchComponent
      },
      { path: 'uploadFailedProfile', component: UploadFailedProfileComponent },
      { path: 'vacRecord', component: VacRecordComponent },
      { path: 'vaccineDetail', component: VaccineDetailComponent },
      { path: 'vacInventorySearch', component: VacInventorySearchComponent },
      {
        path: 'inboundOutboundCollect',
        component: InboundOutboundCollectComponent
      },
      {
        path: 'inboundOutboundDetail',
        component: InboundOutboundDetailComponent
      },
      { path: 'shouldInformExport', component: ShouldInformExportComponent },
      {
        path: 'overdueSpeciesStatistics',
        component: OverdueSpeciesStatisticsComponent
      },
      { path: 'reservationSearch', component: ReservationSearchComponent },
      { path: 'batchSearch', component: BatchSearchComponent },
      { path: 'electronCodeManage', component: ElectronCodeManageComponent },
      { path: 'coldEquipmentManage', component: ColdEquipmentManageComponent },
      {
        path: 'coldTemperatureManage',
        component: ColdTemperatureManageComponent
      },
      { path: 'msgTemplateManage', component: MsgTemplateManageComponent },
      { path: 'msgRecord', component: MsgRecordComponent },
      { path: 'otherManage', component: OtherManageComponent },
      { path: 'deviceTypeManage', component: DeviceTypeManageComponent },
      { path: 'pushNotification', component: PushNotificationComponent },
      { path: 'smsBilling', component: SmsBillingComponent },
      { path: 'inoculationYield', component: InoculationYieldComponent },
      { path: 'povPriceManage', component: PovPriceManagementComponent },
      { path: 'vacDepartmentDeploy', component: VacDepartmentDeployComponent },
      { path: 'previewing', component: PreviewingComponent },
      {path: 'previewingRecord', component: PreviewingRecordListComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }

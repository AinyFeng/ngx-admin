import { NgModule } from '@angular/core';
import { UeaDashboardModule } from '../../@uea/components/dashboard/ueadashboard.module';
import { SharedModule } from '@tod/svs-common-lib';
import { BirthHospitalDataComponent } from './components/base-info-management/birth-hospital-data/birth-hospital-data.component';
import { CommunityDataComponent } from './components/base-info-management/community-data/community-data.component';
import { KindergartenDataComponent } from './components/base-info-management/kindergarten-data/kindergarten-data.component';
import { PovInfoManagementComponent } from './components/base-info-management/pov-info-management/pov-info-management.component';
import { DepartmentManagementComponent } from './components/department-management/department-management.component';
import { AddHospitalComponent } from './components/dialog/add-hospital/add-hospital.component';
import { AddStaffComponent } from './components/dialog/add-staff/add-staff.component';
import { ChangeCommunityComponent } from './components/dialog/change-community/change-community.component';
import { ChangeKindergartenComponent } from './components/dialog/change-kindergarten/change-kindergarten.component';
import { ChooseOfficeComponent } from './components/dialog/choose-office/choose-office.component';
import { PovDialogComponent } from './components/dialog/pov-dialog/pov-dialog.component';
import { PersonnelAdminComponent } from './components/personnel-admin/personnel-admin.component';
import { SysConfDictComponent } from './components/sys-conf-dict/sys-conf-dict.component';
import { SysConfComponent } from './components/sys-conf/sys-conf.component';
import { SysUserComponent } from './components/sys-user/sys-user.component';
import { SysWorkingDayAddComponent } from './components/sys-working-day-add/sys-working-day-add.component';
import { SysWorkingDayComponent } from './components/sys-working-day/sys-working-day.component';
import { SysWorkingTimeComponent } from './components/sys-working-time/sys-working-time.component';
import { mdsSystemDashboardOptions } from './system-dashboard';
import { SystemRoutingModule } from './system-routing.module';
import { SystemComponent } from './system.component';
import { PovVaccineConfigurationComponent } from './components/pov-vaccine-configuration/pov-vaccine-configuration.component';
import { SignImageComponent } from './components/dialog/sign-image/sign-image.component';
import { SysWorkingTimeAddComponent } from './components/sys-working-time-add/sys-working-time-add.component';
import { SysHolidayConfComponent } from './components/sys-holiday-conf/sys-holiday-conf.component';
import { SysHolidayAddComponent } from './components/sys-holiday-add/sys-holiday-add.component';
import {AddDepartmentComponent} from './components/dialog/add-department/add-department.component';
import { ApiSystemWorkingDayService, ApiSystemWorkingTimeService } from '@tod/svs-common-lib';
import { UeaModule } from '../../@uea/uea.module';

const COMPONENTS = [
  SystemComponent,
  SysConfComponent,
  SysConfDictComponent,
  SysWorkingDayComponent,
  SysWorkingTimeComponent,
  SysUserComponent,
  SysWorkingDayAddComponent,
  PersonnelAdminComponent,
  DepartmentManagementComponent,
  PovInfoManagementComponent,
  CommunityDataComponent,
  KindergartenDataComponent,
  BirthHospitalDataComponent,
  AddStaffComponent,
  ChooseOfficeComponent,
  PovDialogComponent,
  AddHospitalComponent,
  ChangeCommunityComponent,
  ChangeKindergartenComponent,
  PovVaccineConfigurationComponent,
  SignImageComponent,
  SysWorkingTimeAddComponent,
  SysHolidayConfComponent,
  SysHolidayAddComponent,
  AddDepartmentComponent
];

const API_SERVICE = [ApiSystemWorkingDayService, ApiSystemWorkingTimeService];

@NgModule({
  imports: [
    UeaModule,
    SystemRoutingModule,
    UeaDashboardModule.forRoot(mdsSystemDashboardOptions)
  ],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
  exports: [...COMPONENTS, UeaModule, SystemRoutingModule],
  providers: [...API_SERVICE]
})
export class SystemModule { }

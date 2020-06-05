import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UeaDashboardComponent } from '../../@uea/components/dashboard/ueadashboard.component';
import { BirthHospitalDataComponent } from './components/base-info-management/birth-hospital-data/birth-hospital-data.component';
import { CommunityDataComponent } from './components/base-info-management/community-data/community-data.component';
import { KindergartenDataComponent } from './components/base-info-management/kindergarten-data/kindergarten-data.component';
import { PovInfoManagementComponent } from './components/base-info-management/pov-info-management/pov-info-management.component';
import { DepartmentManagementComponent } from './components/department-management/department-management.component';
import { PersonnelAdminComponent } from './components/personnel-admin/personnel-admin.component';
import { SysConfDictComponent } from './components/sys-conf-dict/sys-conf-dict.component';
import { SysConfComponent } from './components/sys-conf/sys-conf.component';
import { SysUserComponent } from './components/sys-user/sys-user.component';
import { SysWorkingDayComponent } from './components/sys-working-day/sys-working-day.component';
import { SysWorkingTimeComponent } from './components/sys-working-time/sys-working-time.component';
import { SystemComponent } from './system.component';
import {PovVaccineConfigurationComponent} from './components/pov-vaccine-configuration/pov-vaccine-configuration.component';
import {SysHolidayConfComponent} from './components/sys-holiday-conf/sys-holiday-conf.component';

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    children: [
      { path: 'dashboard', component: UeaDashboardComponent },
      { path: 'sysConf', component: SysConfComponent },
      { path: 'sysConfDict', component: SysConfDictComponent },
      { path: 'sysWorkingDay', component: SysWorkingDayComponent },
      { path: 'sysWorkingTime', component: SysWorkingTimeComponent },
      { path: 'sysUser', component: SysUserComponent },
      { path: 'personnelAdmin', component: PersonnelAdminComponent },
      {
        path: 'departmentManagement',
        component: DepartmentManagementComponent
      },
      { path: 'sysHolidayConf', component: SysHolidayConfComponent },
      { path: 'povInfoManagement', component: PovInfoManagementComponent },
      { path: 'birthHospitalData', component: BirthHospitalDataComponent },
      { path: 'communityData', component: CommunityDataComponent },
      { path: 'kindergartenData', component: KindergartenDataComponent },
      {path: 'povVaccineConfiguration', component: PovVaccineConfigurationComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }

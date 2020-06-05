import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from '../../@uea/components/not-found/not-found.component';
import {ReportComponent} from './report.component';
import {AlertReportComponent} from './component/alert-report/alert-report.component';
import {DeviceRecordReportComponent} from './component/device-record-report/device-record-report.component';
import {TemperatrueReportComponent} from './component/temperatrue-report/temperatrue-report.component';
import {JurisdictionAlertComponent} from './component/jurisdiction-alert/jurisdiction-alert.component';


const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      {
        path: 'temperaturealert',
        component: AlertReportComponent
      },
      {
        path: 'devicerecord',
        component: DeviceRecordReportComponent
      },
      {
        path: 'temperaturerepport',
        component: TemperatrueReportComponent
      },
      {
        path: 'jurisdiction',
        component: JurisdictionAlertComponent
      },
      { path: '', redirectTo: 'alertreport', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}

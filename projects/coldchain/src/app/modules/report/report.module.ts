import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReportRoutingModule} from './report.routing.module';
import {ReportComponent} from './report.component';
import {AlertReportComponent} from './component/alert-report/alert-report.component';
import {JurisdictionAlertComponent} from './component/jurisdiction-alert/jurisdiction-alert.component';
import {TemperatrueReportComponent} from './component/temperatrue-report/temperatrue-report.component';
import {DeviceRecordReportComponent} from './component/device-record-report/device-record-report.component';



@NgModule({
  declarations: [
    ReportComponent,
    AlertReportComponent,
    DeviceRecordReportComponent,
    JurisdictionAlertComponent,
    TemperatrueReportComponent
  ],
  imports: [
    CommonModule, ReportRoutingModule
  ]
})
export class ReportModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HumidityComponent} from '../historydata/component/humidity/humidity.component';
import {QueryComponent} from '../historydata/component/query/query.component';
import {AlertRoutingModule} from './alert.routing.module';
import {AlertComponent} from './alert.component';
import {AlertHandlingComponent} from './component/alert-handling/alert-handling.component';
import {DeviceAlertComponent} from './component/device-alert/device-alert.component';
import {TemperatureHumidityAlertComponent} from './component/temperature-humidity-alert/temperature-humidity-alert.component';

const COMPONENTS = [
  AlertComponent,
  AlertHandlingComponent,
  DeviceAlertComponent,
  TemperatureHumidityAlertComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule, AlertRoutingModule
  ]
})
export class AlertModule { }

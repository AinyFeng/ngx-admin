import { NgModule } from '@angular/core';
import { UeaModule } from '../../@uea/uea.module';
import { RealtimeDataRoutingModule } from './realtime-data.routing.module';
import { MonitorComponent } from './component/monitor/monitor.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {RealtimeDataComponent} from './realtime-data.component';
import { TemperatureHumidityDetailComponent } from './component/temperature-humidity-detail/temperature-humidity-detail.component';

const COMPONENTS = [
  RealtimeDataComponent,
  MonitorComponent,
  TemperatureHumidityDetailComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    UeaModule,
    NgxEchartsModule,
    RealtimeDataRoutingModule
  ]
})
export class RealtimeDataModule { }

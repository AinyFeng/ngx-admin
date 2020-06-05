import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HistorydataRoutingModule} from './historydata.routing.module';
import {HistorydataComponent} from './historydata.component';
import {HumidityComponent} from './component/humidity/humidity.component';
import {QueryComponent} from './component/query/query.component';
import {TemperatureComponent} from './component/temperature/temperature.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxEchartsModule} from 'ngx-echarts';




@NgModule({
  declarations: [
    HistorydataComponent,
    HumidityComponent,
    QueryComponent,
    TemperatureComponent
  ],
  imports: [
    CommonModule, HistorydataRoutingModule, NgZorroAntdModule, ReactiveFormsModule, NgxEchartsModule
  ]
})
export class HistorydataModule { }

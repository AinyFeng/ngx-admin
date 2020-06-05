import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InoculationRateStatisticsComponent} from './inoculation-rate-statistics.component';
import {UeaModule} from '../../@uea/uea.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {InoculationRateStatisticsRoutingModule} from './inoculation-rate-statistics.routing.module';
import {SixOneRateSumComponent} from './components/six-one-rate-sum/six-one-rate-sum.component';
import {SixTwoRateSumComponent} from './components/six-two-rate-sum/six-two-rate-sum.component';
import {SelectVaccineComponent} from './components/select-vaccine/select-vaccine.component';


const COMPONENTS = [
  InoculationRateStatisticsComponent,
  SixOneRateSumComponent,
  SixTwoRateSumComponent,
  SelectVaccineComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    InoculationRateStatisticsRoutingModule,
    UeaModule,
    NgZorroAntdModule
  ]
})
export class InoculationRateStatisticsModule {
}

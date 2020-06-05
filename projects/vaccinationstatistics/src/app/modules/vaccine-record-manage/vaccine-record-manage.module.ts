import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VaccineRecordManageComponent} from './vaccine-record-manage.component';
import {VaccineRecordManageRoutingModule} from './vaccine-record-manage.routing.module';
import {ChildVacRecordComponent} from './components/child-vac-record/child-vac-record.component';
import {AdultVacRecordComponent} from './components/adult-vac-record/adult-vac-record.component';
import {RabiesVacRecordComponent} from './components/rabies-vac-record/rabies-vac-record.component';
import {AdultRabiesStatisticsComponent} from './components/adult-rabies-statistics/adult-rabies-statistics.component';
import {UeaModule} from '../../@uea/uea.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ObstetricsDepartComponent} from './components/obstetrics-depart/obstetrics-depart.component';
import {VacRecordListComponent} from './components/obstetrics-depart/vac-record-list/vac-record-list.component';
import {VacRecordStatisticsComponent} from './components/obstetrics-depart/vac-record-statistics/vac-record-statistics.component';

const COMPONENTS = [
  VaccineRecordManageComponent,
  ChildVacRecordComponent,
  AdultVacRecordComponent,
  RabiesVacRecordComponent,
  AdultRabiesStatisticsComponent,
  ObstetricsDepartComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    VacRecordListComponent,
    VacRecordStatisticsComponent,
  ],
  imports: [
    CommonModule,
    VaccineRecordManageRoutingModule,
    UeaModule,
    NgZorroAntdModule
  ]
})
export class VaccineRecordManageModule {
}

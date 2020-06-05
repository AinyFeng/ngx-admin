import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from '../../@uea/components/not-found/not-found.component';
import {NgModule} from '@angular/core';
import {VaccineRecordManageComponent} from './vaccine-record-manage.component';
import {ChildVacRecordComponent} from './components/child-vac-record/child-vac-record.component';
import {RabiesVacRecordComponent} from './components/rabies-vac-record/rabies-vac-record.component';
import {AdultRabiesStatisticsComponent} from './components/adult-rabies-statistics/adult-rabies-statistics.component';
import {AdultVacRecordComponent} from './components/adult-vac-record/adult-vac-record.component';
import {ObstetricsDepartComponent} from './components/obstetrics-depart/obstetrics-depart.component';

const routes: Routes = [
  {
    path: '',
    component: VaccineRecordManageComponent,
    children: [
      {
        path: 'obstetricsdepart',
        component: ObstetricsDepartComponent,
      },
      {
        path: 'childvacrecord',
        component: ChildVacRecordComponent
      },
      {
        path: 'adultvacrecord',
        component: AdultVacRecordComponent
      },
      {
        path: 'rabiesvacrecord',
        component: RabiesVacRecordComponent
      },
      {
        path: 'adultrabiesstatistics',
        component: AdultRabiesStatisticsComponent
      },
      {path: '', redirectTo: 'obstetricsdepart', pathMatch: 'full'},
      {path: '**', component: NotFoundComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaccineRecordManageRoutingModule {
}

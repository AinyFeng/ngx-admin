import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from '../../@uea/components/not-found/not-found.component';
import {NgModule} from '@angular/core';
import {InoculationRateStatisticsComponent} from './inoculation-rate-statistics.component';
import {SixOneRateSumComponent} from './components/six-one-rate-sum/six-one-rate-sum.component';
import {SixTwoRateSumComponent} from './components/six-two-rate-sum/six-two-rate-sum.component';

const routes: Routes = [
  {
    path: '',
    component: InoculationRateStatisticsComponent,
    children: [
      {
        path: 'sixoneratesum',
        component: SixOneRateSumComponent,
      },
      {
        path: 'sixtworatesum',
        component: SixTwoRateSumComponent
      },
      {path: '', redirectTo: 'sixoneratesum', pathMatch: 'full'},
      {path: '**', component: NotFoundComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InoculationRateStatisticsRoutingModule {
}

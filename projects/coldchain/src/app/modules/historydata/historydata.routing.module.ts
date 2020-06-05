import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from '../../@uea/components/not-found/not-found.component';
import {QueryComponent} from './component/query/query.component';
import {HumidityComponent} from './component/humidity/humidity.component';
import {TemperatureComponent} from './component/temperature/temperature.component';
import {HistorydataComponent} from './historydata.component';

const routes: Routes = [
  {
    path: '',
    component: HistorydataComponent,
    children: [
      {
        path: 'query',
        component: QueryComponent
      },
      {
        path: 'humidity',
        component: HumidityComponent
      },
      {
        path: 'temperature',
        component: TemperatureComponent
      },
      { path: '', redirectTo: 'query', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorydataRoutingModule {
}

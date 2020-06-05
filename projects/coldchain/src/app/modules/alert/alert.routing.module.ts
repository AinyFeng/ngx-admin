import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from '../../@uea/components/not-found/not-found.component';
import {AlertComponent} from './alert.component';
import {AlertHandlingComponent} from './component/alert-handling/alert-handling.component';
import {DeviceAlertComponent} from './component/device-alert/device-alert.component';
import {TemperatureHumidityAlertComponent} from './component/temperature-humidity-alert/temperature-humidity-alert.component';


const routes: Routes = [
  {
    path: '',
    component: AlertComponent,
    children: [
      {
        path: 'handling',
        component: AlertHandlingComponent
      },
      {
        path: 'devicealert',
        component: DeviceAlertComponent
      },
      {
        path: 'temperaturehumidity',
        component: TemperatureHumidityAlertComponent
      },
      { path: '', redirectTo: 'alerthandling', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertRoutingModule {
}

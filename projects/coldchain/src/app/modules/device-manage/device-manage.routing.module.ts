import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from '../../@uea/components/not-found/not-found.component';
import {DeviceManageComponent} from './device-manage.component';
import {ColdChainDeviceComponent} from './component/cold-chain-device/cold-chain-device.component';
import {MaintainManagerComponent} from './component/maintain-manager/maintain-manager.component';
import {MonitorDeviceComponent} from './component/monitor-device/monitor-device.component';
import {SensorComponent} from './component/sensor/sensor.component';
import {ScrappedManagerComponent} from './component/scrapped-manager/scrapped-manager.component';


const routes: Routes = [
  {
    path: '',
    component: DeviceManageComponent,
    children: [
      {
        path: 'device',
        component: ColdChainDeviceComponent
      },
      {
        path: 'maintain',
        component: MaintainManagerComponent
      },
      {
        path: 'monitor',
        component: MonitorDeviceComponent
      },
      {
        path: 'sensor',
        component: SensorComponent
      },
      {
        path: 'scrapped',
        component: ScrappedManagerComponent
      },
      { path: '', redirectTo: 'device', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceManageRoutingModule {
}

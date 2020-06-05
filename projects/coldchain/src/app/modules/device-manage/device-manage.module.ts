import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DeviceManageComponent} from './device-manage.component';
import {DeviceManageRoutingModule} from './device-manage.routing.module';
import {ScrappedManagerComponent} from './component/scrapped-manager/scrapped-manager.component';
import {SensorComponent} from './component/sensor/sensor.component';
import {MonitorDeviceComponent} from './component/monitor-device/monitor-device.component';
import {MaintainManagerComponent} from './component/maintain-manager/maintain-manager.component';
import {ColdChainDeviceComponent} from './component/cold-chain-device/cold-chain-device.component';
import {NbCardModule} from '@nebular/theme';
import {ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { AddEditDeviceComponent } from './component/dialoge/add-edit-device/add-edit-device.component';
import {UeaModule} from '../../@uea/uea.module';
import { AddEditMaintainComponent } from './component/dialoge/add-edit-maintain/add-edit-maintain.component';
import { AddEditMonitorComponent } from './component/dialoge/add-edit-monitor/add-edit-monitor.component';
import { AddEditSencorComponent } from './component/dialoge/add-edit-sencor/add-edit-sencor.component';
import { AddEditScrappedComponent } from './component/dialoge/add-edit-scrapped/add-edit-scrapped.component';


const COMPONENTS = [
  DeviceManageComponent,
  ColdChainDeviceComponent,
  MaintainManagerComponent,
  MonitorDeviceComponent,
  ScrappedManagerComponent,
  SensorComponent,
  AddEditDeviceComponent,
  AddEditMaintainComponent,
  AddEditMonitorComponent,
  AddEditSencorComponent,
  AddEditScrappedComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule, DeviceManageRoutingModule, ReactiveFormsModule, NgZorroAntdModule, UeaModule,
  ]
})
export class DeviceManageModule { }

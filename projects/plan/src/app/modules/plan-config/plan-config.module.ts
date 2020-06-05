import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanConfigComponent } from './plan-config.component';
import { PlanConfigListComponent } from './plan-config-list/plan-config-list.component';
import { PlanConfigFormComponent } from './plan-config-form/plan-config-form.component';
import {UeaModule} from '../../@uea/uea.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {UeaDashboardModule} from '../../@uea/components/dashboard/ueadashboard.module';
import {mdsDashboardOptions} from '../modules-dashboard';
import {PlanConfigRoutingModule} from './plan-config-routing.module';
import {PlanConfigService} from '../services/plan-config.service';



@NgModule({
  declarations: [
    PlanConfigComponent,
    PlanConfigListComponent,
    PlanConfigFormComponent
  ],
  imports: [
    CommonModule,
    UeaModule,
    PlanConfigRoutingModule,
    NgZorroAntdModule,
    UeaDashboardModule.forRoot(mdsDashboardOptions),
  ],
  providers: [
    PlanConfigService
  ]
})
export class PlanConfigModule { }

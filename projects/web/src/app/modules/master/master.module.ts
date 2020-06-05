/**
 * Created by Administrator on 2019/6/19.
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@tod/svs-common-lib';
import { OutPatientManagementComponent } from './components/out-patient-management/out-patient-management.component';
import { MasterRoutingModule } from './master-routing.modules';
import { MasterComponent } from './master.component';
import { UeaModule } from '../../@uea/uea.module';

const COMPONENTS = [OutPatientManagementComponent, MasterComponent];
@NgModule({
  imports: [UeaModule, MasterRoutingModule],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
  exports: [...COMPONENTS, UeaModule, MasterRoutingModule]
})
export class MasterModule { }

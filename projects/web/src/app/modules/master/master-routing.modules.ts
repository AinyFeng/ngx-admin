import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutPatientManagementComponent } from './components/out-patient-management/out-patient-management.component';
import { MasterComponent } from './master.component';
/**
 * Created by Administrator on 2019/6/19.
 */

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      { path: 'out-patient', component: OutPatientManagementComponent },
      { path: '', redirectTo: 'out-patient', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule {}

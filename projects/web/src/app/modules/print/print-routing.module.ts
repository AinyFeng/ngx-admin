import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrintProfileComponent } from './components/print-profile/print-profile.component';
import { PrintVaccRecordComponent } from './components/print-vacc-record/print-vacc-record.component';
import { RegistInfoComponent } from './components/regist-info/regist-info.component';
import { SchoolAttendCertificationComponent } from './components/school-attend-certification/school-attend-certification.component';
import { VaccinateAgreementComponent } from './components/vaccinate-agreement/vaccinate-agreement.component';
import { PrintComponent } from './print.component';
import { PrintFrameComponent } from './print.frame.component';

const routes: Routes = [
  {
    path: '',
    component: PrintFrameComponent,
    children: [
      { path: 'print', component: PrintComponent },
      { path: 'profile', component: PrintProfileComponent },
      { path: 'registInfo', component: RegistInfoComponent },
      { path: 'vaccinateAgreement', component: VaccinateAgreementComponent },
      { path: 'careProve', component: SchoolAttendCertificationComponent },
      { path: 'printVaccRecord', component: PrintVaccRecordComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRoutingModule { }

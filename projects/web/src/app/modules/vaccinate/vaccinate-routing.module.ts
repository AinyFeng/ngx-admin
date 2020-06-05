import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccinateLogComponent } from './components/vaccinate-log/vaccinate-log.component';
// import { VaccinatePlatformComponent } from './components/vaccinate-platform/vaccinate-platform.component';
import { VaccinateComponent } from './vaccinate.component';
import { VaccinatePlatformNewComponent } from './components/vaccinate-platform-new/vaccinate-platform-new.component';
/**
 * Created by Administrator on 2019/5/24.
 */
const routes: Routes = [
  {
    path: '',
    component: VaccinateComponent,
    children: [
      // { path: 'vaccinate-platform', component: VaccinatePlatformComponent },
      { path: 'vaccinatenewplatform', component: VaccinatePlatformNewComponent },
      { path: 'vaccinate-log', component: VaccinateLogComponent },
      { path: '', redirectTo: 'vaccinatenewplatform', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaccinateRoutingModule { }

import { UeaDashboardComponent } from './basecomponents/dashboard/ueadashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { WeblistComponent } from './components/weblist/weblist.component';

const config: ExtraOptions = {
  useHash: false
};

const routes: Routes = [
  { path: 'dashboard', component: UeaDashboardComponent },
  { path: 'weblist', component: WeblistComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

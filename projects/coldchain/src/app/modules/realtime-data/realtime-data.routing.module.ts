import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RealtimeDataComponent } from './realtime-data.component';
import { MonitorComponent } from './component/monitor/monitor.component';
import { NotFoundComponent } from '../../@uea/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: RealtimeDataComponent,
    children: [
      {
        path: 'data',
        component: MonitorComponent
      },
      { path: '', redirectTo: 'data', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RealtimeDataRoutingModule {
}

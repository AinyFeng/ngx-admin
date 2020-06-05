import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UeaDashboardComponent } from '../@uea/components/dashboard/ueadashboard.component';
import { NotFoundComponent } from '../@uea/components/not-found/not-found.component';
import { ModulesComponent } from './modules.component';
import {EntryComponent} from './entry.component';

/**
 * routes 编写这个routes 是有加载顺序的，redirectTo 要放在最后面
 */
const routes: Routes = [
  {
    path: '',
    component: ModulesComponent,
    children: [
      {
        path: 'entry',
        component: EntryComponent,
        children: [
          {
            path: 'realtimedata',
            loadChildren: () => import('./realtime-data/realtime-data.module').then(mod => mod.RealtimeDataModule),
          },
          {
            path: 'alertmanage',
            loadChildren: () => import('./alert/alert.module').then(mod => mod.AlertModule)
          },
          {
            path: 'devicemanage',
            loadChildren: () => import('./device-manage/device-manage.module').then(mod => mod.DeviceManageModule)
          },
          {
            path: 'historydata',
            loadChildren: () => import('./historydata/historydata.module').then(mod => mod.HistorydataModule)
          },
          {
            path: 'report',
            loadChildren: () => import('./report/report.module').then(mod => mod.ReportModule)
          },
          { path: '', redirectTo: 'realtimedata', pathMatch: 'full' },
        ]
      },
      { path: '', redirectTo: 'entry', pathMatch: 'full' },
      { path: 'dashboard', redirectTo: 'entry', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule {
}

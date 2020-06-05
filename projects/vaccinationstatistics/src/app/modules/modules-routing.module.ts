import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../@uea/components/not-found/not-found.component';
import { ModulesComponent } from './modules.component';
import {VaccineAefiManageComponent} from './vaccine-aefi-manage/vaccine-aefi-manage.component';
import {VaccineAefiAddComponent} from './vaccine-aefi-add/vaccine-aefi-add.component';

/**
 * routes 编写这个routes 是有加载顺序的，redirectTo 要放在最后面
 */
const routes: Routes = [
  {
    path: '',
    component: ModulesComponent,
    children: [
      {
        path: 'archivesmanagement',
        loadChildren: () => import('./archives-management/archives-management.module').then(mod => mod.ArchivesManagementModule)
        // loadChildren: './archives-management/archives-management.module#ArchivesManagementModule'
      },
      {
        path: 'vaccinerecordmanage',
        loadChildren: () => import('./vaccine-record-manage/vaccine-record-manage.module').then(mod => mod.VaccineRecordManageModule)
      },
      {
        path: 'inoculationratestatistics',
        loadChildren: () => import('./inoculation-rate-statistics/inoculation-rate-statistics.module').then(mod => mod.InoculationRateStatisticsModule)
      },
      {
        path: 'vaccineaefimanage',
       component: VaccineAefiManageComponent
      },
      {
        path: 'vaccineaefiadd',
        component: VaccineAefiAddComponent
      },
      { path: '', redirectTo: 'archivesmanagement', pathMatch: 'full' },
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

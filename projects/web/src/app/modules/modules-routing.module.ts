import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UeaDashboardComponent } from '../@uea/components/dashboard/ueadashboard.component';
import { NotFoundComponent } from '../@uea/components/not-found/not-found.component';
import { ModulesComponent } from './modules.component';
import { NoticeComponent } from './components/notice/notice.component';

/**
 * routes 编写这个routes 是有加载顺序的，redirectTo 要放在最后面
 */
const routes: Routes = [
  {
    path: '',
    component: ModulesComponent,
    children: [
      {
        path: 'dashboard',
        component: UeaDashboardComponent
      },
      {
        path: 'notice',
        component: NoticeComponent
      },
      {
        path: 'register',
        loadChildren: './register/register.module#RegisterModule'
        // loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
      },
      {
        path: 'payment',
        loadChildren: './payment/payment.module#PaymentModule'
        // loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
      },
      {
        path: 'vaccinate',
        loadChildren: './vaccinate/vaccinate.module#VaccinateModule'
        // loadChildren: () => import('./vaccinate/vaccinate.module').then(m => m.VaccinateModule),
      },
      {
        path: 'report',
        loadChildren: './report/report.module#ReportModule'
        // loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
      },
      {
        path: 'master',
        loadChildren: './master/master.module#MasterModule'
        // loadChildren: () => import('./master/master.module').then(m => m.MasterModule),
      },
      {
        path: 'admin',
        loadChildren:
          './administration/administration.module#AdministrationModule'
        // loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule),
      },
      {
        path: 'system',
        loadChildren: './system/system.module#SystemModule'
        // loadChildren: () => import('./system/system.module').then(m => m.SystemModule),
      },
      {
        path: 'portal',
        loadChildren: './portal/portal.module#PortalModule'
        // loadChildren: () => import('./portal/portal.module').then(m => m.PortalModule),
      },
      {
        path: 'stock',
        loadChildren: './stock/stock.module#StockModule'
        // loadChildren: () => import('./stock/stock.module').then(m => m.StockModule),
      },
      {
        path: 'ticket',
        loadChildren: './ticket/ticket.module#TicketModule'
        // loadChildren: () => import('./ticket/ticket.module').then(m => m.TicketModule),
      },
      {
        path: 'print',
        loadChildren: './print/print.module#PrintModule'
        // loadChildren: () => import('./print/print.module').then(m => m.PrintModule),
      },
      {
        path: 'charge',
        loadChildren: './charge/charge.module#ChargeModule'
        // loadChildren: () => import('./print/print.module').then(m => m.PrintModule),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }

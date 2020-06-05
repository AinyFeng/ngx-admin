import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../../@uea/components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { StockInComponent } from './components/stock-in/stock-in.component';
import { StockOutComponent } from './components/stock-out/stock-out.component';
import { StockLossComponent } from './components/stock-loss/stock-loss.component';
import { StockSendBackComponent } from './components/stock-send-back/stock-send-back.component';
import { StockUseComponent } from './components/stock-use/stock-use.component';
import { StockWriteOffComponent } from './components/stock-write-off/stock-write-off.component';
import { StockApplicationComponent } from './stock-application.component';
import {BatchDistributeComponent} from './components/batch-distribute/batch-distribute.component';

const routes: Routes = [
  {
    path: '',
    component: StockApplicationComponent,
    children: [
      {
        path: 'in',
        component: StockInComponent
      },
      {
        path: 'out',
        component: StockOutComponent
      },
      {
        path: 'loss',
        component: StockLossComponent
      },
      {
        path: 'sendback',
        component: StockSendBackComponent
      },
      {
        path: 'use',
        component: StockUseComponent
      },
      {
        path: 'writeoff',
        component: StockWriteOffComponent
      },
      {
        path: 'distribute',
        component: BatchDistributeComponent
      },
      { path: '', redirectTo: 'in', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockApplicationRoutingModule {
}

import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../../@uea/components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { StockOrderComponent } from './stock-order.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderListDetailComponent } from './components/order-list-detail/order-list-detail.component';

const routes: Routes = [
  {
    path: '',
    component: StockOrderComponent,
    children: [
      {
        path: 'orderlist',
        component: OrderListComponent
      },
      {
        path: 'orderlistdetail',
        component: OrderListDetailComponent
      },
      {path: '', redirectTo: 'orderlist', pathMatch: 'full'},
      {path: '**', component: NotFoundComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockOrderRoutingModule {
}

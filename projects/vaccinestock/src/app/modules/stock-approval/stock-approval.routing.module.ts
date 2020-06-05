import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../../@uea/components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { StockApprovalComponent } from './stock-approval.component';
import { InConfirmComponent } from './components/in-confirm/in-confirm.component';
import { OrderChangeComponent } from './components/order-change/order-change.component';
import { OutApprovalComponent } from './components/out-approval/out-approval.component';
import { OutConfirmComponent } from './components/out-confirm/out-confirm.component';
import { OutReceiptComponent } from './components/out-receipt/out-receipt.component';
import {VacOrderDetailComponent} from './components/order-detail/vac-order-detail-approval/vac-order-detail.component';
import {OutConfirmOrderDetailComponent} from './components/order-detail/out-confirm-order-detail/out-confirm-order-detail.component';
import {InConfirmOrderDetailComponent} from './components/order-detail/in-confirm-order-detail/in-confirm-order-detail.component';
import {OrderChangeOrderDetailComponent} from './components/order-detail/order-change-order-detail/order-change-order-detail.component';
import {OutReceiptOrderDetailComponent} from './components/order-detail/out-receipt-order-detail/out-receipt-order-detail.component';

const routes: Routes = [
  {
    path: '',
    component: StockApprovalComponent,
    children: [
      {
        path: 'inconfirm',
        component: InConfirmComponent
      },
      {
        path: 'orderchange',
        component: OrderChangeComponent
      },
      {
        path: 'outapproval',
        component: OutApprovalComponent,
      },
      {
        path: 'outconfirm',
        component: OutConfirmComponent
      },
      {
        path: 'outreceipt',
        component: OutReceiptComponent
      },
      {
        path: 'outreceipt',
        component: OutReceiptComponent
      },
      {
        path: 'vacorderdetailapproval',
        component: VacOrderDetailComponent
      },
      {
        path: 'vacorderdetailoutconfirm',
        component: OutConfirmOrderDetailComponent
      },
      {
        path: 'vacorderdetailinconfirm',
        component: InConfirmOrderDetailComponent
      },
      {
        path: 'vacorderdetailorderchange',
        component: OrderChangeOrderDetailComponent
      },
      {
        path: 'outreceiptorderdetail',
        component: OutReceiptOrderDetailComponent
      },
      { path: '', redirectTo: 'outapproval', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockApprovalRoutingModule {
}

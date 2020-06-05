import { NgModule } from '@angular/core';
import { StockOrderRoutingModule } from './stock-order.routing.module';
import { UeaModule } from '../../@uea/uea.module';
import { StockOrderComponent } from './stock-order.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderListDetailComponent } from './components/order-list-detail/order-list-detail.component';
import { QRCodeModule } from 'angularx-qrcode';
import { StockSharedModule } from '../stock-shared/stock-shared.module';

const COMPONENTS = [
  StockOrderComponent,
  OrderListComponent,
  OrderListDetailComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    StockOrderRoutingModule,
    UeaModule,
    QRCodeModule,
    StockSharedModule
  ]
})
export class StockOrderModule {
}

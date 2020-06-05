import { NgModule } from '@angular/core';
import { UeaModule } from '../../@uea/uea.module';
import { VaccineBatchInfoComponent } from './components/vaccine-batch-info/vaccine-batch-info.component';
import { VaccineStockInfoComponent } from './components/vaccine-stock-info/vaccine-stock-info.component';
import { OutInDateComponent } from './components/out-in-date/out-in-date.component';
import {PrintApprovalOrderInfoComponent} from './components/print/print-approval-order-info/print-approval-order-info.component';
import {QRCodeModule} from 'angularx-qrcode';
import {PrintStockOutComponent} from './components/print/print-stock-out/print-stock-out.component';
import {PrintSendBackComponent} from './components/print/print-send-back/print-send-back.component';
import {PrintInvoicesComponent} from './components/print/print-invoices/print-invoices.component';
import {PrintScrapOrderComponent} from './components/print/print-scrap-order/print-scrap-order.component';
import {PrintUseOrderComponent} from './components/print/print-use-order/print-use-order.component';
import {PrintBreakageOrderComponent} from './components/print/print-breakage-order/print-breakage-order.component';
import { PrintCheckPlanComponent } from './components/print/print-check-plan/print-check-plan.component';
import { PrintStockInComponent } from './components/print/print-stock-in/print-stock-in.component';

const COMPONENTS = [
  VaccineBatchInfoComponent,
  VaccineStockInfoComponent,
  OutInDateComponent,

  PrintApprovalOrderInfoComponent,
  PrintStockOutComponent,
  PrintSendBackComponent,
  PrintInvoicesComponent,
  PrintScrapOrderComponent,
  PrintUseOrderComponent,
  PrintCheckPlanComponent,
  PrintStockInComponent,
  PrintBreakageOrderComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    UeaModule,
    QRCodeModule
  ],
  exports: [...COMPONENTS]
})
export class StockSharedModule {
}

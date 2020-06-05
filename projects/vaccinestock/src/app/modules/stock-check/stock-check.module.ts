import { NgModule } from '@angular/core';
import { InOutReportComponent } from './components/in-out-report/in-out-report.component';
import { InventoryCheckComponent } from './components/inventory-check/inventory-check.component';
import { InventoryCheckRecordListComponent } from './components/inventory-check-record-list/inventory-check-record-list.component';
import { UeaModule } from '../../@uea/uea.module';
import { StockCheckComponent } from './stock-check.component';
import { StockCheckRoutingModule } from './stock-check.routing.module';
import { AddStockCheckPlanComponent } from './components/add-stock-check-plan/add-stock-check-plan.component';
import { PovStaffApiService } from '@tod/svs-common-lib';
import { InOutReportDetailComponent } from './components/in-out-report-detail/in-out-report-detail.component';
import { PriceAdjustmentComponent } from './components/price-adjustment/price-adjustment.component';
import { CheckPlanComponent } from './components/check-plan/check-plan.component';
import { CheckPlanDetailComponent } from './components/check-plan-detail/check-plan-detail.component';
import { VaccineOrderInformationComponent } from './components/vaccine-order-information/vaccine-order-information.component';
import { StockSharedModule } from '../stock-shared/stock-shared.module';

const COMPONENTS = [
  InOutReportComponent,
  InventoryCheckComponent,
  InventoryCheckRecordListComponent,
  StockCheckComponent,
  AddStockCheckPlanComponent,
  PriceAdjustmentComponent,
  CheckPlanComponent,
  CheckPlanDetailComponent,
  VaccineOrderInformationComponent,
  InOutReportDetailComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    UeaModule,
    StockSharedModule,
    StockCheckRoutingModule
  ],
  providers: [
    PovStaffApiService
  ]
})
export class StockCheckModule {
}

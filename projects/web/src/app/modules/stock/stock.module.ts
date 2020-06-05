import {UeaDashboardModule} from './../../@uea/components/dashboard/ueadashboard.module';
import {NgModule} from '@angular/core';
// 导入 NB 组件库
import {SharedModule} from '@tod/svs-common-lib';
import {StockRoutingModule} from './stock-routing.module';
import {StockComponent} from './stock.component';
import {TotalStockComponent} from './components/total-stock/total-stock.component';
import {StockWarningComponent} from './components/stock-warning/stock-warning.component';
import {DailyInventoryComponent} from './components/daily-inventory/daily-inventory.component';
import {MonthlyInventoryComponent} from './components/monthly-inventory/monthly-inventory.component';
import {CityOutInComponent} from './components/city-out-in/city-out-in.component';
import {TransfferOutInComponent} from './components/transffer-out-in/transffer-out-in.component';
import {BatchInjectComponent} from './components/batch-inject/batch-inject.component';
import {ReportLossComponent} from './components/report-loss/report-loss.component';
import {DisscussOutInComponent} from './components/disscuss-out-in/disscuss-out-in.component';
import {OtherOutInComponent} from './components/other-out-in/other-out-in.component';
import {BiologicalManagementComponent} from './components/biological-management/biological-management.component';
import {AdministrationModule} from '../administration/administration.module';
import {VacManageSearchComponent} from './components/vac-manage-search/vac-manage-search.component';
import {OutPutStorageComponent} from './components/out-put-storage/out-put-storage.component';
import {OutPutStorageDetailComponent} from './components/out-put-storage-detail/out-put-storage-detail.component';
import {BatchQueryComponent} from './components/batch-query/batch-query.component';
import {SupervisionCodeComponent} from './components/supervision-code/supervision-code.component';
import {mdsStockDashboardOptions} from './stock-dashboard';
import {BatchInjectAddComponent} from './components/dialog/batch-inject-add/batch-inject-add.component';
import {StockOutInManagementComponent} from './components/stock-out-in-management/stock-out-in-management.component';
import {CityStockBackComponent} from './components/dialog/city-stock-back/city-stock-back.component';
import {CityInStockComponent} from './components/dialog/city-in-stock/city-in-stock.component';
import {CityStockRefuseComponent} from './components/dialog/city-stock-refuse/city-stock-refuse.component';
import {PovVaccAdjustComponent} from './components/pov-vacc-adjust/pov-vacc-adjust.component';
import {AllotInpovDialogComponent} from './components/dialog/allot-inpov-dialog/allot-inpov-dialog.component';
import {SelfStorageInComponent} from './components/self-storage-in/self-storage-in.component';
import {UeaModule} from '../../@uea/uea.module';
import {ColdChainEquipmentComponent} from './components/cold-chain-equipment/cold-chain-equipment.component';
import {AddColdEquipmentComponent} from './components/dialog/add-cold-equipment/add-cold-equipment.component';
import {BatchInjectBackComponent} from './components/dialog/batch-inject-back/batch-inject-back.component';
import { CityInDetailComponent } from './components/dialog/city-in-detail/city-in-detail.component';
import { SelfStorageAddComponent } from './components/dialog/self-storage-add/self-storage-add.component';
import { InventoryRecordComponent } from './components/inventory-record/inventory-record.component';
import { UpdateInventoryRecordComponent } from './components/dialog/update-inventory-record/update-inventory-record.component';

const COMPONENTS = [
  StockComponent,
  TotalStockComponent,
  StockWarningComponent,
  DailyInventoryComponent,
  MonthlyInventoryComponent,
  CityOutInComponent,
  CityStockBackComponent,
  CityStockRefuseComponent,
  CityInStockComponent,
  TransfferOutInComponent,
  BatchInjectComponent,
  BatchInjectAddComponent,
  ReportLossComponent,
  DisscussOutInComponent,
  OtherOutInComponent,
  BiologicalManagementComponent,
  VacManageSearchComponent,
  OutPutStorageComponent,
  OutPutStorageDetailComponent,
  BatchQueryComponent,
  SupervisionCodeComponent,
  PovVaccAdjustComponent,
  StockOutInManagementComponent,
  AllotInpovDialogComponent,
  SelfStorageInComponent,
  ColdChainEquipmentComponent,
  AddColdEquipmentComponent,
  BatchInjectBackComponent,
  CityInDetailComponent,
  SelfStorageAddComponent,
  InventoryRecordComponent,
  UpdateInventoryRecordComponent
];

@NgModule({
  imports: [
    UeaModule, StockRoutingModule, AdministrationModule,
    UeaDashboardModule.forRoot(mdsStockDashboardOptions),
  ],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
  exports: [...COMPONENTS, UeaModule, StockRoutingModule],
})
export class StockModule {
}

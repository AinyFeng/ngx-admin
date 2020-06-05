import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UeaDashboardComponent } from './../../@uea/components/dashboard/ueadashboard.component';
import { BatchInjectComponent } from './components/batch-inject/batch-inject.component';
import { BatchQueryComponent } from './components/batch-query/batch-query.component';
import { BiologicalManagementComponent } from './components/biological-management/biological-management.component';
import { CityOutInComponent } from './components/city-out-in/city-out-in.component';
import { DailyInventoryComponent } from './components/daily-inventory/daily-inventory.component';
import { DisscussOutInComponent } from './components/disscuss-out-in/disscuss-out-in.component';
import { MonthlyInventoryComponent } from './components/monthly-inventory/monthly-inventory.component';
import { OtherOutInComponent } from './components/other-out-in/other-out-in.component';
import { OutPutStorageDetailComponent } from './components/out-put-storage-detail/out-put-storage-detail.component';
import { OutPutStorageComponent } from './components/out-put-storage/out-put-storage.component';
import { ReportLossComponent } from './components/report-loss/report-loss.component';
import { StockOutInManagementComponent } from './components/stock-out-in-management/stock-out-in-management.component';
import { StockWarningComponent } from './components/stock-warning/stock-warning.component';
import { SupervisionCodeComponent } from './components/supervision-code/supervision-code.component';
import { TotalStockComponent } from './components/total-stock/total-stock.component';
import { TransfferOutInComponent } from './components/transffer-out-in/transffer-out-in.component';
import { VacManageSearchComponent } from './components/vac-manage-search/vac-manage-search.component';
import { StockComponent } from './stock.component';
import {PovVaccAdjustComponent} from './components/pov-vacc-adjust/pov-vacc-adjust.component';
import {SelfStorageInComponent} from './components/self-storage-in/self-storage-in.component';
import {ColdChainEquipmentComponent} from './components/cold-chain-equipment/cold-chain-equipment.component';
import {InventoryRecordComponent} from './components/inventory-record/inventory-record.component';

const routes: Routes = [
  {
    path: '',
    component: StockComponent,
    children: [
      { path: 'dashboard', component: UeaDashboardComponent },
      { path: 'totalStock', component: TotalStockComponent },
      { path: 'stockWarning', component: StockWarningComponent },
      { path: 'dailyInventor', component: DailyInventoryComponent },
      { path: 'inventorRecord', component: InventoryRecordComponent },
      { path: 'monthlyInventory', component: MonthlyInventoryComponent },
      { path: 'cityOutIn', component: CityOutInComponent },
      { path: 'transferOutIn', component: TransfferOutInComponent },
      { path: 'batchInject', component: BatchInjectComponent },
      { path: 'reportLoss', component: ReportLossComponent },
      { path: 'disscussOutIn', component: DisscussOutInComponent },
      { path: 'otherOutIn', component: OtherOutInComponent },
      {
        path: 'biologicalManagement',
        component: BiologicalManagementComponent
      },
      { path: 'vacManageSearch', component: VacManageSearchComponent },
      { path: 'batchQuery', component: BatchQueryComponent },
      { path: 'outPutStorage', component: OutPutStorageComponent },
      { path: 'outPutStorageDetail', component: OutPutStorageDetailComponent },
      { path: 'supervisionCode', component: SupervisionCodeComponent },
      {
        path: 'stockOutInManagement',
        component: StockOutInManagementComponent
      },
      {path: 'vacAdjustManagement', component: PovVaccAdjustComponent},
      {path: 'selfStorageIn', component: SelfStorageInComponent},
      {path: 'coldChainManagement', component: ColdChainEquipmentComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }

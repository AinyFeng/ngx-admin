import { NgModule } from '@angular/core';
import { UeaModule } from '../../@uea/uea.module';
import { VaccineStockInfoComponent } from './components/vaccine-stock-info/vaccine-stock-info.component';
import {QRCodeModule} from 'angularx-qrcode';
import {VaccStockApiService} from '@tod/svs-common-lib';
import {PlanServiceModule} from '../services/plan-service.module';

const COMPONENTS = [
  VaccineStockInfoComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    UeaModule,
    QRCodeModule,
    PlanServiceModule
  ],
  exports: [...COMPONENTS],
  providers: [VaccStockApiService]
})
export class StockSharedModule {
}

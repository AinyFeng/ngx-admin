import { NgModule } from '@angular/core';
import { StockInComponent } from './components/stock-in/stock-in.component';
import { StockOutComponent } from './components/stock-out/stock-out.component';
import { StockSendBackComponent } from './components/stock-send-back/stock-send-back.component';
import { StockWriteOffComponent } from './components/stock-write-off/stock-write-off.component';
import { StockUseComponent } from './components/stock-use/stock-use.component';
import { StockLossComponent } from './components/stock-loss/stock-loss.component';
import { UeaModule } from '../../@uea/uea.module';
import { StockApplicationComponent } from './stock-application.component';
import { StockApplicationRoutingModule } from './stock-application.routing.module';
import { StockSharedModule } from '../stock-shared/stock-shared.module';
import { BatchDistributeComponent } from './components/batch-distribute/batch-distribute.component';

const COMPONENTS = [
  StockApplicationComponent,
  StockInComponent,
  StockOutComponent,
  StockSendBackComponent,
  StockWriteOffComponent,
  StockUseComponent,
  StockLossComponent,
  BatchDistributeComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    UeaModule,
    StockApplicationRoutingModule,
    StockSharedModule
  ]
})
export class StockApplicationModule {
}

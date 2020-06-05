import { NgModule } from '@angular/core';
import { PrintModule } from '../print/print.module';
import { IdCardScanService } from '@tod/svs-common-lib';
// 导入 NB 组件库
import { ScanDialogComponent } from './components/scan-dialog/scan-dialog.component';
import { TicketGeneratorComponent } from './components/ticketgenerator/ticketgenerator.component';
import { TicketRoutingModule } from './ticket-routing.module';
import { TicketComponent } from './ticket.component';
import { RegisterModule } from '../register/register.module';
import { UeaModule } from '../../@uea/uea.module';

const COMPONENTS = [
  TicketComponent,
  TicketGeneratorComponent,
  ScanDialogComponent
];

@NgModule({
  imports: [UeaModule, TicketRoutingModule, PrintModule, RegisterModule],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [IdCardScanService]
})
export class TicketModule { }

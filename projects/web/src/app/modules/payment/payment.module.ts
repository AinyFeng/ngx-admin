import { NgModule } from '@angular/core';
import { PrintModule } from '../print/print.module';
import { PaymentPlatformComponent } from './components/payment-platform/payment-platform.component';
import { ReportStatisticsComponent } from './components/report-statistics/report-statistics.component';
import { SetdialogComponent } from './components/setdialog/setdialog.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import {
  ProfileService, VaccinateService, RegQueueService, DicDataService,
  RegistRecordService, PaymentService, DictionaryPipe, SharedModule
} from '@tod/svs-common-lib';
import { UeaModule } from '../../@uea/uea.module';
import { PaidListComponentComponent } from './components/paid-list-component/paid-list-component.component';
import {AlipayDialogComponent} from './components/alipay-dialog/alipay-dialog.component';

/**
 * Created by Administrator on 2019/5/20.
 */
const API_SERVICE = [
  ProfileService,
  VaccinateService,
  RegQueueService,
  DicDataService,
  DictionaryPipe,
  RegistRecordService,
  PaymentService
];

const COMPONENTS = [
  PaymentComponent,
  PaymentPlatformComponent,
  SetdialogComponent,
  ReportStatisticsComponent,
  AlipayDialogComponent
];
@NgModule({
  imports: [UeaModule, PaymentRoutingModule, PrintModule, SharedModule],
  declarations: [...COMPONENTS, PaidListComponentComponent],
  entryComponents: [...COMPONENTS],
  exports: [...COMPONENTS, PaymentRoutingModule],
  providers: [...API_SERVICE]
})
export class PaymentModule { }

import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { PrintInjectSheetComponent } from '../register/components/print-dialog/print-inject-sheet/print-inject-sheet.component';
import { CallNumberInfoComponent } from './components/call-number-info/call-number-info.component';
import { ChildCaseInfoComponent } from './components/child-case-info/child-case-info.component';
import { InjectionSheetDialogComponent } from './components/injection-sheet-dialog/injection-sheet-dialog.component';
import { InjectionSheetComponent } from './components/injection-sheet/injection-sheet.component';
import { PrintProfileComponent } from './components/print-profile/print-profile.component';
import { PrintRabiesProveComponent } from './components/print-rabies-prove/print-rabies-prove.component';
import { PrintReceiptComponent } from './components/print-receipt/print-receipt.component';
import { PrintVaccRecordComponent } from './components/print-vacc-record/print-vacc-record.component';
import { RabiesAgreementComponent } from './components/rabies-agreement/rabies-agreement.component';
import { RegistInfoComponent } from './components/regist-info/regist-info.component';
import { SchoolAttendCertificationComponent } from './components/school-attend-certification/school-attend-certification.component';
import { ShanghaiImmunityVacCardComponent } from './components/shanghai-immunity-vac-card/shanghai-immunity-vac-card.component';
import { SpecialVaccineComponent } from './components/special-vaccine/special-vaccine.component';
import { VaccinateAgreementComponent } from './components/vaccinate-agreement/vaccinate-agreement.component';
import { PrintRoutingModule } from './print-routing.module';
import { PrintComponent } from './print.component';
import { UeaModule } from '../../@uea/uea.module';
import { PrintFrameComponent } from './print.frame.component';

const COMPONENTS = [
  PrintFrameComponent,
  PrintComponent,
  PrintProfileComponent,
  PrintVaccRecordComponent,
  VaccinateAgreementComponent,
  CallNumberInfoComponent,
  RegistInfoComponent,
  SchoolAttendCertificationComponent,
  PrintReceiptComponent,
  ShanghaiImmunityVacCardComponent,
  InjectionSheetComponent,
  PrintInjectSheetComponent,
  InjectionSheetDialogComponent,
  ChildCaseInfoComponent,
  SpecialVaccineComponent,
  RabiesAgreementComponent,
  PrintRabiesProveComponent
];

@NgModule({
  imports: [UeaModule, PrintRoutingModule, QRCodeModule],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
  exports: [...COMPONENTS, UeaModule, PrintRoutingModule]
})
export class PrintModule { }

import { NgxWebstorageModule } from '@tod/ngx-webstorage';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NbDialogModule, NbSelectModule } from '@nebular/theme';
import { DebounceClickDirective } from './directive/debounce.click.directive';
import { AdministrativePipe } from './pipe/administrative.pipe';
import { BusinessTypePipe } from './pipe/business.type.pipe';
import { CommunityNamePipe } from './pipe/community.name.pipe';
import { DepartmentNamePipe } from './pipe/department.name.pipe';
import { DictionaryPipe } from './pipe/dictionary.pipe';
import { IsHaveLocalProfilePipe } from './pipe/isHaveLocalProfile.pipe';
import { KeepHtmlPipe } from './pipe/keep.html.pipe';
import { ManufacturePipe } from './pipe/manufacture.pipe';
import {AssetsNamePipe} from './pipe/assets.name.pipe';
import { NationPipe } from './pipe/nation.pipe';
import { PovNamePipe } from './pipe/pov.name.pipe';
import { QbGenderPipePipe } from './pipe/qb-gender-pipe.pipe';
import { QbTablePipe } from './pipe/qb-table-pipe';
import { QbTableFilterFun } from './pipe/qbTableFilterFun';
import { ReservationChannelPipe } from './pipe/reservation.channel.pipe';
import { VacBroadHeadingPipe } from './pipe/vac.broad.heading.pipe';
import { VacProductNamePipe } from './pipe/vac.product.name.pipe';
import { VacSubclassPipe } from './pipe/vac.subclass.pipe';
import { VaccineSubclassPipe } from './pipe/vaccine.subclass.pipe';
import { WorkDayPipe } from './pipe/work.day.pipe';
import { SysConfGroupPipe } from './pipe/sys.conf.group.pipe';
import { ReservationTimePipe } from './pipe/reservation.time.pipe';
import { NbSelectAllComponent } from './form/nb-select-override/nb-select-all.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberTransferDirective } from './directive/number.transfer.directive';
import { HospitalNamePipe } from './pipe/hospital.name.pipe';
import { OrderStatusPipe } from './pipe/order.status.pipe';
import { PovStaffNamePipe } from './pipe/pov.staff.name.pipe';
import { InvoiceStatusPipe } from './pipe/invoice.status.pipe';
import {InputNoSpaceDirective} from './directive/input.nospace.directive';
import { SelectDistrictComponent } from './component/select-district/select-district.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LoseEfficacyDatePipe } from './pipe/lose-efficacy-date.pipe';
import { FixedAssetsName } from './pipe/fixed.assets.name.pipe';
import {StockInoutMemoPipe} from './pipe/stock.inout.memo.pipe';
import { VaccinateEleCode } from './pipe/vaccinate.ele.code.pipe';
import {RabiesStrategy} from './pipe/rabies.strategy.pipe';

const DECLARATIONS = [
  QbTablePipe,
  QbTableFilterFun,
  QbGenderPipePipe,
  DictionaryPipe,
  NationPipe,
  VacBroadHeadingPipe,
  VacSubclassPipe,
  PovNamePipe,
  CommunityNamePipe,
  VacProductNamePipe,
  ManufacturePipe,
  VaccineSubclassPipe,
  AdministrativePipe,
  IsHaveLocalProfilePipe,
  LoseEfficacyDatePipe,
  DebounceClickDirective,
  KeepHtmlPipe,
  BusinessTypePipe,
  DepartmentNamePipe,
  ReservationChannelPipe,
  WorkDayPipe,
  SysConfGroupPipe,
  ReservationTimePipe,
  HospitalNamePipe,
  OrderStatusPipe,
  PovStaffNamePipe,
  InvoiceStatusPipe,
  AssetsNamePipe,
  StockInoutMemoPipe,
  FixedAssetsName,
  RabiesStrategy,
  VaccinateEleCode,

  NbSelectAllComponent,
  NumberTransferDirective,
  InputNoSpaceDirective,

  SelectDistrictComponent
];

const MODULES = [
  CommonModule,
  NbDialogModule.forChild(),
  NgxWebstorageModule,
  NbSelectModule,
  NgZorroAntdModule,
  FormsModule,
  ReactiveFormsModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS],
  entryComponents: [...DECLARATIONS]
})
export class SharedModule { }

import { UeaDashboardModule } from './components/dashboard/ueadashboard.module';
import { SharedModule } from '@tod/svs-common-lib';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NbMomentDateModule } from '@nebular/moment';
import { TranslateModule } from '@ngx-translate/core';

import {
  NbThemeModule,
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbCardModule,
  NbLayoutModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbPopoverModule,
  NbContextMenuModule,
  NbProgressBarModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbStepperModule,
  NbListModule,
  NbToastrModule,
  NbAccordionModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbSpinnerModule,
  NbRadioModule,
  NbSelectModule,
  NbChatModule,
  NbTooltipModule,
  NbCalendarKitModule,
  NbIconModule,
  NbBadgeModule,
  NbToggleModule
} from '@nebular/theme';

import { NbSecurityModule } from '@nebular/security';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgZorroAntdModule, NzTableModule, NzSelectModule } from 'ng-zorro-antd';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { PageFooterComponent } from './components/footer/page-footer.component';
import { PagePortalComponent } from './components/portal/page-portal.component';
import { PageHeaderComponent } from './components/header/page-header.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UeaExchangeRatesComponent } from './components/graphql/ueaexchangerates.component';
import { UeaAuthComponent } from './components/layout/ueaauth.component';
import { UeaLoginComponent } from './components/login/uealogin.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ThemeModule } from './theme/theme.module';
import { ConfirmDialogComponent } from './components/dialog/confirm-dialog/confirm-dialog.component';
import { DialogNamePromptComponent } from './components/dialog/dialog-name-prompt/dialog-name-prompt.component';
import { SearchResultComponent } from './components/dialog/search-result/search-result.component';
import { ShowFormErrorsComponent } from './components/form/show-form-errors/show-form-errors.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { UeaAuthShareModule } from '@tod/uea-auth-lib';
import { ToolsPortalComponent } from './components/portal/tools-portal.component';

const BASE_MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule
];

const SHARED_MODULES = [
  NzSelectModule,
  NbThemeModule,
  NbCardModule,
  NbLayoutModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbProgressBarModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbStepperModule,
  NbButtonModule,
  NbListModule,
  NbToastrModule,
  NbInputModule,
  NbAccordionModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbAlertModule,
  NbSpinnerModule,
  NbRadioModule,
  NbSelectModule,
  NbChatModule,
  NbTooltipModule,
  NbCalendarKitModule,
  NbIconModule,
  NbMomentDateModule,
  NbBadgeModule,
  ThemeModule,
  NbSidebarModule,
  Ng2SmartTableModule,
  NgbModule,
  NgZorroAntdModule,
  NzTableModule,
  TranslateModule,
  NbToggleModule,
  NbEvaIconsModule,
  NbSecurityModule,
  SharedModule,
  UeaAuthShareModule,
  UeaDashboardModule
];

const LOCAL_DECLARATIONS = [
  PageFooterComponent,
  PagePortalComponent,
  PageHeaderComponent,
  NotFoundComponent,
  UeaExchangeRatesComponent,
  UeaAuthComponent,
  UeaLoginComponent,
  ConfirmDialogComponent, DialogNamePromptComponent, SearchResultComponent,
  ShowFormErrorsComponent,
  PersonalInfoComponent, ToolsPortalComponent
];

@NgModule({
  imports: [...BASE_MODULES, ...SHARED_MODULES],
  exports: [...BASE_MODULES, ...SHARED_MODULES, ...LOCAL_DECLARATIONS],
  declarations: [...LOCAL_DECLARATIONS],
  providers: []
})
export class UeaModule { }

import { NgModule, ModuleWithProviders } from '@angular/core';
import { UeaDashboardOptions, UEA_DASHBOARD_OPTIONS } from './uea.options';
import { UeaDashboardComponent } from './ueadashboard.component';
import { UeaStatusCardComponent } from './status-card/ueastatus-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  NbCardModule,
  NbIconModule
} from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgZorroAntdModule, NzTableModule } from 'ng-zorro-antd';
import { ThemeModule } from '../../theme/theme.module';

const BASE_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule
];

const SHARED_MODULES = [
  NbCardModule,
  NbIconModule,
  ThemeModule,
  NgbModule,
  NgZorroAntdModule,
  NzTableModule,
];

const LOCAL_DECLARATIONS = [UeaDashboardComponent, UeaStatusCardComponent];

@NgModule({
  imports: [...BASE_MODULES, ...SHARED_MODULES],
  exports: [...BASE_MODULES, ...SHARED_MODULES, ...LOCAL_DECLARATIONS],
  declarations: [...LOCAL_DECLARATIONS]
})
export class UeaDashboardModule {
  static forRoot(config?: UeaDashboardOptions): ModuleWithProviders<UeaDashboardModule> {
    return {
      ngModule: UeaDashboardModule,
      providers: [
        {
          provide: UEA_DASHBOARD_OPTIONS,
          useValue: config
        }
      ]
    };
  }
}

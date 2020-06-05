import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { JwksValidationHandler, OAuthModule, OAuthModuleConfig, OAuthStorage, ValidationHandler } from 'angular-oauth2-oidc';

import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { UeaSimpleRoleProvider, defaultUeaSecurityOptions } from './uea.auth.security';
import { UeaAuthStorageService } from './uea.auth.storage.service';
import { ConfigService, ConfigModule, ConfigLoader } from '@ngx-config/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfigHttpLoader } from '@ngx-config/http-loader';
import { UeaAuthModuleConfig } from './uea.auth.module.config';
import { UeaProfileNamePipe } from './uea.profile.name.pipe';

export function ueaAppConfigFactory(http: HttpClient): ConfigLoader {
  const localConfigLoader = new ConfigHttpLoader(
    http,
    './assets/config/uea.config.json'
  ); // API ENDPOINT (local)
  return localConfigLoader;
}

const BASE_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  HttpClientModule
];

const NB_MODULES = [
];

const LocalModules = [
  ConfigModule.forRoot({
    provide: ConfigLoader,
    useFactory: ueaAppConfigFactory,
    deps: [HttpClient]
  }),
  OAuthModule.forRoot(),
];

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES, ...LocalModules],
  exports: [...BASE_MODULES, ...NB_MODULES],
  declarations: [],
})
export class UeaAuthModule {
  static forRoot(config?: UeaAuthModuleConfig): ModuleWithProviders<UeaAuthModule> {
    return {
      ngModule: UeaAuthModule,
      providers: [
        { provide: OAuthModuleConfig, useExisting: UeaAuthModuleConfig },
        { provide: ValidationHandler, useClass: JwksValidationHandler },
        { provide: OAuthStorage, useClass: UeaAuthStorageService },
        { provide: UeaAuthModuleConfig, useValue: config },
        ...NbSecurityModule.forRoot(defaultUeaSecurityOptions).providers,
        { provide: NbRoleProvider, useClass: UeaSimpleRoleProvider },
        ConfigService,
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: UeaAuthModule) {
    if (parentModule) {
      throw new Error('UeaAuthModule is already loaded. Import it in the AppModule only');
    }
  }
}

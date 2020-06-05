import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { ConfigService } from '@ngx-config/core';

@Injectable({ providedIn: 'root' })
export class UeaAuthConfigService {
  private defaultAuthConfig: Partial<AuthConfig> = {
    issuer: 'https://uat.chinavacc.com.cn',
    clientId: 'e83508de-89c0-4188-adc4-be240631d790',
    redirectUri: window.location.origin, // index.html',
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
    // scope: 'openid svsprofile city locality phone address mobile_phone phone_mobile_number email user_name country department',
    scope: 'openid svsprofile',
    silentRefreshTimeout: 5 * 1000, // For faster testing
    timeoutFactor: 0.8, // For faster testing
    sessionChecksEnabled: true,
    sessionCheckIntervall: 300 * 1000,
    showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
    clearHashAfterLogin: false,
    silentRefreshShowIFrame: false,
  };

  private userAuthConfig: Partial<AuthConfig> = {};
  private finalAuthConfig: Partial<AuthConfig> = {};
  private baseURI: string = '/';

  constructor(private configService: ConfigService) {
    this.userAuthConfig = this.configService.getSettings('auth.AuthConfig');
    let tmp: Partial<AuthConfig> = {};
    if (this.userAuthConfig['baseURI']) {
      this.baseURI = this.userAuthConfig['baseURI'];
      tmp = {
        redirectUri: window.location.origin + this.userAuthConfig['baseURI'],
        silentRefreshRedirectUri: window.location.origin + this.userAuthConfig['baseURI'] + '/silent-refresh.html',
      };
    }
    this.finalAuthConfig = Object.assign({} as AuthConfig, this.defaultAuthConfig, this.userAuthConfig, tmp);
  }

  getConfig(): AuthConfig {
    return this.finalAuthConfig;
  }

  getCBaseURI(): string {
    return this.baseURI;
  }
}

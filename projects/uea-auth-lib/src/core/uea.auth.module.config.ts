import { OAuthModuleConfig } from 'angular-oauth2-oidc';


export abstract class UeaAuthModuleConfig extends OAuthModuleConfig {

}


export const ueaAuthModuleConfig: UeaAuthModuleConfig = {
  resourceServer: {
    allowedUrls: [
      'https://svs.chinavacc.com.cn',
      'https://svs.chinavacc.com.cn:19999',
      'https://uat.chinavacc.com.cn',
      'https://uat.chinavacc.com.cn:19999',
      'http://localhost:19999',
      'https://localhost:19999',
      'https://localhost:4200'
    ],
    sendAccessToken: true
  }
};

import 'hammerjs';
/**
 * @license
 * Copyright TOD. All Rights Reserved.
 * Licensed under the Commercial License. See License.txt in the project root for license information.
 */
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {WxModule} from './app/wx.module';
import {environment} from './environments/environment';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(WxModule)
  .catch(err => console.error(err));

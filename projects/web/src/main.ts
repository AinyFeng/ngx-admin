/**
 * @license
 * Copyright TOD. All Rights Reserved.
 * Licensed under the Commercial License. See License.txt in the project root for license information.
 */
import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);

// if (environment.production) {
//   enableProdMode();
// }

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  NbThemeModule,
} from '@nebular/theme';
@NgModule({
  imports: [CommonModule],
  exports: [CommonModule]
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default'
          },
        ).providers
      ]
    } as ModuleWithProviders<ThemeModule>;
  }
}

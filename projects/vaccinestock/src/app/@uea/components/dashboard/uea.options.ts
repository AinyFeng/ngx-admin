import { InjectionToken } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

export class CardSettings extends NbMenuItem {
  type?: string = 'info';
  on?: boolean = true;
}

export class UeaDashboardOptions {
  title: string = '请配置系统标题';
  cards: CardSettings[] = [];
}

export const defaultDashboardOptions: UeaDashboardOptions = {
  title: '请配置系统名称',
  cards: []
};

export const UEA_DASHBOARD_OPTIONS = new InjectionToken<UeaDashboardOptions>(
  'Uea Dashboard Options'
);

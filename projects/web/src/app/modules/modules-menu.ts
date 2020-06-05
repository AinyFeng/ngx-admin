import { NbMenuItem } from '@nebular/theme';

export const MODULES_MENU_ITEMS: NbMenuItem[] = [
  {
    title: '主面板',
    icon: 'landmark',
    link: '/modules/dashboard',
    home: true
  },
  {
    title: '自助排号',
    icon: 'user-tag',
    link: '/modules/ticket/ticketgenerator'
  },
  {
    title: '医生工作台',
    icon: 'notes-medical',
    link: '/modules/register/register'
  },
  {
    title: '收银台',
    icon: 'cash-register',
    link: '/modules/payment/payment-platform'
  },
  {
    title: '接种台',
    icon: 'user-nurse',
    link: '/modules/vaccinate/vaccinatenewplatform'
  },
  {
    title: '库存管理',
    icon: 'briefcase-medical',
    link: '/modules/stock/dashboard'
  },
  {
    title: '统计与报表',
    icon: 'chart-line',
    link: '/modules/report/dashboard'
  },
  {
    title: '日常管理',
    icon: 'toolbox',
    link: '/modules/admin/dashboard'
  },
  {
    title: '系统管理',
    icon: 'cogs',
    link: '/modules/system/dashboard'
  },
  /*  {
      title: '打印',
      icon: 'print',
      link: '/modules/print',
    },*/
  /*  {
      title: '对账管理',
      icon: 'dollar-sign',
      link: '/modules/charge',
    },*/
  {
    title: '控制台',
    icon: 'user-cog',
    link: '/uea/dashboard',
    hidden: true
  }
];

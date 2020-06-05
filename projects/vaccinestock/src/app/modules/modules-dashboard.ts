import { UeaDashboardOptions } from '../@uea/components/dashboard/uea.options';

export const mdsDashboardOptions: UeaDashboardOptions = {
  title: '智慧预防接种平台',
  cards: [
    {
      title: '系统公告',
      icon: 'bell',
      type: 'success',
      link: '/modules/notice',
      on: true
    },
    {
      title: '自助排号',
      icon: 'user-tag',
      type: 'success',
      link: '/modules/ticket',
      on: true
    },
    {
      title: '登记台',
      icon: 'notes-medical',
      type: 'success',
      link: '/modules/register',
      on: true,
      hidden: false
    },
    {
      title: '收银台',
      icon: 'cash-register',
      type: 'success',
      link: '/modules/payment',
      on: true
    },
    {
      title: '接种台',
      icon: 'user-nurse',
      type: 'success',
      link: '/modules/vaccinate',
      on: true
    },
    {
      title: '打印',
      icon: 'print',
      type: 'success',
      link: '/modules/print',
      on: true
    },
    {
      title: '报表管理',
      icon: 'dollar-sign',
      type: 'success',
      link: '/modules/charge',
      on: true
    },
    {
      title: '库存管理',
      icon: 'briefcase-medical',
      type: 'info',
      link: '/modules/stock',
      on: true
    },
    {
      title: '统计与报表',
      icon: 'chart-line',
      type: 'info',
      link: '/modules/report',
      on: true
    },
    {
      title: '日常管理',
      icon: 'toolbox',
      type: 'info',
      link: '/modules/admin',
      on: true
    },
    {
      title: '系统管理',
      icon: 'cogs',
      type: 'info',
      link: '/modules/system',
      on: true
    },
    {
      title: '用户设置',
      icon: 'user-cog',
      link: '/modules/portal',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: 'Apollo',
      icon: 'star-of-david',
      link: '/modules/apollo',
      type: 'info',
      on: true,
      hidden: true
    }
  ]
};

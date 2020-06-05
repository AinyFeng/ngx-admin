import { UeaDashboardOptions } from '../@uea/components/dashboard/uea.options';

export const mdsDashboardOptions: UeaDashboardOptions = {
  title: '主面板',
  cards: [
    {
      title: '系统公告',
      icon: 'bell',
      type: 'success',
      link: '/tools/notice',
      on: true
    },
    {
      title: '自助排号',
      icon: 'user',
      type: 'success',
      link: '/modules/ticket/ticketgenerator',
      on: true
    },
    {
      title: '医生工作台',
      icon: 'notification',
      type: 'success',
      link: '/modules/register/register',
      on: true,
      hidden: false
    },
    {
      title: '收银台',
      icon: 'pay-circle',
      type: 'success',
      link: '/modules/payment/payment-platform',
      on: true
    },
    {
      title: '接种台',
      icon: 'usergroup-add',
      type: 'success',
      link: '/modules/vaccinate/vaccinatenewplatform',
      on: true
    },
    {
      title: '打印中心',
      icon: 'printer',
      type: 'success',
      link: '/modules/print/print',
      on: true
    },
    {
      title: '报表管理',
      icon: 'table',
      type: 'success',
      link: '/modules/charge/charge',
      on: true
    },
    {
      title: '库存管理',
      icon: 'bank',
      type: 'info',
      link: '/modules/stock/dashboard',
      on: true
    },
    {
      title: '统计与报表',
      icon: 'file-done',
      type: 'info',
      link: '/modules/report/dashboard',
      on: true
    },
    {
      title: '日常管理',
      icon: 'tool',
      type: 'info',
      link: '/modules/admin/dashboard',
      on: true
    },
    {
      title: '系统管理',
      icon: 'setting',
      type: 'info',
      link: '/modules/system/dashboard',
      on: true
    },
    {
      title: '用户设置',
      icon: 'profile',
      link: '/modules/portal/dashboard',
      type: 'info',
      on: true,
      hidden: true
    }
  ]
};

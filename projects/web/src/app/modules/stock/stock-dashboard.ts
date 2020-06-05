import { UeaDashboardOptions } from './../../@uea/components/dashboard/uea.options';

export const mdsStockDashboardOptions: UeaDashboardOptions = {
  title: '库存管理',
  cards: [
    {
      title: '总库存量',
      link: '/modules/stock/totalStock',
      icon: 'bank',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      'title': '库存查询',
      'link': '/modules/stock/vacManageSearch',
      icon: 'bank',
      type: 'info',
      on: true,
    },
    {
      'title': '出入库明细',
      'link': '/modules/stock/outPutStorageDetail',
      icon: 'bank',
      type: 'info',
      on: true,
    },
    {
      'title': '出入库汇总',
      'link': '/modules/stock/outPutStorage',
      icon: 'bank',
      type: 'info',
      on: true
    },
    {
      title: '预售查询',
      link: '/modules/stock/stockWarning',
      icon: 'bank',
      type: 'info',
      on: true
    },
    {
      title: '库存盘点',
      link: '/modules/stock/dailyInventor',
      icon: 'bank',
      type: 'info',
      on: true
    },
    {
      title: '库存盘点记录',
      link: '/modules/stock/inventorRecord',
      icon: 'bank',
      type: 'info',
      on: true
    },
    {
      title: '月度盘点',
      link: '/modules/stock/monthlyInventory',
      icon: 'bank',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '平台入库',
      link: '/modules/stock/cityOutIn',
      icon: 'bank',
      type: 'info',
      on: true
    },
    {
      title: '平级调拨',
      link: '/modules/stock/transferOutIn',
      icon: 'bank',
      type: 'info',
      on: true,
      hidden: true,
    },
    {
      title: '报损',
      link: '/modules/stock/reportLoss',
      icon: 'bank',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '疫苗使用',
      link: '/modules/stock/biologicalManagement',
      icon: 'bank',
      type: 'info',
      on: true
    },
    {
      'title': '疫苗调剂',
      'link': '/modules/stock/vacAdjustManagement',
      icon: 'bank',
      type: 'info',
      on: true
    },
    {
      title: '生物制品库存',
      group: true,
      icon: 'bank',
      type: 'info',
      on: true
    },
    {
      'title': '电子监管码',
      'link': '/modules/stock/supervisionCode',
      icon: 'bank',
      type: 'info',
      on: true,
      hidden: true,
    },
    {
      title: '自采入库',
      link: '/modules/stock/selfStorageIn',
      icon: 'bank',
      type: 'info',
      on: true
    },
    {
      title: '冷链设备',
      link: '/modules/stock/coldChainManagement',
      icon: 'bank',
      type: 'info',
      on: true
    },
    {
      'title': '批号查询',
      'link': '/modules/stock/batchQuery',
      icon: 'bank',
      type: 'info',
      on: true,
    },
  ]
};

import { UeaDashboardOptions } from './../../@uea/components/dashboard/uea.options';

export const mdsAdminDashboardOptions: UeaDashboardOptions = {
  title: '日常管理',
  cards: [
    {
      title: '档案查询',
      link: '/modules/admin/profile',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '在册变更',
      link: '/modules/admin/profileStatus',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '重卡查询',
      link: '/modules/admin/duplicatedProfile',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '未传档案',
      link: '/modules/admin/uploadFailedProfile',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '接种查询',
      link: '/modules/admin/vacRecord',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '应种通知',
      link: '/modules/admin/shouldInformExport',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '逾期未种',
      link: '/modules/admin/overdueSpeciesStatistics',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '接种合格率',
      link: '/modules/admin/inoculationYield',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '预约查询',
      link: '/modules/admin/reservationSearch',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '预诊管理',
      link: '/modules/admin/previewingRecord',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '预诊模板',
      link: '/modules/admin/previewing',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '短信模板',
      link: '/modules/admin/msgTemplateManage',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '短信记录',
      link: '/modules/admin/msgRecord',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '短信计费',
      link: '/modules/admin/smsBilling',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '固定资产',
      link: '/modules/admin/otherManage',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '设备类型',
      link: '/modules/admin/deviceTypeManage',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '门诊调价',
      link: '/modules/admin/povPriceManage',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '疫苗配置',
      link: '/modules/admin/vacDepartmentDeploy',
      icon: 'tool',
      type: 'info',
      on: true
    },
    {
      title: '消息推送',
      link: '/modules/admin/pushNotification',
      icon: 'tool',
      type: 'info',
      on: true,
      hidden: true,
    },
    {
      title: '批量接种',
      link: '/modules/stock/batchInject',
      icon: 'tool',
      type: 'info',
      on: true,
    }
  ]
};

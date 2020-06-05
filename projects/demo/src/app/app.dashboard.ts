import { UeaDashboardOptions } from './basecomponents/dashboard/uea.options';

const BASE_URL_SVS = 'https://svs.chinavacc.com.cn';
const BASE_URL_SaaS = 'https://svs.chinavacc.com.cn/saas';
const BASE_URL_POV = 'https://svs.chinavacc.com.cn/pov';
const BASE_URL_UAT = 'https://uat.chinavacc.com.cn';

export const appDashboardOptions: UeaDashboardOptions = {
  title: '主面板',
  cards: [
    {
      title: '门诊Web',
      icon: 'bell',
      type: 'success',
      url: `${BASE_URL_SVS}:19999`,
      on: true
    },
    {
      title: '微信公众号',
      icon: 'user',
      type: 'success',
      url: `${BASE_URL_SVS}/wxpub`,
      on: true
    },
    {
      title: '产科接种台',
      icon: 'notification',
      type: 'success',
      url: `${BASE_URL_SVS}/pov/obstetric`,
      on: true,
      hidden: false
    },
    {
      title: '平台出入库管理',
      icon: 'pay-circle',
      type: 'success',
      url: `${BASE_URL_SaaS}/stock`,
      on: true
    },
    {
      title: '平台计划管理',
      icon: 'usergroup-add',
      type: 'success',
      url: `${BASE_URL_SaaS}/plan`,
      on: true
    },
    {
      title: '平台查验管理',
      icon: 'printer',
      type: 'success',
      url: `${BASE_URL_SaaS}/examine`,
      on: true
    },
    {
      title: '平台冷链管理',
      icon: 'table',
      type: 'success',
      url: `${BASE_URL_SaaS}/coldchain`,
      on: true
    },
    {
      title: '平台统计及AEFI管理',
      icon: 'file-done',
      type: 'info',
      url: `${BASE_URL_SaaS}/statistics`,
      on: true
    }
  ]
};

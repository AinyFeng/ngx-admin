import { NbMenuItem } from '@nebular/theme';

export const MODULE_MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: '主面板',
  //   icon: 'landmark',
  //   link: '/modules/dashboard',
  //   home: true
  // },
  {
    title: '计划上报参数配置',
    icon: 'cogs',
    link: '/modules/plan/config',
    home: false
  },
  {
    title: '一类苗年计划管理',
    home: false,
    icon: 'tag',
    children: [
      {
        title: '年度计划列表',
        icon: 'calendar',
        link: '/modules/plan/typeOne/yearly/list',
      },
      {
        title: '年度计划填报',
        icon: 'calendar',
        link: '/modules/plan/typeOne/yearly/fillIn',
      },
      {
        title: '年度计划审核',
        icon: 'calendar',
        link: '/modules/plan/typeOne/yearly/audit',
      }
    ]
  },
  {
    title: '一类苗月计划管理',
    icon: 'tag',
    home: false,
    children: [
      {
        title: '月度计划列表',
        icon: 'bars',
        link: '/modules/plan/typeOne/monthly/list',
      },
      {
        title: '月度计划审核',
        icon: 'bars',
        link: '/modules/plan/typeOne/monthly/audit',
      }
    ]
  },
  {
    title: '二类季度计划管理',
    icon: 'list-alt',
    home: false,
    children: [
      {
        title: '季度计划列表',
        icon: 'arrow-circle-right',
        link: '/modules/plan/typeTwo/quarterly/list',
      },
      {
        title: '季度计划填报',
        icon: 'arrow-circle-right',
        link: '/modules/plan/typeTwo/quarterly/fillIn',
      },
      {
        title: '季度计划审核',
        icon: 'arrow-circle-right',
        link: '/modules/plan/typeTwo/quarterly/audit',
      }
    ]
  },
  {
    title: '二类苗月计划管理',
    icon: 'list-alt',
    home: false,
    children: [
      {
        title: '月度计划列表',
        icon: 'arrow-circle-right',
        link: '/modules/plan/typeTwo/monthly/list',
      },
      {
        title: '月度计划审核',
        icon: 'arrow-circle-right',
        link: '/modules/plan/typeTwo/monthly/audit',
      }
    ]
  },
  {
    title: '查询统计',
    home: false,
    icon: 'sitemap',
    children: [
      {
        title: '分地区一类苗计划汇总',
        icon: 'arrow-circle-right',
        link: '/modules/plan/typeOne/summary',
      },
      {
        title: '分地区二类苗计划汇总',
        icon: 'arrow-circle-right',
        link: '/modules/plan/typeTwo/summary',
      }
    ]
  }
];

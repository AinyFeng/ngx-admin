import { UeaDashboardOptions } from './../../@uea/components/dashboard/uea.options';

export const mdsReportDashboardOptions: UeaDashboardOptions = {
  title: '统计与报表',
  cards: [
    {
      title: '国家6-1',
      link: '/modules/report/nation-six-one',
      icon: 'file-done',
      type: 'info',
      on: true
    },
    {
      title: '国家6-1汇总',
      link: '/modules/report/nation-six-one-sum',
      icon: 'file-done',
      type: 'info',
      on: true
    },
    {
      title: '国家6-2',
      link: '/modules/report/nation-six-two',
      icon: 'file-done',
      type: 'info',
      on: true
    },
    {
      title: '国家6-2汇总',
      link: '/modules/report/nation-six-two-sum',
      icon: 'file-done',
      type: 'info',
      on: true
    },
    {
      title: '上报记录',
      link: '/modules/report/report-submission-record',
      icon: 'file-done',
      type: 'info',
      on: true
    },
    {
      title: '二类苗进销存7-2',
      link: '/modules/report/class-two-vaccine-invoicing',
      icon: 'file-done',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '二类苗预售',
      link: '/modules/report/class-two-pre-presale',
      icon: 'file-done',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '新生儿建卡',
      link: '/modules/report/new-child-count',
      icon: 'file-done',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '一类苗预防明细',
      link: '/modules/report/class-one-prevention',
      icon: 'file-done',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '基本资料完整性',
      link: '/modules/report/file-integrity-check',
      icon: 'file-done',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '接种记录完整性',
      link: '/modules/report/record-integrity-check',
      icon: 'file-done',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '民生工程-妇幼资料',
      link: '/modules/report/livelihood-improves-health',
      icon: 'file-done',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '接种统计',
      link: '/modules/report/vaccination',
      icon: 'file-done',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '应种统计',
      link: '/modules/report/vaccinationshould',
      icon: 'file-done',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '逾期未中',
      link: '/modules/report/vaccinationnot',
      icon: 'file-done',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '预约图表',
      link: 'reserve-table',
      icon: 'file-done',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '预约管理',
      link: '/modules/report/reserve-management',
      icon: 'file-done',
      type: 'info',
      on: true,
      hidden: true
    }
  ]
};

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
    }
  ]
};

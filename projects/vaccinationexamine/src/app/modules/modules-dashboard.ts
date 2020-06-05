import { UeaDashboardOptions } from '../@uea/components/dashboard/uea.options';

export const mdsDashboardOptions: UeaDashboardOptions = {
  title: '入学入托接种查验',
  cards: [
    {
      title: '学校管理',
      icon: 'home',
      type: 'success',
      link: '/modules/vaccexamine/school',
      on: true
    },
    {
      title: '学生管理',
      icon: 'team',
      type: 'success',
      link: '/modules/vaccexamine/student',
      on: true
    },
    {
      title: '接种查验管理',
      icon: 'file-search',
      type: 'success',
      link: '/modules/vaccexamine/examine',
      on: true,
      hidden: false
    },
    {
      title: '接种查验报告',
      icon: 'file-text',
      type: 'success',
      link: '/modules/vaccexamine/report',
      on: true,
      hidden: false
    }
  ]
};

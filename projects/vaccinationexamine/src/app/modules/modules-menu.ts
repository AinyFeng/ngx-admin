import { NbMenuItem } from '@nebular/theme';

export const MODULES_MENU_ITEMS: NbMenuItem[] = [
  {
    title: '主面板',
    icon: 'landmark',
    link: '/modules/dashboard',
    home: true
  },
  {
    title: '学校管理',
    icon: 'school',
    link: '/modules/vaccexamine/school'
  },
  {
    title: '学生管理',
    icon: 'user-graduate',
    link: '/modules/vaccexamine/student'
  },
  {
    title: '接种查验管理',
    icon: 'crosshairs',
    link: '/modules/vaccexamine/examine'
  },
  {
    title: '接种查验报表',
    icon: 'file-medical',
    link: '/modules/vaccexamine/report'
  }
];

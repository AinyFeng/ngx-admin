import { NbMenuItem } from '@nebular/theme';

export const MODULE_MENU_ITEMS: NbMenuItem[] = [
  {
    title: '产科接种',
    group: true
  },
  {
    title: '产科接种',
    icon: 'cog',
    children: [
      {
        title: '产科接种',
        link: '/modules/vaccinate/vaccinate',
      }
    ]
  }
];

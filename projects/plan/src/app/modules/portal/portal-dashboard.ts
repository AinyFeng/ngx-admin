import { UeaDashboardOptions } from './../../@uea/components/dashboard/uea.options';

export const mdsPortalDashboardOptions: UeaDashboardOptions = {
  title: '智慧接种系统SVS2.0 | 用户设置',
  cards: [
    {
      title: '账户管理',
      link: '/modules/portal/accountBindingInfo',
      icon: 'user-cog',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '个人资料',
      link: '/modules/portal/personalInfo',
      icon: 'user-cog',
      type: 'info',
      on: true
    },
    {
      title: '操作记录',
      link: '/modules/portal/operateRecord',
      icon: 'user-cog',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '接收消息',
      link: '/modules/portal/messageList',
      icon: 'user-cog',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '发送消息',
      link: '/modules/portal/sendMessage',
      icon: 'user-cog',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '已删消息',
      link: '/modules/portal/deleteMessage',
      icon: 'user-cog',
      type: 'info',
      on: true,
      hidden: true
    }
  ]
};

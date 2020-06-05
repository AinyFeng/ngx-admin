import { UeaDashboardOptions } from '../../@uea/components/dashboard/uea.options';

export const mdsSystemDashboardOptions: UeaDashboardOptions = {
  title: '系统管理',
  cards: [
    {
      title: '系统用户',
      link: '/modules/system/sysUser',
      icon: 'setting',
      type: 'info',
      on: true,
      hidden: true
    },
    {
      title: '系统配置',
      link: '/modules/system/sysConf',
      icon: 'setting',
      type: 'info',
      on: true
    },
    // {
    //   title: '配置字典',
    //   link: '/modules/system/sysConfDict',
    //   icon: 'setting',
    //   type: 'info',
    //   on: true
    // },
    {
      title: '工作日',
      link: '/modules/system/sysWorkingDay',
      icon: 'setting',
      type: 'info',
      on: true
    },
    {
      title: '工作时段',
      link: '/modules/system/sysWorkingTime',
      icon: 'setting',
      type: 'info',
      on: true
    },
    {
      title: '节假日',
      link: '/modules/system/sysHolidayConf',
      icon: 'setting',
      type: 'info',
      on: true
    },
    {
      title: '医护人员',
      link: '/modules/system/personnelAdmin',
      icon: 'setting',
      type: 'info',
      on: true
    },
    {
      title: '部门管理',
      link: '/modules/system/departmentManagement',
      icon: 'setting',
      type: 'info',
      on: true
    },
    {
      title: '疫苗配置',
      link: '/modules/system/povVaccineConfiguration',
      icon: 'setting',
      type: 'info',
      on: true
    },
    {
      title: '门诊信息',
      link: '/modules/system/povInfoManagement',
      icon: 'setting',
      type: 'info',
      on: true
    },
    {
      title: '出生医院',
      link: '/modules/system/birthHospitalData',
      icon: 'setting',
      type: 'info',
      on: true
    },
    {
      title: '社区数据',
      link: '/modules/system/communityData',
      icon: 'setting',
      type: 'info',
      on: true
    }
  ]
};

import { NbMenuItem } from '@nebular/theme';

export const MODULE_MENU_ITEMS: NbMenuItem[] = [
  {
    title: '受种人档案管理',
    icon: 'cog',
    children: [
      {
        title: '个案信息查询',
        link: '/modules/archivesmanagement/informationquery',
      },
      {
        title: '个案信息统计',
        link: '/modules/archivesmanagement/informatiionStatistics',
      },
      {
        title: '个案查重删除',
        link: '/modules/archivesmanagement/caseDuplicateDeletion',
      },
      {
        title: '出生年月分布',
        link: '/modules/archivesmanagement/distributionOfBirth',
      },
      {
        title: '已删除个案信息查询',
        link: '/modules/archivesmanagement/caseInformationQueryDeleted',
      },
      {
        title: '重复儿童统计',
        link: '/modules/archivesmanagement/duplicatechildstatistics',
      },
      {
        title: '建档统计',
        link: '/modules/archivesmanagement/archivesstatistics',
      },
      {
        title: '产科建档',
        link: '/modules/archivesmanagement/archivesobstetrics',
      }
    ]
  },
  {
    title: '接种记录管理',
    icon: 'cog',
    children: [
      {
        title: '产科接种记录',
        link: '/modules/vaccinerecordmanage/obstetricsdepart',
      },
      {
        title: '儿童接种记录',
        link: '/modules/vaccinerecordmanage/childvacrecord',
      },
      {
        title: '特殊疫苗接种统计',
        link: '/modules/vaccinerecordmanage/adultvacrecord',
      },
      /* {
         title: '犬伤接种记录',
         link: '/modules/vaccinerecordmanage/rabiesvacrecord',
       },
       {
         title: '成人犬伤统计',
         link: '/modules/vaccinerecordmanage/adultrabiesstatistics',
       },*/
    ]
  },
  {
    title: '常用接种率统计',
    icon: 'cog',
    children: [
      {
        title: '6-1接种率报表累计汇总表',
        link: '/modules/inoculationratestatistics/sixoneratesum',
      },
      {
        title: '6-2接种率报表累计汇总表',
        link: '/modules/inoculationratestatistics/sixtworatesum',
      }
    ]
  },
  {
    title: 'AEFI',
    icon: 'cog',
    children: [
      {
        title: '个案报告信息管理',
        link: '/modules/vaccineaefimanage',
      }
    ]
  },
];

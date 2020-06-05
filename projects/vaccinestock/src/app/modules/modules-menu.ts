import { NbMenuItem } from '@nebular/theme';

export const MODULE_MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: '疫苗出入库管理',
  //   group: true
  // },
  {
    title: '出入库申请',
    icon: 'cog',
    children: [
      {
        title: '疫苗入库',
        link: '/modules/stockapplication/in',
      },
      {
        title: '疫苗出库',
        link: '/modules/stockapplication/out',
      },
      {
        title: '疫苗退回',
        link: '/modules/stockapplication/sendback',
      },
      {
        title: '疫苗报废',
        link: '/modules/stockapplication/writeoff',
      },
      {
        title: '疫苗使用',
        link: '/modules/stockapplication/use',
      },
      {
        title: '疫苗损耗',
        link: '/modules/stockapplication/loss',
      },
      {
        title: '批量下发',
        link: '/modules/stockapplication/distribute',
      },
    ]
  },
  {
    title: '出入库审批',
    icon: 'cog',
    children: [
      {
        title: '出库审批',
        link: '/modules/stockapproval/outapproval',
      },
      {
        title: '出库确认',
        link: '/modules/stockapproval/outconfirm',
      },
      {
        title: '入库确认',
        link: '/modules/stockapproval/inconfirm',
      },
      {
        title: '订单更改',
        link: '/modules/stockapproval/orderchange',
      },
      {
        title: '出库开票',
        link: '/modules/stockapproval/outreceipt',
      }
    ]
  },
  {
    title: '疫苗盘点',
    icon: 'cog',
    children: [
      {
        title: '进销存报表',
        link: '/modules/stockcheck/inoutreport',
      },
      {
        title: '库存盘点',
        link: '/modules/stockcheck/check',
      },
      {
        title: '库存盘点记录',
        link: '/modules/stockcheck/checkrecordlist',
      },
      {
        title: '二类苗调价',
        link: '/modules/stockcheck/priceAdjustment',
      },
      {
        title: '盘点计划',
        link: '/modules/stockcheck/checkPlan',
      }
    ]
  },
  {
    title: '查询统计',
    icon: 'cog',
    children: [
      {
        title: '分疫苗出入库明细统计',
        link: '/modules/stockquerystatistics/vacinboundoutbounddetail',
      },
      {
        title: '分地区出入库明细查询',
        link: '/modules/stockquerystatistics/areainboundoutbounddetail',
      },
      {
        title: '疫苗出入库流向查询',
        link: '/modules/stockquerystatistics/vacinboundoutboundflow',
      },
      {
        title: '近效期疫苗情况查询',
        link: '/modules/stockquerystatistics/vaccinestatusenquiry',
      },
      {
        title: '分地区疫苗库存量统计',
        link: '/modules/stockquerystatistics/areainboundoutboundstatistics',
      }
    ]
  },
  {
    title: '出入库信息查询',
    icon: 'cog',
    children: [
      {
        title: '出入库信息列表',
        link: '/modules/stockorder/orderlist',
      }
    ]
  },
  {
    title: '大屏展示',
    icon: 'cog',
    children: [
      {
        title: '接种情况展示',
        link: '/bigscreen/vaccinationdisplay',
      },
      {
        title: '疫苗追溯',
        link: '/bigscreen/vaccinationtrace',
      }
    ]
  },
];

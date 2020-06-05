import { NbMenuItem } from '@nebular/theme';

export const MODULE_MENU_ITEMS: NbMenuItem[] = [
  {
    title: '实时数据',
    icon: 'landmark',
    children: [
      {
        title: '实时监控',
        link: '/modules/entry/realtimedata/data',
      }
    ],
    home: true
  },
  {
    title: '设备管理',
    icon: 'cog',
    children: [
      {
        title: '冷链设备',
        link: '/modules/entry/devicemanage/device',
      },
      {
        title: '监测设备',
        link: '/modules/entry/devicemanage/monitor',
      },
      {
        title: '传感器',
        link: '/modules/entry/devicemanage/sensor',
      },
      {
        title: '设备维修管理',
        link: '/modules/entry/devicemanage/maintain',
      },
      {
        title: '设备报废管理',
        link: '/modules/entry/devicemanage/scrapped',
      },
    ],
  },
  {
    title: '历史数据',
    icon: 'cog',
    children: [
      {
        title: '历史数据查询',
        link: '/modules/entry/historydata/query',
      },
      {
        title: '温度统计图',
        link: '/modules/entry/historydata/temperature',
      },
      {
        title: '湿度统计图',
        link: '/modules/entry/historydata/humidity',
      }
    ],
  },
  {
    title: '报警管理',
    icon: 'cog',
    children: [
      {
        title: '温度湿度异常报警',
        link: '/modules/entry/alertmanage/temperaturehumidity',
      },
      {
        title: '设备异常报警',
        link: '/modules/entry/alertmanage/devicealert',
      },
      {
        title: '警情处理',
        link: '/modules/entry/alertmanage/handling',
      }
    ],
  },
  {
    title: '数据报表',
    icon: 'cog',
    children: [
      {
        title: '冷链设备温度记录表',
        link: '/modules/entry/report/temperaturerepport',
      },
      {
        title: '冷链设备档案表',
        link: '/modules/entry/report/devicerecord',
      },
      {
        title: '异常温度',
        link: '/modules/entry/report/temperaturealert',
      },
      {
        title: '辖区异常',
        link: '/modules/entry/report/jurisdiction',
      }
    ],
  }
];

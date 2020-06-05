import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'uea-appoint-to-observation',
  templateUrl: './appoint-to-observation.component.html',
  styleUrls: ['./appoint-to-observation.component.scss']
})
export class AppointToObservationComponent implements OnInit {

  // echarts 的 option
  echartsOption: any;

  axisData = ['预约', '登记', '缴费', '接种', '留观'];
  data: any;
  links: any;

  constructor() {
  }

  ngOnInit() {
    this.data = this.axisData.map(function (item, i) {
      return Math.round(Math.random() * 1000 * (i + 1));
    });
    this.links = this.data.map(function (item, i) {
      return {
        source: i,
        target: i + 1
      };
    });
    this.links.pop();
    this.initOption();
  }

  initOption() {
    this.echartsOption = {
      title: {
        text: '预约至留观流程图',
        subtext: '数据来自市平台',
        textStyle: {
          color: '#f2f6ff'
        }
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          /*lineStyle: {
            color: '#f2f6ff'
          }*/
          show: false
        },
        data: this.axisData
      },
      yAxis: {
        type: 'value',
        axisLine: {
          /*lineStyle: {
            color: '#f2f6ff'
          }*/
          show: false // 是否显示坐标轴
        },
      },
      series: [
        {
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'cartesian2d',
          symbolSize: 40,
          label: {
            show: true
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          data: this.data,
          links: this.links,
          lineStyle: {
            color: '#ffffff'
          }
        }
      ]
    };
  }


}

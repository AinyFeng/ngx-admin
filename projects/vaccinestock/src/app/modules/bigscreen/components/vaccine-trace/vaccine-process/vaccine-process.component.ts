import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'uea-vaccine-process',
  templateUrl: './vaccine-process.component.html',
  styleUrls: ['./vaccine-process.component.scss']
})
export class VaccineProcessComponent implements OnInit {

  // echarts 的 option
  echartsOption: any;

  constructor() {
  }

  ngOnInit() {
    this.initOption();
  }

  initOption() {
    this.echartsOption = {
      title: {
        text: '疫苗追溯全过程',
        subtext: '数据来自市平台',
        textStyle: {
          color: '#f2f6ff'
        }
      },
      tooltip: {},
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'none',
          symbolSize: 50,
          roam: true,
          label: {
            show: true
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            fontSize: 20
          },
          data: [{
            name: '北研生物',
            x: 300,
            y: 300
          }, {
            name: '淮北预防疾控中心',
            x: 800,
            y: 300
          }, {
            name: '淮北ADR',
            x: 550,
            y: 100
          }, {
            name: '淮北疾控门诊',
            x: 550,
            y: 500
          }],
          links: [{
            source: 0,
            target: 1,
            symbolSize: [5, 20],
            label: {
              show: true
            },
            lineStyle: {
              width: 5,
              curveness: 0.2
            }
          }, {
            source: '北研生物',
            target: '淮北疾控门诊',
            label: {
              show: true
            },
            lineStyle: {
              curveness: 0.2
            }
          }, {
            source: '淮北预防疾控中心',
            target: '淮北疾控门诊'
          }, {
            source: '淮北ADR',
            target: '淮北疾控门诊'
          }, {
            source: '淮北预防疾控中心',
            target: '淮北ADR'
          }, {
            source: '北研生物',
            target: '淮北ADR'
          }],
          lineStyle: {
            opacity: 0.9,
            width: 2,
            curveness: 0
          }
        }
      ]
    };
  }
}

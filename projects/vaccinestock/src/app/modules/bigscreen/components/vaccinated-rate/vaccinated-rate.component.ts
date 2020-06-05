import { Component, Input, OnInit } from '@angular/core';
import { BIG_SCREEN } from '../../big.screen.const';
import { BigScreenApi } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-vaccinated-rate',
  templateUrl: './vaccinated-rate.component.html',
  styleUrls: ['./vaccinated-rate.component.scss']
})
export class VaccinatedRateComponent implements OnInit {

  /**
   * echarts 的 option
   */
  echartsOption: any;

  /**
   * echarts 需要展现的数据
   */
  optionData: any;

  @Input()
  userInfo: any;

  /**
   * 数据展现方式，分为 区域模式 和 POV模式，已经定义了实体类
   */
  viewType = BIG_SCREEN.viewTypeDistrict;

  @Input('viewType')
  set setViewType(type: string) {
    if (!type) return;
    this.viewType = type;
    this.setOptionData(this.optionData);
  }

  /**
   * 当前所在城市编码，比如滁州市3411，凤阳县就是3411XX 共6位数
   */
  searchDistrictCode: string;

  @Input('searchDistrictCode')
  set setSearchDistrictCode(code: string) {
    // if (!code) return;
    this.searchDistrictCode = code ? code : '3411';
    this.queryData();
  }

  constructor(private bsApi: BigScreenApi) {
  }

  ngOnInit() {
    this.queryData();
  }

  /**
   * 将重卡率的数据设置到echarts中
   * @param data
   */
  setOptionData(data: any) {
    if (!data) return;
    const xAxisData = [];
    const seriesData = [];
    if (this.viewType !== BIG_SCREEN.viewTypeDistrict) {
      const povData: any[] = data.pov.sort((a, b) => a.value - b.value);
      povData.forEach(pd => {
        xAxisData.push(pd.povName);
        seriesData.push(pd.value);
      });
    } else {
      const districtData: any[] = data.district.sort((a, b) => a.value - b.value);
      districtData.forEach(dd => {
        xAxisData.push(dd.districtName);
        seriesData.push(dd.value);
      });
    }
    this.echartsOption = this.getOption(xAxisData, seriesData);
    // console.log(this.dupProfileOption);
  }


  getOption(xAxisData, seriesData) {
    return {
      title: {
        text: '接种率',
        subtext: '数据来自市平台',
        textStyle: {
          color: '#f2f6ff'
        }
      },
      legend: {
        data: ['bar'],
        align: 'left',
        textStyle: {
          color: '#f2f6ff' // 图例的字体颜色
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '5%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#f2f6ff'
          },
          splitLine: {
            show: false
          },
          formatter: function (val) {
            if (val.length > 4) {
              val = val.substr(0, 4) + '...';
            }
            return val;
          }
        }
      },
      yAxis: {
        type: 'value',
        show: false,
        silent: false,
        splitLine: {
          show: false
        }
      },
      series: [{
        name: '接种率',
        type: 'bar',
        data: seriesData,
        animationDelay: function (idx) {
          return idx * 10;
        }
      }],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5;
      }
    };
  }

  /**
   * 查询接种率
   */
  queryData() {
    if (!this.userInfo || !this.searchDistrictCode) return;
    const query = [this.searchDistrictCode];
    console.log('查询接种率', query);
    this.bsApi.queryVaccinatedRate(query, res => {
      console.log('查询接种率返回值', res);
      if (res.code === 0) {
        this.setOptionData(res.data);
      }
    });
  }

}

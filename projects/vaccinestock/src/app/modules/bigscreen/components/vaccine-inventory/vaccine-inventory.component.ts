import { Component, Input, OnInit } from '@angular/core';
import { BIG_SCREEN } from '../../big.screen.const';
import { BigScreenApi } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-vaccine-inventory',
  templateUrl: './vaccine-inventory.component.html',
  styleUrls: ['./vaccine-inventory.component.scss']
})
export class VaccineInventoryComponent implements OnInit {

  /**
   * echarts 的 option
   */
  echartsOption: any;

  /**
   * echarts 需要展现的数据
   */
  optionData: any;

  /**
   * echarts 主题
   */
  theme = 'macarons';

  @Input()
  userInfo: any;

  /**
   * 当前所在城市编码，比如滁州市3411，凤阳县就是3411XX 共6位数
   */
  searchDistrictCode: string;
  /**
   * 按区域或者pov统计的疫苗库存
   */
  districtData = [];
  /**
   * 按疫苗类型统计的疫苗库存
   */
  typeData = [];
  /**
   * 一类苗数据
   */
  freeVacData = [];
  /**
   * 二类苗数据
   */
  nonFreeVacData = [];
  /**
   * 疫苗类型label
   */
  typeLegendData = ['一类苗', '二类苗'];
  /**
   * 其它数据
   */
  otherVacData = [];
  /**
   * 按疫苗大类统计的疫苗库存
   */
  broadHeadingData = [];
  /**
   * 按照疫苗大类统计时显示的横坐标数据
   */
  xAxisData = [];
  /**
   * 各区县数据显示的label
   */
  legendData = [];

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
    const optionData: any[] = data.sort((a, b) => a.value - b.value);
    optionData.forEach(pd => {
      xAxisData.push(pd.name);
      seriesData.push({
        name: pd.name,
        value: pd.value
      });
    });
    this.echartsOption = this.getOption();
    // console.log(this.dupProfileOption);
  }


  getOption() {
    return {
      title: {
        text: '疫苗库存情况',
        textStyle: {
          color: '#f2f6ff'
        }
      },
      tooltip: {},
      legend: [{
        orient: 'vertical',
        data: this.legendData,
        top: '60%',
        left: '38%',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#cad9f4' // 图例的字体颜色
        }
      }, {
        orient: 'vertical',
        data: this.typeLegendData,
        top: '65%',
        right: 10,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#cad9f4' // 图例的字体颜色
        }
      }],
      grid: [{
        id: 0,
        left: '5%',
        right: '4%',
        top: '15%',
        bottom: '50%',
        containLabel: true
      }, {
        id: 1,
        left: '5%',
        right: '4%',
        top: '65%',
        bottom: '1%',
        containLabel: true
      }],
      xAxis: [
        {
          gridIndex: 0,
          type: 'category',
          data: this.xAxisData,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            rotate: 45
          }
        }
      ],
      yAxis: [
        {
          gridIndex: 0,
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#4eedf7',
              type: 'dotted'
            }
          },
          splitArea: {
            show: false
          },
          nameTextStyle: {
            color: '#cad9f4'
          }
        }
      ],
      series: [{
        name: '各类疫苗类型库存',
        type: 'scatter',
        symbolSize: (data) => {
          const size = Math.ceil(Math.sqrt(Math.ceil(Math.sqrt(data))));
          if (size > 20) return 20;
          if (size < 8) return 8;
          return size;
        },
        data: this.broadHeadingData
      }, {
        name: '各类疫苗类型库存',
        type: 'line',
        data: this.broadHeadingData,
        lineStyle: {
          color: '#f1ca6c'
        }
      }, {
        name: '库存',
        type: 'pie',
        radius: '30%',
        center: ['22%', '70%'],
        hoverAnimation: false,
        data: this.districtData,
        roseType: 'radius',
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        animationDelay: function (idx) {
          return idx * 10;
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            if (!params) return;
            const name = params['name'];
            const value = params['value'];
            return '当前库存<br>' + name + ': ' + value;
          }
        },
      },
        {
          name: '疫苗库存',
          type: 'pie',
          hoverAnimation: false,
          radius: ['55', '65'],
          center: ['70%', '70%'],
          data: this.nonFreeVacData,
          roseType: 'radius',
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          animationDelay: function (idx) {
            return idx * 10;
          }
        }, {
          name: '疫苗库存',
          type: 'pie',
          radius: ['30', '40'],
          center: ['70%', '70%'],
          hoverAnimation: false,
          data: this.freeVacData,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
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
   * 查询疫苗实时库存信息
   */
  queryData() {
    if (!this.userInfo || !this.searchDistrictCode) return;
    const query = this.searchDistrictCode;
    console.log('查询库存', query);
    this.bsApi.queryVaccInventoryAll(query, ([broadHeadingInventory, districtInventory, typeStock]) => {
      console.log('查询库存返回值', [broadHeadingInventory, districtInventory, typeStock]);
      // 根据大类显示的库存量
      if (broadHeadingInventory.code === 0) {
        this.xAxisData = [];
        this.broadHeadingData = broadHeadingInventory.data;
        this.broadHeadingData.forEach(bhd => {
          let name = bhd.name;
          if (name.length > 7) {
            name = bhd.name.substr(0, 7) + '...';
          }
          this.xAxisData.push(name);
        });
        this.echartsOption = this.getOption();
      }
      // 根据区域疫苗显示的库存量
      if (districtInventory.code === 0) {
        this.districtData = districtInventory.data;
        this.districtData.forEach(dd => {
          this.legendData.push(dd.name);
        });
        this.echartsOption = this.getOption();
      }
      // 根据疫苗类型显示的库存量
      if (typeStock.code === 0) {
        const typeData = typeStock.data;
        let freeVacStock = 0;
        let nonFreeVacStock = 0;
        typeData.forEach(td => {
          if (td['vaccType'] === '1') {
            nonFreeVacStock += td['value'];
          } else {
            freeVacStock += td['value'];
          }
        });
        this.freeVacData.push({ name: '一类苗', value: freeVacStock });
        this.nonFreeVacData.push({ name: '二类苗', value: nonFreeVacStock });
        this.echartsOption = this.getOption();
      }
    });
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { BigScreenApi } from '@tod/svs-common-lib';
import { BIG_SCREEN } from '../../big.screen.const';

@Component({
  selector: 'uea-profile-incomplete',
  templateUrl: './profile-incomplete.component.html',
  styleUrls: ['./profile-incomplete.component.scss']
})
export class ProfileIncompleteComponent implements OnInit {

  /**
   * 档案信息完整率
   */
  echartsOption: any;


  /**
   * echarts 需要展现的数据
   */
  optionData: any;

  @Input()
  userInfo: any;
  /**
   * echarts 主题
   */
  theme = 'macarons';

  /**
   * 数据展现方式，分为 区域模式 和 POV模式，已经定义了实体类
   */
  viewType = BIG_SCREEN.viewTypeDistrict;
  /**
   * 档案总数
   */
  profileTotal = 0;
  /**
   * 档案完整的档案总数
   */
  profileCompleteTotal = 0;

  ratio: string;

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
   * 查询档案信息完整率
   */
  queryData() {
    if (!this.userInfo || !this.searchDistrictCode) return;
    const query = this.searchDistrictCode;
    this.bsApi.queryProfileComplete(query, res => {
      console.log('档案信息完整率', res);
      if (res.code === 0) {
        this.optionData = res.data;
        this.setOptionData(res.data);
      }
    });
  }

  /**
   * 档案信息完整率
   * @param data
   */
  setOptionData(data: any) {
    if (!data) return;
    const xAxisData = [];
    const seriesData = [];
    // 从大到小 profileCount profileIncompleteCount
    const optionData: any[] = data.sort((a, b) => a.value - b.value);
    optionData.forEach(od => {
      xAxisData.push(od.name);
      seriesData.push({
        name: od.name,
        value: od.value
      });
      this.profileTotal += od.profileCount;
      this.profileCompleteTotal += od.profileIncompleteCount;
    });
    this.ratio = (this.profileCompleteTotal / this.profileTotal * 100).toFixed(2) + '%';
    this.echartsOption = this.getOption(xAxisData, seriesData);
    console.log(this.echartsOption);
  }

  getOption(xAxisData, seriesData) {
    return {
      title: {
        text: '档案信息完整率',
        textStyle: {
          color: '#f2f6ff'
        }
      },
      legend: {
        orient: 'vertical',
        right: 20,
        bottom: 40,
        data: xAxisData,
        textStyle: {
          color: '#f2f6ff' // 图例的字体颜色
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (!params) return;
          const name = params['name'];
          const value = params['value'];
          return '档案完整率<br>' + name + ':' + value + '%';
        }
      },
      grid: {
        left: '5%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      series: [{
        name: '档案完整率(%)',
        type: 'pie',
        radius: '55%',
        center: ['40%', '70%'],
        data: seriesData,
        roseType: 'area',
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

}

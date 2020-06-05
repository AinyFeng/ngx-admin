import { Component, Input, OnDestroy, OnInit } from '@angular/core';
// @ts-ignore
import { BigScreenApi } from '@tod/svs-common-lib';
import { BIG_SCREEN } from '../../big.screen.const';
import * as echarts from 'echarts';
import { interval, of, Subscription, timer } from 'rxjs';
import { debounceTime, delay, expand, map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'uea-profile-dup-component',
  templateUrl: './profile.dup.component.component.html',
  styleUrls: ['./profile.dup.component.component.scss']
})
export class ProfileDupComponentComponent implements OnInit, OnDestroy {

  /**
   * echarts 的 option
   */
  echartsOption: any;

  @Input()
  userInfo: any;

  show = true;

  /**
   * 数据展现方式，分为 区域模式 和 POV模式，已经定义了实体类
   */
  viewType = BIG_SCREEN.viewTypeDistrict;
  /**
   * 每页数量
   */
  pageSize = 5;
  /**
   * 页码
   */
  page = 1;
  /**
   * 需要展现的数据
   */
  optionData: any;
  /**
   * 原始数据
   */
  tableData = [];

  @Input('viewType')
  set setViewType(type: string) {
    if (!type) return;
    this.viewType = type;
    // this.setOptionData(this.optionData);
  }

  /**
   * 当前所在城市编码，比如滁州市3411，凤阳县就是3411XX 共6位数
   */
  searchDistrictCode: string;

  private subscription: Subscription[] = [];

  @Input('searchDistrictCode')
  set setSearchDistrictCode(code: string) {
    // if (!code) return;
    this.searchDistrictCode = code ? code : '3411';
    this.queryDupProfile();
  }

  constructor(private bsApi: BigScreenApi) {
  }

  ngOnInit() {
    this.queryDupProfile();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  /**
   * 查询重卡率
   */
  queryDupProfile() {
    if (!this.userInfo || !this.searchDistrictCode) return;
    const query = this.searchDistrictCode;
    this.bsApi.queryDupProfile(query, res => {
      console.log('重卡率结果', res);
      if (res.code === 0) {
        this.tableData = res.data;
        // this.setOptionData(res.data);
        this.startShowData();
      }
    });
  }

  /**
   * 开始循环数据
   */
  startShowData() {
    // 计算出数据循环的总页数
    const totalPage = Math.ceil(this.tableData.length / this.pageSize);
    this.dataChange(totalPage);
    const sub = interval(4000)
      .subscribe(() => {
        this.dataChange(totalPage);
      });
    this.subscription.push(sub);
  }

  /**
   * 数据切换
   * 根据传入的页码切换到相应页码的数据
   */
  dataChange(totalPage: number) {
    this.optionData = this.tableData.filter((ele, indx) =>
      (indx) >= ((this.page - 1) * this.pageSize) && (indx) < (this.page * this.pageSize));
    this.page++;
    if (this.page > totalPage) {
      this.page = 1;
    }
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
        text: '档案重卡率',
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
        type: 'value',
        show: false,
        silent: false,
        splitLine: {
          show: false
        }
      },
      yAxis: {
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
      series: [{
        name: '重卡率',
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

}

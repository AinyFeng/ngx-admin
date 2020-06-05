import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ColdchainSelectedNodeService, DateUtils, HistoryDataService} from '@tod/svs-common-lib';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'uea-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit, OnDestroy {
  queryForm: FormGroup;
  // 已选择的组织（从service中获取）
  organization: any;
  option: any;
 /* option = {
    title: {
      text: '温度分布图'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['最高气温', '最低气温']
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        dataView: {readOnly: false},
        magicType: {type: ['line', 'bar', 'point']},
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis:  {
      type: 'category',
      boundaryGap: false,
      data: ['2017-09-30 23:40:06.0', '2017-10-01 01:15:06.0', '2017-10-01 01:40:06.0', '2017-10-01 02:05:06.0',
        '2017-10-02 02:30:06.0', '2017-10-02 02:55:06.0', '2017-10-3 23:40:06.0',
        '2017-10-03 01:15:06.0', '2017-10-03 01:40:06.0', '2017-10-03 02:05:06.0' ]
    },
    yAxis: {
      min: function(value) {
        return value.min - 4;
      },
      max: function(value) {
        return value.max + 5;
      },
      type: 'value',
      axisLabel: {
        formatter: '{value} ℃'
      },
      axisPointer: {
        snap: true
      }
    },
    series: [
      {
        name: '时间                ',
        type: 'line',
        smooth: true
      },
      {
        name: '温度',
        type: 'line',
        smooth: true,
        data: [1, -2, 2, 5, 3, 2, 0, -3 , 7, 4],
        markPoint: {
          data: [
            {type : 'max', name: '最大值'},
            {type : 'min', name: '最小值'}

          ]
        },
        markLine : {
          data : [
            {type : 'average', name: '平均值'}
          ]
        },
        itemStyle: {
          normal: {
            color: '#1E91FF',
            lineStyle: {
              color: '#1E91FF'
            }
          }
        }

      },
      {
        name: '温度上限',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        itemStyle: {
          normal: {
            color: '#FFA500',
            lineStyle: {
              color: '#FFA500'
            }
          }
        }
      },
      {
        name: '温度下限',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        itemStyle: {
          normal: {
            color: '#2E8B57',
            lineStyle: {
              color: '#2E8B57'
            }
          }
        }
      }

    ]
  };*/
  treeSubscribe: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private treeNodeSvc: ColdchainSelectedNodeService,
    private historyDataSvc: HistoryDataService,
    private modalService: NzModalService,
    private msg: NzMessageService
  ) {
    this.queryForm = this.fb.group({
      deviceName: [null], // 设备名称
      startDate: [null],
      endDate: [null],
    });
    // 监听节点树变化查询
    const sub = this.treeNodeSvc.getNzTreeSelectedNode().subscribe(data => {
      // 监听变化回调函数
      if (data) {
        this.organization = data.areaCode;
        this.serachData();
      }
    });
    this.treeSubscribe.push(sub);
  }

  ngOnInit() {
    this.serachData();
  }
  ngOnDestroy(): void {
    this.treeSubscribe.forEach(subscription => subscription.unsubscribe());
  }

  // 查询数据
  serachData() {
    if (!this.organization) {
      return;
    }
    // 查询数据并显示目前直接显示
    // 处理起始 和 截止 时间
    let startTime = null, endTime = null;
    if ( this.queryForm.get('startDate').value) {
      startTime =  DateUtils.getFormatDateTime(this.queryForm.get('startDate').value);
    }
    if ( this.queryForm.get('endDate').value) {
      endTime =  DateUtils.getFormatDateTime(this.queryForm.get('endDate').value);
    }
    const params = {
      /*  facilityName: this.queryForm.value.deviceName,*/
      tempIsnormal: this.queryForm.value.tempIsnormal,
      sensorMac: this.queryForm.value.deviceName,
      startTime: startTime,
      endTime: endTime,
      organizationCode: this.organization,
    };
    console.log('参数', params);
    this.historyDataSvc.queryHumiChart(params, resp => {
      if (resp && resp.code === 0 && resp.data  && resp.data.xAxisTempData) {
        const  xAxisTempData = resp.data.xAxisTempData.split(',');
        const  seriesTempData = resp.data.seriesTempData.split(',');
        const  upperTempData = resp.data.upperTempData.split(',');
        const  lowerTempData = resp.data.lowerTempData.split(',');
        this.option = {
          title: {
            text: '温度分布图'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            data: ['最高气温', '最低气温']
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {readOnly: false},
              magicType: {type: ['line', 'bar', 'point']},
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: xAxisTempData
          },
          yAxis: {
            min: function(value) {
              return value.min - 4;
            },
            max: function(value) {
              return value.max + 5;
            },
            type: 'value',
            axisLabel: {
              formatter: '{value} ℃'
            },
            axisPointer: {
              snap: true
            }
          },
          series: [
            {
              name: '时间                ',
              type: 'line',
              smooth: true
            },
            {
              name: '温度',
              type: 'line',
              smooth: true,
              data: seriesTempData,
              markPoint: {
                data: [
                  {type : 'max', name: '最大值'},
                  {type : 'min', name: '最小值'}

                ]
              },
              markLine : {
                data : [
                  {type : 'average', name: '平均值'}
                ]
              },
              itemStyle: {
                normal: {
                  color: '#1E91FF',
                  lineStyle: {
                    color: '#1E91FF'
                  }
                }
              }

            },
            {
              name: '温度上限',
              type: 'line',
              smooth: true,
              symbol: 'none',
              data: upperTempData,
              itemStyle: {
                normal: {
                  color: '#FFA500',
                  lineStyle: {
                    color: '#FFA500'
                  }
                }
              }
            },
            {
              name: '温度下限',
              type: 'line',
              smooth: true,
              symbol: 'none',
              data: lowerTempData,
              itemStyle: {
                normal: {
                  color: '#2E8B57',
                  lineStyle: {
                    color: '#2E8B57'
                  }
                }
              }
            }
          ]};
      } else if (resp.code === 0 && !resp.data.xAxisTempData) {
        this.modalService.info({
          nzTitle: '提示',
          nzContent: '<p>暂无数据！</p>',
          nzOnOk: () => this.option = null
        });
      } else {
        this.msg.warning(`${resp.msg}`);
      }
    });
  }
  /**
   * 过滤开始日期
   * @param d
   */
  disabledStartDate = (d: Date) => {
    if (this.queryForm.value.endDate) {
      return d > this.queryForm.value.endDate;
    } else {
      return false;
    }
  }
  /**
   * 过滤开始日期
   * @param d
   */
  disabledEndDate = (d: Date) => {
    if (this.queryForm.value.startDate) {
      return d < this.queryForm.value.startDate;
    } else {
      return false;
    }
  }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColdchainSelectedNodeService, DateUtils, HistoryDataService } from '@tod/svs-common-lib';
import { Subscription } from 'rxjs';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'uea-humidity',
  templateUrl: './humidity.component.html',
  styleUrls: ['./humidity.component.scss']
})
export class HumidityComponent implements OnInit, OnDestroy {

  queryForm: FormGroup;
  // 已选择的组织（从service中获取）
  organization: any;
  option: any;
/*  option = {
    title: {
      text: '湿度分布图'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    toolbox: {
      show: true,
      showTitle: false,
      right: '3%',
      feature: {
        dataView: {readOnly: true},
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
        '2017-10-03 01:15:06.0', '2017-10-03 01:40:06.0', '2017-10-03 02:05:06.0']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%RH'
      },
      axisPointer: {
        snap: true
      }
    },

    series: [
      {
        name: '时间                ',
        type: 'line',
        smooth: true,
      },
      {
        name: '湿度',
        type: 'line',
        smooth: true,
        data: [20, 40, 10, 0, 60, 70, 35, 16, 80, 57],
        markPoint : {
          data : [
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
        name: '湿度上限',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
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
        name: '湿度下限',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        itemStyle: {
          normal: {
            color: '#2E8B57',
            lineStyle: {
              color: '#2E8B57'
            }
          }
        }
      },

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
      console.log('resp===', resp);
    if (resp && resp.code === 0 && resp.data && resp.data.xAxisHumiData) {
      const  xAxisHumiData = resp.data.xAxisHumiData.split(',');
      const  seriesHumiData = resp.data.seriesHumiData.split(',');
      const  upperHumiData = resp.data.upperHumiData.split(',');
      const  lowerHumiData = resp.data.lowerHumiData.split(',');
      this.option = {
        title: {
          text: '湿度分布图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        toolbox: {
          show: true,
          showTitle: false,
          right: '3%',
          feature: {
            dataView: {readOnly: true},
            magicType: {type: ['line', 'bar', 'point']},
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis:  {
          type: 'category',
          boundaryGap: false,
          data: xAxisHumiData
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%RH'
          },
          axisPointer: {
            snap: true
          }
        },

        series: [
          {
            name: '时间                ',
            type: 'line',
            smooth: true,
          },
          {
            name: '湿度',
            type: 'line',
            smooth: true,
            data: seriesHumiData,
            markPoint : {
              data : [
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
            name: '湿度上限',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: upperHumiData,
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
            name: '湿度下限',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: lowerHumiData,
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
      };
    } else if (resp.code === 0 && !resp.data.xAxisHumiData) {
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

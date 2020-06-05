import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColdchainSelectedNodeService, DateUtils, RealtimeDataService } from '@tod/svs-common-lib';
import { Subscription } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'uea-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit, OnDestroy {
  private organization: string = '';
  private treeSubscribe: Subscription[] = [];

  nameArr = [];
  macArr = [];
  timeArr = [];
  tempArr = [];
  minArr = [];
  maxArr = [];
  statusArr = [];
  data = [];

  constructor(
    private treeNodeSvc: ColdchainSelectedNodeService,
    private realTimeDataSvc: RealtimeDataService,
    private modalService: NzModalService
  ) {
    // 监听节点树变化查询
    const sub = this.treeNodeSvc.getNzTreeSelectedNode().subscribe(data => {
      // 监听变化回调函数
      if (data) {
        this.organization = data.areaCode;
        console.log('所选组织信息=====', this.organization);
        this.searchData();
      }
    });
    this.treeSubscribe.push(sub);
  }

  ngOnInit() {
    this.searchData();
    /* this.initOptions();*/
  }

  ngOnDestroy(): void {
    this.treeSubscribe.forEach(subscription => subscription.unsubscribe());
  }
  // 查询数据
  searchData() {
    if (!this.organization) {
      return;
    }
    const params = {
      organizationCode: this.organization
    };
    this.realTimeDataSvc.queryRealDataChart(params, resp => {
      console.log('仪表数据===', resp);
      if (resp && resp.code === 0 && resp.data.length > 0) {
        // 渲染charts options
        this.nameArr = [];
        this.timeArr = [];
        this.tempArr = [];
        this.minArr = [];
        this.maxArr = [];
        this.statusArr = [];
        for (let i = 0; i < resp.data.length; i++) {
          this.nameArr[i] = resp.data[i].sensorName;
          this.timeArr[i] = DateUtils.getFormatDateTime(resp.data[i].getTime);
          this.tempArr[i] = resp.data[i].tempBcd;
          this.maxArr[i] = resp.data[i].upperTemp;
          this.minArr[i] = resp.data[i].lowerTemp;
          this.statusArr[i] = resp.data[i].tempIsnormal;
        }
        /*console.log(this.nameArr, this.timeArr, this.tempArr, this.minArr, this.maxArr, this.statusArr);*/
        // 填充options
        this.initOptions();
      } else {
        // 弹窗提示暂时没有数据
        this.nameArr = [];
        this.timeArr = [];
        this.tempArr = [];
        this.minArr = [];
        this.maxArr = [];
        this.statusArr = [];
        this.modalService.info({
          nzTitle: '提示',
          nzContent: '<p>暂无数据！</p>',
          nzOnOk: () => this.data = []
        });
      }
    });
  }
  // 渲染仪表数据
  initOptions() {
    this.data = [];
    for (let i = 0; i < this.nameArr.length; i++) {
      let option = {
        title: {
          text: this.nameArr[i] + '温度   (温度' + this.statusArr[i] + ')', // 标题文本内容
          x: 'center',
          y: 'bottom',
          padding: [0, 0, 30, 0],
          subtext: this.timeArr[i],
          textStyle: {
            x: 'left',
            y: 'bottom',
            fontSize: 13,
            fontWeight: 'bolder',
            color: '#000000'
          },
          subtextStyle: {
            fontSize: 13,
          }
        },
        toolbox: {
          show: false,
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '',
            type: 'gauge',
            min: this.minArr[i],
            max: this.maxArr[i],
            data: [{ value: this.tempArr[i], name: '' }],
            axisLine: {            // 坐标轴线
              lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.2, '#62879F'], [0.8, '#91C7AF'], [1, '#C33430']],
                width: 7 // 这个是修改宽度的属性
              }
            },
            axisTick: {            // 坐标轴小标记
              length: 11.5,        // 属性length控制线长
              lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto'
              }
            },
            splitLine: {           // 分隔线
              length: 15,         // 属性length控制线长
              lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
              }
            },
            pointer: {
              show: true,
              length: '66%',
              width: 8,
            },
            detail: {
              show: true,
              // offsetCenter: [0, '50%'],
              formatter: '{value}℃',
              textStyle: {
                fontSize: 25
              }
            },
          }
        ]
      };
      this.data.push(option);
    }
  }

}

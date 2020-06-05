import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ColdchainSelectedNodeService, RealtimeDataService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-temperature-humidity-detail',
  templateUrl: './temperature-humidity-detail.component.html'
})
export class TemperatureHumidityDetailComponent implements OnInit, OnDestroy {
  private organization: string = '';
  private treeSubscribe: Subscription[] = [];
  // 表格数据
  dataSet = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  constructor(
    private realTimeDataSvc: RealtimeDataService,
    private treeNodeSvc: ColdchainSelectedNodeService
  ) {
    // 监听节点树变化查询
    const sub = this.treeNodeSvc.getNzTreeSelectedNode().subscribe(data => {
      // 监听变化回调函数
      if (data) {
        this.organization = data.areaCode;
        this.searchData();
      }
    });
    this.treeSubscribe.push(sub);
  }

  ngOnInit() {
    this.searchData();
  }
  ngOnDestroy(): void {
    this.treeSubscribe.forEach(subscription => subscription.unsubscribe());
  }
  // 查询数据
  searchData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    const params = {
      organizationCode: this.organization,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.realTimeDataSvc.queryRealData(params, resp => {
      console.log('温湿度数据resp===', resp);
      this.loading = false;
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.dataSet = searchDataList.data;
      } else {
        this.dataSet = [];
      }
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
      } else {
        this.total = 0;
      }
    });
  }

}

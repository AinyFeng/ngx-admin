import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ColdchainSelectedNodeService, DateUtils, HistoryDataService} from '@tod/svs-common-lib';
import {Subscription} from 'rxjs';

@Component({
  selector: 'uea-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {
  queryForm: FormGroup;
  // 已选择的组织（从service中获取）
  organization: any;
  listOfData: any;
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  // 传感器下拉选
  sensorOptions = [];
  treeSubscribe: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private treeNodeSvc: ColdchainSelectedNodeService,
    private historyDataSvc: HistoryDataService
  ) {
    this.queryForm = this.fb.group({
      deviceName: [null], // 设备名称
      tempIsnormal: [null],
      startDate: [null],
      endDate: [null],
    });
    // 监听节点树变化查询
    const sub = this.treeNodeSvc.getNzTreeSelectedNode().subscribe(data => {
      // 监听变化回调函数
      if (data) {
        this.organization = data.areaCode;
        this.searchData();
        this.changeOption();
      }
    });
    this.treeSubscribe.push(sub);
    this.changeOption();
  }
  // 根据组织结构改变下拉选值
  changeOption() {
    const param = this.organization;
    this.historyDataSvc.querySeneorOptions( param, resp => {
      if (resp && resp.code === 0) {
        this.sensorOptions = resp.data;
        /*console.log('queryFacilityOptions', this.deviceOptions);*/
      } else {
        this.sensorOptions = [];
      }
    });
  }
  ngOnInit() {
    this.searchData();
  }

  // 获取数据
  searchData(page = 1) {
    /* console.log('执行冷链设备管理的查询方法=====');*/
    if (this.loading) return;
    if (!this.organization) {
      return;
    }
    this.pageIndex = page;
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
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.historyDataSvc.queryHistoryData(params, resp => {
      console.log('resp===', resp);
      this.loading = false;
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      } else {
        this.listOfData = [];
      }
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
      } else {
        this.total = 0;
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

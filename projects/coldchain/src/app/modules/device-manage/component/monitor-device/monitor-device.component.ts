import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd';
import {AddEditMonitorComponent} from '../dialoge/add-edit-monitor/add-edit-monitor.component';
import {Subscription} from 'rxjs';
import {ColdchainSelectedNodeService, MonitorDeviceService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-monitor-device',
  templateUrl: './monitor-device.component.html',
  styleUrls: ['../../device-manage.component.scss']
})
export class MonitorDeviceComponent implements OnInit, OnDestroy {
  queryForm: FormGroup;
  listOfData: any = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  treeSubscribe: Subscription[] = [];
  // 已选择的组织（从service中获取）
  organization: any;
  // 已经选中的id
  mapOfCheckedId: { [key: string]: boolean } = {};
  // 是否全选
  isAllDisplayDataChecked = false;
  // 是否有没有选的
  isIndeterminate = false;
  // 选中的数量
  numberOfChecked = 0;
  // 需要编辑的数据
  data: any;
  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private deviceSvc: MonitorDeviceService,
    private treeNodeSvc: ColdchainSelectedNodeService
  ) {
    this.queryForm = this.fb.group({
      deviceName: [null], // 设备名称
    });
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
  // 新增
  add() {
    this.data = null;
    // 显示弹窗
    const modal = this.modalService.create({
      nzTitle: '新增监测设备',
      nzContent: AddEditMonitorComponent,
      nzWidth: 870,
      nzClosable: false,
      nzMask: false,
      nzComponentParams: {
        organization: this.organization
      },
      nzFooter: null
    });
    // 回调函数 用来刷新页面
    modal.afterClose.subscribe(resp => {
      if (resp) {
        this.searchData(this.pageIndex);
      }
    });
  }
  // 编辑
  edit() {
    if (this.numberOfChecked > 1 || this.numberOfChecked <= 0) {
      window.alert('无法确定对应设备信息，请选择一条设备信息！');
      return;
    }
    // 获取需要编辑的数据
    this.listOfData.forEach( d => {
      if ( this.mapOfCheckedId[d.id]) {
        this.data = d;
      }
    });
    // 显示弹窗
    const modal = this.modalService.create({
      nzTitle: '编辑监测设备信息',
      nzContent: AddEditMonitorComponent,
      nzWidth: 870,
      nzClosable: false,
      nzMask: false,
      nzComponentParams: {
        deviceInfo: this.data,
      },
      nzFooter: null
    });
    // 回调函数 用来刷新页面
    modal.afterClose.subscribe(resp => {
      if (resp) {
        this.searchData(this.pageIndex);
      }
    });
  }
  // 删除
  delete() {
    if (this.numberOfChecked <= 0) {
      window.alert('无法确定对应设备信息，请选择至少一条设备信息！');
      return;
    }
    let content = '您确定删除' + this.numberOfChecked + '条设备信息？';
    const  ids = [];
    for (let key in this.mapOfCheckedId) {
      if (this.mapOfCheckedId[key]) {
        ids.push(key);
      }
    }
    console.log('删除的ids', ids);
    this.modalService.confirm({
      nzTitle: '确定删除',
      nzContent: '<b style="color: red;">' + content + '</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () =>  // 调删除的逻辑
        this.deviceSvc.deleteMonitorDevice(ids, resp => {
          // 解析表格数据
          if (resp && resp.code === 0) {
            this.searchData();
            console.log('删除成功！');
          } else {
            console.log('删除失败！');
          }
        }),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }
  // 获取数据
  searchData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    // 清空选项
    this.mapOfCheckedId = {};
    this.refreshStatus();
    const params = {
      name: this.queryForm.value.deviceName,
      organizationCode: this.organization,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.deviceSvc.queryMonitoDeviceInfo(params, resp => {
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
  checkAll(value: boolean): void {
    this.listOfData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }
  refreshStatus(): void {
    this.numberOfChecked = this.listOfData.filter(item => this.mapOfCheckedId[item.id]).length;
    this.isAllDisplayDataChecked = this.listOfData.every(item => this.mapOfCheckedId[item.id]) && this.numberOfChecked > 0;
    this.isIndeterminate = !this.isAllDisplayDataChecked && this.numberOfChecked > 0;
  }

}

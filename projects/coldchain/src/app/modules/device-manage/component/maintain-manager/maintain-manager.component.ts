import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd';
import {ColdchainSelectedNodeService, RepairScrapService} from '@tod/svs-common-lib';
import {Subscription} from 'rxjs';
import {AddEditMaintainComponent} from '../dialoge/add-edit-maintain/add-edit-maintain.component';


@Component({
  selector: 'uea-maintain-manager',
  templateUrl: './maintain-manager.component.html',
  styleUrls: ['../../device-manage.component.scss']
})
export class MaintainManagerComponent implements OnInit, OnDestroy {

  queryForm: FormGroup;
  // 已选择的组织（从service中获取）
  organization: any;
  listOfData: any = [];
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
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  treeSubscribe: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private treeNodeSvc: ColdchainSelectedNodeService,
    private deviceSvc: RepairScrapService
  ) {
    this.queryForm = this.fb.group({
      deviceName: [null] // 设备名称
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
      nzTitle: '新增维修设备',
      nzContent: AddEditMaintainComponent,
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
      window.alert('无法确定对应设备信息，请选择至少一条设备信息！');
      return;
    }
    // 获取需要编辑的数据
    this.listOfData.forEach( d => {
      if ( this.mapOfCheckedId[d.id]) {
        this.data = d;
      }
    });
    if (this.data.is_repaired === '1') {
      window.alert('已修复的设备工单不能操作!');
      return;
    }
    // 显示弹窗
    const modal = this.modalService.create({
      nzTitle: '编辑维修设备信息',
      nzContent: AddEditMaintainComponent,
      nzWidth: 870,
      nzClosable: false,
      nzMask: false,
      nzComponentParams: {
        deviceInfo: this.data,
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
  // 获取数据
  searchData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    // 每次查询清空选项清空选项
    this.mapOfCheckedId = {};
    this.refreshStatus();
    const params = {
      facilityName: this.queryForm.value.deviceName,
      organizationCode: this.organization,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.deviceSvc.queryRepairData(params, resp => {
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

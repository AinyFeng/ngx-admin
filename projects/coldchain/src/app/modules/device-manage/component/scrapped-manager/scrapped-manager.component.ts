import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd';
import {Subscription} from 'rxjs';
import {ColdchainSelectedNodeService, RepairScrapService} from '@tod/svs-common-lib';
import {AddEditScrappedComponent} from '../dialoge/add-edit-scrapped/add-edit-scrapped.component';

@Component({
  selector: 'uea-scrapped-manager',
  templateUrl: './scrapped-manager.component.html',
  styleUrls: ['../../device-manage.component.scss']
})
export class ScrappedManagerComponent implements OnInit, OnDestroy {
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
    private serapSvc: RepairScrapService
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
      nzTitle: '新增报废设备',
      nzContent: AddEditScrappedComponent,
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
    this.listOfData.forEach(d => {
      if (this.mapOfCheckedId[d.id]) {
        this.data = d;
      }
    });
    // 显示弹窗
    const modal = this.modalService.create({
      nzTitle: '编辑报废设备信息',
      nzContent: AddEditScrappedComponent,
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
    this.serapSvc.queryScrapData(params, resp => {
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

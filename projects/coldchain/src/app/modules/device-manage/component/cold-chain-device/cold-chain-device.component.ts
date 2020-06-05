import {Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AddEditDeviceComponent} from '../dialoge/add-edit-device/add-edit-device.component';
import { NzModalService} from 'ng-zorro-antd';
import {ColdchainDeviceService, ColdchainSelectedNodeService} from '@tod/svs-common-lib';
import {Subscription} from 'rxjs';


@Component({
  selector: 'uea-cold-chain-device',
  templateUrl: './cold-chain-device.component.html',
  styleUrls: ['../../device-manage.component.scss']
})
export class ColdChainDeviceComponent implements OnInit, OnDestroy {
  queryForm: FormGroup;
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
  listOfData: any = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  treeSubscribe: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private deviceSvc: ColdchainDeviceService,
    private treeNodeSvc: ColdchainSelectedNodeService
  ) {
    this.queryForm = this.fb.group({
      deviceName: [null], // 设备名称
      status: [null], // 状态
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
      nzTitle: '新增冷链设备',
      nzContent: AddEditDeviceComponent,
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
        /*console.log('保存成功>>>>>', resp);*/
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
      nzTitle: '编辑冷链设备信息',
      nzContent: AddEditDeviceComponent,
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
      console.log('编辑成功>>>>>', resp);
      // 返回后刷新当前页选中置空
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
      nzOnOk: () =>
        // 调删除的逻辑
        this.deviceSvc.deleteColdChainDevice(ids, resp => {
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
   /* console.log('执行冷链设备管理的查询方法=====');*/
    if (this.loading) return;
    this.pageIndex = page;
    // 每次查询清空选项清空选项
    this.mapOfCheckedId = {};
    this.refreshStatus();
    const params = {
      facilityName: this.queryForm.value.deviceName,
      status: this.queryForm.value.status,
      organizationCode: this.organization,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('查询冷链设备参数', params);
    this.loading = true;
    this.deviceSvc.queryDeviceInfo(params, resp => {
     /* console.log('resp===', resp);*/
      this.loading = false;
      let searchDataList = resp[1];
      let searchDataCount = resp[0];
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

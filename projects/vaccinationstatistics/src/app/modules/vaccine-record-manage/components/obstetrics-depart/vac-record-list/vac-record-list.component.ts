import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

import {
  VaccineSubclassInitService,
  VaccManufactureDataService,
  VaccBroadHeadingDataService,
  SelectDistrictComponent, LOCAL_STORAGE
} from '@tod/svs-common-lib';
import {UserService} from '@tod/uea-auth-lib';
import {take} from 'rxjs/operators';
import {LocalStorageService} from '@tod/ngx-webstorage';

@Component({
  selector: 'uea-vac-record-list',
  templateUrl: './vac-record-list.component.html',
  styleUrls: ['./vac-record-list.component.scss']
})
export class VacRecordListComponent implements OnInit {
  listForm: FormGroup;

  listOfData: any = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  // 疫苗小类
  vacSubClassData = [];
  // 疫苗大类
  vacBroadHeaderData = [];
  // 生产企业
  manufactureData = [];
  userInfo: any;
  areaCode: any;
  TreeData = [];
  // 选中的节点
  selectedNode: any;
  constructor(
    private fb: FormBuilder,
    private vacSubClassSvc: VaccineSubclassInitService,
    private manufaSvc: VaccManufactureDataService,
    private modalSvc: NzModalService,
    private msg: NzMessageService,
    private vacBroadHeaderSvc: VaccBroadHeadingDataService,
    private localSt: LocalStorageService,
    private user: UserService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      this.areaCode = this.userInfo.pov;
    });
  }

  ngOnInit() {
    // 获取组织树数据
    this.TreeData = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA) === null ? [] : this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);
    // 获取小类编码
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取生产企业
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();
    // 获取疫苗大类
    this.vacBroadHeaderData = this.vacBroadHeaderSvc.getVaccBoradHeadingData();

    this.listForm = this.fb.group({
      address: [null], // 地区
      name: [null], // 儿童姓名
      motherName: [null], // 母亲姓名
      vacSbuClassCode: [null], // 疫苗名称(小类)
      manufacturerCode: [null], // 生产企业
      batchNo: [null], // 疫苗批号
      startTime: [null], // 开始信息
      endTime: [null], // 结束信息
      birthStart: [null], // 生日开始
      birthEnd: [null], // 生日结束
    });
  }

  // 查询
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
  }

  // 重置
  resetForm() {
    this.listForm.reset();
    this.loading = false;
  }
  /**
   * 选择收货单位
   */
  selectAddress() {
    const modal = this.modalSvc.create({
      nzTitle: '选择机构',
      nzContent: SelectDistrictComponent,
      nzComponentParams: {
        treeData: this.TreeData,
        hideSearchInput: false,
        unSelectedNodeKey: 'organizationType',
        selectedNode: this.selectedNode
      },
      nzBodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      nzFooter: [
        {
          label: '确定',
          type: 'primary',
          onClick: comp => {
            modal.close(comp.selectedNode);
          }
        },
        {
          label: '取消',
          type: 'default',
          onClick: () => modal.close()
        }
      ]
    });

    // 订阅关闭时获取的数值
    modal.afterClose.pipe(take(1)).subscribe(res => {
      if (res) {
        this.selectedNode = res;
        /*this.orderForm.get('supplyorgName').patchValue(res.title);
       this.orderForm.get('supplyorgCode').patchValue(res.key);*/
        this.listForm.get('address').setValue(res.title);
        this.areaCode = res.key;
      }
    });
  }

}

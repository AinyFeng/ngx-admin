import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

import {
  VaccineSubclassInitService,
  VaccManufactureDataService,
  VaccBroadHeadingDataService,
  TreeDataApi,
  PovNamePipe,
  ApiAdminDailyManagementService,
  DateUtils,
  SelectDistrictComponent, LOCAL_STORAGE
} from '@tod/svs-common-lib';
import {UserService} from '@tod/uea-auth-lib';
import {take} from 'rxjs/operators';
import {LocalStorageService} from '@tod/ngx-webstorage';


@Component({
  selector: 'uea-child-vac-record',
  templateUrl: './child-vac-record.component.html',
  styleUrls: ['./child-vac-record.component.scss'],
  providers: [ PovNamePipe ]
})
export class ChildVacRecordComponent implements OnInit {
  listForm: FormGroup;

  listOfData: any = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  // 接种针次
  injections = [
    {label: '第一针', value: '1'},
    {label: '第二针', value: '2'},
    {label: '第三针', value: '3'},
    {label: '第四针', value: '4'},
    {label: '第五针', value: '5'},
    {label: '第六针', value: '6'},
    {label: '第七针', value: '7'},
    {label: '第八针', value: '8'},
    {label: '第九针', value: '9'},
    {label: '免疫蛋白', value: '0'},
  ];
  // 疫苗小类
  vacSubClassData = [];
  // 疫苗大类
  vacBroadHeaderData = [];
  // 生产企业
  manufactureData = [];
  userInfo: any;
  povName: any;
  areaCode: any;
  TreeData = [];
  // 选中的节点
  selectedNode: any;
  // 初始化时间值
  endData = new Date();
  startDate = new Date().setDate(this.endData.getDate() - 6);
  constructor(
    private fb: FormBuilder,
    private vacSubClassSvc: VaccineSubclassInitService,
    private manufaSvc: VaccManufactureDataService,
    private modalSvc: NzModalService,
    private msg: NzMessageService,
    private vacBroadHeaderSvc: VaccBroadHeadingDataService,
    private user: UserService,
    private treeDataApi: TreeDataApi,
    private localSt: LocalStorageService,
    private vacRecordService: ApiAdminDailyManagementService,
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息数据===', resp);
      this.areaCode = this.userInfo.pov;
    });
  }

  ngOnInit() {
    // 获取组织树数据
    this.TreeData = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA) === null ? [] : this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);
    /*console.log('树数据', this.TreeData);*/
    // 获取小类编码
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取生产企业
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();
    // 获取疫苗大类
    this.vacBroadHeaderData = this.vacBroadHeaderSvc.getVaccBoradHeadingData();

    this.listForm = this.fb.group({
      address: [null], // 地区
      name: [null], // 儿童姓名
      injectionTime: [null], // 针次
      vacSbuClassCode: [null], // 疫苗名称(小类)
      vacAttribute: [null], // 疫苗属性 0-一类 1-二类
      manufacturerCode: [null], // 生产企业
      vacBroadHeaderCode: [null], // 疫苗大类
      batchNo: [null], // 疫苗批号
      startTime: [this.startDate], // 开始信息
      endTime: [this.endData], // 结束信息
    });
    this.queryData();
  }

  // 查询
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    let type = null;
    if (this.listForm.value.vacAttribute) {
      type = [this.listForm.value.vacAttribute];
    }
   const params = {
      managePovCode: this.areaCode,
      profileName: this.listForm.value.name,
      vaccinateInjectNumber: this.listForm.value.injectionTime,
     vaccineType: type,
      /* 疫苗大类没有入参, 生产企业没有入参*/
     vacSbuClassCode: this.listForm.value.vacSbuClassCode,
     vaccineBatchNo: this.listForm.value.batchNo,
     startVaccinateTime: DateUtils.formatStartDate(new Date(this.listForm.get('startTime').value)),
     endVaccinateTime: DateUtils.formatEndDate(new Date(this.listForm.get('endTime').value)),
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.vacRecordService.vaccinateRecord(params, (queryData, countData) => {
      this.loading = false;
      console.log('返回来的数据', queryData, countData);
      if (
        queryData && queryData.code === 0 && queryData.hasOwnProperty('data')) {
        this.listOfData = queryData.data;
      } else {
        this.listOfData = [];
        this.msg.warning('未查询到数据');
      }
      if (
        countData &&
        countData.code === 0 &&
        countData.hasOwnProperty('data')
      ) {
        this.total = countData.data[0]['count'];
      }
    });
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
  // 选择地区
  /*selectAddress(): void {
    const modal = this.modalSvc.create({
      nzTitle: '选择机构',
      nzContent: SelectAddressComponent,
      nzWidth: 500,
      nzClosable: false,
      nzComponentParams: {
        areaCode: this.areaCode, /!*当前的选中的节点*!/
        TreeData: this.TreeData
      },
      nzMask: false,
      nzFooter: [
        {
          label: '确定',
          type: 'primary',
          onClick: componentInstance => {
            if (componentInstance.selectedNode) {
              console.log('已选中的地区节点------', componentInstance.selectedNode);
              this.listForm.get('address').setValue(componentInstance.selectedNode.title);
              this.areaCode = componentInstance.selectedNode.key;
              modal.destroy();
              componentInstance.selectedNode = null;
            } else {
              this.msg.warning('请选择机构');
              return;
            }
          }
        },
        {
          label: '关闭',
          onClick: () => {
            modal.destroy();
          }
        }
      ]
    });
  }*/

  /**
   * 过滤开始日期
   * @param d
   */
  disabledStartDate = (d: Date) => {
    if (this.listForm.value.endTime) {
      return d > this.listForm.value.endTime;
    } else {
      return false;
    }
  }
  /**
   * 过滤开始日期
   * @param d
   */
  disabledEndDate = (d: Date) => {
    if (this.listForm.value.startTime) {
      return d < this.listForm.value.startTime;
    } else {
      return false;
    }
  }
}

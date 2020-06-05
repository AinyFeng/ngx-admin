import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

import {
  VaccineSubclassInitService,
  VaccManufactureDataService,
  VaccBroadHeadingDataService,
  DateUtils,
  VacRecordManageApiService,
  SelectDistrictComponent,
  LOCAL_STORAGE
} from '@tod/svs-common-lib';
import {UserService} from '@tod/uea-auth-lib';
import {take} from 'rxjs/operators';
import {LocalStorageService} from '@tod/ngx-webstorage';

@Component({
  selector: 'uea-adult-vac-record',
  templateUrl: './adult-vac-record.component.html',
  styleUrls: ['./adult-vac-record.component.scss']
})
export class AdultVacRecordComponent implements OnInit {

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
    private localSt: LocalStorageService,
    private vacRecordSvc: VacRecordManageApiService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      this.areaCode = this.userInfo.pov;
    });
  }

  ngOnInit() {
    this.TreeData = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA) === null ? [] : this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);
    // 获取小类编码(只需要成人接种疫苗)
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取生产企业
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();
    // 获取疫苗大类(只需要成人接种疫苗)
    this.vacBroadHeaderData = this.vacBroadHeaderSvc.getVaccBoradHeadingData();

    this.listForm = this.fb.group({
      address: [null], // 地区
      name: [null], // 接种人姓名
      manufacturerCode: [null], // 生产企业
      vacSbuClassCode: [null], // 疫苗名称(小类)
      vacBroadHeaderCode: [null], // 疫苗大类
      batchNo: [null], // 疫苗批号
      startTime: [this.startDate], // 开始信息
      endTime: [this.endData], // 结束信息
    });
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
      code: this.areaCode,  // 区域编码
      name: this.listForm.value.name, // 接种人姓名
      batchNo: this.listForm.value.batchNo, // 疫苗批号
      vaccineProductCode: [this.listForm.value.vacSbuClassCode],
      vaccineManufactureCode: this.listForm.value.manufacturerCode,
      startVaccinateTime: DateUtils.formatStartDate(new Date(this.listForm.get('startTime').value)),
      endVaccinateTime: DateUtils.formatEndDate(new Date(this.listForm.get('endTime').value)),
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.vacRecordSvc.queryAdultVacRecord(params, (queryData, countData) => {
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

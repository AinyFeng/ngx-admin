import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { UserService } from '@tod/uea-auth-lib';
import {
  DevicetypeService,
  DicDataService, StockService
} from '@tod/svs-common-lib';
import { AddColdEquipmentComponent } from '../dialog/add-cold-equipment/add-cold-equipment.component';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'uea-cold-chain-equipment',
  templateUrl: './cold-chain-equipment.component.html',
  styleUrls: ['../stock.common.scss'],
  providers: [DevicetypeService]
})
export class ColdChainEquipmentComponent implements OnInit {
  searchForm: FormGroup;
  listOfData = [];
  loading = false;
  userInfo: any;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  // 经费来源options
  sourceCodeOptions: any;
  // 设备状态options
  facilityStatusOptions: any;
  // 设备类型
  deviceTypeOptions: any;
  // 温度数据
  temperatureDate = [];

  constructor(
    private dialogService: NbDialogService,
    private user: UserService,
    private fb: FormBuilder,
    private dicSvc: DicDataService,
    private stockService: StockService,
    private devicetypeService: DevicetypeService,
    private notifier: NotifierService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    // 获取经费来源
    this.sourceCodeOptions = this.dicSvc.getDicDataByKey('fixedAssetsSource');
    // 获取设备状态
    this.facilityStatusOptions = this.dicSvc.getDicDataByKey('facilityStatus');
    // 获取冷藏设备类型
    this.devicetypeService.queryDeviceType({}, resp => {
      console.log('获取冷藏设备类型===', resp);
      this.loading = false;
      if (resp && resp.code === 0) {
        this.deviceTypeOptions = resp.data;
      } else {
        this.deviceTypeOptions = [];
      }
    });
    console.log('设备类型====', this.deviceTypeOptions);
    this.searchForm = this.fb.group({
      sourceCode: [null],
      deviceTypeCode: [null],
      facilityStatus: [null], // 设备状态
      brand: [null], // 品牌
      model: [null] // 类型
    });
    this.searchData();
  }

  // 查询
  searchData(page = 1) {
    this.pageIndex = page;
    this.loading = true;
    const params = {
      belongPovCode: this.userInfo.pov,
      sourceCode: this.searchForm.value.sourceCode,
      deviceTypeCode: this.searchForm.value.deviceTypeCode,
      facilityStatus: this.searchForm.value.facilityStatus,
      brand: this.searchForm.value.brand,
      model: this.searchForm.value.model,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.stockService.queryColdChain(params, resp => {
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

  // 编辑设备
  editFacility(data: any) {
    this.dialogService.open(AddColdEquipmentComponent, {
      context: {
        deviceInfo: data
      },
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        this.searchData(this.pageIndex);
      }
    });
  }

  // 重置
  reset() {
    this.searchForm.reset();
    this.loading = false;
  }

  // 构造温度数据
  initTemperatureDate() {
    this.temperatureDate = [];
    let hours = Math.floor(new Date().getHours() / 4);
    console.log('当前时间', new Date().getHours(), hours);
    for (let t = 0; t < hours; t++) {
      console.log(t);
      const temp = { hours: '', temperature: '' };
      temp.hours = t * 4 + '点 -- ' + (t + 1) * 4 + '点';
      temp.temperature = Math.floor(Math.random() * 8) + 1 + '℃';
      this.temperatureDate.push(temp);
    }
    console.log('温度数据===', this.temperatureDate);
  }

  /**
   * 取消冰箱关联科室 fixedAssetsCode
   */
  cancelDepartment(data: any) {
    this.loading = true;
    const fixedAssetsCode = data['fixedAssetsCode'];
    this.stockService.deleteColdChainRelationWithDepartment(fixedAssetsCode, res => {
      console.log(res);
      this.loading = false;
      if (res.code === 0) {
        this.notifier.notify('success', '删除成功');
        this.searchData();
      }
    });
  }
}

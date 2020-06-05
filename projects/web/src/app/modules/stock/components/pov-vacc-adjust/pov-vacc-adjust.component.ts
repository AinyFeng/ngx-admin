import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { NbDialogService } from '@nebular/theme';
import { AllotInpovDialogComponent } from '../dialog/allot-inpov-dialog/allot-inpov-dialog.component';
import {
  StockService,
  VaccBroadHeadingDataService,
  DepartmentInitService,
  VaccineSubclassInitService, StockCommonService
} from '@tod/svs-common-lib';



@Component({
  selector: 'uea-pov-vacc-adjust',
  templateUrl: './pov-vacc-adjust.component.html',
  styleUrls: ['../stock.common.scss'],
  providers: [StockCommonService]
})
export class PovVaccAdjustComponent implements OnInit {
  // 疫苗大类
  vacTypeList = [];
  vacSubClassData = [];
  // 部门(科室)
  departmentOptions = [];
  departmentSelect = [];
  userInfo: any;
  loading = false; // 显示入库的加载框
  listOfData = [];
  searchForm: FormGroup;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  // 冰箱设备
  facilityOptions = [];
  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private stockService: StockService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private departmentSvc: DepartmentInitService,
    private msg: NzMessageService,
    private dialogService: NbDialogService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private stockCommon: StockCommonService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    // 获取科室
    this.departmentOptions = this.departmentSvc.getDepartmentData();
    // 过滤科室信息
    this.departmentOptions.forEach( d => {
      if ( d.type === '1' || d.type === '4') {
        this.departmentSelect.push(d);
      }
    });
    // 拉取疫苗大类的数据
    this.vacTypeList = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    // 拉取疫苗小类的数据
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    this.searchForm = this.fb.group({
      batchCode: [null],
      facilityCode: [null], // 冷藏设备编码
      departmentCode: [null], // 部门
      vaccineSubclassCode: [[]],
    });
    // 查询
    this.toSearch();
  }

  // 查询
  toSearch(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    const params = {
      povCode: this.userInfo.pov,
      facilityCode: this.searchForm.value.facilityCode,
      departmentCode: this.searchForm.value.departmentCode,
      vaccineSubclassCode: this.searchForm.value.vaccineSubclassCode,
      batchCode: this.searchForm.value.batchCode === '' ? null : this.searchForm.value.batchCode,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数====', params);
    this.loading = true;
    this.stockService.queryStock(params, res => {
      this.loading = false;
      console.log('库存余量=====', res);

      let searchDataList = res[0];
      let searchDataCount = res[1];
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      } else {
        this.listOfData = [];
        this.msg.warning(`${res.msg}`);
      }
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
      } else {
        this.total = 0;
        this.msg.warning(`${res.msg}`);
      }
    });
  }
  // 调拨
  allot(data) {
    this.dialogService.open(AllotInpovDialogComponent, {
      context: {
        allotInfo: data
      },
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        // 在入库页面点击确定后的回调
        console.log('完成报损回调'  +　result);
        this.toSearch(this.pageIndex);
      }
    });
  }
  // 重置
  reset() {
    this.searchForm = this.fb.group({
      batchCode: [null],
      facilityCode: [null], // 冷藏设备编码
      departmentCode: [null], // 部门
      vaccineSubclassCode: [[]],
    });
    this.loading = false;
    this.facilityOptions = [];
  }

  /**
   *  获取部门下的设备
   * @param ev
   */
  departmentChange(ev) {
    console.log('部门====',  ev);
    if (!ev) {
      return;
    }
    this.facilityOptions = [];
    const params = {
      belongPovCode: this.userInfo.pov,
      belongDepartmentCode: ev
    };
    this.stockCommon.getFacilityOptions(params, res => {
      this.loading = false;
      if (res && res.code === 0) {
        this.facilityOptions = res.data;
        console.log('设备====', params, this.facilityOptions);
      } else {
        this.facilityOptions = [];
      }
    });
  }
}

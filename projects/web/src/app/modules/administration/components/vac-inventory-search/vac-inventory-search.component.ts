import { Component, OnInit } from '@angular/core';
import {
  DicDataService,
  VaccManufactureDataService,
  VaccBroadHeadingDataService,
  ApiAdminDailyManagementService,
  DepartmentInitService,
  VaccineSubclassInitService,
  FileDownloadUtils,
  FILE_TYPE,
  DateUtils, FILE_TYPE_SUFFIX, StockExportService
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { NbDialogService } from '@nebular/theme';
import { VacBreakageOutComponent } from '../dialog/vac-breakage-out/vac-breakage-out.component';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'uea-vac-inventory-search',
  templateUrl: './vac-inventory-search.component.html',
  styleUrls: ['../admin.common.scss']
})
export class VacInventorySearchComponent implements OnInit {
  vacStockForm: FormGroup;
  listOfData: any[] = [];
  // 用户信息
  userInfo: any;
  // 疫苗大类名称
  vacBroadHeadingData = [];
  // 疫苗小类
  vacSubClassData = [];
  // 疫苗类型
  vaccineTypeData = [];
  // 部门(科室)
  departmentOptions = [];
  departmentSelect = [];
  // 疫苗厂商
  manufactureData = [];

  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;

  constructor(
    private dicSvc: DicDataService,
    private manufaSvc: VaccManufactureDataService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private fb: FormBuilder,
    private modalSvc: NzModalService,
    private api: ApiAdminDailyManagementService,
    private user: UserService,
    private msg: NzMessageService,
    private departmentSvc: DepartmentInitService,
    private exportSvc: StockExportService,
    private dialogService: NbDialogService,
  ) {
    // 获取用户数据
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
    });
  }

  ngOnInit() {
    // 拉取疫苗小类的数据
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取疫苗大类
    /* this.vacBroadHeadingData = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
     console.log('疫苗大类', this.vacBroadHeadingData);*/
    // 获取疫苗类型
    this.vaccineTypeData = this.dicSvc.getDicDataByKey('vaccineType');
    // 获取疫苗厂商
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();
    // 获取科室
    this.departmentOptions = this.departmentSvc.getDepartmentData();
    /* console.log('科室信息====', this.departmentOptions);*/
    // 过滤科室信息
    this.departmentOptions.forEach(d => {
      if (d.type === '1' || d.type === '4') {
        this.departmentSelect.push(d);
      }
    });
    this.vacStockForm = this.fb.group({
      /*    vacBroadHeadingCode: [null], // 疫苗名称 大类*/
      subClassData: [[]], // 疫苗名称 疫苗编码
      batchCode: [null], // 疫苗批号
      manufacturerCode: [null], // 疫苗厂商
      vaccineType: [null], // 疫苗类型
      departmentCode: [null], // 科室
      maintainZeroInventory: [false] // 维护0库存
    });
    this.searchData();
  }

  /**
   * 查询数据
   */
  searchData(page = 1) {
    this.pageIndex = page;
    this.loading = true;
    let vacStockForm = JSON.parse(JSON.stringify(this.vacStockForm.value));
    let param = {
      povCode: this.userInfo.pov,
      batchCode: vacStockForm.batchCode === '' ? null : vacStockForm.batchCode,
      /*  broadHeadingCode: vacStockForm.vacBroadHeadingCode,*/
      vaccineSubclassCode: vacStockForm.subClassData, // 疫苗名称 疫苗编码
      manufacturerCode: vacStockForm.manufacturerCode,
      vaccineType: vacStockForm.vaccineType,
      maintain: vacStockForm.maintainZeroInventory,
      departmentCode: vacStockForm.departmentCode,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('param', param);
    this.api.vacStockQuery(param, resp => {
      console.log('resp===', resp);
      this.loading = false;
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      } else {
        this.listOfData = [];
        this.msg.warning(`${ resp.msg }`);
      }
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
      } else {
        this.total = 0;
      }
    });
  }

  // 导出 StockExportService
  export() {
    if (this.listOfData.length === 0) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: '没有数据，请先执行查询操作',
        nzMaskClosable: true
      });
      return;
    }
    this.dialogService.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认导出',
        content: '是否确认导出此报表?'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        let vacStockForm = JSON.parse(JSON.stringify(this.vacStockForm.value));
        const params = {
          povCode: this.userInfo.pov,
          batchCode: vacStockForm.batchCode === '' ? null : vacStockForm.batchCode,
          /*  broadHeadingCode: vacStockForm.vacBroadHeadingCode,*/
          vaccineSubclassCode: vacStockForm.subClassData, // 疫苗名称 疫苗编码
          manufacturerCode: vacStockForm.manufacturerCode,
          vaccineType: vacStockForm.vaccineType,
          maintain: vacStockForm.maintainZeroInventory,
          departmentCode: vacStockForm.departmentCode,
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        };
        console.log('params2', params);
        this.loading = true;
        this.exportSvc.inventoryLevelExcel(params, resp => {
          this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '疫苗库存报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

  // 重置
  reset() {
    this.vacStockForm = this.fb.group({
      /* vacBroadHeadingCode: [null], // 疫苗名称 大类*/
      subClassData: [[]], // 疫苗名称 疫苗编码
      batchCode: [null], // 疫苗批号
      manufacturerCode: [null], // 疫苗厂商
      vaccineType: [null], // 疫苗类型
      departmentCode: [null], // 科室
      maintainZeroInventory: [false] // 维护0库存
    });
    this.loading = false;
    /* this.listOfData = [];*/
  }

  // 是否维护0库存
  toggle(check: boolean) {
    this.vacStockForm.get('maintainZeroInventory').setValue(check);
  }

  // 报损出库
  breakageOut(data) {
    this.dialogService.open(VacBreakageOutComponent, {
      context: {
        breakage: data
      },
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        // 在入库页面点击确定后的回调
        console.log('完成报损回调' + result);
        this.searchData();
      }
    });
  }
}

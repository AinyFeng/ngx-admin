import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import {
  DicDataService,
  BatchInjectService,
  StockService,
  VaccManufactureDataService,
  VaccBroadHeadingDataService,
  VaccineSubclassInitService,
  DateUtils, FileDownloadUtils, FILE_TYPE, FILE_TYPE_SUFFIX, StockExportService
} from '@tod/svs-common-lib';
import { NbDateService, NbDialogService } from '@nebular/theme';
import { BatchInjectAddComponent } from '../dialog/batch-inject-add/batch-inject-add.component';
import { BatchInjectBackComponent } from '../dialog/batch-inject-back/batch-inject-back.component';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NzModalService } from 'ng-zorro-antd';


@Component({
  selector: 'uea-batch-inject',
  templateUrl: './batch-inject.component.html',
  styleUrls: ['../stock.common.scss'],
  providers: [
    BatchInjectService
  ],
})
export class BatchInjectComponent implements OnInit {
  batchInjectFrom: FormGroup;
  loading = false;
  // 疫苗类型
  vaccineTypeData = [];
  // 疫苗厂商
  manufactureData = [];
  // 疫苗大类
  vacTypeList = [];
  // 疫苗小类名称
  vacSubClassData = [];
  vacSubClassOptions = [];
  userInfo: any;
  listOfData = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  checked = false;
  maxDate: Date;

  constructor(
    private dialogService: NbDialogService,
    private user: UserService,
    private fb: FormBuilder,
    private stockService: StockService,
    private dicSvc: DicDataService,
    private manufaSvc: VaccManufactureDataService,
    private batchInjectService: BatchInjectService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private exportSvc: StockExportService,
    private modalSvc: NzModalService,
    protected dateService: NbDateService<Date>
  ) {
    this.maxDate = this.dateService.today();
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  toggle(checked: boolean) {
    this.checked = checked;
  }

  ngOnInit() {
    // 拉取疫苗大类的数据
    this.vacTypeList = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    // 拉取疫苗小类的数据
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取疫苗类型
    this.vaccineTypeData = this.dicSvc.getDicDataByKey('vaccineType');
    // 获取疫苗厂商
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();
    this.batchInjectFrom = this.fb.group({
      beVaccinateUnits: [null],
      vaccineBatchNo: [null],
      vaccineProductCode: [null],
      vaccinateTime: [null],
      manufacturerCode: [null],
      vaccineType: [null],
    });
    this.searchData();
  }

  // 查询批量接种记录
  searchData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    let batchInjectFrom = JSON.parse(JSON.stringify(this.batchInjectFrom.value));
    let vaccinateTimeStr = null;
    if (batchInjectFrom.vaccinateTime) {
      vaccinateTimeStr = this.batchInjectFrom.get('vaccinateTime').value.format('YYYY-MM-DD HH:mm:ss');
    }
    const params = {
      vaccinatePovCode: this.userInfo.pov,
      vaccinateDepartmentCode: this.userInfo.department,
      beVaccinateUnits: batchInjectFrom.beVaccinateUnits,
      vaccineBatchNo: batchInjectFrom.vaccineBatchNo,
      vaccineProductCode: batchInjectFrom.vaccineProductCode,
      vaccinateTime: vaccinateTimeStr,
      vaccineManufactureCode: batchInjectFrom.manufacturerCode,
      vaccineType: batchInjectFrom.vaccineType,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.batchInjectService.queryBatchVaccinateRecord(params, resp => {
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

  /**
   * 根据疫苗大类选择疫苗小类
   * @param ev
   */
  vaccineBroadHeadingChange(ev) {
    if (!ev) {
      return;
    }
    this.vacSubClassOptions = [];
    this.vacSubClassData.forEach(vac => {
      if (vac.value.substring(0, 2) === ev) {
        this.vacSubClassOptions.push(vac);
      }
    });
  }

  // 添加批量接种
  addBatchInject() {
    this.dialogService.open(BatchInjectAddComponent, {
      context: {},
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        this.searchData(this.pageIndex);
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
        let batchInjectFrom = JSON.parse(JSON.stringify(this.batchInjectFrom.value));
        let vaccinateTimeStr = null;
        if (batchInjectFrom.vaccinateTime) {
          vaccinateTimeStr = this.batchInjectFrom.get('vaccinateTime').value.format('YYYY-MM-DD HH:mm:ss');
        }
        const params = {
          vaccinatePovCode: this.userInfo.pov,
          vaccinateDepartmentCode: this.userInfo.department,
          beVaccinateUnits: batchInjectFrom.beVaccinateUnits,
          vaccineBatchNo: batchInjectFrom.vaccineBatchNo,
          vaccineProductCode: batchInjectFrom.vaccineProductCode,
          vaccinateTime: vaccinateTimeStr,
          vaccineManufactureCode: batchInjectFrom.manufacturerCode,
          vaccineType: batchInjectFrom.vaccineType,
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        };
        console.log('params2', params);
        this.loading = true;
        this.exportSvc.batchVaccinateRecordExcel(params, resp => {
          this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '批量接种报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

  // 重置
  reset() {
    this.batchInjectFrom.reset();
    this.loading = false;
  }

  // 批量接种退回（入库）
  stockBack(data: any) {
    this.dialogService.open(BatchInjectBackComponent, {
      context: {
        vaccinateInfo: data
      },
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        this.searchData(this.pageIndex);
      }
    });
  }
}

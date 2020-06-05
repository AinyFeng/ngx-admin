import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import {
  DateUtils,
  DepartmentInitService, FILE_TYPE, FILE_TYPE_SUFFIX, FileDownloadUtils,
  StockExportService,
  StockService,
  VaccineSubclassInitService
} from '@tod/svs-common-lib';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'uea-daily-inventory',
  templateUrl: './daily-inventory.component.html',
  styleUrls: ['../stock.common.scss']
})
export class DailyInventoryComponent implements OnInit {
  form: FormGroup;
  userInfo: any;
  loading = false;
  listOfData = [];
  pageIndex = 1;
  pageSize = 10;
  // 小类下拉options
  vacSubClassData = [];
  // 科室信息
  departmentOptions = [];
  // 当前日期
  date = moment(new Date());
  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private stockService: StockService,
    private msg: NzMessageService,
    private modalSvc: NzModalService,
    private dialogService: NbDialogService,
    private exportSvc: StockExportService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private departmentSvc: DepartmentInitService,
  ) {
    // 获取科室
    this.departmentOptions = this.departmentSvc.getDepartmentData();
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    // 拉取疫苗小类的数据
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    this.form = this.fb.group({
      startDate: [moment(new Date()), [Validators.required]],
      endDate: [moment(new Date()), [Validators.required]],
      departmentCode: [],
      vaccineSubclassCode: [[]],
      prodBatchCode: [null]
    });
    this.toSearch();
  }
 // 日报盘点
  toSearch() {
    if (this.loading) return; // 正在查询不给点
    this.loading = true;
    const params = {
      povCode: this.userInfo.pov,
      departmentCode: this.form.value.departmentCode,
      vaccineSubclassCode: this.form.value.vaccineSubclassCode,
      prodBatchCode: this.form.value.prodBatchCode,
      startDate: this.form.get('startDate').value.format('YYYY-MM-DD') + ' 00:00:00',
      endDate: this.form.get('endDate').value.format('YYYY-MM-DD') + ' 23:59:59'
    };
      console.log('库存盘点params===', params);
      this.stockService.queryStockDaily(params, res => {
        console.log('库存盘点=====', res);
        this.loading = false;
        // 解析表格数据
        if (res && res.code === 0) {
          this.listOfData = res.data;
        } else {
          this.listOfData = [];
        }
      });
    }
    // 导出库存盘点
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
        const params = {
          povCode: this.userInfo.pov,
          departmentCode: this.form.value.departmentCode,
          vaccineSubclassCode: this.form.value.vaccineSubclassCode,
          prodBatchCode: this.form.value.prodBatchCode,
          startDate: this.form.get('startDate').value.format('YYYY-MM-DD') + ' 00:00:00',
          endDate: this.form.get('endDate').value.format('YYYY-MM-DD') + ' 23:59:59',
        };
        // console.log('params1', params);
        this.loading = true;
        this.exportSvc.excelStockInventory(params, resp => {
          this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '库存盘点_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }
  // 重置
  reset() {
    this.loading = false;
    this.form = this.fb.group({
      startDate: [moment(new Date()), [Validators.required]],
      endDate: [moment(new Date()), [Validators.required]],
      departmentCode: [],
      vaccineSubclassCode: [[]],
      prodBatchCode: [null],
    });
  }

  /**
   * 过滤开始日期
   * @param d
   */
  disabledStartDate = (d: Date) => {
    if (this.form.value.endDate) {
      return d <= this.form.value.endDate;
    } else {
      return false;
    }
  }
  /**
   * 过滤开始日期
   * @param d
   */
  disabledEndDate = (d: Date) => {
    if (this.form.value.startDate) {
      return d >= this.form.value.startDate;
    } else {
      return false;
    }
  }
}

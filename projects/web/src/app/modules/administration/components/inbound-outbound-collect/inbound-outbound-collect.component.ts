import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import { NbDateService, NbDialogService, NbWindowService } from '@nebular/theme';
import { NzModalService } from 'ng-zorro-antd';
import { InandoutCollectDetailComponent } from '../dialog/inandout-collect-detail/inandout-collect-detail.component';
import {
  VaccineSubclassInitService,
  StockService,
  FileDownloadUtils,
  FILE_TYPE,
  DateUtils,
  FILE_TYPE_SUFFIX, StockExportService
} from '@tod/svs-common-lib';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'uea-inbound-outbound-collect',
  templateUrl: './inbound-outbound-collect.component.html',
  styleUrls: ['../admin.common.scss']
})
export class InboundOutboundCollectComponent implements OnInit {
  recordSumForm: FormGroup;
  listOfData: any[] = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  // 疫苗名称
  vacSubClassData = [];
  userInfo: any;
  /**
   * 当前日期
   */
  currentDate = moment();
  constructor(
    private vacSubClassSvc: VaccineSubclassInitService,
    private fb: FormBuilder,
    private user: UserService,
    private stockService: StockService,
    private dialogService: NbDialogService,
    private exportSvc: StockExportService,
    private modalSvc: NzModalService,
    protected dateService: NbDateService<Date>
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo);
    });
  }

  ngOnInit() {
    // 拉取疫苗小类的数据
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    this.recordSumForm = this.fb.group({
      subClassData: [[]], // 疫苗名称 疫苗编码
      vaccineBatchNo: [null], // 疫苗批次号
      accessType: [null], // 出入库类型
      accessDateStart: [moment(new Date())], // 出库时间范围  默认 查询当天
      accessDateEnd: [moment(new Date())] // 出库时间范围
    });
    // 加载默认查询
    this.searchData();
  }
  /**
   * 过滤修改日期 - 起
   * @param d
   */
  filterStartDate = (d: Moment) => {
    const endDate = this.recordSumForm.get('accessDateEnd').value;
    if (endDate) {
      return d <= endDate;
    }
    return d <= this.currentDate;
  }
  /**
   * 过滤修改日期 - 止
   * @param d
   */
  filterEndDate = (d: Moment) => {
    const startDate = this.recordSumForm.get('accessDateStart').value;
    if (startDate) {
      return d >= startDate && d <= this.currentDate;
    }
    return d <= this.currentDate;
  }
  //  查询
  searchData(page = 1) {
    this.pageIndex = page;
    const params = {
      povCode: this.userInfo.pov,
      prodBatchCode: this.recordSumForm.value.vaccineBatchNo === '' ? null : this.recordSumForm.value.vaccineBatchNo,
      vaccineSubclassCode: this.recordSumForm.value.subClassData,
      isStockIn: this.recordSumForm.value.accessType,
      startTime: this.recordSumForm.get('accessDateStart').value.format('YYYY-MM-DD') + ' 00:00:00',
      endTime: this.recordSumForm.get('accessDateEnd').value.format('YYYY-MM-DD') + ' 23:59:59',
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.stockService.queryInAndOutCollect(params, resp => {
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
  // 查看详情
  detail(data: any) {
    this.dialogService.open(InandoutCollectDetailComponent, {
      context: {
        collectInfo: data
      },
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        // 在入库页面点击确定后的回调
        console.log('查看详情回调' + result);
        // this.searchData();
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
        const params = {
          povCode: this.userInfo.pov,
          prodBatchCode: this.recordSumForm.value.vaccineBatchNo === '' ? null : this.recordSumForm.value.vaccineBatchNo,
          vaccineSubclassCode: this.recordSumForm.value.subClassData,
          isStockIn: this.recordSumForm.value.accessType,
          startTime: this.recordSumForm.get('accessDateStart').value.format('YYYY-MM-DD') + ' 00:00:00',
          endTime: this.recordSumForm.get('accessDateEnd').value.format('YYYY-MM-DD') + ' 23:59:59',
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        };
        // console.log('params1',params);
        this.loading = true;
        this.exportSvc.excelInventoryDetail(params, resp => {
        this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '出入库记录汇总报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

  // 重置
  reset() {
    this.loading = false;
    this.recordSumForm = this.fb.group({
      subClassData: [[]], // 疫苗名称 疫苗编码
      vaccineBatchNo: [null], // 疫苗批次号
      accessType: [null], // 出入库类型
      accessDateStart: [moment(new Date())], // 出库时间范围  默认 查询当天
      accessDateEnd: [moment(new Date())] // 出库时间范围
    });
  }

}

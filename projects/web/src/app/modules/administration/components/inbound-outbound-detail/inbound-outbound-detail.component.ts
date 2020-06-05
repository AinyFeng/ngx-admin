import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  StockService,
  DateUtils,
  DicDataService,
  VaccineSubclassInitService,
  StockExportService,
  FileDownloadUtils, FILE_TYPE, FILE_TYPE_SUFFIX
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { NzModalService } from 'ng-zorro-antd';
import { NbDialogService } from '@nebular/theme';
import { DiscussModifyDialogComponent } from '../dialog/discuss-modify-dialog/discuss-modify-dialog.component';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'uea-inbound-outbound-detail',
  templateUrl: './inbound-outbound-detail.component.html',
  styleUrls: ['../admin.common.scss']
})
export class InboundOutboundDetailComponent implements OnInit {
  recordDetailForm: FormGroup;
  listOfData: any[] = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  // 疫苗小类名称
  vacSubClassData = [];
  // 业务类型数据
  stockEventData = [];
  userInfo: any;
  // 是否作为弹出框
  isDialog: boolean;
  // 汇总中查看详情
  @Input()
  collectInfo: any;
  @Input()
  ref: any;
  @Input()
  styleD: any;
  /**
   * 当前日期
   */
  currentDate = moment();
  style = false;

  constructor(
    private vacSubClassSvc: VaccineSubclassInitService,
    private fb: FormBuilder,
    private stockService: StockService,
    private user: UserService,
    private dicSvc: DicDataService,
    private dialogService: NbDialogService,
    private modalSvc: NzModalService,
    private exportSvc: StockExportService,
    private dialogSvc: NbDialogService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo);
    });
  }

  ngOnInit() {
    // 拉取疫苗小类的数据
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    console.log('汇总信息=====', this.collectInfo);
    // 业务类型
    this.stockEventData = this.dicSvc.getDicData().stockChangeEvent;
    // 判断是否是弹出框
    if (this.collectInfo && this.collectInfo != null) {
      this.isDialog = true;
      let beginTime = new Date(this.collectInfo.stockChangeTime);
      this.recordDetailForm = this.fb.group({
        accessDateStart: [moment(beginTime)], // 出入库时间
        accessDateEnd: [moment(beginTime)], // 出入库时间
        /*broadHeadingCode: [this.collectInfo.broadHeadingCode], // 疫苗大类*/
        subClassData: [[]], // 疫苗小类
        accessType: [this.collectInfo.isStockIn], // 出入库类型
        stockTime: [DateUtils.getFormatDateTime(this.collectInfo.stockChangeTime)], // 入库时间
        batchCode: [this.collectInfo.prodBatchCode], // 批号
        stockEventSerial: [this.collectInfo.stockEventSerial], // 业务类型
        automated: [null]
      });
    } else {
      this.isDialog = false;
      // 添加查询条件
      this.recordDetailForm = this.fb.group({
        accessDateStart: [moment(new Date())], // 出入库时间
        accessDateEnd: [moment(new Date())], // 出入库时间
        subClassData: [[]], // 疫苗名称 疫苗小类数组
        accessType: [null], // 出入库类型
        stockTime: [null],
        batchCode: [null],
        automated: [null],
        stockEventSerial: [null], // 业务类型
      });
    }
    // 默认查询
    this.searchData(1);
  }

  /**
   * 过滤修改日期 - 起
   * @param d
   */
  filterStartDate = (d: Moment) => {
    const endDate = this.recordDetailForm.get('accessDateEnd').value;
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
    const startDate = this.recordDetailForm.get('accessDateStart').value;
    if (startDate) {
      return d >= startDate && d <= this.currentDate;
    }
    return d <= this.currentDate;
  }

  //  查询
  searchData(page = 1) {
    let batchFrom = JSON.parse(JSON.stringify(this.recordDetailForm.value));
    const params = {
      povCode: this.userInfo.pov,
      vaccineProductCode: batchFrom.vaccineProductCode,
      batchCode: batchFrom.batchCode === '' ? null : batchFrom.batchCode,
      vaccineSubclassCode: batchFrom.subClassData,
      isStockIn: batchFrom.accessType,
      startTime: this.recordDetailForm.get('accessDateStart').value.format('YYYY-MM-DD') + ' 00:00:00',
      endTime: this.recordDetailForm.get('accessDateEnd').value.format('YYYY-MM-DD') + ' 23:59:59',
      stockChangeEvent: batchFrom.stockEventSerial, // 业务类型
      stockChangeTime: batchFrom.stockTime, // 入库时间
      automated: batchFrom.automated,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.pageIndex = page;
    this.loading = true;
    this.stockService.queryInAndOutDetail(params, resp => {
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
    this.dialogSvc.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认导出',
        content: '是否确认导出此报表?'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        let batchFrom = JSON.parse(JSON.stringify(this.recordDetailForm.value));
        const params = {
          povCode: this.userInfo.pov,
          vaccineProductCode: batchFrom.vaccineProductCode,
          batchCode: batchFrom.batchCode === '' ? null : batchFrom.batchCode,
          vaccineSubclassCode: batchFrom.subClassData,
          isStockIn: batchFrom.accessType,
          startTime: this.recordDetailForm.get('accessDateStart').value.format('YYYY-MM-DD') + ' 00:00:00',
          endTime: this.recordDetailForm.get('accessDateEnd').value.format('YYYY-MM-DD') + ' 23:59:59',
          stockChangeEvent: batchFrom.stockEventSerial, // 业务类型
          stockChangeTime: batchFrom.stockTime, // 入库时间
          automated: batchFrom.automated,
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        };
        console.log(params);
        this.loading = true;
        this.exportSvc.exportChangeRecords(params, resp => {
        this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '出入库明细报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }
  // 重置
  reset() {
    this.loading = false;
    this.recordDetailForm = this.fb.group({
      accessDateStart: [moment(new Date())], // 出入库时间
      accessDateEnd: [moment(new Date())], // 出入库时间
      subClassData: [[]], // 疫苗名称 疫苗小类数组
      accessType: [null], // 出入库类型
      stockTime: [null],
      batchCode: [null],
      automated: [null],
      stockEventSerial: [null], // 业务类型
    });
  }
  // 合议
  discussAndModify(data: any) {
    this.dialogService.open(DiscussModifyDialogComponent, {
      context: {
        discussInfo: data
      },
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        // 在入库页面点击确定后的回调
        console.log('合议成功回调' + result);
        this.searchData(this.pageIndex);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import { NbDateService, NbDialogService } from '@nebular/theme';
import { CityStockBackComponent } from '../dialog/city-stock-back/city-stock-back.component';
import { CityInStockComponent } from '../dialog/city-in-stock/city-in-stock.component';
import { CityStockRefuseComponent } from '../dialog/city-stock-refuse/city-stock-refuse.component';
import {CityInDetailComponent} from '../dialog/city-in-detail/city-in-detail.component';
import {
  DateUtils,
  DicDataService, FILE_TYPE, FILE_TYPE_SUFFIX, FileDownloadUtils, StockExportService,
  StockService,
  VaccBroadHeadingDataService,
  VaccineSubclassInitService
} from '@tod/svs-common-lib';
import * as moment from 'moment';
import { Moment } from 'moment';
import {ConfirmDialogComponent} from "../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component";



@Component({
  selector: 'uea-city-out-in',
  templateUrl: './city-out-in.component.html',
  styleUrls: ['../stock.common.scss']
})
export class CityOutInComponent implements OnInit {
  searchForm: FormGroup;
  userInfo: any;
  loading = false;  // 显示入库的加载框
  listOfData = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  /**
   * 当前日期
   */
  currentDate = moment();
  max: Date;

  constructor(
    private user: UserService,
    private stockService: StockService,
    private fb: FormBuilder,
    private dicSvc: DicDataService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private dialogService: NbDialogService,
    private msg: NzMessageService,
    protected dateService: NbDateService<Date>,
    private modalSvc: NzModalService,
    private exportSvc: StockExportService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
    this.max = this.dateService.today();
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      pullDateStart: [moment(new Date())],
      pullDateEnd: [moment(new Date())]
    });
    this.toSearch();
  }


  /**
   * 过滤修改日期 - 起
   * @param d
   */
  filterStartDate = (d: Moment) => {
    const endDate = this.searchForm.get('pullDateEnd').value;
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
    const startDate = this.searchForm.get('pullDateStart').value;
    if (startDate) {
      return d >= startDate && d <= this.currentDate;
    }
    return d <= this.currentDate;
  }

  // 查询入库信息
  toSearch(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    const params = {
      // 测试
      /* povCode: '3406030301',*/
      povCode: this.userInfo.pov,
      /* batchCode: this.searchForm.value.batchCode,*/
      pullDateStart: this.searchForm.get('pullDateStart').value.format('YYYY-MM-DD') + ' 00:00:00',
      pullDateEnd:   this.searchForm.get('pullDateEnd').value.format('YYYY-MM-DD') + ' 23:59:59',
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数====', params);
    this.loading = true;
    this.stockService.queryNeedInstock(params, resp => {
      this.loading = false;
      console.log('市平台入库???????====', resp);
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

  // 表头操作 将已入库的疫苗退回
 /* stockedBack() {
    this.dialogService.open(CityStockBackComponent, {
      context: {},  // 传递需要退回的数据
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        // 操作成功后
      }
    });
  }*/
  // 对已入库的苗进行退回操作
  stockedBack(data: any) {
    this.dialogService.open(CityStockBackComponent, {
      context: {
        sendBackInfo: data
      },  // 传递需要退回的数据
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        // 操作成功后
        this.toSearch(this.pageIndex);
      }
    });
  }

  // 重置
  reset() {
    this.searchForm = this.fb.group({
      pullDateStart: [moment(new Date())],
      pullDateEnd: [moment(new Date())]
    });
    this.loading = false;
  }

  // 入库
  inStock(data: any) {
    this.dialogService.open(CityInStockComponent, {
      context: {
        instockInfo: data
      },
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        // 在入库页面点击确定后的回调
        console.log('完成入库回调' + result);
        this.toSearch(this.pageIndex);
      }
    });
  }

  // 拒收
  refuse(data) {
    this.dialogService.open(CityStockRefuseComponent, {
      context: {
        instockInfo: data
      },
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        // 在入库页面点击确定后的回调
        console.log('完成拒收回调！' + result);
        this.toSearch(this.pageIndex);
      }
    });
  }

  /**
   * 刷新市平台订单，用以获取待入库的市平台订单
   */
  refreshOrder() {
    if (!this.userInfo) return;
    const povCode = this.userInfo.pov;
    this.stockService.refreshCityPlatformOrder(povCode, resp => {
      console.log('刷新市平台入库订单返回值', resp);
      if (resp.code === 0) {
        this.msg.success('刷新市平台订单成功');
        this.toSearch();
      } else {
        this.msg.error('刷新市平台订单失败，请重试');
      }
    });
  }
  // 查看该单号下的疫苗详情
  showDetail(data)　{
    this.dialogService.open(CityInDetailComponent, {
      context: {
        instockInfo: data
      },
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        // 查看完的回调，这里不用任何操作
      }
    });
  }

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
      if (confirm) {debugger
        const params = {
          povCode: this.userInfo.pov,
          pullDateStart: this.searchForm.get('pullDateStart').value.format('YYYY-MM-DD') + ' 00:00:00',
          pullDateEnd:   this.searchForm.get('pullDateEnd').value.format('YYYY-MM-DD') + ' 23:59:59'
        };
        // console.log('params1', params);
        this.loading = true;
        this.exportSvc.excelStockCityOutIn(params, resp => {
          this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '平台入库_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }
}

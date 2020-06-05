import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import { NbIconLibraries } from '@nebular/theme';
import { NbMomentDateService } from '@nebular/moment';
import { NzMessageService } from 'ng-zorro-antd';
import {
  DicDataService,
  ChargeService,
  DateUtils,
  VaccineSubclassInitService,
  PovStaffInitService
} from '@tod/svs-common-lib';
import { AppStateService } from '../../../@uea/service/app.state.service';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'uea-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.scss'],
  providers: [NbMomentDateService]
})
export class ChargeComponent implements OnInit, OnDestroy {
  reportTotal = 0;
  invoiceTotal = 0;
  pageIndexReport = 1;
  pageSizeReport = 10;
  pageIndexInvoice = 1;
  pageSizeInvoice = 10;

  invoiceForm: FormGroup;
  payForm: FormGroup;
  orderForm: FormGroup;
  reportForm: FormGroup;
  userInfo: any;

  // 支付方式
  payWays = [];

  // 发票统计列表数据
  invoiceList = [];

  // 网上支付列表数据
  onlinePayList = [];

  // 对账列表数据
  payCheckList = [];

  // 报表管理列表数据
  reportList = [];

  // 查询发票统计按钮
  showTipBtn = true;

  // 每天开始时间和结束时间
  todayStart: any;
  todayEnd: any;
  currentDate: any;

  // 收银员 暂定为登记人员
  options: any = [];

  // 实际打印发票
  reallyPrintCount = 0;
  // 首款总额
  totalAmount = 0;

  currentNow = moment();
  today: any;


  constructor(
    private appStateService: AppStateService,
    private user: UserService,
    private fb: FormBuilder,
    private dicDataService: DicDataService,
    private chargeService: ChargeService,
    iconLibraries: NbIconLibraries,
    private momentSvc: NbMomentDateService,
    private msg: NzMessageService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private location: Location,
    private staffInitSvc: PovStaffInitService
  ) {
    this.currentDate = this.momentSvc.today();
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconLibraries.setDefaultPack('fas');

    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo);
    });
  }

  loading = false; // 显示入库的加载框

  ngOnInit() {
    this.appStateService.setSubTitle('报表管理');
    this.options = this.staffInitSvc.getPovStaffData().filter(staff => staff.hasOwnProperty('number'));
    // 计算一天的开始和结束
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    this.today = new Date(year, month, day);
    this.todayStart = new Date(year, month, day, 0, 0, 0);
    this.todayEnd = new Date(year, month, day, 23, 59, 59);
    this.loadPayWays();
    this.invoiceForm = this.fb.group({
      cashierName: [null], // 收银员
      status: [null], // 发票状态。0-正常；1-已作废
      invoiceSerial: [null], // 发票流水号
      vaccineeName: [null], // 受种人姓名
      createStartTime: [this.today], // 创建起始时间。时间为空时，默认值为当天的0:00
      createEndTime: [this.today] // 创建结束时间。时间为空时，默认值为当天的24:00。
    });
    this.payForm = this.fb.group({
      vaccineeName: [null], // 受种人姓名
      orderSerial: [null], // 发票流水号
      createStartTime: [null], // 创建起始时间。时间为空时，默认值为当天的0:00
      createEndTime: [null] // 创建结束时间。时间为空时，默认值为当天的24:00。
    });
    this.orderForm = this.fb.group({
      orderSerial: [null], // 订单流水号
      createStartTime: [null], // 创建起始时间。时间为空时，默认值为当天的0:00
      createEndTime: [null] // 创建结束时间。时间为空时，默认值为当天的24:00。
    });
    this.reportForm = this.fb.group({
      cashierName: [null], // 收银员
      // vaccineeName: [null], // 受种人姓名
      createStartTime: [this.today], // 创建起始时间。时间为空时，默认值为当天的0:00
      createEndTime: [this.today], // 创建结束时间。时间为空时，默认值为当天的24:00。
      vaccineProductCode: [null], // 疫苗名称
    });
  }

  // 发票统计中的日期-起
  filterStartDate = (d: Moment) => {
    const endDate = this.invoiceForm.get('createEndTime').value;
    if (endDate) {
      return d <= endDate;
    }
    return d <= this.currentNow;
  }
  // 发票统计中的日期-止
  filterEndDate = (d: Moment) => {
    const startDate = this.invoiceForm.get('createStartTime').value;
    if (startDate) {
      return d >= startDate && d <= this.currentNow;
    }
    return d <= this.currentNow;
  }

  // 报表日中的日期-起
  disabledInvoiceDayStart = (d: Date) => {
    const endDate = this.invoiceForm.get('createEndTime').value;
    if (endDate) {
      return d > new Date() || d > endDate;
    }
    return d > new Date();
  }
  // 报表日中的日期-止
  disabledInvoiceDayEnd = (d: Date) => {
    const sendStart = this.invoiceForm.get('createStartTime').value;
    if (sendStart) {
      return d < sendStart || d > new Date();
    } else {
      return d > new Date();
    }
  }

  // 日(起)
  disabledDayStart = (d: Date) => {
    const endDate = new Date(this.reportForm.get('createEndTime').value);
    if (endDate) {
      return d > new Date() || d > endDate;
    }
    return d > new Date();
  }
  // 日(止)
  disabledDayEnd = (d: Date) => {
    const sendStart = new Date(this.reportForm.get('createStartTime').value);
    if (sendStart) {
      return d < sendStart || d > new Date();
    } else {
      return d > new Date();
    }
  }

  /**
   * 加载支付方式
   */
  loadPayWays() {
    this.payWays = this.dicDataService.getDicDataByKey('payWay');
  }

  // 重置发票
  reset() {
    this.invoiceForm.reset({
      createStartTime: this.today,
      createEndTime: this.today
    });
    this.loading = false;
    this.invoiceList = [];
  }

  // 重置明细
  resetReport() {
    this.reportForm.reset({
      createStartTime: this.today,
      createEndTime: this.today
    });
    this.loading = false;
    this.reportList = [];
  }

  // 发票统计
  queryInventory(page = 1) {
    if (this.loading) return;
    this.pageIndexInvoice = page;
    this.invoiceList = [];
    let {
      cashierName,
      status,
      invoiceSerial,
      vaccineeName,
      createStartTime,
      createEndTime
    } = this.invoiceForm.value;
    let startTime, endTime;
    if (this.invoiceForm.get('createStartTime').value && this.invoiceForm.get('createEndTime').value) {
      startTime = DateUtils.formatStartDate(this.invoiceForm.get('createStartTime').value);
      endTime = DateUtils.formatEndDate(this.invoiceForm.get('createEndTime').value);
      if (startTime > endTime) {
        this.msg.warning('你选择的时间范围有误');
        return;
      }
    }
    const params = {
      povCode: this.userInfo.pov,
      cashierName,
      status,
      invoiceSerial,
      vaccineeName,
      createStartTime: this.transferTime(createStartTime || this.todayStart),
      createEndTime: createEndTime ? DateUtils.formatEndDate(createEndTime) : DateUtils.formatEndDate(new Date()),
      pageEntity: {
        page: this.pageIndexInvoice,
        pageSize: this.pageSizeInvoice
      }
    };
    this.loading = true;
    console.log(params);
    this.chargeService.inventoryAndCount(params, resp => {
      this.loading = false;
      console.log('发票统计=====', resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        this.invoiceList = [];
        this.msg.warning('未查询到相关数据');
        return;
      }
      this.invoiceList = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data') || resp[1].data.length === 0) {
        return;
      }
      this.invoiceTotal = resp[1].data[0].count;
    });
    let conditions = {
      povCode: this.userInfo.pov,
      cashierName,
      status,
      invoiceSerial,
      createStartTime: this.transferTime(createStartTime || this.todayStart),
      createEndTime: createEndTime ? DateUtils.formatEndDate(createEndTime) : DateUtils.formatEndDate(new Date()),
    };
    this.chargeService.inventoryTotal(conditions, res => {
      console.log(res);
      if (!res || res.code !== 0 || !res.hasOwnProperty('data') || res.data.length === 0) {
        return;
      }
      this.reallyPrintCount = res.data.count;
      this.totalAmount = res.data.sum;
    });
  }

  // 报表日明细
  queryReportManager(page = 1) {
    if (this.loading) return;
    this.pageIndexReport = page;
    this.reportList = [];
    let {
      cashierName,
      createStartTime,
      createEndTime
    } = this.reportForm.value;
    const params = {
      povCode: this.userInfo.pov,
      cashierName,
      createStartTime: this.transferTime(createStartTime || this.todayStart),
      createEndTime: createEndTime ? DateUtils.formatEndDate(createEndTime) : DateUtils.formatEndDate(new Date()),
      pageEntity: {
        page: this.pageIndexReport,
        pageSize: this.pageSizeReport
      }
    };
    this.reportList = [];
    this.loading = true;
    console.log('报表明细参数====', params);
    this.chargeService.reportManagerAndCount(params, res => {
      this.loading = false;
      console.log('报表日明细=====', res);
      if (!res || res[0].code !== 0 || !res[0].hasOwnProperty('data') || res[0].data.length === 0) {
        this.msg.warning('未查询到相关数据');
        return;
      }
      this.reportList = res[0].data;
      if (!res || res[1].code !== 0 || !res[1].hasOwnProperty('data') || res[1].data.length === 0) {
        return;
      }
      this.reportTotal = res[1].data[0].count;
    });
  }

  queryPayType() {
    this.onlinePayList = [];
    let {
      vaccineeName,
      orderSerial,
      createStartTime,
      createEndTime
    } = this.payForm.value;
    const params = {
      povCode: this.userInfo.pov,
      vaccineeName,
      orderSerial,
      createStartTime: this.transferTime(createStartTime || new Date()),
      createEndTime: this.transferTime(createEndTime || new Date())
    };
    // this.payForm.reset();
    this.chargeService.payType(params, res => {
      if (res.code === 0) {
        // console.log('网上支付统计=====', res.data);
        this.onlinePayList = res.data;
      }
    });
  }

  queryOrderManager() {
    this.payCheckList = [];
    let { orderSerial, createStartTime, createEndTime } = this.orderForm.value;
    const params = {
      povCode: this.userInfo.pov,
      orderSerial,
      createStartTime: this.transferTime(createStartTime || new Date()),
      createEndTime: this.transferTime(createEndTime || new Date())
    };
    // this.orderForm.reset();
    this.chargeService.orderManager(params, res => {
      if (res.code === 0) {
        console.log('对账管理=====', res);
        this.payCheckList = res.data;
      }
    });
  }


  transferTime(time) {
    return DateUtils.getFormatDateTime(time) || '';
  }

  /**
   * @description 切换tab控制header的查询按钮
   * @author ainy
   * @params:
   * @date 2019/10/30 0030
   */
  changeTab(ev) {
    this.showTipBtn = ev.tabTitle === '发票统计';
  }

  ngOnDestroy() {
    this.appStateService.clearSubTitle();
  }

  goBack() {
    this.location.back();
  }
}

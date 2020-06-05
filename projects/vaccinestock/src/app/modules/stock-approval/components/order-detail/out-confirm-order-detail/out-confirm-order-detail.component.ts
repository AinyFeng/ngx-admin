import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {DicDataService, VacStockApprovalApiService, DateUtils, LodopPrintService} from '@tod/svs-common-lib';
import {NzModalService} from 'ng-zorro-antd';
import {NotifierService} from 'angular-notifier';
import {OutInDateComponent} from '../../../../stock-shared/components/out-in-date/out-in-date.component';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-out-confirm-order-detail',
  templateUrl: './out-confirm-order-detail.component.html',
  styleUrls: ['./out-confirm-order-detail.component.scss']
})
export class OutConfirmOrderDetailComponent implements OnInit {

  orderForm: FormGroup;

  private subscription: Subscription[] = [];

  batchNoData = [];
  priceSum: any;

  // 冷藏方式
  refrigerateTypeOptions: any;
  // 运输工具
  transportationOptions: any;
  userInfo: any;

  // 订单状态
  orderStatus: string;

  // 传来的数据
  orderData: any;
  today = new Date();

  // 出库时间
  outDate: any;

  // 打印订单信息详情 template
  @ViewChild('printOrderDetail', {static: false}) printReceipt: any;
  // 打印出库单
  @ViewChild('printStockOut', {static: false}) printStockOut: any;
  // 打印退回单
  @ViewChild('printSendBackOrder', {static: false}) sendBackOrder: any;
  // 报废单打印
  @ViewChild('printScrapOrder', {static: false}) printScrapOrder: any;
  // 使用单打印
  @ViewChild('printUseOrder', {static: false}) printUseOrder: any;
  // 报损单打印
  @ViewChild('printBreakageOrder', {static: false}) printBreakageOrder: any;


  // 打印机加载错误
  error: boolean;
  showError: boolean;

  // 出库确认 - 需要打印的信息
  printOrderData = {
    orderInfo: {}, // 订单信息
    vaccineInfo: [], // 疫苗信息
    priceSum: {}, // 总统计的数量和价格信息
    id: 'orderDetail_4' // 待出库 打印订单id
  };
  // 出库单打印
  printStockOutInfo = {
    id: 'wait_stock_out', // 待出库 打印出库单id
    orderInfo: {}, // 订单信息
    vaccineInfo: [], // 疫苗信息
    priceSum: {}, // 总统计的数量和价格信息
  };

  // 退回单打印
  printSendBackInfo = {
    id: 'send_back', // 待出库 退回单打印id,
    orderInfo: {}, // 订单信息
    vaccineInfo: [], // 疫苗信息
    priceSum: {}, // 统计的成本价和销售价和总数量
  };

  // 报废单打印
  printScrapOrderInfo = {
    id: 'scrap_order_2', // 报废订单打印
    orderInfo: {}, // 订单信息
    vaccineInfo: [], // 疫苗信息
    priceSum: {}, // 总统计的数量和价格信息
  };
  // 使用单打印
  printUseOrderInfo = {
    id: 'use_order_0', // 使用单打印
    orderInfo: {}, // 订单信息
    vaccineInfo: [], // 疫苗信息
    priceSum: {}, // 总统计的数量和价格信息
  };
  // 报损单打印
  printBreakageInfo = {
    id: 'breakage_order_6', // 报损单打印
    orderInfo: {}, // 订单信息
    vaccineInfo: [], // 疫苗信息
    priceSum: {}, // 总统计的数量和价格信息
  };

  constructor(
    private location: Location,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private dicSvc: DicDataService,
    private modalService: NzModalService,
    private api: VacStockApprovalApiService,
    private notifierService: NotifierService,
    private userSvc: UserService,
    private lodopPrintSvc: LodopPrintService
  ) {
    const sub = this.route.queryParams.subscribe(resp => {
      console.log('传来的数据', resp);
      if (resp) {
        this.orderStatus = resp.orderStatus;
        this.orderData = resp;
        this.printOrderData.orderInfo = resp;
        this.printStockOutInfo.orderInfo = resp;
        this.printSendBackInfo.orderInfo = resp;
        this.printScrapOrderInfo.orderInfo = resp;
        this.printUseOrderInfo.orderInfo = resp;
        this.printBreakageInfo.orderInfo = resp;
      }
    });
    this.subscription.push(sub);

    // 初始化打印机
    this.lodopPrintSvc.getLodopStatus().subscribe(status => {
      this.showError = status ? status : !status;
      this.error = status;
    });

    // 获取运输类型
    this.transportationOptions = dicSvc.getDicDataByKey('transportationType');
    // 获取冷藏方式
    this.refrigerateTypeOptions = dicSvc.getDicDataByKey('refrigerateType');
    // 获取登录人信息
    userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.orderForm = this.fb.group({
      orderNo: [this.orderData ? this.orderData.orderNo : null], // 订单号
      orderStatus: [this.orderData ? this.orderData.orderStatus : null], // 订单状态
      orderDate: [this.orderData ? new Date(parseInt(this.orderData.orderDate, 10)) : null], // 出入库时间
      orderType: [this.orderData ? this.orderData.orderType : null], // 类型
      supplyorgName: [this.orderData ? this.orderData.supplyorgName : null], // 供货单位
      consignorName: [this.orderData ? this.orderData.consignorName : null], // 供货单位经手人
      receiveorgName: [this.orderData ? this.orderData.receiveorgName : null], // 收货单位
      consigneeName: [this.orderData ? this.orderData.consigneeName : null], // 收货单位经手人
      transportation: [this.orderData ? this.orderData.transportation : null], // 疫苗运输工具
      otherTransportation: [this.orderData ? this.orderData.otherTransportation : null], // 疫苗运输工具其他
      refrigerateType: [this.orderData ? this.orderData.refrigerateType : null], // 疫苗冷藏方式
      otherRefrigerateType: [this.orderData ? this.orderData.otherRefrigerateType : null], // 疫苗冷藏方式 其他
      vaccineType: [this.orderData ? this.orderData.vaccineType : null], // 疫苗类型
      memo: [this.orderData ? this.orderData.memo : null], // 备注信息
      entrystaffName: [this.orderData ? this.orderData.entrystaffName : null], // 填报人
      createorgName: [this.orderData ? this.orderData.createorgName : null], // 使用单位
    });
    this.queryDetail();
  }

  // 查看详情
  queryDetail() {
    const params = {
      serialCode: this.orderData.serialCode,
    };
    this.batchNoData = [];
    this.api.queryStockApprovalDetailAndAmount(params, resp => {
      console.log('结果', resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) {
        return;
      }
      this.batchNoData = resp[0].data;
      this.printOrderData.vaccineInfo = resp[0].data;
      this.printStockOutInfo.vaccineInfo = resp[0].data;
      this.printSendBackInfo.vaccineInfo = resp[0].data;
      this.printScrapOrderInfo.vaccineInfo = resp[0].data;
      this.printUseOrderInfo.vaccineInfo = resp[0].data;
      this.printBreakageInfo.vaccineInfo = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data')) {
        return;
      }
      this.priceSum = resp[1].data[0];
      this.printOrderData.priceSum = resp[1].data[0];
      this.printStockOutInfo.priceSum = resp[1].data[0];
      this.printSendBackInfo.priceSum = resp[1].data[0];
      this.printScrapOrderInfo.priceSum = resp[1].data[0];
      this.printUseOrderInfo.priceSum = resp[1].data[0];
      this.printBreakageInfo.priceSum = resp[1].data[0];
    });
  }

  // 返回
  goBack() {
    this.location.back();
  }

  // 出库确认 和失败
  sureWarehouse(flag: boolean) {
    if (!flag) {
      this.modalService.confirm({
        nzTitle: '提示',
        nzContent: `<p>取消出库?</p>`,
        nzMaskClosable: true,
        nzOkText: '确定',
        nzCancelText: '取消',
        nzOnOk: () => {
          this.sureOutStock(flag);
        }
      });
    } else {
      const modal = this.modalService.create({
        nzTitle: '信息',
        nzContent: OutInDateComponent,
        nzComponentParams: {
          title: '出库时间'
        },
        nzFooter: [
          {
            label: '出库确定',
            type: 'primary',
            onClick: comp => {
              modal.close(comp.outDate);
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
      modal.afterClose.subscribe(res => {
        console.log('结果', res);
        if (res) {
          this.outDate = res;
          this.sureOutStock(flag);
        }
      });
    }
  }

  // 出库确认和失败的调用
  sureOutStock(flag: boolean) {
    let params = JSON.parse(JSON.stringify(this.orderForm.value));
    params['operationUser'] = this.userInfo.name;
    params['operationIp'] = this.userInfo.userCode;
    params['orderStatus'] = [];
    params['serialCode'] = this.orderData.serialCode;
    if (flag) {
      params['statusNum'] = '0';
      params['operationUser'] = this.userInfo.name;
      params['operationIp'] = this.userInfo.userCode;
      params['sumOrignprice'] = this.priceSum.costSum;
      params['sumSellprice'] = this.priceSum.priceSum;
      params['receiveorgCodes'] = this.orderData.receiveorgCode;
      params['orderDate'] = DateUtils.getTimestamp(new Date(this.outDate));
      params['stokOperationVaccines'] = [...this.batchNoData];
    } else {
      params['statusNum'] = '1';
    }
    console.log('餐数', params);
    this.api.sureOutOfStock(params, resp => {
      console.log(resp);
      if (resp && resp.code === 0) {
        if (flag) {
          this.notifierService.notify('success', '出库确认成功');
        }
        this.goBack();
      }
    });
  }

  // 打印订单信息
  printOrderInfo(preview: boolean) {
    if (this.error) {
      return;
    }
    if (this.orderData.orderType === '2') { // 报废
      this.printScrapOrder.print(preview);
    } else if (this.orderData.orderType === '0') { // 使用
      this.printUseOrder.print(preview);
    } else if (this.orderData.orderType === '6') { // 报损
      this.printBreakageOrder.print(preview);
    } else {
      this.printReceipt.print(preview);
    }

  }

  // 打印出库单
  printOutbound(preview: boolean) {
    if (this.error) {
      return;
    }
    this.printStockOut.print(preview);
  }

  // 打印退回单
  printSendBack(preview: boolean) {
    if (this.error) {
      return;
    }
    this.sendBackOrder.print(preview);
  }

  // 关闭提示
  closeAlert() {
    this.showError = false;
    this.error = false;
  }
}

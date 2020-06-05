import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {
  DicDataService,
  VacStockApprovalApiService,
  DateUtils,
  LodopPrintService
} from '@tod/svs-common-lib';
import {NzModalService} from 'ng-zorro-antd';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'uea-vac-order-detail',
  templateUrl: './vac-order-detail.component.html',
  styleUrls: ['./vac-order-detail.component.scss']
})
export class VacOrderDetailComponent implements OnInit {
  orderForm: FormGroup;

  private subscription: Subscription[] = [];

  batchNoData = [];
  // 价格综合
  priceSum: any;

  // 冷藏方式
  refrigerateTypeOptions: any;
  // 运输工具
  transportationOptions: any;

  // 传来的数据
  orderData: any;
  today = new Date();

  // 打印订单信息详情 template
  @ViewChild('printOrderDetail', {static: false}) printReceipt: any;
  // 打印出库单
  @ViewChild('printStockOut', {static: false}) printStockOut: any;
  // 报废单打印
  @ViewChild('printScrapOrder', {static: false}) printScrapOrder: any;

  // 打印机加载错误
  error: boolean;
  showError: boolean;

  // 出库审批 - 需要打印的信息
  printOrderData = {
    orderInfo: {}, // 订单信息
    vaccineInfo: [], // 疫苗信息
    priceSum: {}, // 总统计的数量和价格信息
    id: 'orderDetail_13' // 出库审批 打印订单id
  };
  // 出库单打印
  printStockOutInfo = {
    id: 'approval_stock_out', // 出库审批 打印出库单id
    orderInfo: {}, // 订单信息
    vaccineInfo: [], // 疫苗信息
    priceSum: {}, // 总统计的数量和价格信息
  };
  // 报废单打印
  printScrapOrderInfo = {
    id: 'scrap_order_2', // 报废订单打印
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
    private lodopPrintSvc: LodopPrintService
  ) {
    const sub = this.route.queryParams.subscribe(resp => {
      console.log('传来的数据', resp);
      this.printOrderData.orderInfo = {};
      if (resp) {
        this.orderData = resp;
        this.printOrderData.orderInfo = resp;
        this.printStockOutInfo.orderInfo = resp;
        this.printScrapOrderInfo.orderInfo = resp;
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
    this.printOrderData.vaccineInfo = [];
    this.printOrderData.priceSum = {};
    this.api.queryStockApprovalDetailAndAmount(params, resp => {
      console.log('结果', resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) {
        return;
      }
      this.batchNoData = resp[0].data;
      this.printOrderData.vaccineInfo = resp[0].data;
      this.printStockOutInfo.vaccineInfo = resp[0].data;
      this.printScrapOrderInfo.vaccineInfo = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data')) {
        return;
      }
      this.priceSum = resp[1].data[0];
      this.printOrderData.priceSum = this.priceSum;
      this.printStockOutInfo.priceSum = this.priceSum;
      this.printScrapOrderInfo.priceSum = this.priceSum;
    });
  }

  // 返回
  goBack() {
    this.location.back();
  }

  // 审批通过or不通过
  approve(pass: boolean) {
    if (pass) {
      this.modalService.confirm({
        nzTitle: '确认',
        nzContent: `<p>审批通过?</p>`,
        nzMaskClosable: true,
        nzOkText: '确定',
        nzCancelText: '取消',
        nzOnOk: () => {
          this.confirmApproval(pass);
        }
      });
    } else {
      this.modalService.confirm({
        nzTitle: '确认',
        nzContent: `<p>审批不通过?</p>`,
        nzMaskClosable: true,
        nzOkText: '确定',
        nzCancelText: '取消',
        nzOnOk: () => {
          this.confirmApproval(pass);
        }
      });
    }
  }

  // 审批通过接口
  confirmApproval(pass: boolean, skip?: boolean) {
    let params = JSON.parse(JSON.stringify(this.orderForm.value));
    params['orderDate'] = DateUtils.getTimestamp(this.orderForm.get('orderDate').value);
    params['orderStatus'] = [];
    params['serialCode'] = this.orderData.serialCode;
    if (pass) {
      // 二类 - 审批通过 为3
      if (this.orderData.vaccineType === '1') {
        params['statusNum'] = '3';
      } else {
        // 一类 - 审批通过 为0
        params['statusNum'] = '0';
      }
    } else {
      // 不通过均为1
      params['statusNum'] = '1';
    }
    if (skip) {
      params['statusNum'] = '0';
    }
    console.log('参数', params);
    this.api.queryApproval(params, resp => {
      if (resp.code === 0) {
        if (pass)
          this.notifierService.notify('success', '审批成功');
        this.goBack();
      }
    });
  }

  // 通过并跳过开票
  skipBilling() {
    this.modalService.confirm({
      nzTitle: '确认',
      nzContent: `<p>通过并跳过开票?</p>`,
      nzMaskClosable: true,
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.confirmApproval(true, true);
      }
    });
  }

  // 打印订单信息
  printOrderInfo(preview: boolean) {
    if (this.error) {
      return;
    }
    if (this.orderData.orderType === '7') { // 下发/售出
      this.printReceipt.print(preview);
    }
    if (this.orderData.orderType === '2') { // 报废
      this.printScrapOrder.print(preview);
    }

  }

  // 打印出库单
  printOutbound(preview: boolean) {
    if (this.error) {
      return;
    }
    this.printStockOut.print(preview);
  }

  // 关闭提示
  closeAlert() {
    this.showError = false;
    this.error = false;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import {
  DateUtils,
  DicDataService,
  LodopPrintService,
  OrderService,
  VacStockApprovalApiService
} from '@tod/svs-common-lib';
import { NzModalService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';
import { OutInDateComponent } from '../../../stock-shared/components/out-in-date/out-in-date.component';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';

@Component({
  selector: 'uea-order-list-detail',
  templateUrl: './order-list-detail.component.html',
  styleUrls: ['./order-list-detail.component.scss']
})
export class OrderListDetailComponent implements OnInit {

  queryForm: FormGroup;
  private subscription: Subscription[] = [];

  // 冷藏方式
  refrigerateTypeOptions: any;
  // 运输工具
  transportationOptions: any;
  // 出入库时间
  ConfirmationDate: any;
  // 付款时间金额相关参数
  payDate: any;
  payment: any;
  isVisible = false;
  isConfirmLoading = false;
  // 用户信息
  userInfo: any;
  // 上个页面的订单信息
  orderInfo: any;
  today = new Date();
  // 打印明细
  // vaccineDetail: any;
  // 订单详细
  dataSet: any;
  priceSum: any;

  // 打印订单信息详情 template
  @ViewChild('printOrderDetail', {static: false}) printReceipt: any;
  // 打印出库单
  @ViewChild('printStockOut', {static: false}) printStockOut: any;
  // 打印退回单
  @ViewChild('printSendBackOrder', {static: false}) sendBackOrder: any;
  // 补打发票
  @ViewChild('printInvoices', {static: false}) invoices: any;
  // 报废单打印
  @ViewChild('printScrapOrder', {static: false}) printScrapOrder: any;
  // 使用单打印
  @ViewChild('printUseOrder', {static: false}) printUseOrder: any;
  // 报损单打印
  @ViewChild('printBreakageOrder', {static: false}) printBreakageOrder: any;
  // 入库单打印
  @ViewChild('printStockInOrder', {static: false}) printStockInOrder: any;

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

  // 退回单打印
  printSendBackInfo = {
    id: 'send_back', // 待出库 退回单打印id,
    orderInfo: {}, // 订单信息
    vaccineInfo: [], // 疫苗信息
    priceSum: {}, // 统计的成本价和销售价和总数量
  };

  // 补打发票
  printInvoicesInfo = {
    id: ' print_invoices', // 补打发票id,
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

  // 报损单打印
  printBreakageInfo = {
    id: 'breakage_order_6', // 报损单打印
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

  // 入库单打印
  printStockInInfo = {
    id: 'stock_in_0', // 入库单打印
    orderInfo: {}, // 订单信息
    vaccineInfo: [], // 疫苗信息
    priceSum: {}, // 总统计的数量和价格信息
  };

  constructor(private fb: FormBuilder,
              private location: Location,
              private api: OrderService,
              private modalSvc: NzModalService,
              private dicSvc: DicDataService,
              private approvalSvr: VacStockApprovalApiService,
              private user: UserService,
              private notifierService: NotifierService,
              private route: ActivatedRoute,
              private lodopPrintSvc: LodopPrintService
  ) {
    // 获取运输类型
    this.transportationOptions = dicSvc.getDicDataByKey('transportationType');
    // 获取冷藏方式
    this.refrigerateTypeOptions = dicSvc.getDicDataByKey('refrigerateType');
    // 用户信息
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
    const sub = this.route.queryParams.subscribe((params: Params) => {
      console.log('orderInfo：', params);
      this.printOrderData.orderInfo = {};
      if (params) {
        this.orderInfo = params;
        this.printOrderData.orderInfo = params;
        this.printStockOutInfo.orderInfo = params;
        this.printSendBackInfo.orderInfo = params;
        this.printInvoicesInfo.orderInfo = params;
        this.printScrapOrderInfo.orderInfo = params;
        this.printUseOrderInfo.orderInfo = params;
        this.printBreakageInfo.orderInfo = params;
        this.printStockInInfo.orderInfo = params;
      }
    });
    this.subscription.push(sub);
    // 初始化打印机
    this.lodopPrintSvc.getLodopStatus().subscribe(status => {
      this.showError = status ? status : !status;
      this.error = status;
    });


  }

  ngOnInit(): void {
    this.queryForm = this.fb.group({
      orderNo: [this.orderInfo.orderNo], // 订单号
      orderStatus: [this.orderInfo.orderStatus], // 订单状态
      orderDate: [this.orderInfo ? new Date(parseInt(this.orderInfo.orderDate, 10)) : null], // 出入库时间
      orderType: [this.orderInfo.orderType], // 类型
      supplyorgName: [this.orderInfo.supplyorgName], // 供货单位
      consignorName: [this.orderInfo.consignorName], // 供货单位经手人
      receiveorgName: [this.orderInfo.receiveorgName], // 收货单位
      consigneeName: [this.orderInfo.consigneeName], // 收货单位经手人
      createorgName: [this.orderInfo.createorgName], // 使用单位
      writtenBy: [this.orderInfo.consigneeName], // 填报人
      distributionUnit: [this.orderInfo.distributionUnit], // 配送单位
      transportation: [this.orderInfo.transportation], // 疫苗运输工具
      otherTransportation: [this.orderInfo.otherTransportation], // 其他疫苗运输工具
      refrigerateType: [this.orderInfo.refrigerateType], // 疫苗冷藏方式
      otherRefrigerateType: [this.orderInfo.otherRefrigerateType], // 其他疫苗冷藏方式
      vaccineType: [this.orderInfo.vaccineType], // 疫苗类型
      memo: [this.orderInfo.memo], // 备注信息
    });
    this.queryData();
  }

  // 出库
  sureWarehouse(param: string) {
    if (param === '1') {
      this.modalSvc.confirm({
        nzTitle: '提示',
        nzContent: `<p>取消出库?</p>`,
        nzMaskClosable: true,
        nzOkText: '确定',
        nzCancelText: '取消',
        nzOnOk: () => {
          this.outOfStock('1');
        }
      });
    } else {
      const modal = this.modalSvc.create({
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
          this.ConfirmationDate = res;
          this.outOfStock('0');
        }
      });
    }
  }

  // 出库确认（确认/失败）
  outOfStock(param: string): void {
    // alert(JSON.stringify(this.orderInfo));
    let params = JSON.parse(JSON.stringify(this.queryForm.value));
    params['operationUser'] = this.userInfo.name;
    params['operationIp'] = this.userInfo.userCode;
    params['orderStatus'] = [];
    params['serialCode'] = this.orderInfo.serialCode;
    if (param === '0') {
      params['statusNum'] = '0';
      params['operationUser'] = this.userInfo.name;
      params['operationIp'] = this.userInfo.userCode;
      params['sumOrignprice'] = this.priceSum.costSum;
      params['sumSellprice'] = this.priceSum.priceSum;
      params['receiveorgCodes'] = this.orderInfo.receiveorgCode;
      params['orderDate'] = DateUtils.getTimestamp(new Date(this.ConfirmationDate));
      params['stokOperationVaccines'] = [...this.dataSet];
    } else {
      params['statusNum'] = '1';
    }
    console.log('出库确认参数', params);
    this.api.outOfStock(params, resp => {
      console.log('出库结果', resp);
      if (resp && resp.code === 0) {
        this.notifierService.notify('success', '操作成功');
        this.goBack();
      }
    });
  }

  // 入库
  warehousing(param: string) {
    if (param === '1') {
      this.modalSvc.confirm({
        nzTitle: '提示',
        nzContent: `<p>入库失败?</p>`,
        nzMaskClosable: true,
        nzOkText: '确定',
        nzCancelText: '取消',
        nzOnOk: () => {
          this.inOfStock('1');
        }
      });
    } else if (param === '2') {
      this.modalSvc.confirm({
        nzTitle: '提示',
        nzContent: `<p>拒收退回？</p>`,
        nzMaskClosable: true,
        nzOkText: '确定',
        nzCancelText: '取消',
        nzOnOk: () => {
          this.inOfStock('2');
        }
      });
    } else {
      const modal = this.modalSvc.create({
        nzTitle: '信息',
        nzContent: OutInDateComponent,
        nzComponentParams: {
          title: '入库时间'
        },
        nzFooter: [
          {
            label: '入库确认',
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
          this.ConfirmationDate = res;
          this.inOfStock('0');
        }
      });
    }
  }


  // 入库确认（确认/失败/退回）
  inOfStock(param: string): void {
    const params = {
      operationUser: this.userInfo.name,
      operationIp: this.userInfo.userCode,
      serialCode: this.orderInfo.serialCode ? this.orderInfo.serialCode : null,
      orderType: this.orderInfo.orderType ? this.orderInfo.orderType : null,
      statusNum: param ? param : null,
      orderDate: DateUtils.getTimestamp(this.ConfirmationDate) ? DateUtils.getTimestamp(this.ConfirmationDate) : ' ',
      stokOperationVaccines: [...this.dataSet],
    };
    console.log('入库确认参数', params);
    this.api.warehousing(params, resp => {
      console.log('resp===', resp);
      if (resp && resp.code === 0) {
        this.notifierService.notify('success', '操作成功');
        this.goBack();
      }
    });
  }


  // 返回
  goBack() {
    this.location.back();
  }


  // 详情列表查询
  queryData() {
    const param = {
      serialCode: this.orderInfo.serialCode ? this.orderInfo.serialCode : null,
    };
    this.api.queryVacInOutInfoDetail(param, resp => {
      if (!resp || resp.code !== 0 || !resp.hasOwnProperty('data')) {
        return;
      }
      this.dataSet = resp.data;
      const vaccineDetail = [];
      for (let i = 0; i < resp.data.length; i++) {
        vaccineDetail.push(resp.data[i]);
      }
      if (resp.data.length > 0 && resp.data.length < 10) {
        for (let i = resp.data.length; i < 12; i++) {
          vaccineDetail.push({
            orignPrice: '  ',
            sellPrice: '  ',
            vaccNum: '  ',
            vaccineType: null
          });
        }
      }
      console.log('入库确认参数', vaccineDetail);
      this.printOrderData.vaccineInfo = vaccineDetail;
      this.printStockOutInfo.vaccineInfo = vaccineDetail;
      this.printSendBackInfo.vaccineInfo = vaccineDetail;
      this.printInvoicesInfo.vaccineInfo = vaccineDetail;
      this.printScrapOrderInfo.vaccineInfo = vaccineDetail;
      this.printUseOrderInfo.vaccineInfo = vaccineDetail;
      this.printBreakageInfo.vaccineInfo = vaccineDetail;
      this.printStockInInfo.vaccineInfo = vaccineDetail;
    });
    this.api.querySumPrice(param, resp => {
      console.log('resp', resp);
      if (!resp || resp.code !== 0 || !resp.hasOwnProperty('data')) {
        return;
      }
      this.priceSum = resp.data[0];
      this.printOrderData.priceSum = this.priceSum;
      this.printStockOutInfo.priceSum = this.priceSum;
      this.printSendBackInfo.priceSum = this.priceSum;
      this.printInvoicesInfo.priceSum = this.priceSum;
      this.printScrapOrderInfo.priceSum = this.priceSum;
      this.printUseOrderInfo.priceSum = this.priceSum;
      this.printBreakageInfo.priceSum = this.priceSum;
      this.printStockInInfo.priceSum = this.priceSum;
    });

  }

  // 付款
  pay(): void {
    this.payDate = new Date();
    this.isVisible = true;
  }

  handleOk(): void {
    // 检查收货金额
    if (this.payment == null) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: `<p>价格输入不正确</p>`,
        nzMaskClosable: true
      });
      return;
    }
    this.isConfirmLoading = true;
    this.modalSvc.confirm({
      nzTitle: '提示',
      nzContent: `<p>确认收款?</p>`,
      nzMaskClosable: true,
      nzOkText: '确认付款',
      nzCancelText: '取消',
      nzOnOk: () => {
        const param = {
          orderSerialCode: this.orderInfo.serialCode,
          updateBy: this.userInfo.name,
          payment: this.payment,
          payDate: DateUtils.getTimestamp(this.payDate),
          payee: this.userInfo.name,
        };
        console.log('付款参数', param);
        this.api.isPay(param, resp => {
          if (resp.code === 0) {
            this.notifierService.notify('success', '付款成功');
          } else {
            this.notifierService.notify('error', resp.msg);
          }
        });
      }
    });
    this.isConfirmLoading = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  // 审批通过
  approve(pass: boolean) {
    let nzContent = '';
    if (pass) {
      nzContent = '审批通过?';
    } else {
      nzContent = '审批不通过?';
    }
    this.modalSvc.confirm({
      nzTitle: '确认',
      nzContent: nzContent,
      nzMaskClosable: true,
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.confirmApproval(pass);
      }
    });
  }

  // 审批通过接口
  confirmApproval(pass: boolean, skip?: boolean) {
    let params = JSON.parse(JSON.stringify(this.queryForm.value));
    params['orderDate'] = DateUtils.getTimestamp(this.queryForm.get('orderDate').value);
    params['orderStatus'] = [];
    params['serialCode'] = this.orderInfo.serialCode;
    if (pass) {
      // 二类 - 审批通过 为3
      if (this.orderInfo.vaccineType === '1' && (this.orderInfo.orderType === '5' || this.orderInfo.orderType === '7')) {
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
    this.approvalSvr.queryApproval(params, resp => {
      if (resp.code === 0) {
        this.notifierService.notify('success', '审批成功');
        this.location.back();
      }
    });
  }

  // 通过并跳过开票
  skipBilling() {
    this.modalSvc.confirm({
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


  // 开票确认 和失败
  sureInvoice(flag: boolean) {
    if (!flag) {
      this.modalSvc.confirm({
        nzTitle: '提示',
        nzContent: `<p>是否确认开票失败?</p>`,
        nzMaskClosable: true,
        nzOkText: '确定',
        nzCancelText: '取消',
        nzOnOk: () => {
          this.invoice(flag);
        }
      });
    } else {
      const modal = this.modalSvc.create({
        nzTitle: '信息',
        nzContent: '是否确认开票完成？',
        nzFooter: [
          {
            label: '开票完成',
            type: 'primary',
            onClick: comp => {
              this.invoice(flag);
              modal.close();
            }
          },
          {
            label: '打印发票',
            type: 'default',
            onClick: () => {
              this.invoices.print(true);
            }
          }
        ]
      });
      // 订阅关闭时获取的数值
      modal.afterClose.subscribe(res => {
        console.log('结果', res);
        if (res) {
          // this.outDate = res;
          // this.invoice(flag);
        }
      });
    }
  }

  // 开票成功和开票失败的调用
  invoice(flag: boolean) {
    let params = JSON.parse(JSON.stringify(this.queryForm.value));
    params['orderDate'] = DateUtils.getTimestamp(this.queryForm.get('orderDate').value);
    params['orderStatus'] = [];
    params['serialCode'] = this.orderInfo.serialCode;
    if (flag) {
      // 开票成功 - 0
      params['statusNum'] = '0';
    } else {
      // 开票失败 - 1
      params['statusNum'] = '1';
    }
    console.log('参数', params);
    this.approvalSvr.queryApproval(params, resp => {
      if (resp.code === 0) {
        if (flag) {
          this.notifierService.notify('success', '开票成功');
        } else {
          this.notifierService.notify('success', '操作成功');
        }
        this.location.back();
      }
    });
  }

  // 打印订单信息
  printOrderInfo(preview: boolean) {
    if (this.error) {
      return;
    }
    if (this.orderInfo.orderType === '7' || this.orderInfo.orderType === '9') { // 下发/售出
      this.printReceipt.print(preview);
    } else if (this.orderInfo.orderType === '2') { // 报废
      this.printScrapOrder.print(preview);
    } else if (this.orderInfo.orderType === '0') { // 使用
      this.printUseOrder.print(preview);
    } else if (this.orderInfo.orderType === '6') { // 报损
      this.printBreakageOrder.print(preview);
    } else if (this.orderInfo.orderType === '8') { // 入库
      this.printStockInOrder.print(preview);
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

  // 补打发票
  printInvoices(preview: boolean) {
    if (this.error) {
      return;
    }
    this.modalSvc.confirm({
      nzTitle: '提示',
      nzContent: `<p>点击打印预览打印发票?</p>`,
      nzMaskClosable: true,
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.invoices.print(preview);
      }
    });
  }


  // 关闭提示
  closeAlert() {
    this.showError = false;
  }
}

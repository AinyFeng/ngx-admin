import {Component, Inject, Input, OnInit, Output} from '@angular/core';

import {LodopPrintService} from '@tod/svs-common-lib';
import {NzModalService} from 'ng-zorro-antd';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'uea-print-approval-order-info',
  templateUrl: './print-approval-order-info.component.html',
})
export class PrintApprovalOrderInfoComponent implements OnInit {

  /**
   * 1. 出库审批 : 13 待审批 7 下发/售出
   * 2. 出库确认 : 4  待出库 9 退回  7 下发/售出
   *
   */
    // 打印机加载错误
  error: boolean;
  showError: boolean;
  // 打印传递的数据
  @Input()
  printOrderData: any;
  today = new Date();
  // 出库单号二维码
  qrCode: any;

  constructor(
    private lodopPrintSvc: LodopPrintService,
    private modalService: NzModalService,
    @Inject(DOCUMENT) private doc
  ) {
    // 初始化打印机
    this.lodopPrintSvc.getLodopStatus().subscribe(status => {
      this.showError = status ? status : !status;
      this.error = status;
    });
  }

  ngOnInit() {
    this.qrCode = this.printOrderData.orderInfo.orderNo;
  }

  // 打印
  print(preview: boolean) {
    if (this.error) {
      return;
    }
    const printId = this.printOrderData.id;
    this.lodopPrintSvc.print(preview, printId, 20);
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {LodopPrintService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-print-stock-out',
  templateUrl: './print-stock-out.component.html',
})
export class PrintStockOutComponent implements OnInit {

  /**
   * 1. 出库审批 : 13 待审批 7 下发/售出
   * 2. 出库确认 : 4 待出库 7 下发/售出
   */

    // 打印的信息
  @Input() printStockOutInfo: any;

  today = new Date();

  constructor(
    private lodopPrintSvc: LodopPrintService
  ) {
  }

  ngOnInit() {
  }

  print(preview: boolean) {
    const printId = this.printStockOutInfo.id;
    this.lodopPrintSvc.print(preview, printId, 20);
  }

}

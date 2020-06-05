import { Component, Input, OnInit } from '@angular/core';
import { LodopPrintService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-print-check-plan',
  templateUrl: './print-check-plan.component.html',
  styleUrls: ['./print-check-plan.component.scss']
})
export class PrintCheckPlanComponent implements OnInit {


  /**
   * 盘点计划打印
   */

    // 打印的信息
  @Input() printCheckPlanInfo: any;

  today = new Date();
  // 盘点计划单号二维码
  qrCode: any;

  constructor(
    private lodopPrintSvc: LodopPrintService
  ) {
  }

  ngOnInit() {
    this.qrCode = this.printCheckPlanInfo.orderInfo.serialCode;
  }

  print(preview: boolean) {
    const printId = this.printCheckPlanInfo.id;
    this.lodopPrintSvc.print(preview, printId, 20);
  }

}


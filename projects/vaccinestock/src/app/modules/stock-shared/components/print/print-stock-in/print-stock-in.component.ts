import { Component, Inject, Input, OnInit } from '@angular/core';
import { LodopPrintService } from '@tod/svs-common-lib';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'uea-print-stock-in',
  templateUrl: './print-stock-in.component.html',
  styleUrls: ['./print-stock-in.component.scss']
})
export class PrintStockInComponent implements OnInit {

  // 打印的数据
  @Input()
  printStockInInfo: any;
  today = new Date();

  // 打印机加载错误
  error: boolean;
  showError: boolean;

  constructor(
    private lodopPrintSvc: LodopPrintService,
    @Inject(DOCUMENT) private doc
  ) {
    // 初始化打印机
    this.lodopPrintSvc.getLodopStatus().subscribe(status => {
      this.showError = status ? status : !status;
      this.error = status;
    });
  }

  ngOnInit() {
  }

  // 打印
  print(preview) {
    if (this.error) {
      return;
    }
    const printId = this.printStockInInfo.id;
    this.lodopPrintSvc.print(preview, printId, 20);
  }
}

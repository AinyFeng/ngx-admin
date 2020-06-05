import {Component, Inject, Input, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {LodopPrintService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-print-use-order',
  templateUrl: './print-use-order.component.html',
  styleUrls: ['./print-use-order.component.scss']
})
export class PrintUseOrderComponent implements OnInit {
  // 打印的数据
  @Input()
  printUseOrderInfo: any;
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
    const printId = this.printUseOrderInfo.id;
    this.lodopPrintSvc.print(preview, printId, 20);
  }

}

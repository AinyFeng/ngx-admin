import {Component, Input, OnInit} from '@angular/core';
import {LodopPrintService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-print-send-back',
  templateUrl: './print-send-back.component.html',
})
export class PrintSendBackComponent implements OnInit {
  /**
   * 1. 出库确认 : 待出库 4 退回 9
   */
  @Input()
  printSendBackInfo: any;
  today = new Date();

  constructor(
    private lodopSvc: LodopPrintService
  ) {
  }

  ngOnInit() {
  }

  print(preview: boolean) {
    const id = this.printSendBackInfo.id;
    this.lodopSvc.print(preview, id, 20);
  }

}

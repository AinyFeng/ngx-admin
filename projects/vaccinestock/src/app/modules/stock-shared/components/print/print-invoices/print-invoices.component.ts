import { Component, Input, OnInit } from '@angular/core';
import { LodopPrintService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-print-invoices',
  templateUrl: './print-invoices.component.html',
  styleUrls: ['./print-invoices.component.scss']
})
export class PrintInvoicesComponent implements OnInit {

  /**
   * 1. 补打发票
   */
  @Input()
  printInvoicesInfo: any;
  today = new Date();

  constructor(
    private lodopSvc: LodopPrintService
  ) {
  }

  ngOnInit() {
    console.log('printInvoicesInfo', this.printInvoicesInfo);
  }

  print(preview: boolean) {
    const id = this.printInvoicesInfo.id;
    this.lodopSvc.print(preview, id, 20);
  }

}

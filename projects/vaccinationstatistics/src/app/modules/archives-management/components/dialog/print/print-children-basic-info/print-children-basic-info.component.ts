import { Component, Inject, Input, OnInit } from '@angular/core';
import { LodopPrintService } from '@tod/svs-common-lib';
import { NzModalService } from 'ng-zorro-antd';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'uea-print-children-basic-info',
  templateUrl: './print-children-basic-info.component.html',
  styleUrls: ['./print-children-basic-info.component.scss']
})
export class PrintChildrenBasicInfoComponent implements OnInit {

    // 打印机加载错误
  error: boolean;
  showError: boolean;
  // 打印传递的数据
  @Input()
  printChildrenDetailInfo: any;

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
  }

  // 打印
  print(preview: boolean) {
    if (this.error) {
      return;
    }
    const printId = this.printChildrenDetailInfo.id;
    this.lodopPrintSvc.print(preview, printId, 20);
  }

}

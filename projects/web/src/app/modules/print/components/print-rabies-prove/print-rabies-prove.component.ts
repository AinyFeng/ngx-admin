import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { LodopPrintService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-print-rabies-prove',
  templateUrl: './print-rabies-prove.component.html',
  styleUrls: ['./print-rabies-prove.component.scss']
})
export class PrintRabiesProveComponent implements OnInit {
  profile: any;
  povInfo: any;
  isChild: boolean;
  rabiesInfo: any;

  // 打印机加载错误
  error: boolean;
  nowDate = new Date();

  constructor(
    private ref: NbDialogRef<PrintRabiesProveComponent>,
    public lodopPrintSvc: LodopPrintService
  ) {
    // 加载打印机
    this.lodopPrintSvc.getLodopStatus().subscribe(status => {
      this.error = status;
    });
  }

  ngOnInit() { }

  close() {
    this.ref.close();
  }
  /**
   * 关闭提醒
   */
  closeAlert() {
    if (this.error) {
      this.error = false;
    }
  }

  // 打印
  print(isPreview: boolean) {
    if (this.error) {
      return;
    }
    this.lodopPrintSvc.print(isPreview, 'prove', 20);
  }
}

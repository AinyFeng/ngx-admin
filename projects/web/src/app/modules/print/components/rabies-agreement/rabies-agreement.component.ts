import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { LodopPrintService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-rabies-agreement',
  templateUrl: './rabies-agreement.component.html',
  styleUrls: ['./rabies-agreement.component.scss']
})
export class RabiesAgreementComponent implements OnInit {
  rabiesAgreementTemplate: any;

  // 打印机加载错误
  error: boolean;

  constructor(
    private ref: NbDialogRef<RabiesAgreementComponent>,
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

  // 打印
  print(isPreview: boolean) {
    if (this.error) {
      return;
    }
    this.lodopPrintSvc.print(isPreview, 'rabiesAgreement', 20);
  }
}

import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { IdCardScanService, SysConfInitService, SysConfKey } from '@tod/svs-common-lib';

@Component({
  selector: 'mds-scan-dialog',
  templateUrl: './scan-dialog.component.html',
  styleUrls: ['./scan-dialog.component.scss']
})
export class ScanDialogComponent implements OnInit {
  childCode: string;

  accessWay = '0';

  vaccineCode = '';

  businessType: string;


  constructor(
    private idCardScanSvc: IdCardScanService,
    private ref: NbDialogRef<ScanDialogComponent>,
    private sysConfSvc: SysConfInitService
  ) {
    const way = sysConfSvc.getConfValue(SysConfKey.idCardScanWay);
    if (way) {
      this.accessWay = way;
    }
  }

  ngOnInit() {
    this.getBarcode();
    this.scan();
  }

  // 监听扫码枪
  getBarcode() {
    window.onkeyup = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (this.childCode) {
          this.ref.close({
            regQueueCode: this.childCode
          });
        }
      }
    };
  }

  onClose() {
    this.ref.close();
  }

  /**
   * 扫描身份证
   */
  scan() {
    this.idCardScanSvc.getIdCardInfoByUrl(this.accessWay, resp => {
      if (resp && resp.hasOwnProperty('cardno')) {
        this.ref.close({
          idCardNo: resp['cardno']
        });
      }
    });
  }
}

import { Component, Inject, Input, OnInit } from '@angular/core';
import { Lodop, LodopService } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { DOCUMENT } from '@angular/common';
import { ConfigService } from '@ngx-config/core';

@Component({
  selector: 'uea-call-number-info',
  templateUrl: './call-number-info.component.html',
  styleUrls: ['./call-number-info.component.scss']
})
/**
 * 打印叫号小票信息
 */
export class CallNumberInfoComponent implements OnInit {
  // 排队号码

  @Input()
  printData: any = {};

  // 打印机的访问地址
  lodopUrl: any;

  error: boolean;
  // 打印机实例
  lodop: any;
  // 打印机列表
  printers: any[];
  // 固定打印机的名称
  printer: any;

  qrCode = 'this is a test';

  constructor(
    private lodopSrv: LodopService,
    private msg: NzMessageService,
    private configSvc: ConfigService,
    @Inject(DOCUMENT) private doc
  ) {
    this.lodopUrl = this.configSvc.getSettings('signPad').lodopUrl;
    this.printer = this.configSvc.getSettings('signPad').receiptPrinterName;
    this.lodopSrv.cog.url = this.lodopUrl;
    this.lodopSrv.lodop.subscribe(({ lodop, ok }) => {
      // console.log('ok', ok);
      if (!ok) {
        this.error = true;
        return;
      }
      this.error = false;
      this.msg.success(`打印机加载成功`);
      this.lodop = lodop as Lodop;
      this.printers = this.lodopSrv.printer;
    });
  }

  ngOnInit() {}

  print(isPreview = false) {
    const LODOP = this.lodop as Lodop;
    LODOP.SET_LICENSES(
      '安徽奇兵医学科技有限公司',
      '56E2EB898EE17DEBD030D1E8A683CAFE',
      '安徽奇兵醫學科技有限公司',
      '423D486AF17E2120FEB7B2BDDF66F396'
    );
    LODOP.SET_LICENSES(
      'THIRD LICENSE',
      '',
      'AnHui Ace-power Medical and Technology Co., Ltd',
      '709251107F8D9D680D1A81F88BED121F'
    );
    LODOP.PRINT_INITA(10, 10, 1140, 610, '测试C-Lodop远程打印四步骤');
    LODOP.SET_PRINT_STYLE('ItemType', 4);
    LODOP.SET_PRINTER_INDEXA(this.printer);
    LODOP.ADD_PRINT_HTM(
      0,
      0,
      '98%',
      '100%',
      this.doc.getElementById('call').innerHTML
    );
    if (isPreview) {
      LODOP.PREVIEW();
    } else {
      LODOP.PRINT();
    }
  }
}

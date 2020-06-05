import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@tod/uea-auth-lib';
import { DOCUMENT, Location } from '@angular/common';
import { Lodop, LodopService } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Subscription, timer } from 'rxjs';
import { ConfigService } from '@ngx-config/core';
import { ProfileDataService, RegQueueService, REG_QUEUE_STATUS } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-regist-info',
  templateUrl: './regist-info.component.html',
  styleUrls: ['./regist-info.component.scss']
})
export class RegistInfoComponent implements OnInit, OnDestroy {
  // 由接种登记列表传过来的数据
  @Input()
  data: any;

  @Input()
  id = 'regist';

  // 用户信息
  userInfo: any;

  // 打印机的访问地址
  lodopUrl: string;

  error: boolean;
  // 打印机实例
  lodop: any;
  // 打印机列表
  printers: any[];
  // 固定打印机名称(XP-80C);
  printer: any;
  // 二维码显示信息
  qrCode = 'this is a test';
  // 接种时间
  vaccinateDate = new Date();

  private subscription: Subscription[] = [];

  constructor(
    private regQueueSvc: RegQueueService,
    private location: Location,
    private userSvc: UserService,
    private lodopSrv: LodopService,
    private msg: NzMessageService,
    private configSvc: ConfigService,
    @Inject(DOCUMENT) private doc
  ) {
    this.lodopUrl = this.configSvc.getSettings('signPad').lodopUrl;
    this.printer = this.configSvc.getSettings('signPad').receiptPrinterName;
    // console.log('打印机名称', this.printer);
    this.lodopSrv.cog.url = this.lodopUrl;
    const sub = this.lodopSrv.lodop.subscribe(({ lodop, ok }) => {
      if (!ok) {
        this.error = true;
        return;
      }
      this.error = false;
      // this.msg.success(`打印机加载成功`);
      this.lodop = lodop as Lodop;
      this.printers = this.lodopSrv.printer;
    });
    this.subscription.push(sub);
  }

  ngOnInit() {
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  /**
   * 查询队列等待人数
   * 查询的状态为 "待接种 - 6"
   */
  queryWaitCount(func: Function) {
    if (!this.userInfo) {
      return;
    }
    const query = {
      povCode: this.userInfo.pov,
      curStatus: REG_QUEUE_STATUS.TO_VACCINATE
    };
    this.regQueueSvc.queryQueue(query, resp => {
      // console.log('查询到的排号数据', resp);
      // 如果没有查到数据，说明并不存在排队信息，当前操作无
      if (resp.code === 0 && resp.data.length > 0) {
        let d = resp.data;
        // 对排号队列数据进行升序排列
        d = d.sort((a, b) => a['createDate'] - b['createDate']);
        const profileCode = this.data['profileCode'];
        for (let i = 0; i < d.length; i++) {
          const code = d[i]['profileCode'];
          if (profileCode === code) {
            this.data['queueTime'] = d[i]['createDate'];
            this.data['wait'] = i;
            break;
          }
        }
      } else {
        this.data['wait'] = 0;
        this.data['queueTime'] = null;
      }
      func('');
    });
  }

  print(isPreview = false) {
    // console.log(this.data);
    // 打印的时候需要延迟 0.5 秒执行，需要给angular 一点时间将数据绑定到 html中，否则在 getElementById 的时候会出现空值
    const sub = timer(500).subscribe(r => {
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
      LODOP.PRINT_INITA(10, 10, 300, 610, '打印登记小票');
      LODOP.SET_PRINTER_INDEXA(this.printer);
      LODOP.ADD_PRINT_HTM(
        0,
        0,
        '98%',
        '100%',
        this.doc.getElementById(this.id).innerHTML
      );
      if (isPreview) {
        LODOP.PREVIEW();
      } else {
        LODOP.PRINT();
      }
    });
    this.subscription.push(sub);
    // this.queryWaitCount(_ => {
    //
    // });
  }
}

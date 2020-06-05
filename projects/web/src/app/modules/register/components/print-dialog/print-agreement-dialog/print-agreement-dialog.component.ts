import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '@tod/uea-auth-lib';
import { NbDialogRef } from '@nebular/theme';
import { Lodop, LodopService } from '@delon/abc';
import { DOCUMENT } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import { ProfileDataService, SignatureApiService } from '@tod/svs-common-lib';
import { ConfigService } from '@ngx-config/core';
import { WINDOW } from '@delon/theme';

@Component({
  selector: 'uea-print-agreement-dialog',
  templateUrl: './print-agreement-dialog.component.html',
  styleUrls: ['./print-agreement-dialog.component.scss']
})
export class PrintAgreementDialogComponent implements OnInit {
  // 接种记录信息
  recordInfo: any;
  // 告知书模板
  agreementTemplate: any;
  // 档案信息
  profile: any;
  // 签字信息
  signInfo: any;

  // 登记记录的告知书
  flag: any;

  // lodop 打印机访问地址
  lodopUrl: string;
  // 打印机加载错误
  error: boolean;
  // 打印机实例
  lodop: any;
  // 打印机列表
  printers = [];

  // 当前访问地址的域名
  hostname: any;

  altMsg = '告知书签字';

  constructor(
    private userSvc: UserService,
    @Inject(DOCUMENT) private doc,
    @Inject(WINDOW) private window: Window,
    private lodopSrv: LodopService,
    private profileDataSvc: ProfileDataService,
    private ref: NbDialogRef<PrintAgreementDialogComponent>,
    private signatureSvc: SignatureApiService,
    private msg: NzMessageService,
    private configSvc: ConfigService
  ) {
    this.profileDataSvc.getProfileData().subscribe(profile => {
      if (profile) {
        this.profile = profile;
      }
    });
    this.lodopUrl = this.configSvc.getSettings('signPad').lodopUrl;
    // 加载打印机
    this.lodopSrv.cog.url = this.lodopUrl;
    this.lodopSrv.lodop.subscribe(({ lodop, ok }) => {
      if (!ok) {
        this.error = true;
        this.msg.warning('打印机加载失败，请检查打印机的驱动是否启动');
        return;
      }
      this.error = false;
      this.msg.success(`打印机加载成功`);
      this.lodop = lodop as Lodop;
      this.printers = this.lodopSrv.printer;
    });
    const location = window.location;
    console.log(location);
    this.hostname = location.hostname;
  }

  ngOnInit() {
    if (this.recordInfo.vaccinateTime) {
      // 获取签字信息
      this.queryVacRecordSignatureInfo();
    }
    if (this.flag) {
      this.querySignatureInfo();
    }
  }

  onClose() {
    this.ref.close();
  }

  /**
   * 先查询登记的签字信息,如果没有登记的签字信息就要去查询接种记录的签字信息
   * 查询签字信息
   */
  querySignatureInfo() {
    if (!this.profile) return;
    let query = {
      signCode: this.recordInfo['registerRecordNumber'],
    };
    this.signatureSvc.querySignature(query, resp => {
      // console.log('签字结果', resp);
      if (resp.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        const signature = resp.data[0]['signature'];
        if (signature) {
          this.signInfo = '/svs/signature/downloadSignatureImg' + signature;
        } else {
          this.altMsg = '没有查到签字信息';
        }

        // this.signInfo = 'http://' + this.hostname + ':19998' + '/svs/signature/downloadSignatureImg' + resp.data[0]['signature'];
      }
    });
  }

  // 查询接种记录的签字信息
  queryVacRecordSignatureInfo() {
    this.signatureSvc.queryVacRecordSignatureInfo(this.recordInfo['registerRecordNumber'], res => {
      // console.log('接种记录的sigin', res);
      if (res && res.code === 0 && res.hasOwnProperty('data') && res.data.length !== 0) {
        // this.signInfo = 'http://' + this.hostname + ':19998' + '/svs/signature/downloadSignatureImg' + res.data[0]['signature'];
        const signature = res.data[0]['signature'];
        if (signature) {
          this.signInfo = '/svs/signature/downloadSignatureImg' + signature;
        } else {
          this.querySignatureInfo();
        }
        // console.log('sign2', this.signInfo);
      } else {
        this.querySignatureInfo();
      }
    });
  }

  print(preview: boolean) {
    if (!this.lodop) {
      if (!this.error) this.error = true;
      return;
    }
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
    LODOP.PRINT_INITA(10, 10, 1140, 610, '打印档案信息');
    LODOP.SET_PRINT_STYLE('ItemType', 4);
    LODOP.ADD_PRINT_HTM(
      0,
      0,
      '98%',
      '100%',
      this.doc.getElementById('singleAgreement').innerHTML
    );
    if (preview) {
      LODOP.PREVIEW();
    } else {
      LODOP.PRINT();
    }
  }

  /**
   * 关闭提醒
   */
  closeAlert() {
    if (this.error) {
      this.error = false;
    }
  }
}

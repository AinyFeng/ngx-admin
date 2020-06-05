import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '@tod/uea-auth-lib';
import { Lodop, LodopService } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { DOCUMENT } from '@angular/common';
import { NbDialogRef } from '@nebular/theme';
import { ProfileDataService, PovInfoService } from '@tod/svs-common-lib';
import { ConfigService } from '@ngx-config/core';

@Component({
  selector: 'uea-print-profile-dialog',
  templateUrl: './print-profile-dialog.component.html',
  styleUrls: ['./print-profile-dialog.component.scss']
})
export class PrintProfileDialogComponent implements OnInit {
  // 入托证明对象，用于传输打印入托证明需要的所有资料
  printProfileData: any = {
    userInfo: {},
    povInfo: {},
  };

  // lodop 打印机访问地址
  lodopUrl: string;
  // 打印机加载错误
  error: boolean;
  // 打印机实例
  lodop: any;
  // 打印机列表
  printers = [];
  // 用户信息
  userInfo: any;

  constructor(
    private profileDataSvc: ProfileDataService,
    private lodopSrv: LodopService,
    private msg: NzMessageService,
    private userSvc: UserService,
    @Inject(DOCUMENT) private doc,
    private povApiSvc: PovInfoService,
    private ref: NbDialogRef<PrintProfileDialogComponent>,
    private configSvc: ConfigService
  ) {
    // 获取档案信息，将档案信息融合到入托证明对象中
    this.profileDataSvc.getProfileData().subscribe(profile => {
      Object.assign(this.printProfileData, profile);
      console.log('profile', this.printProfileData);
    });
    this.lodopUrl = this.configSvc.getSettings('signPad').lodopUrl;
    // 加载打印机
    this.lodopSrv.cog.url = this.lodopUrl;
    this.lodopSrv.lodop.subscribe(({ lodop, ok }) => {
      if (!ok) {
        this.error = true;
        // this.msg.warning('打印机加载失败，请检查打印机的驱动是否启动');
        return;
      }
      this.error = false;
      // this.msg.success(`打印机加载成功`);
      this.lodop = lodop as Lodop;
      this.printers = this.lodopSrv.printer;
    });
    // 获取登录用户所在地区信息
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.printProfileData.userInfo = user;
      this.userInfo = user;
      // 获取当前登录用户所属的pov信息
      this.getPovInfo();
    });
    // 获取父母信息 (父母信息都修改到了档案表里面)
    /* this.profileDataSvc.getParenets().subscribe(parents => {
       console.log('父母姓名', parents);
       if (parents) {
         parents.forEach(p => {
           if (p['relationshipCode'] === '1') {
             this.printProfileData.fatherInfo = p;
           }
           if (p['relationshipCode'] === '2') {
             this.printProfileData.motherInfo = p;
           }
         });
       }
     });*/
  }

  ngOnInit() {
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
      this.doc.getElementById('profile').innerHTML
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

  close() {
    this.ref.close();
  }

  /**
   * 根据登录用户查询接种门诊的基本信息，比如接种门诊的地址，电话，工作时间等
   */
  getPovInfo() {
    const query = {
      povCode: this.userInfo.pov
    };
    this.povApiSvc.queryPovInfo(query, resp => {
      console.log('获取的povInfo', resp);
      if (resp.code === 0) {
        this.printProfileData.povInfo = resp.data[0];
      }
    });
  }
}

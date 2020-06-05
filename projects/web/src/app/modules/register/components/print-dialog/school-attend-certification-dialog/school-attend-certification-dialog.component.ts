import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@tod/uea-auth-lib';
import { Lodop, LodopService } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { DOCUMENT } from '@angular/common';
import { NbDialogRef } from '@nebular/theme';
import { ConfigService } from '@ngx-config/core';
import { Subscribable, Subscription } from 'rxjs';
import { ProfileDataService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-school-attend-certification-dialog',
  templateUrl: './school-attend-certification-dialog.component.html',
  styleUrls: ['./school-attend-certification-dialog.component.scss']
})
export class SchoolAttendCertificationDialogComponent implements OnInit, OnDestroy {
  // 入托证明对象，用于传输打印入托证明需要的所有资料
  schoolAttendCertification: any = {
    oneVaccRecord: [],
    twoVaccRecord: [],
    addVaccRecord: [],
    motherInfo: {},
    fatherInfo: {},
    name: ''
  };

  userInfo: any;

  // lodop 打印机访问地址
  lodopUrl: string;
  // 打印机加载错误
  error: boolean;
  // 打印机实例
  lodop: any;
  // 打印机列表
  printers = [];
  // 订阅对象
  private subscription: Subscription[] = [];

  constructor(
    private profileDataSvc: ProfileDataService,
    private userSvc: UserService,
    private lodopSrv: LodopService,
    private msg: NzMessageService,
    @Inject(DOCUMENT) private doc,
    private ref: NbDialogRef<SchoolAttendCertificationDialogComponent>,
    private configSvc: ConfigService
  ) {
    // 获取档案信息，将档案信息融合到入托证明对象中
    const sub1 = this.profileDataSvc.getProfileData().subscribe(profile => {
      Object.assign(this.schoolAttendCertification, profile);
    });
    // 获取登录用户所在地区信息
    const sub2 = this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      this.getCurDistrictCode();
    });
    // 获取监护人信息
    const sub3 = this.profileDataSvc.getParenets().subscribe(parents => {
      if (parents) {
        parents.forEach(g => {
          if (g['relationshipCode'] === '1') {
            this.schoolAttendCertification.fatherInfo = g;
          } else {
            this.schoolAttendCertification.motherInfo = g;
          }
        });
      }
    });
    const sub4 = this.profileDataSvc.getVaccinatedRecords().subscribe(vaccinatedRecords => {
      if (vaccinatedRecords) {
        let oneVaccRecord = [];
        let twoVaccRecord = [];
        let addVaccRecord = [];
        vaccinatedRecords.forEach(record => {
          // 显示接种完成，且接种记录状态为在册的接种记录
          if (
            record['vaccinateStatusCode'] === '0' &&
            record['vaccinateStatus'] === '3'
          ) {
            if (record.vaccinateStatus === '3' && record.vaccineType === '0') {
              oneVaccRecord.push(record);
            }
            if (record.vaccinateStatus === '3' && record.vaccineType === '1') {
              twoVaccRecord.push(record);
            }
            if (record.vaccinateStatus !== '3') {
              addVaccRecord.push(record);
            }
          }
        });
        this.schoolAttendCertification.oneVaccRecord = oneVaccRecord;
        this.schoolAttendCertification.twoVaccRecord = twoVaccRecord;
        this.schoolAttendCertification.addVaccRecord = addVaccRecord;
      }
    });
    this.subscription.push(sub1);
    this.subscription.push(sub2);
    this.subscription.push(sub3);
    this.subscription.push(sub4);
  }

  ngOnInit() {
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
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  /**
   * 获取登录用户所在 pov的前6位，使用前六位的数字作为当前打印地区的编码
   */
  getCurDistrictCode() {
    this.schoolAttendCertification['curCityCode'] =
      this.userInfo.pov.substring(0, 4) + '00';
    this.schoolAttendCertification['curDistrictCode'] =
      this.userInfo.pov.substring(0, 6);
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
    LODOP.PRINT_INITA(10, 10, 1140, 610, '打印入托入学证明');
    LODOP.SET_PRINT_STYLE('ItemType', 4);
    LODOP.ADD_PRINT_HTM(
      0,
      0,
      '98%',
      '100%',
      this.doc.getElementById('school').innerHTML
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
}

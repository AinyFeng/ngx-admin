import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Observable, Subscription, timer } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { RegistInfoComponent } from '../../../../print/components/regist-info/regist-info.component';
import { UserService } from '@tod/uea-auth-lib';
import {
  RegistRecordService,
  ProfileDataService,
  ProfileChangeService,
  PROFILE_CHANGE_KEY,
  DateUtils,
  QueueApiService, SysConfInitService, QueueListService, RegRecordDataService
} from '@tod/svs-common-lib';
import { ConfigService } from '@ngx-config/core';

@Component({
  selector: 'uea-regist-record-list',
  templateUrl: './regist-record-list.component.html',
  styleUrls: ['./regist-record-list.component.scss'],
  providers: [QueueApiService]
})
export class RegistRecordListComponent implements OnInit, OnDestroy {
  profile: any;

  loading = false;

  registRecord = [];

  printData: any;

  userInfo: any;

  currentNumberInfo: any;

  private readonly REGIST_STATUS_NORMAL = '1';

  private readonly REGIST_STATUS_CANCEL = '0';

  @Output()
  readonly registRecordCount = new EventEmitter();

  @ViewChild('registInfoComponent', { static: false })
  private registInfoCom: RegistInfoComponent;

  private readonly subscription: Subscription[] = [];

  // 叫号延迟时间
  queueCallDelay: any;
  private readonly queueCallDelayKey = 'queueDelay';

  constructor(
    private registSvc: RegistRecordService,
    private dialogSvc: NbDialogService,
    private profileDataSvc: ProfileDataService,
    private profileChangeSvc: ProfileChangeService,
    private route: Router,
    private userSvc: UserService,
    private msg: NzMessageService,
    private queueApiService: QueueApiService,
    private configSvc: ConfigService,
    private sysConfSvc: SysConfInitService,
    private currentNumberSvc: QueueListService,
    private regRecDataSvc: RegRecordDataService
  ) {
    const sub = this.profileDataSvc.getProfileData().subscribe(resp => {
      this.profile = resp;
      this.resetListTable();
      if (resp) {
        this.queryRegistRecord();
      }
    });
    this.subscription.push(sub);
    const sub1 = this.userSvc
      .getUserInfoByType()
      .subscribe(user => (this.userInfo = user));
    this.subscription.push(sub1);
  }

  ngOnInit() {
    const sub = this.profileChangeSvc.getProfileChange().subscribe(key => {
      if (key === PROFILE_CHANGE_KEY.REGIST_RECORD) {
        this.queryRegistRecord();
      }
    });
    this.subscription.push(sub);
    this.queueCallDelay = this.sysConfSvc.getConfValue(this.queueCallDelayKey);

    const sub3 = this.currentNumberSvc.getCallingNumber().subscribe(num => {
      this.currentNumberInfo = num;
    });
    this.subscription.push(sub3);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  queryRegistRecord() {
    if (!this.profile) return;
    this.resetListTable();
    this.loading = true;
    const today = new Date();
    const query = {
      profileCode: this.profile['profileCode'],
      registPovCode: this.userInfo.pov,
      registDate: {
        start: DateUtils.formatStartDate(today),
        end: DateUtils.formatEndDate(today)
      },
      pageEntity: {
        page: 1,
        pageSize: 999,
        sortBy: ['registDate,desc']
      }
    };
    this.registSvc.queryRegistRecord(query, resp => {
      console.log('查询登记记录的返回值', resp);
      this.loading = false;
      if (resp.code === 0) {
        this.registRecord = resp.data;
        this.registRecordCount.emit(resp.data.length);
        this.setAvailableRegRecords(resp.data);
      }
    });
  }

  resetListTable() {
    this.registRecord = [];
    this.registRecordCount.emit(0);
  }

  /**
   * 撤销登记记录
   * 更新登记记录状态为撤销 registStatus = 0
   * @param data
   */
  cancelRegistRecord(data: any) {
    console.log('data', data);
    if (!this.profile) return;
    if (!data.hasOwnProperty('orderSerial')) {
      this.msg.info('当前登记信息还未生成订单，不可执行撤销操作');
      return;
    }
    const update = {
      registerRecordNumber: data['registerRecordNumber'],
      globalRecordNumber: data['globalRecordNumber'],
      orderSerial: data['orderSerial'],
      registPovCode: data['registPovCode']
    };

    if (data.registDate + (Number(this.queueCallDelay) * 1000) >= new Date().valueOf()) {
      this.msg.warning(this.queueCallDelay + '秒内无法撤销！');
      return;
    } else {
      this.loading = true;
      const currentOrder = this.registRecord.filter(record => record['globalRecordNumber'] === data['globalRecordNumber']);
      this.registSvc.cancelRegRecord(update, resp => {
        this.loading = false;
        if (resp.code === 0) {
          this.msg.success('成功取消登记记录');
          this.queryRegistRecord();
          this.regRecDataSvc.setRegRecordCountChange(RegRecordDataService.REG_RECORD_CHANGE);
          data['registStatus'] = this.REGIST_STATUS_CANCEL;
          const pulsarConfig = this.configSvc.getSettings('pulsar');
          const namespace = pulsarConfig['pulsarNameSpace'];
          const paySharedTopic = pulsarConfig['payWaitTopicShared'];
          const payMonitorTopic = pulsarConfig['payWaitTopic'];
          const vaccinateSharedTopic = pulsarConfig['vaccinateWaitTopicShared'];
          const vaccinateMonitorTopic = pulsarConfig['vaccinateWaitTopic'];
          // 判断当前取消的疫苗是否是收费的，如果收费，则将排号信息从收银台取消
          if (data.vaccinePrice > 0) {
            this.queueApiService.deleteQueueItem(this.userInfo.pov, namespace, paySharedTopic, payMonitorTopic, data.globalRecordNumber, deleteResp => {
              if (deleteResp.code === 0) {
                // this.msg.success('成功！');
              }
            });
          } else {
            this.queueApiService.deleteQueueItem(this.userInfo.pov, namespace, vaccinateSharedTopic, vaccinateMonitorTopic, data.globalRecordNumber, deleteResp => {
              if (deleteResp.code === 0) {
                // this.msg.success('成功！');
              }
            });
          }

          // 过滤有效状态的登记记录
          const leftoverVaccinate = currentOrder.filter(order => order['registStatus'] === this.REGIST_STATUS_NORMAL);
          let totalPrice = 0;
          leftoverVaccinate.forEach(a => {
            totalPrice += a.vaccinePrice;
          });
          let tempNumberInfo = JSON.parse(JSON.stringify(this.currentNumberInfo));
          tempNumberInfo['actionTime'] = DateUtils.getFormatDateTime(tempNumberInfo['actionTime']);
          tempNumberInfo['birthDate'] = DateUtils.getFormatDateTime(tempNumberInfo['birthDate']);
          tempNumberInfo['createDate'] = DateUtils.getFormatDateTime(tempNumberInfo['createDate']);
          // 判断剩下的登记疫苗是否还含有收费的疫苗，用于重新向收银台或接种台推送排号信息，如果有，则修改排号信息状态 needToPay, 1-收费，2-免费
          if (totalPrice > 0) {
            tempNumberInfo.needToPay = '1';
          } else {
            tempNumberInfo.needToPay = '0';
          }
          // 判断剩下的登记疫苗数量是否大于0，大于0则需要重新推送
          if (leftoverVaccinate.length !== 0) {
            // 判断当前叫号的globalRecordNumber是否等于撤销记录的globalRecordNumber，用于重新推送
            if (this.currentNumberInfo['globalRecordNumber'] === data['globalRecordNumber']) {
              this.queueApiService.addToPayQueueOrVaccinateQueue(tempNumberInfo, result => {
              });
            }
          }
        }
      });
    }
  }

  /**
   * 打印登记小票信息
   * 将数据传递到打印页面
   */
  printInfo(data: any) {
    if (!this.profile) return;
    this.profile['createDate'] = null;
    const vaccineList = [];
    let vaccine = {};
    vaccine['vaccineSubclassCode'] = data['vaccineSubclassCode'];
    vaccine['vaccineManufactureName'] = data['vaccineManufactureName'];
    vaccine['vaccineBatchNo'] = data['vaccineBatchNo'];
    vaccine['vaccinePrice'] = data['vaccinePrice'];
    vaccine['vaccinateInjectNumber'] = data['vaccinateInjectNumber'];
    vaccineList.push(vaccine);
    const printData = {};
    Object.assign(printData, data, this.profile);
    printData['vaccineList'] = vaccineList;
    this.printData = printData;
    // this.printData = JSON.parse(JSON.stringify(printData));
    const sub = timer(1000).subscribe(_ => this.registInfoCom.print(false));
    this.subscription.push(sub);
  }

  /**
   * 检查登记日期是否是今天
   *
   * @param registDate
   */
  checkRegistDateIsToday(registDate: number): boolean {
    const dateStr = DateUtils.formatToDate(registDate);
    const today = new Date().getTime();
    const todayStr = DateUtils.formatToDate(today);
    return dateStr === todayStr;
  }

  /**
   * 设置有效的登记记录
   * @param records
   */
  setAvailableRegRecords(records: any[]) {
    const availableRec = [];
    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      if (rec['registStatus'] === '1') {
        availableRec.push(rec);
      }
    }
    this.regRecDataSvc.setRegRecords(availableRec);
  }
}

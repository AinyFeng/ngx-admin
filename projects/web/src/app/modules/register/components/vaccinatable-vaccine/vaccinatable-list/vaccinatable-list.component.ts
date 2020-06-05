import { ConfirmDialogComponent } from '../../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import {
  Component, Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { RegistRecordComponent } from '../regist-record/regist-record.component';
import { NzMessageService } from 'ng-zorro-antd';
import { BehaviorSubject, combineLatest, Subscription, timer } from 'rxjs';
import { UserService } from '@tod/uea-auth-lib';
import { AddRejectVaccineComponent } from '../add-reject-vaccine/add-reject-vaccine.component';
import {
  VaccinateStrategyApiService,
  ProfileDataService,
  ProfileChangeService,
  QueueListService,
  VaccBroadHeadingDataService,
  RecommendVaccineNotificationService,
  RECOMMEND_VACCINE_REFRESH,
  PROFILE_CHANGE_KEY,
  QueueApiService, DateUtils, RegistRecordService, SysConfInitService,
  SysConfKey,
  RegRecordDataService
} from '@tod/svs-common-lib';
import { ConfigService } from '@ngx-config/core';
import { take } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'vaccination-list',
  templateUrl: './vaccinatable-list.component.html',
  styleUrls: ['./vaccinatable-list.component.scss'],
  providers: [VaccinateStrategyApiService, QueueApiService]
})
/**
 * 排号列表 或 可接种疫苗列表
 */
export class VaccinatableListComponent implements OnInit, OnDestroy {
  /**
   * 当前查询的档案信息
   */
  profile: any;

  /**
   * 档案删除状态标志
   */
  profileDelete: boolean;

  /**
   * 已选择疫苗
   */
  selectedVac = [];

  /**
   * 疫苗大类
   */
  vacBroadHeadingData = [];
  /**
   * 用户登录信息
   */
  userInfo: any;
  /**
   * 可推荐疫苗列表
   */
  recommendedVacData = [];
  /**
   * 可推荐疫苗列表原始数据
   */
  originalRecommendedVacData = [];
  /**
   * 数据加载中
   */
  loading = false;

  /**
   * 当前叫号信息
   */
  callingData: any;
  /**
   * 打印登记小票对象
   */
  printRegisterInfo: any;
  /**
   * 打印组件引用模板
   */
  @ViewChild('printRegisterRef', { static: false }) printRegisterRefTem: any;

  private subscription: Subscription[] = [];

  /**
   * 没有查到可推荐疫苗时显示的内容
   */
  noDataText: string;

  /**
   * 登记台已叫号公共队列
   */
  registPassTopicShared: string;
  /**
   * 登记台已叫号监听队列
   */
  registPassTopic: string;
  /**
   * 接种策略已经接种针数
   */
  registStrategyInjectCount = 0;
  /**
   * 是否打印登记小票
   */
  printQueueNo = false;
  /**
   * 接种策略疫苗推荐
   */
  private vaccinableData$ = new BehaviorSubject<any>([]);
  /**
   * 登记记录
   */
  private registRecord$ = new BehaviorSubject<any>([]);

  // 是否进行了预诊
  @Input()
  diagnosePass: any;
  /**
   * 当前时间戳
   */
  todayTime = new Date().getTime();

  constructor(
    private dialogService: NbDialogService,
    private msg: NzMessageService,
    private profileDataSvc: ProfileDataService,
    private profileChangeSvc: ProfileChangeService,
    private queueListSvc: QueueListService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private vacStrategyApiSvc: VaccinateStrategyApiService,
    private recommendSvc: RecommendVaccineNotificationService,
    private userSvc: UserService,
    private queueApi: QueueApiService,
    private configSvc: ConfigService,
    private registerSvc: RegistRecordService,
    private sysConfSvc: SysConfInitService,
    private regRecDataSvc: RegRecordDataService,
    private notifier: NotifierService
  ) {
    this.initSysConf();
    this.initPulsarConfig();
    const sub = this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
    });
    this.subscription.push(sub);
    const sub1 = this.profileDataSvc.getProfileData().subscribe(profile => {
      this.profile = profile;
      this.resetRecommendListTable();
      if (profile) {
        // console.log('订阅得到的档案信息', profile);
        this.queryRecommendedVacStrategy();
        this.checkRegisterRecord();
      }
    });
    this.subscription.push(sub1);
    const sub2 = this.profileDataSvc
      .getProfileDeletedStatus()
      .subscribe(deleted => (this.profileDelete = deleted));
    this.subscription.push(sub2);
    const sub3 = this.queueListSvc.getCallingNumber().subscribe(queue => {
      // console.log('订阅得到的当前叫号为', queue);
      this.callingData = queue;
      if (queue) {
        this.queryRecommendedVacStrategy();
        this.checkRegisterRecord();
      }
    });

    this.subscription.push(sub3);
    const sub4 = this.recommendSvc
      .getVaccineStrategyNotification()
      .subscribe(notice => {
        if (notice === RECOMMEND_VACCINE_REFRESH) {
          this.queryRecommendedVacStrategy();
        }
      });
    this.subscription.push(sub4);
  }

  initPulsarConfig() {
    const pulsarConfig = this.configSvc.getSettings('pulsar');
    this.registPassTopicShared = pulsarConfig['registPassTopicShared'];
    this.registPassTopic = pulsarConfig['registPassTopic'];
  }

  initSysConf() {
    this.printQueueNo = this.sysConfSvc.getConfValue(SysConfKey.printQueueNoAfterRegister) === '1';
  }

  ngOnInit() {
    this.vacBroadHeadingData = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    const sub = combineLatest([this.vaccinableData$, this.registRecord$])
      .subscribe(([recommendedData, registerRecords]) => {
        this.recommendedVacData = recommendedData
          .filter(vac => -1 === registerRecords.findIndex(rec => rec['vaccineBroadHeadingCode'] === vac['vaccineSubclassCode'].substring(0, 2)));
        this.recommendedVacData.forEach(d => d['checked'] = false);
        // console.log(this.recommendedVacData);
      });
    this.subscription.push(sub);

    const sub1 = this.regRecDataSvc.getRegRecordCountChange()
      .subscribe(sign => {
        if (sign === RegRecordDataService.REG_RECORD_CHANGE) {
          this.checkRegisterRecord();
        }
      });
    this.subscription.push(sub1);
    this.refreshStrategyModel();
  }

  /**
   * 刷新接种策略模型
   */
  refreshStrategyModel() {
    const sub = this.profileDataSvc.getVaccinateStrategyChange().subscribe(sign => {
      if (sign === ProfileDataService.VACCINATE_STRATEGY_CHANGE) {
        // console.log('刷新模型');
        this.flushVaccineModel();
      }
    });
    this.subscription.push(sub);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  /**
   * vaccineSubclassName:"",
   * vaccineProductShortName:"",
   * vaccineProductCode:"",
   * total_count:"777", 全部累加的库存量
   * batchNoArr: [{label:"批次号", value:"count"}],
   * price: "0", 0 - 免费， 1 - 自费
   * vaccineSubclassCode:""
   */
  add() {
    this.selectedVac = [];
    // console.log('开始add', JSON.parse(JSON.stringify(this.recommendedVacData)));
    for (let i = 0; i < this.recommendedVacData.length; i++) {
      const checkedStatus = this.recommendedVacData[i]['checked'];
      // console.log(checkedStatus);
      if (checkedStatus) {
        const v = this.recommendedVacData[i];
        this.addRecommendedVacData(v);
      }
    }
    this.selectedVac.sort((a, b) => b['loseEfficacyDate'] - a['loseEfficacyDate']);
    // console.log('已选择的接种策略疫苗是', this.selectedVac);
  }

  addRecommendedVacData(data: any) {
    // console.log(this.originalRecommendedVacData);
    this.originalRecommendedVacData.forEach(v => {
      if (data['vaccineSubclassCode'] === v['vaccineSubclassCode'] &&
        v.hasOwnProperty('prodBatchNumber') && v.hasOwnProperty('povVaccPrice') &&
        v['povVaccPrice'] >= 0) {
        this.selectedVac.push(v);
      }
    });
  }

  openDialog(indx: string) {
    if (this.diagnosePass === 1) {
      this.msg.warning('预诊不通过,不能接种, 请下次再来');
      return;
    }
    if (this.checkProfileDeleteStatus()) {
      return;
    }

    // console.log('已选择疫苗', this.selectedVac);
    // console.log('当前叫号为', this.callingData);
    // console.log('当前档案信息为', this.profile);
    // 检查是否存在相同大类疫苗
    this.checkProfileHasGlobalRecordNumber(resp => {
      if (resp) {
        // 判断所选择的疫苗中是否有重复的大类编码，如果选择了相同的疫苗大类编码，则需要提示用户重新选择

        // 打开 排号 组件
        if (indx === 'addToVaccinateQueue') {
          if (this.checkDuplicatedSelectedVacProducts()) return;
          let count = 0;
          for (let i = 0; i < this.recommendedVacData.length; i++) {
            const v = this.recommendedVacData[i];
            if (v['checked']) {
              count++;
            }
          }
          if (count > 3) {
            this.msg.info('一次排号最多只能选择3个疫苗');
            return;
          }
          // console.log(this.registStrategyInjectCount);
          if (this.registStrategyInjectCount >= 3) {
            this.msg.warning(`今天已经登记【${this.registStrategyInjectCount}】支疫苗，无法使用【接种策略进行登记】，请选择【自定义接种登记】`);
            return;
          }
          if (count + this.registStrategyInjectCount > 3) {
            this.msg.warning(`还能登记【${3 - this.registStrategyInjectCount}】支疫苗，请重新选择`);
            return;
          }
          if (count === 0) {
            this.msg.info('请选择疫苗');
            return;
          }
          // 添加已选择的接种策略疫苗
          this.add();
          // console.log(this.selectedVac);
          this.openRegistRecordComponent();
        }
        // 打开 自定义排号 组件
        if (indx === 'customAddToVaccinateQueue') {
          this.openRegistRecordComponent(false);
        }
      }
    });
  }

  /**
   * 检查预检结果
   */
  checkDiagnoseResult() {
    return this.diagnosePass;
  }

  /**
   * 检查档案信息中是否包含全局流水号
   * @param func
   */
  checkProfileHasGlobalRecordNumber(func: Function) {
    // 判断档案信息里是否包含全局流水号
    // 这一步是需要判断2个条件，一个是是否有叫号信息，另一个是档案信息中是否有全局流水号
    // 如果有叫号信息且档案信息中没有全局流水号，说明是在叫号时产生的登记操作，只有关联之后才能继续登记
    // 如果没有叫号信息，则不能继续登记
    // TODO 目前只做通过叫号才能登记，以后再考虑不叫号登记，还有，有可能会需要更新排队信息中的属性
    // console.log('检查全局流水号', this.profile['globalRecordNumber'], this.callingData);
    if (this.callingData && this.callingData['profileName'] !== '' && this.profile['profileCode'] !== this.callingData['profileCode']) {
      this.msg.warning(`当前正在叫号【${this.callingData['profileName']}】，请选择正确的叫号信息之后再登记`);
      return;
    }
    if (!this.profile['globalRecordNumber'] && this.callingData &&
      (this.callingData.hasOwnProperty('globalRecordNumber') ||
        this.callingData['globalRecordNumber'] !== null ||
        this.callingData['globalRecordNumber'] !== undefined)) {
      this.dialogService
        .open(ConfirmDialogComponent, {
          closeOnEsc: false,
          closeOnBackdropClick: false,
          context: {
            title: '消息确认',
            content: `必须要将叫号信息【${this.callingData['queueCode']}】与档案【${this.profile['name']}】进行关联才能登记排号，是否关联？`
          }
        })
        .onClose.subscribe(ret => {
        if (!ret) {
          // 否，不关联，则不执行之后的操作
          func(false);
        } else {
          // 执行绑定操 - 将globalRecordNumber 添加到档案信息profile中，然后继续执行其他操作
          this.profile['globalRecordNumber'] = this.callingData[
            'globalRecordNumber'
            ];
          // 置空的目的是为了防止已经绑定的叫号信息再次被绑定到其他档案信息中
          // registPassTopicShared,registPassTopic
          const param = JSON.parse(JSON.stringify(this.callingData));
          param['createDate'] = DateUtils.getFormatDateTime(param['createDate']);
          param['actionTime'] = DateUtils.getFormatDateTime(param['actionTime']);
          param['profileName'] = this.profile['name'];
          param['profileCode'] = this.profile['profileCode'];
          param['registPassTopicShared'] = this.registPassTopicShared;
          param['registPassTopic'] = this.registPassTopic;
          this.queueApi.updateQueueItemInfoOnRegister(param, r => {
            // console.log('更新已叫号队列', r);
            if (r.code === 0) {
              // this.callingData = null;
              func(true);
            } else {
              func(false);
            }
          });
        }
      });
    } else if (this.callingData && (this.profile['profileCode'] === this.callingData['profileCode'] || this.profile['globalRecordNumber'])) {
      this.profile['globalRecordNumber'] = this.callingData['globalRecordNumber'];
      func(true);
    } else if (!this.callingData) {
      this.msg.info('请先叫号之后再登记');
      func(false);
    }
  }

  openRegistRecordComponent(sendData = true) {
    console.log('排号选择的疫苗数据', this.selectedVac);
    this.dialogService
      .open(RegistRecordComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          reservationVac: sendData ? this.selectedVac : []
        }
      })
      .onClose.subscribe(registered => {
      // 当用户登记注册成功之后，应该跳转出下次接种预约界面
      if (registered) {
        // this.recommendedVacData = this.recommendedVacData.filter(vac => this.selectedVac.findIndex(selected => vac['vaccineProductCode'] === selected['vaccineProductCode']) === -1);
        this.checkRegisterRecord();
        const delayPrint = timer(1000).subscribe(_ => {
          if (this.printQueueNo) {
            this.printRegisterInfo = registered;
            this.printRegisterRefTem.print(false);
          }
          this.profileChangeSvc.setProfileChange(PROFILE_CHANGE_KEY.REGIST_RECORD);
          // this.profileDataSvc.setProfileData(null);
          // 登记成功之后，弹出接种预约页面
          // this.dialogService.open(VaccinateReservationComponent, {
          //   hasBackdrop: true,
          //   closeOnBackdropClick: false,
          //   closeOnEsc: false
          // });
        });
        this.subscription.push(delayPrint);
      }
    });
  }

  checkProfileDeleteStatus(): boolean {
    if (this.profileDelete) {
      this.notifier.notify('warning', '当前档案已经被删除，无法操作');
      return true;
    }
    if (!this.profile) {
      this.notifier.notify('warning', '请先查询档案信息再执行后续操作');
      return true;
    }
    return false;
  }

  /**
   * 根据pov编码和档案编码查询可推荐疫苗列表
   */
  queryRecommendedVacStrategy() {
    if (!this.profile || !this.userInfo) return;
    // const profileCode = this.profile['profileCode'];
    // 目前先试用测试的档案编码 2019092702 或 2019092701
    const profileCode = this.profile['profileCode'];
    const povCode = this.userInfo.pov;
    this.loading = true;
    this.resetRecommendListTable();
    console.log(this.callingData);
    const businessType = {
      businessType: this.callingData ? this.callingData['vaccineCode'] : null
    };
    this.originalRecommendedVacData = [];
    this.recommendedVacData = [];
    this.vacStrategyApiSvc.getRecommendedVaccine(povCode, profileCode, businessType, resp => {
      console.log('查询可接种推荐疫苗', resp);
      this.loading = false;
      if (resp.code === 0) {
        this.originalRecommendedVacData = resp.data;
        if (this.originalRecommendedVacData.length === 0) {
          this.noDataText = resp.msg;
          this.generateDisplayData([]);
          return;
        }
        this.generateDisplayData(resp.data);
      }
    });
  }

  /**
   * 将可推荐疫苗获取到的疫苗信息进行结构重组，以获取展示内容
   * vaccineSubclassName:"",
   * vaccineProductShortName:"",
   * vaccineProductCode:"",
   * total_count:"777", 全部累加的库存量
   * batchNoArr: [{label:"批次号", value:"count"}],
   * price: ["0", ["1"]], 0 - 免费， 1 - 自费
   * vaccineSubclassCode:""
   * @param data
   */
  generateDisplayData(data: any[]) {
    const recommendedVacData = [];
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      this.setAndUpdateRecommendedVacData(d, recommendedVacData);
    }
    console.log('重新循环之后的数据', recommendedVacData);
    recommendedVacData.sort((a, b) => {
      return a['vaccineSubclassCode'] - b['vaccineSubclassCode'];
    });
    this.vaccinableData$.next(recommendedVacData);
  }

  /**
   * 根据传入的data对象，判断vacData中是否存在相同的数据
   * 如果有相同的数据，则累加库存
   * 如果没有，则添加新的数据
   * @param data
   * @param vacData
   */
  setAndUpdateRecommendedVacData(data: any, vacData: any[]) {
    // 如果推送的疫苗产品中没有产品批号和价格，则不予显示
    if (!data.hasOwnProperty('prodBatchNumber') || !data.hasOwnProperty('povVaccPrice') || data['povVaccPrice'] < 0) {
      return;
    }
    // 没有到接种时间不予显示此种疫苗
    const earliestVaccDate = data['earliestVaccDate'];
    const latestVaccDate = data['latestVaccDate'];
    if (this.todayTime > latestVaccDate || this.todayTime < earliestVaccDate) {
      return;
    }
    const d = {
      vaccineSubclassName: data['vaccineSubclassName'],
      vaccineProductShortName: data['vaccineProductShortName'],
      vaccineProductCode: data['vaccineProductCode'],
      count: data['count'],
      vaccOrder: data['vaccOrder'],
      prodBatchNumber: data['prodBatchNumber'],
      price: [data['povVaccPrice'] > 0 ? '1' : '0'],
      vaccineSubclassCode: data['vaccineSubclassCode'],
      loseEfficacyDate: data['loseEfficacyDate'],
      earliestVaccDate: data['earliestVaccDate'],
      latestVaccDate: data['latestVaccDate'],
      batchNoArr: [
        {
          label: data['prodBatchNumber'],
          value: data['count']
        }
      ]
    };
    // 判断条件，小类编码、是否免费、产品编码都相同
    const index = vacData.findIndex(
      v => v.vaccineSubclassCode === d.vaccineSubclassCode
    );
    // 如果没有，则直接插入，然后返回
    if (index === -1) {
      vacData.push(d);
      return;
    }
    // 如果有，则需要将原有元素取出，修改，然后再放回去
    for (let i = 0; i < vacData.length; i++) {
      if (i !== index) continue;
      const v = vacData[i];
      const batchNoArr = v['batchNoArr'];
      const dBatchNo = d.batchNoArr[0];
      batchNoArr.push(dBatchNo);
      const price = d['price'][0];
      const priceArr = v['price'];
      if (!priceArr.includes(price)) {
        priceArr.push(price);
      }
      v.count += d.count;
    }
  }

  resetRecommendListTable() {
    this.recommendedVacData = [];
    this.originalRecommendedVacData = [];
  }

  /**
   * 检查所选的疫苗中事发后包含重复的疫苗大类
   * 如果有重复大类的疫苗产品 - true
   * 如果没有 - false
   */
  checkDuplicatedSelectedVacProducts(): boolean {
    // console.log('----- 开始检查是否重复大类', JSON.parse(JSON.stringify(this.recommendedVacData)));
    for (let i = 0; i < this.recommendedVacData.length; i++) {
      const vac = this.recommendedVacData[i];
      const broadHeadingCode = vac['vaccineSubclassCode'].substring(0, 2);
      if (!vac['checked']) continue;
      for (let j = 0; j < this.recommendedVacData.length; j++) {
        const compareVac = this.recommendedVacData[j];
        if (!compareVac['checked']) continue;
        if (i !== j) {
          const compareBroadHeadingCode = compareVac['vaccineSubclassCode'].substring(0, 2);
          if (broadHeadingCode === compareBroadHeadingCode) {
            const name = this.vacBroadHeadingSvc.getVaccBroadHeadingNameByBroadHeadingCode(broadHeadingCode);
            this.msg.info(`同一个大类【${broadHeadingCode}-${name}】中只能选择一个疫苗产品，请重新选择`);
            return true;
          }
        }
      }
    }
    return false;
  }

  // 不接种
  disableVaccine(data?: any) {
    // 添加不接种
    if (this.checkProfileDeleteStatus()) {
      return;
    }
    this.dialogService.open(AddRejectVaccineComponent, {
      context: {
        profile: this.profile,
        userInfo: this.userInfo
      }
    });
  }

  /**
   * 检查已经登记的数量
   */
  checkRegisterRecord() {
    if (!this.userInfo || !this.profile) {
      return;
    }
    const today = new Date();
    const param = {
      registPovCode: this.userInfo.pov,
      profileCode: this.profile['profileCode'],
      registStatus: ['1', '2'], // 查询待接种和已接种
      registDate: {
        start: DateUtils.formatStartDate(today),
        end: DateUtils.formatEndDate(today)
      }
    };
    this.registerSvc.queryRegistRecord(param, resp => {
      if (resp.code === 0) {
        this.registStrategyInjectCount = resp.data.length;
        this.registRecord$.next(resp.data);
      }
    });
  }

  /**
   * 刷新单个受种人的接种策略模型
   * 刷新之后重新查询接种策略
   */
  flushVaccineModel() {
    if (!this.profile) return;
    this.loading = true;
    const profileCode = this.profile['profileCode'];
    this.vacStrategyApiSvc.flushVaccineModel(profileCode, resp => {
      if (resp.code === 0) {
        const msg = resp.msg;
        const index = msg.indexOf('无需再更新');
        if (index === -1) {
          timer(800).pipe(take(1)).subscribe(() => this.queryRecommendedVacStrategy());
        } else {
          this.msg.info(msg);
          this.noDataText = msg;
          this.loading = false;
        }
      } else {
        this.msg.error('接种策略模型刷新失败，请重试');
        this.loading = false;
      }
    });
  }

  /*
  * 判断是否预检通过
  * */
  preliminaryClinicalPass() {
    if (this.diagnosePass === 1) {
      this.msg.warning('预诊不通过');
      return;
    }
  }
}

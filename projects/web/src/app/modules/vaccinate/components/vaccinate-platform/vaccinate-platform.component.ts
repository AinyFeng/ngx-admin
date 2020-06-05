import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {EventManager} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {NbDialogService} from '@nebular/theme';
import {ConfigService} from '@ngx-config/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {LocalStorageService} from '@tod/ngx-webstorage';
import {interval, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import {UserService} from '@tod/uea-auth-lib';
import {
  DicDataService,
  WebsocketService,
  WebsocketPassService,
  QueueApiService,
  IotInitService,
  ProfileService,
  VaccinateService,
  RegQueueService,
  VaccineProductService,
  BatchInfoService,
  StockService,
  ColdStorageFacilityService,
  RegistRecordService,
  ObserveService,
  EleSuperviseCodeService,
  DepartmentConfigService,
  DepartmentInitService,
  SysConfInitService,
  TransformUtils,
  DateUtils,
  QUEUE_ROOM_TYPE,
  VACCINATE_STATUS,
  DictionaryPipe
} from '@tod/svs-common-lib';
import {VaccinateMemoDialogComponent} from '../vaccinate-memo-dialog/vaccinate-memo-dialog.component';
import {DialogDepartmentComponent} from '../vaccinate-department-dialog/department.dialog.template';

@Component({
  selector: 'uea-vaccinate-plateform',
  templateUrl: './vaccinate-platform.component.html',
  styleUrls: ['./vaccinate-platform.component.scss'],
})
export class VaccinatePlatformComponent implements OnInit, OnDestroy {
  // 用于 LocalStorage 保存选择的科室
  curVaccinationRoom: string = 'curVaccinationRoom';

  // iot 设备 topic
  iotTopic: any;
  iotObservableTopic: any;
  // 接种台状态 有： ''、'叫号中'、'接种中'、'接种完成'、'查看中'
  vaccinationStatus: string = '';

  vaccinatingReceivedCount = 0;
  // pulsar 配置信息
  pulsarJson: any;
  // 连接地址的key
  pulsarUrlKey = 'pulsarUrl';
  // pulsar key
  private readonly pulsarJsonKey = 'pulsar';
  // pulsarUrl 链接地址340604080120151643

  pulsarUrl: string;
  // pulsar 命名空间
  pulsarNs: string;
  // 接种室共享队列
  vaccinateWaitTopicShared = '';
  // 接种室监控队列
  vaccinateWaitTopic = '';
  // 接种室已叫号队列
  vaccinateCalledTopicShared = '';
  // 接种室已叫号监控队列
  vaccinateCalledTopic = '';
  // 接种科室选项
  departmentOption = [];
  // 选择的接种科室
  selectedDepartmentCode = '';
  // 选择的接种科室
  selectedDepartmentName = '';
  // 当前排号信息
  currentQueueItem: any;
  // 下一个排号信息
  nextQueueItem: any;

  isCallNumberDisabled: boolean = false;

  isFinishedVaccinate: boolean = false;

  isCheckSuccess: boolean = false;

  // 当前接种室信息
  userInfo: any;
  // 是否开始疫苗核验
  checkVaccineFlag = false;

  vaccinateRecords: any[] = [];
  vaccinateRecordsCount: number = 0;
  vaccinateRecordsPageSize = 10;
  vaccinateRecordsPageIndex = 1;

  // 扫描疫苗信息
  scanVaccineInfo = {electronicSupervisionCode: ''};

  // 当前接种人接种疫苗信息
  currentVaccineInfo = {};

  // 待接种排队队列
  waitQueueData = [];

  // 接种中排队队列
  vaccinatingQueueData = [];

  // 过号接种队列
  passQueueData = [];

  // 接种完成数据
  successQueueData = [];

  // 基本信息Form
  // baseInfoForm: FormGroup;
  basicInfo: any = {
    name: '',
    gender: '',
    immunityVacCard: '',
    birthDate: '',
    profileCode: '',
    guardian: ''
  };

  // 报损Form 显示
  breakageVisible = false;

  // 报损下拉框开关
  breakageOptionFlag = false;

  // 疫苗产品表信息
  vaccineProducts = [];

  // 疫苗批号信息
  vaccineBatches = [];

  // 疫苗电子监管码信息
  eleSuperviseCodes = [];

  // 冷藏设备信息
  coldStorageFacilities = [];

  // 报损方式
  breakTypes = [];

  // 接种部位
  vaccinateParts = [];

  // 多剂次信息
  vaccineDoseDatas = [];
  // 多剂次Count
  vaccineDoseDatasCount = 0;

  // 可用多剂次数量
  manyDoseAvailables = [];

  private subscription: Subscription[] = [];

  // 登记接种信息
  registerVaccinateRecords = [];

  // 当前接种记录
  currentVaccinateRecords = [];

  // 监护人
  // guardians = '';

  // 显示接种或登记记录
  showvaccinateOrRegister = true;

  // 监听类型flag
  eventListenerFlag = '';

  // 扫描结果
  scanInput = '';

  // 键盘全局监听事件
  globalListenFunc: any;

  // 下一号按钮状态
  nextBtnStatus = false;

  vaccineList = [];

  private readonly waitingSubscription: Subscription[] = [];

  private readonly calledSubscription: Subscription[] = [];

  // @ViewChild('dialog', { static: false })
  // dialog;

  /**
   * 用于报损的产品列表选项
   */
  breakageVaccineProductOptions = [];

  /**
   * 用于报损的疫苗设备编码
   */
  breakageFacilityCodeOptions = [];

  /**
   * 用于报损的入参对象
   */
  breakageObj: any;

  constructor(
    private nbDialogService: NbDialogService,
    private profileService: ProfileService,
    private router: Router,
    private message: NzMessageService,
    private modalService: NzModalService,
    private vaccinateService: VaccinateService,
    private regQueueService: RegQueueService,
    private fb: FormBuilder,
    private vaccineProductService: VaccineProductService,
    private batchInfoService: BatchInfoService,
    private stockService: StockService,
    private coldStorageFacilityService: ColdStorageFacilityService,
    private registRecordService: RegistRecordService,
    private dictionaryPipe: DictionaryPipe,
    private userService: UserService,
    private observeService: ObserveService,
    private dicDataService: DicDataService,
    private eleSuperviseCodeService: EleSuperviseCodeService,
    private departmentConfigService: DepartmentConfigService,
    private eventManager: EventManager,
    private waitingWs: WebsocketService,
    private calledWs: WebsocketPassService,
    private queueApiSvc: QueueApiService,
    private departmentInitSvc: DepartmentInitService,
    private configSvc: ConfigService,
    private iotInitSvc: IotInitService,
    private localSt: LocalStorageService,
    private sysConfSvc: SysConfInitService,
  ) {
    this.initSysConf();
    this.pulsarJson = this.configSvc.getSettings(this.pulsarJsonKey);
    this.vaccinateWaitTopicShared = this.pulsarJson.vaccinateWaitTopicShared;
    this.vaccinateWaitTopic = this.pulsarJson.vaccinateWaitTopic;
    this.vaccinateCalledTopicShared = this.pulsarJson.vaccinateCalledTopicShared;
    this.vaccinateCalledTopic = this.pulsarJson.vaccinateCalledTopic;
    this.pulsarNs = this.pulsarJson.pulsarNameSpace;
  }

  ngOnInit() {
    this.initUserInfo();
    // this.loadBreakType();
    this.loadVaccinatePart();
    // this.queryVaccineDoseInfo();
    // this.initBreakageForm();
    // this.initBaseInfoForm();
    // this.loadVaccineProductInfo();

    this.getObservableIotDepartment();
    this.globalListenFunc = this.eventManager.addGlobalEventListener(
      'window',
      'keyup',
      result => {
        console.log('键盘事件', result);
        if (result['key'] !== 'Enter' && result['key'] !== 'Process') {
          this.scanInput += result['key'];
        } else if (result['key'] === 'Enter') {
          console.log(this.eventListenerFlag);
          // 如果flag 为 scanProfile 则为扫描接种证，如果为 scanVaccine 则为扫描疫苗
          if (
            this.eventListenerFlag === 'scanProfile' &&
            this.scanInput !== ''
          ) {
            this.checkRegisterAndScanProfileInfo();
          } else if (
            this.eventListenerFlag === 'scanVaccine' &&
            this.scanInput !== ''
          ) {
            this.checkRegisterAndScanVaccineInfo();
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    // 退出页面 关闭websocket连接
    this.subscription.forEach(sub => sub.unsubscribe());
    this.waitingSubscription.forEach(sub => sub.unsubscribe());
    this.calledSubscription.forEach(sub => sub.unsubscribe());
    if (typeof this.globalListenFunc === 'function') {
      this.globalListenFunc();
    } else {

    }
  }

  /**
   * 初始化系统配置项
   */
  initSysConf() {
    this.pulsarUrl = this.sysConfSvc.getConfValue(this.pulsarUrlKey);
  }

  /**
   * 通过部门编码查询可接种疫苗列表
   */
  loadVaccineListByDept() {
    const params = {
      belongDepartmentCode: this.selectedDepartmentCode
    };
    this.departmentConfigService.getVaccineListByDept(params, resp => {
      console.log(resp);
      if (resp.code === 0) {
        this.vaccineList = resp.data;
      }
    });
  }

  /**
   * 初始化接种台信息
   */
  initUserInfo() {
    // console.log('----------------------获取接种台用户信息');
    const sub = this.userService.getUserInfoByType().subscribe(user => {
      // console.log('接种台用户信息', user);
      this.userInfo = user;
      if (user) {
        this.queryVaccineDoseInfo();
        // 获取接种室选项
        this.getDepartmentOption();
      }
    });
    this.subscription.push(sub);
  }

  /**
   * 初始化报损表单
   */
  // initBreakageForm() {
  //   this.breakageForm = this.fb.group({
  //     vaccProductCode: [null, [Validators.required]],
  //     prodBatchCode: [null, [Validators.required]],
  //     eleSuperviseCode: [null],
  //     facilityCode: [null, [Validators.required]],
  //     count: [null, [Validators.required, Validators.min(0)]],
  //     breakType: [null, [Validators.required]],
  //     reportTime: [null, [Validators.required]],
  //     memo: [null]
  //   });
  // }

  /**
   * 初始化基本信息Form
   */
  // initBaseInfoForm() {
  //   this.baseInfoForm = this.fb.group({
  //     name: new FormControl({ value: '', disabled: true }),
  //     gender: new FormControl({ value: '', disabled: true }),
  //     immunityVacCard: new FormControl({ value: '', disabled: true }),
  //     birthDate: new FormControl({ value: '', disabled: true }),
  //     idCardNo: new FormControl({ value: '', disabled: true })
  //   });
  // }

  /**
   * 查询档案信息
   * @param profileCode 档案编号
   */
  queryProfile(profileCode: string) {
    if (profileCode) {
      const query = {
        profileCode: profileCode
      };
      this.profileService.queryProfile(query, resp => {
        if (resp.code === 0 && resp.data.length > 0) {
          const profileInfo = resp.data[0];
          const birthDayTime = resp.data[0].birthDate;
          let transFormAge = TransformUtils.getAgeFromBirthDate(birthDayTime);
          let strAge = `(${transFormAge.age}岁${transFormAge.month ? transFormAge.month : 0}月龄)`;
          this.basicInfo.name = profileInfo['name'];
          this.basicInfo.gender = profileInfo['gender'];
          this.basicInfo.immunityVacCard = profileInfo['immunityVacCard'];
          this.basicInfo.birthDate = DateUtils.formatToDate(birthDayTime) + strAge;
          this.basicInfo.profileCode = profileInfo.profileCode;

          // this.baseInfoForm = this.fb.group({
          //   name: profileInfo.name,
          //   gender: this.dictionaryPipe.transform(
          //     profileInfo.gender,
          //     'genderCode'
          //   ),
          //   immunityVacCard: profileInfo.immunityVacCard,
          //   birthDate: DateUtils.formatToDate(birthDayTime) + strAge,
          //   idCardNo: profileInfo.idCardNo
          // });
        } else if (resp.code === 0 && resp.data.length === 0) {
          if (profileCode !== '0' && profileCode !== null) {
            this.createMessage('warning', '未查询到档案信息!');
            this.resetBasicInfo();
          }
        } else {
          this.createMessage('error', '查询档案信息失败!');
          this.resetBasicInfo();
        }
      });
    } else {
      this.resetBasicInfo();
    }
  }

  /**
   * 重置基本信息
   */
  resetBasicInfo() {
    this.basicInfo = {
      name: '',
      gender: '',
      immunityVacCard: '',
      birthDate: '',
      idCardNo: '',
      guardian: ''
    };
  }

  /**
   * 查询当前接种人的接种信息
   * @param profileCode 接种人档案编码
   * @param globalRecordNumber 接种人本次接种全局流水号
   * @param status
   */
  queryCurrentVaccinateRecords(profileCode: string, globalRecordNumber: string, status?: string) {
    this.showvaccinateOrRegister = true;
    const query: any = {
      profileCode: profileCode,
      globalRecordNumber: globalRecordNumber,
      pageEntity: {page: 1, pageSize: 10}
    };
    if (profileCode && globalRecordNumber) {
      this.vaccinateService.queryCurrentVaccinateRecords(query, resp => {
        this.currentVaccinateRecords = resp.data;
        this.addDisabledForVaccinateRecord();
        if (resp.data.length > 0 && status !== 'view' && this.checkVaccineFlag) {
          this.eventListenerFlag = 'scanVaccine';
        } else {
          this.eventListenerFlag = 'scanProfile';
        }
      });
    } else {
      this.currentVaccinateRecords = [];
    }
  }

  /**
   * 查询历史接种记录
   */
  queryHistoryVaccinateRecords(profileCode: string) {
    if (profileCode) {
      const params: any = {
        profileCode: profileCode,
        vaccinateStatus: ['3'],
        pageEntity: {page: 1, pageSize: 10}
      };
      this.vaccinateService.queryVaccinateRecordAndCount(
        params,
        (queryData, countData) => {
          if (queryData.code !== 0 || countData.code !== 0) {
            console.warn('查询接种记录失败!');
            this.vaccinateRecords = [];
            this.vaccinateRecordsCount = 0;
          } else {
            this.vaccinateRecords = queryData.data;
            this.vaccinateRecordsCount = countData.data[0].count;
          }
        }
      );
    } else {
      this.vaccinateRecords = [];
      this.vaccinateRecordsCount = 0;
    }
  }

  callNumber(event) {
    this.isCallNumberDisabled = true;
    this.currentQueueItem = this.initQueueData(this.currentQueueItem);
    switch (this.vaccinationStatus) {
      case VACCINATE_STATUS.calling:
        this.queueApiSvc.repeatCallQueueCode(this.currentQueueItem, _ => {
          if (_.code === 0) {
            this.createMessage('success', '叫号成功');
          } else {
            this.createMessage('error', '出错了！');
          }
        });
        break;
      case VACCINATE_STATUS.viewing:
        this.queueApiSvc.vaccinateCallNumber(this.currentQueueItem, resp => {
          if (resp.hasOwnProperty('code') && resp.code === 0) {
            this.createMessage('success', '叫号成功');
          } else {
            this.createMessage('error', '出错了！');
          }
        });
        break;
      default:
        break;
    }
    const numbers = interval(1000);
    const takeFourNumbers = numbers.pipe(take(4));
    takeFourNumbers.subscribe(
      (x: number) => {
        event.srcElement.innerHTML = '叫号中(' + (3 - x) + ')s';
      },
      error => {
      },
      () => {
        event.srcElement.innerHTML = '叫号';
        this.vaccinationStatus = VACCINATE_STATUS.calling;
        this.isCallNumberDisabled = false;
      }
    );
  }

  /**
   * 下一号的信息
   */
  nextNumber(event) {
    if (this.waitQueueLength() === 0 && this.vaccinatingQueueData.length === 0) {
      this.createMessage('warning', '当前无排队受种人！');
      this.nextBtnStatus = false;
      return;
    }
    // // 清除页面数据
    // this.clearCurrentInfo();
    // 判断接种中队列是否有值，如果 有值，则是叫过号，没有值，则是叫下一号
    if (this.vaccinationStatus === VACCINATE_STATUS.vaccinating) {
      this.modalService.confirm({
        nzTitle: '<i>过号提示</i>',
        nzContent: '<b>' + '确认过号?' + '</b>',
        nzOkText: '确认',
        nzCancelText: '返回',
        nzOnOk: () => this.callNextNumber(this.nextQueueItem, event)
      });
    } else {
      this.callNextNumber(this.nextQueueItem, event);
    }
    // if (this.vaccinatingQueueData.length === 0) {
    //   // 叫下一号
    // } else {
    //   // 过号
    //   this.passNumber(this.currentQueueItem, this.nextQueueItem);
    // }
  }

  /**
   * 打开报损界面
   * 包含两种情况：
   * 1. 有接种信息
   * 2. 无接种信息
   */
  breakageOpen() {
    // 无接种信息
    if (this.currentVaccineInfo['vaccineProductCode'] === undefined) {
      // console.log('无接种信息报损');
      // console.log(this.coldStorageFacilities);
      // 无接种信息报损需要将所有的冷藏设备传入
      this.initBreakageFacilityCodeOptions(this.coldStorageFacilities);
      // if (this.vaccineProducts.length === 0) {
      //   this.createMessage('warning', '疫苗产品加载失败,请重试！');
      //   return;
      // }
      // this.loadBatchInfoByProduct(this.vaccineProducts[0].vaccineProductCode);
      // const params = {
      //   vaccineProductCode: this.vaccineProducts[0].vaccineProductCode
      // };
      // this.batchInfoService.queryBatchInfo(params, resp => {
      //   console.log(resp);
      //   if (!!resp.data) {
      //     this.vaccineBatches = resp.data;
      //     const eleParams = {
      //       batch: this.vaccineBatches[0].batchNo
      //     };
      //     this.eleSuperviseCodeService.queryEleSuperviseCode(
      //       eleParams,
      //       eleResp => {
      //         this.eleSuperviseCodes = eleResp.data;
      //         const eleSuperviseCode =
      //           eleResp.data.length > 0
      //             ? this.eleSuperviseCodes[0].electronicSupervisionCode
      //             : null;
      //         this.breakageObj = {
      //           vaccProductCode: this.vaccineProducts[0].vaccineProductCode, // 有
      //           prodBatchCode: this.vaccineBatches[0].batchNo, // 有
      //           eleSuperviseCode: eleSuperviseCode, // 有
      //           count: 1,
      //           facilityCode: this.coldStorageFacilities[0].facilityCode, // 有
      //           breakType: this.breakTypes[0].value, // 有
      //           breakTime: new Date(),
      //           memo: ''
      //         };
      //         // this.breakageForm = this.fb.group({
      //         // vaccProductCode: [
      //         //   this.vaccineProducts[0].vaccineProductCode,
      //         //   [Validators.required]
      //         // ],
      //         // prodBatchCode: [
      //         //   this.vaccineBatches[0].batchNo,
      //         //   [Validators.required]
      //         // ],
      //         // eleSuperviseCode: [eleSuperviseCode],
      //         // facilityCode: [
      //         //   this.coldStorageFacilities[0].facilityCode,
      //         //   [Validators.required]
      //         // ],
      //         // count: [1, [Validators.required, Validators.min(0)]],
      //         // breakType: [this.breakTypes[0].value, [Validators.required]],
      //         // reportTime: [new Date(), [Validators.required]],
      //         // memo: [null]
      //         // });
      //       }
      //     );
      //   } else {
      //     this.vaccineBatches = [];
      //   }
      // });
    } else if (this.currentVaccineInfo['vaccineProductCode'] !== undefined) {
      // console.log('有接种信息报损');
      // 有接种信息
      // 将表单信息封装好然后传入报损表单
      this.breakageObj = {
        vaccProductCode: this.currentVaccineInfo['vaccineProductCode'], // 有
        prodBatchCode: this.currentVaccineInfo['vaccineBatchNo'], // 有
        eleSuperviseCode: this.currentVaccineInfo['electronicSupervisionCode'], // 有
        count: this.currentVaccineInfo['vaccinateCount'],
        facilityCode: this.coldStorageFacilities[0].facilityCode, // 有
        breakType: this.breakTypes[0].value, // 有
        breakTime: new Date(),
        memo: null
      };
      // 然后将需要的下拉框选项进行封装传入到报损表单页面中
      this.initBreakageVaccineProductOptions(this.currentVaccineInfo['vaccineProductCode']);
      this.initEleSuperviseCodeOptions(this.currentVaccineInfo['electronicSupervisionCode']);
      this.initBreakageFacilityCodeOptions([this.coldStorageFacilities[0]]);
      this.initVaccineBatchOptions(this.currentVaccineInfo['vaccineBatchNo']);

      // this.breakageForm = this.fb.group({
      // vaccProductCode: [
      //   this.currentVaccineInfo['vaccineProductCode'],
      //   [Validators.required]
      // ],
      // prodBatchCode: [
      //   this.currentVaccineInfo['vaccineBatchNo'],
      //   [Validators.required]
      // ],
      // eleSuperviseCode: [
      //   this.currentVaccineInfo['electronicSupervisionCode']
      // ],
      // facilityCode: [
      //   this.coldStorageFacilities[0].facilityCode,
      //   [Validators.required]
      // ],
      // count: [
      //   this.currentVaccineInfo['vaccinateCount'],
      //   [Validators.required, Validators.min(0)]
      // ],
      // breakType: [this.breakTypes[0].value, [Validators.required]],
      // reportTime: [new Date(), [Validators.required]],
      // memo: [null]
      // });
    }
    this.breakageVisible = !this.breakageVisible;
  }

  /**
   * 初始化报损表单的疫苗产品信息下拉框选项
   */
  initBreakageVaccineProductOptions(options?: any) {
    console.log('疫苗产品编码', options);
    this.breakageVaccineProductOptions = [];
    this.breakageVaccineProductOptions.push(options);
  }

  /**
   * 初始化报损表单的垫子监管码下拉框选项
   * @param options
   */
  initEleSuperviseCodeOptions(options?: any) {
    console.log('电子监管码编码', options);
    this.eleSuperviseCodes = [];
    this.eleSuperviseCodes.push({electronicSupervisionCode: options});
  }

  /**
   * 初始化报损表单的冷藏设备下拉框选项
   */
  initBreakageFacilityCodeOptions(options?: any) {
    // console.log('冷藏设备编码', options);
    this.breakageFacilityCodeOptions = [];
    this.breakageFacilityCodeOptions = [...options];
  }

  /**
   * 初始化报损表单的疫苗批号下拉框选项
   * @param options
   */
  initVaccineBatchOptions(options?: any) {
    console.log('疫苗批次号编码', options);
    this.vaccineBatches = [];
    this.vaccineBatches.push({batchNo: options});
  }

  /**
   * 查看队列中接种人信息
   */
  consultVaccinatePersonInfo(data, flag) {
    if (this.vaccinatingQueueData.length === 0) {
      this.vaccinationStatus = VACCINATE_STATUS.viewing;
      this.isCallNumberDisabled = flag;
      if (flag) {
        this.vaccinationStatus = VACCINATE_STATUS.finished;
      }
      this.currentQueueItem = data;
      this.queryPersonInfo(data, flag, 'view');
    } else {
      if (this.vaccinationStatus === VACCINATE_STATUS.vaccinating || this.vaccinationStatus === VACCINATE_STATUS.calling) {
        this.createMessage('warning', `${this.vaccinationStatus}不能查看其他接种人信息!`);
      }
    }
    this.scanInput = '';
  }

  /**
   * 查询受种人相关信息
   * @param data
   * @param flag
   * @param status
   */
  queryPersonInfo(data, flag, status?) {
    const profileCode = data.profileCode;
    const globalRecordNumber = data.globalRecordNumber;
    this.queryProfile(profileCode);
    this.queryHistoryVaccinateRecords(profileCode);
    if (flag && status) {
      this.queryCurrentVaccinateRecords(profileCode, globalRecordNumber, status);
    } else if (flag) {
      this.queryCurrentVaccinateRecords(profileCode, globalRecordNumber);
    } else if (!flag) {
      if (!this.isCheckSuccess) {
        this.showRegisterVaccinateRecord(globalRecordNumber);
      }
    }
  }

  /**
   * 查询登记接种信息
   * @param globalRecordNumber
   */
  showRegisterVaccinateRecord(globalRecordNumber: string) {
    this.showvaccinateOrRegister = false;
    this.eventListenerFlag = 'scanProfile';
    const params = {
      globalRecordNumber: globalRecordNumber,
      registPovCode: this.userInfo.pov,
      pageEntity: {
        page: 1,
        pageSize: 200
      }
    };
    this.registRecordService.queryRegistRecord(params, resp => {
      console.log(resp);
      this.registerVaccinateRecords = resp.data;
    });
  }

  /**
   * 加载疫苗产品信息
   */
  // loadVaccineProductInfo() {
  //   const params = {};
  //   this.vaccineProductService.queryVaccineProduct(params, resp => {
  //     if (!!resp.data) {
  //       this.vaccineProducts = resp.data;
  //     }
  //   });
  // }

  /**
   * 根据疫苗产品编码加载批号信息
   * @param productCode
   */
  // loadBatchInfoByProduct(productCode?: string) {
  //   if (this.breakageOptionFlag) {
  //     return;
  //   }
  //   const params = {
  //     vaccineProductCode: productCode
  //   };
  //   this.batchInfoService.queryBatchInfo(params, resp => {
  //     if (!!resp.data && resp.data.length > 0) {
  //       this.vaccineBatches = resp.data;
  //       this.breakageForm.controls['prodBatchCode'].setValue(
  //         resp.data[0].batchNo
  //       );
  //     } else {
  //       this.breakageForm.controls['prodBatchCode'].setValue(null);
  //       this.vaccineBatches = [];
  //     }
  //   });
  // }

  /**
   * 根据疫苗产品编码加载批号信息
   * @param productCode
   * eleSuperviseCodeService
   */
  // loadEleSuperviseCodeByBatchNo(batchNo?: string) {
  //   if (this.breakageOptionFlag) {
  //     return;
  //   }
  //   const params = {};
  //   if (batchNo) {
  //     params['batchNo'] = batchNo['batchNo'];
  //   }
  //   this.eleSuperviseCodeService.queryEleSuperviseCode(params, resp => {
  //     if (!!resp.data) {
  //       this.eleSuperviseCodes = resp.data;
  //     } else {
  //       this.eleSuperviseCodes = [];
  //     }
  //   });
  // }

  /**
   * 加载设备表信息
   */
  loadFacilityInfo() {
    if (!this.userInfo) return;
    const params = {
      belongPovCode: this.userInfo.pov,
      belongDepartmentCode: this.localSt.retrieve(this.curVaccinationRoom),
      facilityStatus: '0'
    };
    this.coldStorageFacilityService.queryColdStorageFacilityInfo(
      params,
      resp => {
        if (!!resp.data) {
          this.coldStorageFacilities = resp.data;
        } else {
          this.coldStorageFacilities = [];
        }
      }
    );
  }

  /**
   * 加载报损类型字典数据
   */
  // loadBreakType() {
  //   this.breakTypes = this.dicDataService.getDicDataByKey('breakType');
  // }

  /**
   * 加载接种部位字典数据
   */
  loadVaccinatePart() {
    this.vaccinateParts = this.dicDataService.getDicDataByKey('vaccinatePart');
  }

  /**
   * 加载多剂次疫苗剩余可用次数
   */
  loadManyDoseAvailable(batchNo: string) {
    this.manyDoseAvailables = [];
    const vaccineDoseData = this.vaccineDoseDatas.find(
      item => item.vaccineBatchNo === batchNo
    );
    if (!!vaccineDoseData) {
      const availableCount =
        vaccineDoseData.dosageByEach - vaccineDoseData.vaccinateDoseNumber;
      this.manyDoseAvailables = this.splitCount(
        vaccineDoseData.vaccinateDoseNumber,
        availableCount
      );
    } else {
      this.manyDoseAvailables.push(1);
    }
  }

  /**
   * 将数字转化为数组
   * @param vaccinateDoseNumber
   * @param availableCount
   * @returns {Array}
   */
  splitCount(vaccinateDoseNumber, availableCount): number[] {
    let availables = [];
    for (let i = 1; i <= availableCount; i++) {
      availables.push(vaccinateDoseNumber + i);
    }
    return availables;
  }

  /**
   * 关闭报损界面
   */
  breakageClose() {
    this.breakageVisible = !this.breakageVisible;
    this.breakageOptionFlag = false;
  }

  /**
   * 报损
   */
  breakage() {
    // if (this.breakageForm.invalid) {
    //   this.createMessage('warning', '表单填写不完整或有误，请检查');
    //   return;
    // }
    // console.log(this.breakageForm.controls['prodBatchCode'].value);
    // const reportTime = this.breakageForm.controls['reportTime'].value;
    // const params = {
    //   facilityCode: this.breakageForm.controls['facilityCode'].value,
    //   vaccProductCode: this.breakageForm.controls['vaccProductCode'].value,
    //   prodBatchCode: this.breakageForm.controls['prodBatchCode'].value,
    //   eleSuperviseCode: this.breakageForm.controls['eleSuperviseCode'].value,
    //   count: this.breakageForm.controls['count'].value,
    //   breakType: this.breakageForm.controls['breakType'].value,
    //   breakTime: DateUtils.getFormatDateTime(reportTime),
    //   memo: this.breakageForm.controls['memo'].value,
    //   povCode: this.userInfo.pov,
    //   departmentCode: this.userInfo.department,
    //   stockBy: this.userInfo.userCode
    // };
    // console.log(params);
    // this.stockService.breakage(params, resp => {
    //   if (resp.code !== 0) {
    //     this.createMessage('error', '报损失败，请重新报损');
    //   } else {
    //     this.createMessage('success', '报损成功！');
    //     this.queryVaccineDoseInfo();
    //   }
    // });
    // this.breakageClose();
  }

  /**
   * 多剂次人工报损
   */
  manyDoseOperationBreakage(data) {
    // this.breakageOptionFlag = true;
    console.log(data.vaccineBatchNo);
    // 初始化报损表单的批次号下拉框选项
    this.initVaccineBatchOptions(data.vaccineBatchNo);
    this.initEleSuperviseCodeOptions(data.electronicSupervisionCode);
    this.initBreakageVaccineProductOptions(data.vaccineProductCode);
    // this.breakageVaccineProductOptions.push(data.vaccineProductCode);
    this.initBreakageFacilityCodeOptions([this.coldStorageFacilities[0]]);
    // this.breakageFacilityCodeOptions.push(this.coldStorageFacilities[0].facilityCode);
    this.breakageObj = {
      vaccProductCode: data.vaccineProductCode, // 有
      prodBatchCode: data.vaccineBatchNo, // 有
      eleSuperviseCode: data.electronicSupervisionCode, // 有
      count: data.dosageByEach - data.vaccinateDoseNumber,
      facilityCode: this.coldStorageFacilities[0].facilityCode, // 有
      breakType: '2', // 有
      breakTime: DateUtils.getFormatDateTime(new Date()),
      memo: '人工报损',
      povCode: this.userInfo.pov,
      departmentCode: this.selectedDepartmentCode,
      stockBy: this.userInfo.userCode
    };
    this.breakageVisible = !this.breakageVisible;
  }

  /**
   * 倒计时完成，自动报损
   */
  onDoseFinished(event, manyDoseData) {
    if (event.action !== 'done') {
      return;
    }
    if (manyDoseData.disabled) {
      return;
    }
    if (this.coldStorageFacilities.length <= 0) {
      return;
    }
    if (manyDoseData.departmentCode !== this.selectedDepartmentCode) {
      return;
    }
    const contentText =
      manyDoseData.vaccineProductName + '疫苗报损时间已到，是否报损？';
    this.modalService.confirm({
      nzTitle: '<i>延时提示</i>',
      nzContent: '<b>' + contentText + '</b>',
      nzOkText: '多剂次疫苗报损',
      nzCancelText: '延迟2分钟',
      nzOnOk: () => this.doseVaccineBreakage(manyDoseData),
      nzOnCancel: () => this.delayDoseVaccineTime(manyDoseData)
    });
  }

  /**
   * 多剂次疫苗报损
   * @param manyDoseData
   */
  doseVaccineBreakage(manyDoseData) {
    const params = {
      facilityCode: this.coldStorageFacilities[0].facilityCode,
      vaccProductCode: manyDoseData.vaccineProductCode,
      prodBatchCode: manyDoseData.vaccineBatchNo,
      count: manyDoseData.dosageByEach - manyDoseData.vaccinateDoseNumber,
      breakType: '1',
      breakTime: DateUtils.getFormatDateTime(new Date()),
      memo: '自动报损',
      povCode: this.userInfo.pov,
      departmentCode: this.selectedDepartmentCode,
      stockBy: this.userInfo.userCode
    };
    this.stockService.breakage(params, resp => {
      if (resp.code !== 0) {
        // console.log(resp);
        this.createMessage('error', '自动报损失败，请手动报损');
      } else {
        this.createMessage('success', '自动报损成功！');
      }
      this.queryVaccineDoseInfo();
    });
  }

  /**
   * 延迟多剂次报损时间
   * @param manyDoseData
   */
  delayDoseVaccineTime(manyDoseData) {
    manyDoseData.effectiveTime += 120 * 1000;
  }

  /**
   * 接种完按成confirm
   * @param data
   */
  vaccinateFinishConfirm(data) {
    if (this.coldStorageFacilities.length === 0) {
      this.createMessage('warning', '冰箱设备获取失败!');
      return;
    }
    this.modalService.confirm({
      nzTitle: '<i>接种确认</i>',
      nzContent: '<b>' + '确认完成?' + '</b>',
      nzOkText: '确认',
      nzCancelText: '返回',
      nzOnOk: () => this.vaccinateFinish(data, '3')
    });
  }

  /**
   * 接种完成，完成以下操作
   * 1.更新接种记录表：接种状态、接种时间、
   * 2.调用库存接口，完成接种出库
   * 3.更新排队数据，如果为接种人最后一条接种记录，则更改状态为留观，否则更新状态为待接种
   */
  vaccinateFinish(data, vaccinateStatus) {
    // const id = data.id;
    const vaccinateTime = DateUtils.getFormatDateTime(new Date());
    // const currentVaccinateRecord = this.currentVaccinateRecords.find(item => item.id === id);
    const params = {
      vaccinateRecordId: data.id,
      globalRecordNumber: data.globalRecordNumber,
      registerRecordNumber: data.registerRecordNumber,
      vaccinateDoctorCode: this.userInfo.userCode,
      vaccinateDepartmentCode: this.selectedDepartmentCode,
      vaccinatePovCode: this.userInfo.pov,
      vaccinateTime: vaccinateTime,
      facilityCode: this.coldStorageFacilities[0].facilityCode,
      currentVaccinateRecordCount: this.currentVaccinateRecords.length,
      profileCode: this.currentQueueItem.profileCode,
      profileName: this.vaccinatingQueueData[0].profileName,
      vaccinateDoseNumber: data.vaccinateDoseNumber,
      vaccineProductCode: data.vaccineProductCode,
      vaccinateStatus: vaccinateStatus
    };
    if (data.vaccinateMemo) {
      params['vaccinateMemo'] = data.vaccinateMemo;
    }
    this.vaccinateService.vaccinateFinish(params, resp => {
      console.log('vaccinateFinish', resp);
      if (resp.code === 0) {
        const resultData = resp.data;
        const subclassCodes = resultData.subclassCodes;
        const resultCode = resultData.resultCode;
        if (resultCode === '0') {
          this.vaccinateFinished(subclassCodes);
          this.createMessage('success', '所有接种已完成，进入留观！');
          this.nextBtnStatus = false;
          this.isCallNumberDisabled = false;
          // 接种中是否核验成功
          this.isCheckSuccess = false;
          // 查询多剂次信息
          this.queryVaccineDoseInfo();
          this.eventListenerFlag = '';
          // this.initQueueList(this.selectedDepartmentCode);
        } else if (resultCode === '1') {
          this.createMessage('success', '请继续接种其他疫苗！');
          // this.vaccinateFinished(subclassCodes);
          this.queryCurrentVaccinateRecords(
            this.currentQueueItem.profileCode,
            data.globalRecordNumber
          );
          // 查询多剂次信息
          this.queryVaccineDoseInfo();
          // 查询历史接种信息
          this.queryHistoryVaccinateRecords(this.currentQueueItem.profileCode);
        } else if (resultCode === '2') {
          this.vaccinateFinished(subclassCodes);
          this.createMessage('success', '本部门接种已完成，请到其他部门继续接种！');
          this.nextBtnStatus = false;
          this.isCallNumberDisabled = false;
          // 接种中是否核验成功
          this.isCheckSuccess = false;
          // 查询多剂次信息
          this.queryVaccineDoseInfo();
          this.querySuccessData();
          // this.initQueueList(this.selectedDepartmentCode);
        } else if (resultCode === '3') {
          this.nextBtnStatus = false;
          this.isCallNumberDisabled = false;
          this.vaccinateUnqualified();
          this.createMessage('success', '已取消接种！');
          // 接种中是否核验成功
          this.isCheckSuccess = false;
          // 查询多剂次信息
          this.queryVaccineDoseInfo();
          this.querySuccessData();
          // this.initQueueList(this.selectedDepartmentCode);
        }
      } else if (resp.code === 10901601) {
        console.warn(resp.data);
      } else if (resp.code === 10901602) {
        this.createMessage('error', '接种记录更新失败，请重试！');
      } else if (resp.code === 10901603) {
        this.createMessage('error', '疫苗出库失败,请重试！');
      } else if (resp.code === 10901604) {
        this.createMessage('error', '留观数据插入失败,请重试！');
      } else if (resp.code === 10901604) {
        this.createMessage('error', '留观数据插入失败,请重试！');
      }
    });
  }

  /**
   * 更新接种记录
   */
  updateVaccinateRecord(id, modifyType, modifyData, func?: Function) {
    const paramsStr =
      '{"id": ' + id + ', "' + modifyType + '": "' + modifyData + '"}';
    const params = JSON.parse(paramsStr);
    this.vaccinateService.updateVaccinateRecord(params, resp => {
      if (resp.code === 0) {
        this.createMessage('success', '接种记录更新成功！');
        func(true);
        return;
      }
      func(false);
    });
  }

  /**
   * 初始化本次接种所需要的接种记录，如果不存在就插入
   * @param globalRecordNumber
   */
  initVaccinateRecord(globalRecordNumber: string) {
    this.scanInput = '';
    const params = {
      globalRecordNumber: globalRecordNumber,
      registerStatus: '1'
    };
    this.vaccinateService.initVaccinateRecord(params, resp => {
      if (resp.code === 0) {
        this.createMessage('success', '接种记录初始化成功!');
        // this.nextBtnStatus = true;
        this.queryPersonInfo(this.currentQueueItem, true);
      } else if (resp.code === 10901702) {
        console.warn('接种记录已存在,无需初始化！');
        this.nextBtnStatus = false;
        this.queryPersonInfo(this.currentQueueItem, true);
      } else if (resp.code === 10901703) {
        this.createMessage('warning', '登记记录不存在，请到登记台核验!');
        this.nextBtnStatus = false;
      } else if (resp.code === 10901798) {
        this.createMessage('error', '初始化接种记录失败，请重试!');
        this.nextBtnStatus = false;
      } else if (resp.code === 10901799) {
        this.createMessage('error', '初始化接种记录失败，请联系管理员!');
        this.nextBtnStatus = false;
      }
    });
  }

  /**
   * 核验登记接种人信息与扫描接种人信息，如果信息一致则进入下一步骤
   * 如果不一致则在队列中查询是否存在登记接种人，如果存在提医护人员是否插队
   * 如果队列中不存在接种队列中则提示受种人先进行预检登记
   */
  checkRegisterAndScanProfileInfo() {
    console.log('1111111111111111');
    if (this.scanInput === '') {
      this.createMessage('warning', '接种人信息扫描失败，请重新扫描！');
      return;
    }
    console.log('222222222222222');
    this.profileService.queryProfileByStrWithoutCount(
      this.scanInput,
      {pageNo: 1, pageSize: 1},
      resp => {
        if (resp.code === 0 && resp.data.length > 0) {
          const scanProfileCode = resp.data[0].profileCode;
          if (this.currentQueueItem && this.vaccinationStatus === VACCINATE_STATUS.calling) {
            let status = this.currentQueueItem.profileCode === scanProfileCode;
            if (status) {
              this.isCallNumberDisabled = true;
              // this.nextBtnStatus = true;
              this.vaccinationStatus = VACCINATE_STATUS.vaccinating;
              this.createMessage('success', '接种人信息核验成功！');
              this.initVaccinateRecord(this.currentQueueItem.globalRecordNumber);
            } else {
              this.createMessage('warning', '接种人信息核验失败，请确认接种人信息！');
              // 接种中是否核验成功
              this.isCheckSuccess = false;
              this.scanInput = '';
            }
          } else if (this.vaccinatingQueueData.length === 0) {
            const isExistQueue = this.checkIsExistQueue(scanProfileCode);
            if (isExistQueue) {
              this.consultVaccinatePersonInfo(isExistQueue, false);
            } else {
              this.queueUpConfirm();
              this.scanInput = '';
            }
          } else {
            let status = this.currentQueueItem.profileCode === scanProfileCode;
            if (status) {
              this.isCallNumberDisabled = true;
              // this.nextBtnStatus = true;
              this.vaccinationStatus = VACCINATE_STATUS.vaccinating;
              this.createMessage('success', '接种人信息核验成功！');
              this.initVaccinateRecord(
                this.currentQueueItem.globalRecordNumber
              );
            } else {
              this.createMessage(
                'warning',
                '接种人信息核验失败，请确认接种人信息！'
              );
              // 接种中是否核验成功
              this.isCheckSuccess = false;
              this.scanInput = '';
            }
          }
        } else {
          this.createMessage(
            'warning',
            '接种人信息核验失败，请确认接种人信息！'
          );
          // 接种中是否核验成功
          this.isCheckSuccess = false;
          this.scanInput = '';
        }
      }
    );
  }

  /**
   * 核验登记接种疫苗信息与扫描疫苗信息，如果信息一致则进入下一步骤
   * 如果不一致则提示医生疫苗扫描失败，请确认选择疫苗
   *
   */
  checkRegisterAndScanVaccineInfo() {
    if (this.scanInput === '') {
      this.createMessage('warning', '疫苗扫描失败，请重新扫描!');
      return;
    }
    this.eleSuperviseCodeService.checkCode(this.scanInput, findBatchNoResp => {
      if (findBatchNoResp.code === 0) {
        const batchNo = findBatchNoResp.data;
        const currentVaccinateRecord = this.currentVaccinateRecords.find(
          item => item.vaccineBatchNo === batchNo
        );
        if (
          currentVaccinateRecord === null ||
          currentVaccinateRecord === undefined ||
          currentVaccinateRecord.edit === false
        ) {
          this.createMessage(
            'warning',
            '没有与该疫苗匹配的接种记录，请确认所选择疫苗!'
          );
          this.scanInput = '';
          return;
        }
        if (currentVaccinateRecord.vaccinateStatus === '3') {
          this.createMessage(
            'warning',
            '该疫苗已完成接种，请确认选择疫苗是否正确!'
          );
          this.scanInput = '';
          return;
        }
        if (currentVaccinateRecord) {
          this.currentVaccineInfo['vaccineProductCode'] =
            currentVaccinateRecord.vaccineProductCode;
          this.currentVaccineInfo['vaccineBatchNo'] =
            currentVaccinateRecord.vaccineBatchNo;
          this.currentVaccineInfo['electronicSupervisionCode'] = this.scanInput;
          this.currentVaccineInfo['vaccinateCount'] =
            currentVaccinateRecord.vaccinateCount;
          this.vaccineBatches.push(this.currentVaccineInfo['vaccineBatchNo']);
          this.eleSuperviseCodes.push(this.currentVaccineInfo['electronicSupervisionCode']);
          const addVaccinateElcParam = {
            globalRecordNumber: currentVaccinateRecord.globalRecordNumber,
            registerRecordNumber: currentVaccinateRecord.registerRecordNumber,
            vaccineBatchNo: batchNo,
            electronicSupervisionCode: this.scanInput
          };
          this.vaccinateService.addVaccRecordElcSupervision(
            addVaccinateElcParam,
            addVaccinateElcResp => {
              const result = addVaccinateElcResp.data;
              if (result === 1) {
                this.queryCurrentVaccinateRecords(
                  this.currentQueueItem.profileCode,
                  this.currentQueueItem.globalRecordNumber
                );
                this.createMessage('success', '疫苗信息核验成功!');
                this.eventListenerFlag = '';
              } else {
                this.createMessage('warning', '请继续核验下一支疫苗!');
              }
              this.scanInput = '';
            }
          );
        } else {
          this.scanInput = '';
          this.currentVaccineInfo = {};
          this.createMessage(
            'warning',
            '没有与该疫苗匹配的接种记录，请确认所选择疫苗!'
          );
        }
      } else {
        this.scanInput = '';
        this.createMessage('warning', '电子监管码校验不成功,请确认所选择疫苗!');
      }
    });
  }

  /**
   * 检查扫描到的接种人是否存在队列中
   * @param scanProfileCode
   * @returns {boolean}
   */
  checkIsExistQueue(scanProfileCode: string): any {
    let resultData = null;
    this.waitQueueData.forEach(data => {
      const profileCode = data.profileCode;
      if (scanProfileCode === profileCode) {
        resultData = data;
        return;
      }
    });
    this.passQueueData.forEach(data => {
      const profileCode = data.profileCode;
      if (scanProfileCode === profileCode) {
        resultData = data;
        return;
      }
    });
    return resultData;
  }

  /**
   * 排队提示，登记人信息不存在队列中，请先进行登记排队
   */
  queueUpConfirm(): void {
    this.modalService.warning({
      nzTitle: '<i>排队提示</i>',
      nzContent: '<b>接种人未登记接种信息，请先进行登记！</b>'
    });
  }

  /**
   * 打开接种记录备注Dialog
   */
  vaccinateMemo(data) {
    const id = data.id;
    const currentVaccinateRecord = this.currentVaccinateRecords.find(
      item => item.id === id
    );
    this.nbDialogService
      .open(VaccinateMemoDialogComponent, {
        context: {
          currentVaccinateRecord: currentVaccinateRecord,
          userCode: this.userInfo.department
        }
      })
      .onClose.subscribe(result => {
      if (result) {
        data.vaccinateMemo = result.memo;
        if (result.status === '99') {
          this.vaccinateFinish(data, result.status);
        }
      }
    });
  }

  /**
   * 查询疫苗的多剂次信息
   */
  queryVaccineDoseInfo() {
    if (!this.userInfo) return;
    const params = {
      vaccinatePovCode: this.userInfo.pov,
      vaccinateDepartmentCode: this.userInfo.department
    };
    this.vaccinateService.queryVaccineDoseInfo(params, resp => {
      if (resp.code === 0 && resp.data.length > 0) {
        this.vaccineDoseDatas = resp.data;
      } else {
        this.vaccineDoseDatas = [];
      }
    });
  }

  /**
   * 清除当前叫号信息
   */
  clearCurrentInfo() {
    this.scanInput = '';
    this.eventListenerFlag = 'scanProfile';
    this.currentVaccinateRecords = [];
    this.registerVaccinateRecords = [];
    this.vaccinateRecords = [];
    this.currentQueueItem = null;
    this.vaccinationStatus = '';
    this.resetBasicInfo();
    // this.baseInfoForm = this.fb.group({
    //   name: null,
    //   gender: null,
    //   immunityVacCard: null,
    //   birthDate: null,
    //   idCardNo: null
    // });
    // this.guardians = '';
  }

  /**
   * 查询已完成接种
   */
  querySuccessData() {
    if (!this.userInfo) return;
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const todayStart = new Date(year, month, day, 0, 0, 0);
    const todayEnd = new Date(year, month, day, 23, 59, 59);
    const params = {
      curStatus: '8',
      povCode: this.userInfo.pov,
      curRoom: this.selectedDepartmentCode,
      createDate: {
        start: DateUtils.getFormatDateTime(todayStart),
        end: DateUtils.formatEndDate(todayEnd)
      },
      pageEntity: {page: 1, pageSize: 999, sortBy: ['createDate,DESC']}
    };
    this.regQueueService.regQueueStatusChangeRecord(params, resp => {
      this.successQueueData = resp.data;
    });
  }

  waitQueueLength() {
    if (this.waitQueueData) {
      return this.waitQueueData.length;
    }
    return 0;
  }

  passQueueLength() {
    if (this.passQueueData) {
      return this.passQueueData.length;
    }
    return 0;
  }

  successQueueLength() {
    if (this.successQueueData) {
      return this.successQueueData.length;
    }
    return 0;
  }

  /**
   * 消息提示
   * @param type
   * @param message
   */
  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  /**
   * 根据接种状态判断该记录是否被禁用属性
   * @param currentVaccinateRecords
   */
  addDisabledForVaccinateRecord() {
    if (!this.isCheckSuccess) {
      this.currentVaccinateRecords.forEach(item => {
        // 当接种状态为 '已完成' 和 '取消接种' 接种记录不可修改
        if (item.vaccinateStatus === '3' || item.vaccinateStatus === '99') {
          item.edit = false;
          item.cancelBtnStatus = true;
          item.finishBtnStatus = true;
        } else if (item.vaccinateStatus === '1') {
          // 如果状态为1 表示疫苗核验已经通过
          item.edit = true;
          item.finishBtnStatus = false;
          item.cancelBtnStatus = false;
          this.computerVaccinateDoseNumber(item);
        } else if (item.vaccinateStatus === '0' && !this.checkVaccineFlag) {
          // 如果状态为0 并且checkVaccineFlag为false 表示关闭疫苗核验 则完成按钮不被禁用
          // 并且核验该疫苗是否为本部门可接种疫苗
          const vaccineSubclassCode = this.vaccineList.find(
            vaccineListItem => vaccineListItem === item.subclassCode
          );
          if (vaccineSubclassCode) {
            item.edit = true;
            item.finishBtnStatus = false;
            item.cancelBtnStatus = false;
            this.computerVaccinateDoseNumber(item);
          } else {
            item.edit = false;
            item.finishBtnStatus = true;
            item.cancelBtnStatus = true;
          }
        } else {
          item.edit = true;
          item.cancelBtnStatus = false;
          item.finishBtnStatus = true;
          this.computerVaccinateDoseNumber(item);
        }
        this.loadManyDoseAvailable(item.vaccineBatchNo);
      });
    }
    // 接种中是否核验成功
    // this.isCheckSuccess = true;
  }

  /**
   * 计算疫苗多剂次数量
   * @param item
   */
  computerVaccinateDoseNumber(data) {
    const vaccineDoseData = this.vaccineDoseDatas.find(
      item =>
        item.vaccineBatchNo === data.vaccineBatchNo &&
        item.departmentCode === this.userInfo.department
    );
    if (vaccineDoseData) {
      data.vaccinateDoseNumber = vaccineDoseData.vaccinateDoseNumber + 1;
    } else {
      data.vaccinateDoseNumber = 1;
    }
  }

  /**
   * 展示接种记录
   */
  showVaccinateLog() {
    this.router.navigate(['/modules/vaccinate/vaccinate-log']);
  }

  /**
   * 初始化待叫号队列和已叫号队列
   */
  initQueueList(event) {
    if (this.departmentOption.length > 0) {
      this.selectedDepartmentName = this.departmentOption.find(option => option.departmentCode === event).departmentName;
    }
    this.iotTopic = this.iotInitSvc.getIotTopicByDepartmentCode(event);
    // 将选择的 科室 保存至 LocalStorage
    this.localSt.store(this.curVaccinationRoom, event);
    // const vaccinateWaitMonitorTopic = this.vaccinateWaitTopic + '_' + event;
    const vaccinateWaitMonitorTopic = this.vaccinateWaitTopic;
    const vaccinateWaitMonitorTopicWithDepartmentCode = this.vaccinateWaitTopic + '_' + event;
    const vaccinateCalledMonitorTopicShared =
      this.vaccinateCalledTopicShared + '_' + event;
    const vaccinateCalledMonitorTopic = this.vaccinateCalledTopic + '_' + event;

    const tenant = this.userInfo.pov,
      pov = this.userInfo.pov;

    const waitUrl =
      this.pulsarUrl +
      tenant +
      '/' +
      this.pulsarNs +
      '/' +
      vaccinateWaitMonitorTopicWithDepartmentCode +
      '?messageId=latest';
    const calledUrl =
      this.pulsarUrl +
      tenant +
      '/' +
      this.pulsarNs +
      '/' +
      vaccinateCalledMonitorTopic +
      '?messageId=latest';
    // const waitUrl = this.pulsarUrl + tenant + '/' + this.pulsarNs + '/' + vaccinateWaitMonitorTopic + '/' + event + '?subscriptionType=Exclusive';
    // const calledUrl = this.pulsarUrl + tenant + '/' + this.pulsarNs + '/' + vaccinateCalledMonitorTopic + '/' + event + '?subscriptionType=Exclusive';
    this.querySuccessData();
    if (this.waitingWs.connectSuccess) {
      this.waitingWs.onClose();
    }
    this.waitingWs.connect(waitUrl);

    if (this.calledWs.connectSuccess) {
      this.vaccinatingReceivedCount = 0;
      this.calledWs.onClose();
    }
    this.calledWs.connect(calledUrl);

    this.getWebsocketMessage();
    this.eventListenerFlag = 'scanProfile';

    this.waitingWs.isOpen().subscribe(ev => {
      setTimeout(_ => {
        this.initTopic(this.vaccinateWaitTopicShared, vaccinateWaitMonitorTopic);
      }, 1000);
    });
    this.calledWs.isOpen().subscribe(ev => {
      setTimeout(_ => {
        this.initTopic(vaccinateCalledMonitorTopicShared, vaccinateCalledMonitorTopic);
      }, 1000);
    });
  }

  /**
   * 获取科室选项
   */
  getDepartmentOption() {
    if (!this.userInfo) return;
    this.departmentOption = this.departmentInitSvc.getDepartmentData('1');
    const temp = this.localSt.retrieve(this.curVaccinationRoom);
    const isCorrect = this.departmentOption.some(department => department.departmentCode === temp);
    if (isCorrect) {
      this.selectedDepartmentCode = temp;
      this.initQueueList(temp);
      this.loadVaccineListByDept();
      this.loadFacilityInfo();
      this.querySuccessData();
    } else {
      this.nbDialogService.open(DialogDepartmentComponent, {
        context: {
          departmentOption: this.departmentOption,
        },
        closeOnBackdropClick: false,
        closeOnEsc: false
      }).onClose.subscribe(result => {
        if (result !== '') {
          this.selectedDepartmentCode = result;
          this.initQueueList(this.selectedDepartmentCode);
        }
      });
    }
  }

  getObservableIotDepartment() {
    let observableTopics = this.departmentInitSvc.getDepartmentData('6');
    if (observableTopics.length > 0) {
      this.iotObservableTopic = this.iotInitSvc.getIotTopicByDepartmentCode(observableTopics[0].departmentCode);
    } else {
      this.iotObservableTopic = null;
    }
    console.log('this.iotObservableTopic', this.iotObservableTopic);
  }

  /**
   * 从 websocket 连接中获取数据
   */
  getWebsocketMessage() {
    this.waitingSubscription.forEach(sub => sub.unsubscribe());
    this.calledSubscription.forEach(sub => sub.unsubscribe());
    // 排队中队列
    const waitingSub = this.waitingWs.getMessage().subscribe(message => {
      if (!message.error) {
        const data = JSON.parse(message.data);
        const properties = data.properties;
        if (properties.hasOwnProperty('msg')) {
          const wd = JSON.parse(properties.msg);
          this.waitQueueData = wd.filter(msg => !msg.hasOwnProperty('passCount') || Number(msg.passCount).valueOf() === 0);
          // console.log('待叫号队列获取到的消息', this.waitQueueData);
          if (this.waitQueueData.length > 0) {
            this.nextQueueItem = this.initQueueData(this.waitQueueData[0]);
          }
          this.passQueueData = wd.filter(msg => msg.hasOwnProperty('passCount') && Number(msg.passCount).valueOf() > 0);
          // console.log('已过号队列获取到的消息', this.passQueueData);
        }
      }
    });
    this.waitingSubscription.push(waitingSub);
    // 接种中队列
    const calledSub = this.calledWs.getMessage().subscribe(message => {
      if (message && !message.error) {
        this.vaccinatingReceivedCount += 1;
        const data = JSON.parse(message.data);
        const properties = data.properties;
        if (properties.hasOwnProperty('msg')) {
          this.vaccinatingQueueData = JSON.parse(properties.msg);
          if (this.vaccinatingQueueData.length > 0) {
            this.currentQueueItem = this.vaccinatingQueueData[0];
            this.vaccinateService.queryVaccinateRecordSingleCount(
              {globalRecordNumber: this.currentQueueItem.globalRecordNumber},
              countResp => {
                if (countResp.code === 0 && countResp.data[0].count > 0) {
                  this.isCallNumberDisabled = true;
                  // this.nextBtnStatus = true;
                  this.vaccinationStatus = VACCINATE_STATUS.vaccinating;
                  this.currentQueueItem = this.initQueueData(this.currentQueueItem);
                  this.queryPersonInfo(this.currentQueueItem, false);
                  this.createMessage('warning', '请重新核验接种人信息！');
                } else {
                  this.vaccinationStatus = VACCINATE_STATUS.calling;
                  this.currentQueueItem = this.initQueueData(this.currentQueueItem);
                  this.queryPersonInfo(this.currentQueueItem, false);
                  this.createMessage('warning', '请核验接种人信息！');
                  // console.log(1111111111111111111)
                }
                this.scanInput = '';
                this.eventListenerFlag = 'scanProfile';
              }
            );
          } else {
            this.clearCurrentInfo();
          }
        }
      }
    });
    this.calledSubscription.push(calledSub);
  }

  /**
   * 接种完成
   */
  vaccinateFinished(subclassCodes) {
    this.currentQueueItem['calledMessageId'] = this.vaccinatingQueueData[0][
      'messageId'
      ];
    // 模拟接种完成，打完一针疫苗，向finishedVaccineList添加一条
    this.currentQueueItem['finishedVaccineList'] = subclassCodes;
    this.currentQueueItem = this.initQueueData(this.currentQueueItem);
    if (this.iotObservableTopic) {
      this.currentQueueItem.iotTopic = this.iotObservableTopic;
    }
    this.queueApiSvc.vaccinateFinished(this.currentQueueItem, resp => {
      if (resp.hasOwnProperty('code') && resp.code === 0) {
        this.querySuccessData();
        this.vaccinationStatus = VACCINATE_STATUS.finished;
        this.clearCurrentInfo();
      }
    });
  }

  vaccinateUnqualified() {
    this.currentQueueItem = this.initQueueData(this.currentQueueItem);
    if (this.iotObservableTopic) {
      this.currentQueueItem.iotTopic = this.iotObservableTopic;
    }
    this.queueApiSvc.vaccinateUnqualified(this.currentQueueItem, resp => {
      if (resp.hasOwnProperty('code') && resp.code === 0) {
        this.querySuccessData();
        this.vaccinationStatus = VACCINATE_STATUS.finished;
        this.clearCurrentInfo();
      }
    });
  }

  /**
   * 叫下一号
   * @param queueItem
   */
  callNextNumber(queueItem, event) {
    this.nextBtnStatus = true;
    this.showvaccinateOrRegister = true;
    // 接种中是否核验成功
    this.isCheckSuccess = false;
    // 排号信息里添加 当前科室编码
    queueItem = this.initQueueData(queueItem);
    // 叫下一号
    this.queueApiSvc.vaccineCallNextNumber(queueItem, resp => {
      // code === 0 说明叫号成功
      if (resp.hasOwnProperty('code') && resp.code === 0) {
        this.isCallNumberDisabled = false;
        if (this.waitQueueData.length > 0) {
          this.createMessage('success', '叫号成功');
        }
        // this.currentQueueItem = resp.data;
        // this.initQueueData(this.currentQueueItem);
        // this.vaccinationStatus = VACCINATE_STATUS.calling;
        // this.queryPersonInfo(this.currentQueueItem, false);
      }
    });

    const numbers = interval(1000);
    const takeFourNumbers = numbers.pipe(take(4));
    takeFourNumbers.subscribe(
      (x: number) => {
        event.srcElement.innerHTML = '叫号中(' + (3 - x) + ')s';
      },
      error => {
      },
      () => {
        event.srcElement.innerHTML = '下一号';
        this.nextBtnStatus = false;
        this.eventListenerFlag = 'scanProfile';
      }
    );
  }

  /**
   * 获取状态，叫号中、接种中、接种完成、查看中
   */
  getStatus() {
    return this.vaccinationStatus === '' ? '' : `(${this.vaccinationStatus})`;
  }

  /**
   * 初始化排号信息
   * @param queueItem
   */
  initQueueData(queueItem: any) {
    if (!!!queueItem) {
      queueItem = {};
    }
    queueItem['povCode'] = this.userInfo.pov;
    queueItem['nameSpace'] = this.pulsarNs;
    queueItem['departmentCode'] = this.selectedDepartmentCode;
    queueItem['curRoomName'] = this.selectedDepartmentName;
    queueItem['curDoc'] = this.userInfo.userCode;
    queueItem['curRoom'] = this.selectedDepartmentCode;
    // 添加队列数据属性
    queueItem['queueRoomType'] = QUEUE_ROOM_TYPE.vaccinate;
    // 日期格式转换
    queueItem['createDate'] = DateUtils.getFormatDateTime(
      queueItem['createDate']
    );
    // 日期格式转换
    queueItem['actionTime'] = DateUtils.getFormatDateTime(
      queueItem['actionTime']
    );
    queueItem['vaccinateWaitTopicShared'] = this.vaccinateWaitTopicShared;
    queueItem['vaccinateWaitTopic'] = this.vaccinateWaitTopic;
    queueItem['vaccinateCalledTopicShared'] = this.vaccinateCalledTopicShared;
    queueItem['vaccinateCalledTopic'] = this.vaccinateCalledTopic;
    queueItem['iotTopic'] = this.iotTopic;
    return queueItem;
  }

  /**
   * 疫苗核验开关
   */
  checkVaccineFlagStatus() {
    if (this.currentQueueItem) {
      this.queryCurrentVaccinateRecords(
        this.currentQueueItem.profileCode,
        this.currentQueueItem.globalRecordNumber
      );
    }
  }

  /**
   * 当报损成功之后，刷新多剂次信息
   */
  breakageSuccess() {
    this.queryVaccineDoseInfo();
    this.breakageVisible = false;
  }

  initTopic(shared, monitor) {
    this.queueApiSvc.initQueueList(
      this.userInfo.pov,
      this.pulsarNs,
      shared,
      monitor,
      resp => {
        // console.log(resp);
      }
    );
  }
}

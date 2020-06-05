import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ConfigService } from '@ngx-config/core';
import {
  QueueApiService,
  DicDataService,
  VaccBroadHeadingDataService,
  ProfileDataService,
  RegistRecordService,
  RegQueueService,
  VaccineAgreementModelService,
  QueueListService,
  VaccinateRecordsDataService,
  SysConfInitService,
  CommonUtils,
  DateUtils,
  REG_QUEUE_STATUS,
  REG_QUEUE_ACTION, SysConfKey, StockService, MASTER_URLS, JoyusingSignpadService, VaccineSubclassInitService
} from '@tod/svs-common-lib';
import { WINDOW } from '@delon/theme';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'add-to-vaccinate-queue-custom',
  templateUrl: './regist-record.component.html',
  styleUrls: ['./regist-record.component.scss'],
  providers: [JoyusingSignpadService, QueueApiService]
})

/**
 * 自定义排号组件 - 用于弹框展现内容
 */
export class RegistRecordComponent implements OnInit, OnDestroy {
  private readonly signPadKey = 'signPad';

  private readonly pulsarJsonKey = 'pulsar';

  // 档案信息
  profile: any;

  // 是否是自定义排号
  isCustomRegist = false;

  // 证件类型
  idCardType = '1';
  // 疫苗类型 - 疫苗大类
  vacBroadHeading: string;
  vacBroadHeadingOptions = [];
  // 疫苗类型 - 疫苗小类
  vaccineSubclassCode: string;
  vacSubclassOptions = [];
  // 接种类型
  // vaccineType: string;
  vaccineTypeOptions = [];
  // 接种部位
  vaccinatePartOptions = [];

  // 用户信息
  userInfo: any;
  // 接种支数选项
  vaccinateCountOptions = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20
  ];
  // 接种针次选项
  vaccinateInjectNumberOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // 是否需要签字的判断条件, true - 强制签字， false - 不需要签字
  isSignAvailable = false;
  private readonly isSignAvailableKey = 'signRequired';
  // 下拉框选项中需要展示的疫苗大类编码
  broadHeadingCodeArr = [
    '01',
    '02',
    '03',
    '04',
    '06',
    '22',
    '23',
    '28',
    '49',
    '53',
    '54',
    '55',
    '19',
    '25',
    '17'
  ];

  /**
   * 该数据为已选择的排号疫苗数据，如果数据是传入外部传入，则为 排号
   * 如果数据为在这个组件页面中自行添加的，则为 自定义排号
   */
  @Input()
  reservationVac = [];
  vacProductListData = [];
  // 用于进行组合展示数据的订阅
  private vacProductListData$ = new BehaviorSubject<any>(null);

  // 是否签字
  signSuccess = false;
  signPic = '';
  // 签字类型
  signType: any;
  /**
   * 用于展示的签字信息
   */
  signName = '';

  // 告知书内容访问页面 - 静态页面
  agreementUrl: string;
  // 汉王告知书下载地址
  hanWangAreeementUrl: string;
  // 待存储到登记记录的数据
  vacToBeSaved = [];
  // websocket 访问地址
  websocketUrl: string;

  // 订阅集合
  private subscription: Subscription[] = [];
  // 当前叫号信息
  callingData: any;
  // registPassTopicShared 登记台已叫号公共队列
  registPassTopicShared: string;
  // 登记台已叫号监听队列
  registPassTopic: string;

  // pulsar 配置信息
  pulsarJson: any;
  // 收银台共享队列
  payWaitTopicShared: string;
  // 收银台订阅队列
  payWaitTopic: string;
  // 接种台共享待接种队列
  vaccinateWaitTopicShared: string;
  // 接种台订阅队列
  vaccinateWaitTopic: string;
  // 叫号延迟时间
  queueCallDelay: any;
  private readonly queueCallDelayKey = 'queueDelay';

  private registStrategyInjectCount = 0;

  lastActionTime: number = 0;
  /**
   * 无有效期
   */
  noLoseEfficacyDate = new Date(2099, 11, 31).getTime();
  /**
   * 登记 loading
   */
  loading = false;
  /**
   * 当前访问地址的域名
   */
  hostname: string;

  /**
   * 签字板异常
   */
  signError = false;
  /**
   * 是否需要收银台，0 - 不需要收银台， 1 - 需要收银台，如果不需要收银台，则付费订单状态会修改为 - 4 - 无需付款
   */
  needPay = '1';

  constructor(
    protected ref: NbDialogRef<RegistRecordComponent>,
    private dicSvc: DicDataService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private msg: NzMessageService,
    private vacProductSvc: StockService,
    private userSvc: UserService,
    private profileDataSvc: ProfileDataService,
    private dialogSvc: NbDialogService,
    private registSvc: RegistRecordService,
    private regQueueSvc: RegQueueService,
    private aggrementSvc: VaccineAgreementModelService,
    private callingNumberSvc: QueueListService,
    private queueApiSvc: QueueApiService,
    private configService: ConfigService,
    private vaccinateRecordSvc: VaccinateRecordsDataService,
    private ws: JoyusingSignpadService,
    private sysConfSvc: SysConfInitService,
    @Inject(WINDOW) private window: Window,
    private notifier: NotifierService,
    private subclassSvc: VaccineSubclassInitService
  ) {
    this.initSysConf();
    const signPadJson = this.configService.getSettings(this.signPadKey);
    this.agreementUrl = MASTER_URLS.downloadVaccineAgreementPdf;
    this.hanWangAreeementUrl = signPadJson.signatureUrl;
    if (this.signType === '0') {
      this.websocketUrl = signPadJson.wsUrl;
    } else {
      this.websocketUrl = signPadJson.hanwangUrl;
    }
    this.pulsarJson = this.configService.getSettings(this.pulsarJsonKey);
    this.userSvc.getUserInfoByType().subscribe(user => (this.userInfo = user));
    this.profileDataSvc.getProfileData().subscribe(profile => {
      if (profile) {
        this.profile = profile;
        // console.log('疫苗登记得到的档案信息', this.profile);
      }
    });
    this.payWaitTopicShared = this.pulsarJson.payWaitTopicShared;
    this.payWaitTopic = this.pulsarJson.payWaitTopic;
    this.vaccinateWaitTopicShared = this.pulsarJson.vaccinateWaitTopicShared;
    this.vaccinateWaitTopic = this.pulsarJson.vaccinateWaitTopic;
    this.registPassTopic = this.pulsarJson['registPassTopic'];
    this.registPassTopicShared = this.pulsarJson['registPassTopicShared'];
    const location = window.location;
    console.log(location);
    this.hostname = location.hostname;
  }

  ngOnInit() {
    this.vaccineTypeOptions = this.dicSvc.getDicDataByKey('vaccinateType');
    this.vacBroadHeadingOptions = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    this.vacSubclassOptions = this.subclassSvc.getVaccineSubClassData();
    this.vacBroadHeading = this.vacBroadHeadingOptions[0]['broadHeadingCode'];
    this.vaccinatePartOptions = this.dicSvc.getDicDataByKey('vaccinatePart');
    this.isCustomRegist = this.reservationVac.length === 0;
    this.loadSelectedVacData();
    // 如果签字设置为 true，则连接签字板，否则不连接
    if (this.isSignAvailable) {
      this.ws.connect(this.websocketUrl);
      const sub = this.ws.getMessage().subscribe(message => {
        console.log(message);
        if (this.signType === '0') {
          // 捷宇星签字
          if (message === 'error') {
            this.signError = true;
            return;
          }
          // 修改签字信息在任意位置问题 -- 前
          /*if (message) {
            console.log('签字回调====', message);
            this.signError = false;
            const signature = JSON.parse(message.SignNameBase64);
            if (signature.hasOwnProperty('SignName0')) {
              const signName0 = signature['SignName0'] + '';
              const indx = signName0.lastIndexOf(';');
              this.signPic = signName0.substr(0, indx);
              this.signName = 'data:image/png;base64,' + this.signPic;
              this.signSuccess = true;
              // console.log(this.signPic);
            }
          }*/
          // 修改签字位置问题 -- 后
          if (message) {
            console.log('签字回调====', message);
            this.signError = false;
            if (message.hasOwnProperty('SignNameBase64')) {
              this.signPic = message.SignNameBase64;
              this.signName = 'data:image/png;base64,' + this.signPic;
              this.signSuccess = true;
            }
          }
        } else {
          // 汉王签字
          if (message && message['error']) {
            this.msg.error('签字板签字失败，请重新签字');
          }
          if (message && !message.hasOwnProperty('error')) {
            console.log('汉王message====', message);
            let signature: string = message.data;
            console.log('汉王signature====', signature);
            const reg = new RegExp(/\'/g);
            let sign = signature.replace(reg, '"');
            const signatureJson = JSON.parse(sign);
            console.log('汉王signatureJson====', signatureJson);
            this.signPic = signatureJson['signatureData'];
            console.log('签字图片编码', this.signPic);
            this.signName = 'data:image/png;base64,' + this.signPic;
            this.signSuccess = true;
          }
        }
      });
      this.subscription.push(sub);
    }
    const sub3 = this.callingNumberSvc.getCallingNumber().subscribe(num => {
      this.callingData = num;
    });
    this.subscription.push(sub3);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
    this.ws.closeSocket();
  }

  /**
   * 初始化系统配置项
   */
  initSysConf() {
    // 获取系统配置的签字类型  0 - 捷宇星  1 - 汉王
    this.signType = this.sysConfSvc.getConfValue(SysConfKey.signType);
    // 是否强制签字， 签字 - 1，不签字 - 0
    this.isSignAvailable = this.sysConfSvc.getConfValue(SysConfKey.signRequired) === '1';
    this.queueCallDelay = this.sysConfSvc.getConfValue(this.queueCallDelayKey);
    this.needPay = this.sysConfSvc.getConfValue(SysConfKey.needPay);
  }

  /**
   * 添加接种疫苗列表，用于自定义排号操作

   checked: true
   loading: false
   memo: ""
   price: [0]
   stock: 64
   supposeInjectionDate: Wed Sep 18 2019 15:43:12 GMT+0800 (中国标准时间) {}
   vacBroadHeadingCode: "01"
   vacBroadHeadingName: "卡介苗"
   vaccinateInjectNumber: 1
   vaccinatePart: "0"
   vaccineList:
   [
   checked: true
   count: 184 库存
   dataSourceType: "0" 数据来源，默认为0 - 登记台生成
   globalRecordNumber: "b0fbc4624164400296eab18d088d64be"
   profileCode: "505f1f27f34b46e2b5854fa4e941bc2d"
   registDoctorCode: "54831456447"
   registPovCode: "3406040802"
   registStatus: "1"
   vaccinateCount: 1 接种总针数，比如总共需要打乙肝2针
   vaccinateInjectNumber: 1 接种针序，比如乙肝的第2针
   vaccinatePart: "0" 接种部位
   vaccinateType: "0" 接种类型，比如常规接种、群体接种
   vaccineBatchNo: undefined 疫苗批号
   vaccineBroadHeadingCode: "01" 大类编码
   vaccineManufactureCode: undefined
   vaccineManufactureName: undefined
   vaccinePrice: "40.78"
   vaccineType: "1"
   validLabel: ""
   validTime: ""
   ],
   vaccineType: "0"

   自定义排号
   */
  loadVacData() {
    console.log('预约疫苗数据初始化数据为：', this.reservationVac);
    const queryParam = [];
    for (let i = 0; i < this.reservationVac.length; i++) {
      let vac = this.reservationVac[i];
      let o = {
        povCode: this.userInfo.pov,
        vaccineSubclassCode: vac['vaccineSubclassCode']
      };
      queryParam.push(o);
    }
    // 根据疫苗大类编码查询疫苗产品和疫苗批号
    this.queryVacProductStockAndPriceAndBatchNoByVacProductCodeByArr(
      queryParam,
      vacProductsArr => {
        for (let i = 0; i < this.reservationVac.length; i++) {
          let vac = this.reservationVac[i];
          // const manufacturerCode = vac['manufacturerCode'];
          const vacBroadHeadingCode = vac['vacBroadHeadingCode'];
          vac['vaccinateInjectNumber'] = 1;
          vac['vaccineType'] = '0';
          vac['vaccinatePart'] = this.vaccinatePartOptions[i].value;
          // 根据产品编码从查询结果中过滤出相同产品编码的疫苗产品，并将该疫苗产品加入到 reservationVac 的 vaccineList 中
          // 对过滤出来的疫苗产品数组进行遍历
          const filterVacArr = this.findVaccineByBroadHeadingCode(
            vacBroadHeadingCode,
            vacProductsArr
          );
          // 根据 vacProductListData 是否有值 来给 vaccineList 赋值
          if (this.vacProductListData.length > 0) {
            if (i === this.reservationVac.length - 1) {
              vac['vaccineList'] = this.setDisplayData(filterVacArr, vac);
            } else {
              vac['vaccineList'] = this.vacProductListData[i]['vaccineList'];
            }
          } else {
            vac['vaccineList'] = this.setDisplayData(filterVacArr, vac);
          }
        }
        this.vacProductListData = this.reservationVac;
      }
    );
  }

  /**
   *
   需要的数据格式是这样的：
   memo: ""
   stock: 64
   supposeInjectionDate: Wed Sep 18 2019 15:43:12 GMT+0800 (中国标准时间) {}
   vacBroadHeadingCode: "01"
   vacBroadHeadingName: "卡介苗"
   vaccinateInjectNumber: 1
   vaccinatePart: "0"
   vaccineList:
   [
   checked: true
   dataSourceType: "0" 数据来源，默认为0 - 登记台生成
   globalRecordNumber: "b0fbc4624164400296eab18d088d64be"
   profileCode: "505f1f27f34b46e2b5854fa4e941bc2d"
   registDoctorCode: "54831456447"
   registPovCode: "3406040802"
   registStatus: "1"
   vaccinateCount: 1 接种总针数，比如总共需要打乙肝2针
   vaccinateInjectNumber: 1 接种针序，比如乙肝的第2针
   vaccinatePart: "0" 接种部位
   vaccinateType: "0" 接种类型，比如常规接种、群体接种

   count: 184 库存
   vaccineBatchNo: undefined 疫苗批号
   vaccinePrice: "40.78"
   loseEfficacyDate: "",

   vaccineBroadHeadingCode: "01" 大类编码
   vaccineManufactureCode: undefined
   vaccineManufactureName: undefined
   vaccinePrice: "40.78"
   vaccineType: "1"
   validLabel: ""
   validTime: ""
   ],
   vaccineType: "0"



   传入的数据中缺少：
   疫苗大类名称 - vaccineBroadHeadingName，接种针次 - vaccinateInjectNumber，
   疫苗大类编码 - vaccineBroadHeadingCode，

   应接种时间 - supposeInjectionDate (可接种列表中显示，并非在登记页面中显示)

   疫苗价格 - vaccinePrice，疫苗批号 - vaccineBatchNo，
   疫苗是失效日期 - loseEfficacyDate (需要根据所选择的批号来决定)

   传过来的数据是这样的
   approvalNumber: ""
   biologyCategory: "2"
   checked: true
   containerType: ""
   count: 115
   currentStatus: "1"
   dosageByCarton: 1
   dosageByEach: 1
   dosageForm: "1"
   importClearanceNumber: ""
   isImport: ""
   largePackage: "10支/1000支"
   manufacturer: "上海生物"
   manufacturerCode: "08"
   measureUnitCode: "0"
   memo: ""
   openedEffectiveTime: "30m"
   shanghaiBroadHeadingCode: "02结核"
   shanghaiVaccineProductCode: "02010511A"
   vaccinateWay: "4"
   vaccineEngName: ""
   vaccineProductCode: "02010511A"
   vaccineProductCraftCode: "1"
   vaccineProductName: "结核-上生-0.5ml-L-卡介苗冻安"
   vaccineProductShortName: "上生0.5冻安"
   vaccineProductShortNameAbbreviation: ""
   vaccineSpecification: "0.5ml"
   vaccineSubclassCode: "0101"
   vaccineSubclassName: "卡介苗"
   weight: 5000

   正常排号
   */
  loadSelectedVacData() {
    console.log('待排序的数据为', JSON.parse(JSON.stringify(this.reservationVac)));
    // 根据不同地区获取不同的查询出桉树
    if (!this.userInfo || this.reservationVac.length === 0) return;
    const vacProductListData = [];
    for (let i = 0; i < this.reservationVac.length; i++) {
      const v = {};
      let vac = this.reservationVac[i];
      // 疫苗大类编码
      const vacBroadHeadingCode = vac['vaccineSubclassCode'].substring(0, 2);
      v['vacBroadHeadingCode'] = vacBroadHeadingCode;
      // 疫苗大类名称
      const vacBroadHeadingName = this.vacBroadHeadingSvc.getVaccBroadHeadingNameByBroadHeadingCode(vacBroadHeadingCode);
      v['vacBroadHeadingName'] = vacBroadHeadingName;
      // 接种针次（针序）
      const vaccinateInjectNumber = vac['vaccOrder'];
      v['vaccinateInjectNumber'] = vaccinateInjectNumber;
      // 接种部位，默认为 0
      const vaccinatePart = '0';
      v['vaccinatePart'] = vaccinatePart;
      const vaccineList = [];
      // 接种类型 常规接种
      v['vaccineType'] = '0';

      const vaccineListObj = {};
      //  registSourceType: "0" 数据来源，默认为0 - 登记台生成
      vaccineListObj[' registSourceType'] = '0';
      // globalRecordNumber 全局流水号
      vaccineListObj['globalRecordNumber'] = this.profile['globalRecordNumber']
        ? this.profile['globalRecordNumber']
        : CommonUtils.uuid(32, 16);
      // profileCode 档案编码
      vaccineListObj['profileCode'] = this.profile['profileCode'];
      // registDoctorCode
      vaccineListObj['registDoctorCode'] = this.userInfo.userCode;
      // registPovCode
      vaccineListObj['registPovCode'] = this.userInfo.pov;
      // registStatus - 1 待接种
      vaccineListObj['registStatus'] = '1';
      // vaccinateCount  接种总针数，比如总共需要打乙肝2针
      vaccineListObj['vaccinateCount'] = 1;
      // count: 184 库存
      vaccineListObj['count'] = vac['count'];
      vaccineListObj['checked'] = vac['count'] > 0;
      // vaccineBatchNo: undefined 疫苗批号
      vaccineListObj['vaccineBatchNo'] = vac['prodBatchNumber'];
      // loseEfficacyDate 疫苗失效日期
      if (!vac.hasOwnProperty('loseEfficacyDate') || !vac['loseEfficacyDate']) {
        vac['loseEfficacyDate'] = this.noLoseEfficacyDate;
      }
      vaccineListObj['loseEfficacyDate'] = vac['loseEfficacyDate'];
      const validTime = this.getValidEndDate(vac['loseEfficacyDate']);
      vaccineListObj['validTime'] = validTime.value;
      vaccineListObj['validLabel'] = validTime.label;
      // 大类编码
      vaccineListObj['vaccineBroadHeadingCode'] = vacBroadHeadingCode;
      // vaccineManufactureCode 厂商编码
      vaccineListObj['vaccineManufactureCode'] = vac['manufacturerCode'];
      // vaccineManufactureName 厂商名称
      vaccineListObj['vaccineManufactureName'] = vac['manufacturer'];
      // 疫苗价格 vaccinePrice
      vaccineListObj['vaccinePrice'] = vac['povVaccPrice'];
      // 疫苗类型 一类还是 二类
      vaccineListObj['vaccineType'] = vac['povVaccPrice'] > 0 ? '1' : '0';
      // vaccineProductShortName
      vaccineListObj['vaccineProductShortName'] = vac['vaccineProductShortName'];
      // vaccineSpecification
      vaccineListObj['vaccineSpecification'] = vac['vaccineSpecification'];
      // 是否按照接种策略进行登记
      vaccineListObj['registStrategy'] = '1';
      // vaccinateWay
      vaccineListObj['vaccinateWay'] = vac['vaccinateWay'];
      // vaccineProductCode 疫苗产品编码
      vaccineListObj['vaccineProductCode'] = vac['vaccineProductCode'];
      // vaccineSubclassCode 疫苗小类编码
      vaccineListObj['vaccineSubclassCode'] = vac['vaccineSubclassCode'];
      // vaccineProductName 疫苗产品名称
      vaccineListObj['vaccineProductName'] = vac['vaccineProductName'];

      vaccineList.push(vaccineListObj);
      v['vaccineList'] = vaccineList;
      this.addVacDataToVacProductListData(v, vacProductListData);
    }
    this.vacProductListData = vacProductListData;
    console.log('重构之后的数据', this.reservationVac);
  }

  /**
   * 将已选择的疫苗数据添加到待展现的列表中
   * @param vac
   * @param vacProductListData
   */
  addVacDataToVacProductListData(vac: any, vacProductListData: any[]) {
    const index = vacProductListData.findIndex(v => v.vacBroadHeadingCode === vac['vacBroadHeadingCode']);
    if (index === -1) {
      vacProductListData.push(vac);
      return;
    }
    for (let i = 0; i < vacProductListData.length; i++) {
      if (i !== index) continue;
      const v = vacProductListData[i];
      const vVaccineList = vac['vaccineList'][0];
      v['vaccineList'].push(vVaccineList);
      v['vaccineList'].sort((a, b) => a['loseEfficacyDate'] - b['loseEfficacyDate']);
      let checked = false;
      for (let j = 0; j < v['vaccineList'].length; j++) {
        if (v['vaccineList'][j]['count'] > 0 && !checked && v['vaccineList'][j]['vaccinePrice'] >= 0) {
          v['vaccineList'][j]['checked'] = true;
          checked = true;
        } else {
          v['vaccineList'][j]['checked'] = false;
        }
      }
    }
  }

  /**
   * 将获取到的数据与已有数据进行重构
   * @param filterVacArr
   * @param vac
   * @param vaccineList
   */
  setDisplayData(filterVacArr: any[], vac): any[] {
    let vaccineList: any[] = [];
    for (let j = 0; j < filterVacArr.length; j++) {
      const f = filterVacArr[j];
      let v: any = {};
      // 获取有效期的显示内容
      if (!f['loseEfficacyDate']) {
        f['loseEfficacyDate'] = this.noLoseEfficacyDate;
      }
      const validTime = this.getValidEndDate(f['loseEfficacyDate']);
      v['validTime'] = validTime.value;
      v['validLabel'] = validTime.label;
      v['loseEfficacyDate'] = f['loseEfficacyDate'];
      v['vaccineProductName'] = f['vaccineProductName'];
      v['vaccineProductShortName'] = f['vaccineProductShortName'];
      v['vaccineSpecification'] = f['vaccineSpecification'];
      v['vaccineManufactureName'] = f['manufacturerName'];
      // 接种总针数，比如总共需要打乙肝2针
      v['vaccinateCount'] = 1;
      v['registPovCode'] = this.userInfo['pov'];
      v['registDoctorCode'] = this.userInfo['userCode'];
      v['vaccineBatchNo'] = f.batchNo;
      // 接种针次
      // v['vaccinateInjectNumber'] = vac.vaccinateInjectNumber;
      v[' registSourceType'] = '0';
      // 接种方式
      v['vaccinateWay'] = f['vaccinateWay'];
      // 接种部位 0 - 左上臂
      v['vaccinatePart'] = '0';
      // 接种类型， 常规接种
      v['vaccinateType'] = '0';
      v['registStatus'] = '1';
      v['globalRecordNumber'] = this.profile['globalRecordNumber']
        ? this.profile['globalRecordNumber']
        : CommonUtils.uuid(32, 16);
      v['profileCode'] = this.profile['profileCode'];
      // 疫苗大类编码
      v['vaccineBroadHeadingCode'] = vac['vacBroadHeadingCode'];
      // 疫苗厂商名字
      v['vaccineManufactureName'] = f['manufacturerName'];
      // 疫苗厂商编码
      v['vaccineManufactureCode'] = f.manufacturerCode;
      // 疫苗库存
      v['count'] = f['inventoryCount'];
      // 疫苗产品编码
      v['vaccineProductCode'] = f['vaccineProductCode'];
      // 疫苗价格
      v.vaccinePrice = f['povVaccPrice'];
      // 小类编码
      v['vaccineSubclassCode'] = f['vaccineSubclassCode'];
      // 是否按照接种策略进行登记，否 - 0
      v['registStrategy'] = '0';

      v['vaccineType'] = v.vaccinePrice === 0 ? '0' : '1';
      vaccineList.push(v);
    }
    vaccineList.sort((a, b) => a['loseEfficacyDate'] - b['loseEfficacyDate']);
    let checked = false;
    for (let j = 0; j < vaccineList.length; j++) {
      if (vaccineList[j]['count'] > 0 && !checked && vaccineList[j]['vaccinePrice'] >= 0) {
        vaccineList[j]['checked'] = true;
        checked = true;
      } else {
        vaccineList[j]['checked'] = false;
      }
    }
    return vaccineList;
  }

  findVaccineByBroadHeadingCode(broadHeadingCode: string, data: any[]) {
    return data.filter(
      d => d.vaccineSubclassCode.substring(0, 2) === broadHeadingCode
    );
  }

  /**
   * 添加排号疫苗信息，用于自定义排号操作
   */
  addRegistData() {
    if (this.reservationVac.length > 3) {
      this.msg.info('一次只能最多登记3个接种疫苗信息');
      return;
    }
    // 获取当前已经选择小类的大类编码
    if (!this.vaccineSubclassCode) {
      this.msg.warning('请选择疫苗小类');
      return;
    }
    const broadHeadingCode = this.vaccineSubclassCode.substr(0, 2);
    console.log('添加疫苗大类', this.vacBroadHeading);
    const filterList = this.reservationVac.filter(
      vac => vac['vaccineSubclassCode'].substr(0, 2) === broadHeadingCode
    );
    const broadHeadingName = this.vacBroadHeadingSvc.getVaccBroadHeadingNameByBroadHeadingCode(broadHeadingCode);
    if (filterList.length !== 0) {
      this.msg.info('已经包含相同的大类【' + broadHeadingName + '】，请重新选择');
      return;
    }
    const vaccineSubclassCodeOption = this.vacSubclassOptions.filter(
      option => option['value'] === this.vaccineSubclassCode
    );
    // console.log('选择的疫苗', broadHeadingOption);
    this.reservationVac.push({
      vaccinateInjectNumber: 1,
      vacBroadHeadingCode: broadHeadingCode,
      vacBroadHeadingName: broadHeadingName,
      vaccinatePart: this.vaccinatePartOptions[0].value,
      vaccineType: this.vaccineTypeOptions[0].value,
      vaccineSubclassCode: this.vaccineSubclassCode
    });
    this.loadVacData();
  }

  /**
   * 登记注册排号 function
   */
  register() {
    if (!this.profile) return;
    // 如果签字，则判断签字是否成功
    if (this.isSignAvailable && !this.signSuccess) {
      this.msg.warning('签字没有成功，请重新签字');
      return;
    }
    if (this.lastActionTime + (Number(this.queueCallDelay) * 1000) >= new Date().valueOf()) {
      this.msg.warning(`${this.queueCallDelay}秒内无法登记，请${this.queueCallDelay}秒后再试！`);
      return;
    }
    let pListToBeSaved = [];
    /**
     * vaccinateWay,vaccineProductCode,vaccineSubclassCode,vaccineProductName
     *
     * 自定义排号缺少参数
     * vaccinateWay,vaccineProductCode,vaccineSubclassCode,vaccineProductName
     */
    // console.log(this.vacProductListData);
    this.vacProductListData.forEach(vac => {
      if (
        vac.hasOwnProperty('vaccineList') &&
        vac['vaccineList'].length !== 0
      ) {
        vac['vaccineList'].forEach(v => {
          if (v.hasOwnProperty('checked') && v['checked']) {
            v['vaccinateInjectNumber'] = vac.vaccinateInjectNumber;
            v['vaccinatePart'] = vac.vaccinatePart
              ? vac.vaccinatePart
              : v['vaccinatePart'];
            v['vaccinateType'] = vac.vaccineType
              ? vac.vaccineType
              : v['vaccinateType'];
            v['memo'] = vac.memo;
            v['registSourceType'] = '0';
            v['dataSourceType'] = '0';
            v['verified'] = '1';
            if (v.hasOwnProperty('loseEfficacyDate') && v['loseEfficacyDate']) {
              if (v['loseEfficacyDate'] < new Date().getTime()) {
                this.notifier.notify('error', '所选疫苗中有过期疫苗，请重新选择');
                return;
              }
              v['loseEfficacyDate'] = DateUtils.getFormatDateTime(v['loseEfficacyDate']);
            }
            // 如果不需要收银台，则付费订单将会跳过收银台直接到达接种台
            if (this.needPay === '0') {
              v['orderStatus'] = v['vaccineType'] === '0' ? '0' : '4';
            } else {
              // 如果需要收银台，则按照正常流程走
              v['orderStatus'] = v['vaccineType'] === '0' ? '0' : '1';
            }
            // v['loseEfficacyDate'] = DateUtils.formatToDate(vac['loseEfficacyDate']);
            // 如果签字，则将签字信息添加到需要存储的登记记录中
            if (this.isSignAvailable) {
              v['signature'] = this.signPic;
            }
            pListToBeSaved.push(v);
          }
        });
      }
    });
    if (pListToBeSaved.length === 0) {
      this.msg.warning('请选择登记疫苗');
      return;
    }
    this.loading = true;
    console.log('待存储的登记记录有', pListToBeSaved);
    this.registSvc.saveRegistRecordAndSignatureList(pListToBeSaved, resp => {
      console.log('存储登记记录返回值', resp);
      if (resp.code === 0) {
        // 当登记成功之后，修改当前排号队列的状态
        // 如果有收费疫苗，则推送到收银台，如果全都是免费疫苗，则推送到接种台
        let vaccineList = [];
        // 用于打印小票的对象内容
        let printRegistInfo = {};
        const printRegistInfoVaccineList = [];
        // console.log('登记成功之后', resp);
        // 不需要收银台，则直接到接种台
        if (this.needPay === '0') {
          this.callingData['needToPay'] = resp.data === 0 ? '0' : '4';
        } else {
          this.callingData['needToPay'] = resp.data === 0 ? '0' : '1';
        }
        for (let i = 0; i < pListToBeSaved.length; i++) {
          const p = pListToBeSaved[i];
          if (!this.callingData['needToPay'] || this.callingData['needToPay'] === '0') {
            this.callingData['curStatus'] = resp.data === 0 ? REG_QUEUE_STATUS.TO_VACCINATE : REG_QUEUE_STATUS.TO_PAY;
          }
          const vaccineSubclassCode = p['vaccineSubclassCode'];
          vaccineList.push(vaccineSubclassCode);
          printRegistInfoVaccineList.push({
            vaccineSubclassCode: vaccineSubclassCode,
            vaccineBatchNo: p['vaccineBatchNo'],
            vaccinateInjectNumber: p['vaccinateInjectNumber'],
            vaccineManufactureName: p['vaccineManufactureName'],
            vaccinePrice: p['vaccinePrice'],
            vaccineProductName: p['vaccineProductName']
          });
        }

        printRegistInfo['vaccineList'] = printRegistInfoVaccineList;
        printRegistInfo['name'] = this.profile['name'];
        printRegistInfo['profileCode'] = this.profile['profileCode'];
        printRegistInfo['immunityVacCard'] = this.profile['immunityVacCard'];
        printRegistInfo['createDate'] = this.callingData['createDate'];
        printRegistInfo['signature'] = this.signPic;
        printRegistInfo['queueCode'] = this.callingData['queueCode'];
        printRegistInfo['businessType'] = this.callingData['businessType'];
        printRegistInfo['needToPay'] = this.callingData['needToPay'];
        // console.log('待打印小票的内容是', printRegistInfo);

        this.callingData['actionTime'] = DateUtils.getFormatDateTime(this.callingData['actionTime']);
        this.callingData['curAction'] = REG_QUEUE_ACTION.REGISTER_CONFIRM;
        this.callingData['createDate'] = DateUtils.getFormatDateTime(
          this.callingData['createDate']
        );
        this.callingData['curRoom'] = this.userInfo.department;
        this.callingData['vaccineList'] = vaccineList;
        this.callingData['payWaitTopicShared'] = this.payWaitTopicShared;
        this.callingData['payWaitTopic'] = this.payWaitTopic;
        this.callingData['registPassTopicShared'] = this.registPassTopicShared;
        this.callingData['registPassTopic'] = this.registPassTopic;
        this.callingData[
          'vaccinateWaitTopicShared'
          ] = this.vaccinateWaitTopicShared;
        this.callingData['birthDate'] = null;
        this.callingData['vaccinateWaitTopic'] = this.vaccinateWaitTopic;
        this.callingData['profileName'] = this.profile['name'];
        this.callingData['profileCode'] = this.profile['profileCode'];
        this.callingData['queueDelay'] = this.queueCallDelay;
        // console.log('待推送到收银台或接种台的排号信息为', this.callingData);

        const namespace = this.pulsarJson['pulsarNameSpace'];
        this.queueApiSvc.deleteQueueItem(this.userInfo.pov, namespace, this.vaccinateWaitTopicShared, this.vaccinateWaitTopic, this.callingData['globalRecordNumber'], deleteResp => {
          this.loading = false;
          if (deleteResp.code === 0) {
            this.notifier.notify('success', '登记成功');
            this.queueApiSvc.addToPayQueueOrVaccinateQueue(this.callingData, r => {
              // console.log('将消息推送到收银台或者接种台的返回值', r);
              if (r.code === 0) {
                this.lastActionTime = new Date().valueOf();
                this.ref.close(printRegistInfo);
              }
            });
          }
        });
      } else {
        this.notifier.notify('error', '登记失败');
        this.loading = false;
      }
    });
  }

  onClose() {
    this.ref.close();
  }

  /**
   * 根据疫苗产品大类编码 + povcode 查询疫苗产品的批号、库存、价格
   * 正常排号 / 非自定义排号 的 库存、价格查询方法
   * @param queryParam
   * @param func
   */
  queryVacProductStockAndPriceAndBatchNoByVacProductCodeByArr(queryParam: any, func: Function) {
    this.vacProductSvc.queryVaccineInventory(queryParam, resp => {
      console.log('查询库存、价格的返回值', resp);
      if (resp.code === 0) {
        func(resp.data);
        return;
      }
      func([]);
    });
  }

  /**
   * 签字操作
   */
  sign() {
    if (!this.checkSelectedVac()) {
      this.msg.info('请先选择疫苗');
    }
    this.signSuccess = false;
    // 获取已选择疫苗列表
    let queryArr = '';
    let queryHanWangArr = '';
    // console.log(this.reservationVac);
    /*
    * */
    this.vacProductListData.forEach((vac, index) => {
      if (
        vac.hasOwnProperty('vaccineList') &&
        vac['vaccineList'].length !== 0
      ) {
        vac['vaccineList'].forEach((v, i) => {
          if (v.hasOwnProperty('checked') && v['checked']) {
            v['vacBroadHeadingCode'] = vac.vacBroadHeadingCode;
            if (i === vac['vaccineList'].length - 1) {
              queryHanWangArr += 'subclassCodes=' + v['vaccineSubclassCode'];
            } else
              queryHanWangArr += 'subclassCodes=' + v['vaccineSubclassCode'] + '&';
            // 捷宇星
            queryArr += v['vaccineSubclassCode'] + ',';
            this.vacToBeSaved.push(v);
          }
        });
      }
    });
    if (queryArr.length > 2) {
      queryArr = queryArr.substr(0, queryArr.length - 1);
    }
    console.log(queryArr);

    if (this.isSignAvailable) {
      if (this.signType === '0') {
        // 调用捷宇星
        let url = 'http://' + this.hostname + ':19998' + this.agreementUrl + '?subclassCodes=' + queryArr;
        console.log('调用捷宇星的告知书文件地址', url);
        this.ws.sign(url);
      } else {
        // 使用汉王签字版签字
        let url = 'open,' + this.hanWangAreeementUrl + '?' + queryHanWangArr;
        console.log('汉王URL====', url);
        this.ws.sendMessage(url);
      }
    }
  }

  /**
   * 检查是否已经选择了疫苗
   */
  checkSelectedVac(): boolean {
    for (let i = 0; i < this.vacProductListData.length; i++) {
      const vacProductList = this.vacProductListData[i]['vaccineList'];
      if (vacProductList.length === 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * 保证只有一个数据被选中
   * @param event
   * @param data
   */
  onRadioGroupChange(event, data: any[]) {
    // console.log('radio 修改的值为', event);
    data.forEach((vac, index) => {
      // console.log('index + event', index, event);
      if (index !== event) {
        vac['checked'] = false;
      }
    });
  }

  /**
   * 删除已选记录
   * @param data
   */
  removeVacData(data: any) {
    // console.log(data);
    // 接种疫苗排号
    this.vacProductListData = this.vacProductListData.filter(
      vac => data['vacBroadHeadingCode'] !== vac['vacBroadHeadingCode']
    );
    // 自定义登记删除
    this.reservationVac = this.reservationVac.filter(
      vac => data['vacBroadHeadingCode'] !== vac['vacBroadHeadingCode']
    );
  }

  /**
   * 根据疫苗有效期计算疫苗有效期是否在3个月以内
   * 疫苗有效期： 小于3个月 大于2个月 = 3
   * 疫苗有效期： 小于2个月 大于1个月 = 2
   * 疫苗有效期： 小于1个月         = 1
   * @param time
   */
  getValidEndDate(time: number) {
    const nowTime = new Date().getTime();
    const timeDifference = time - nowTime;
    const day = Math.ceil(timeDifference / 3600 / 24 / 1000);
    if (day <= 10) {
      return { label: 'day', value: day };
    }
    const month = Math.ceil(timeDifference / 3600 / 24 / 1000 / 30);
    if (month <= 3) {
      return { label: 'month', value: month };
    }
    return { label: '', value: '' };
  }

  /**
   * 重置签字板
   */
  resetSign() {
    this.ws.cancelAllOperation();
  }

  /**
   * 根据序列号获取接种部位
   * @param i
   * @param vac
   */
  getVaccinatePartByIndex(i: number, vac: any) {
    const length = this.vaccinatePartOptions.length;
    if (i <= length - 1) {
      vac['vaccinatePart'] = this.vaccinateCountOptions[i]['value'];
    } else {
      vac['vaccinatePart'] = this.vaccinateCountOptions[0]['value'];
    }
  }

}

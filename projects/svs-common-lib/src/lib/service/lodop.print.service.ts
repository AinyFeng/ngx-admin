import {Inject, Injectable} from '@angular/core';
import {Lodop, LodopService} from '@delon/abc';
import {PrintUtils} from '../utils/print.utils';
import {DOCUMENT} from '@angular/common';
import {BehaviorSubject, of} from 'rxjs';
import {ConfigService} from '@ngx-config/core';

@Injectable({providedIn: 'root'})

/**
 * LODOP 打印service，全局应用
 */
export class LodopPrintService {
  // settings = require('../../../../assets/data/checkin/settings.json');
  settings: any;
  // lodop 打印机访问地址
  lodopUrl: string;
  lodopCompanyName: string;
  lodopMainLicense: string;
  lodopLicenseA: string;
  lodopLicenseB: string;
  lodopCompanyNameEng: string;
  lodopLicenseARegistName: string;
  lodopLicenseBStr: string;
  // 打印状态码
  private printStatus$ = new BehaviorSubject<number>(null);
  // 打印机加载错误
  error: boolean;
  // 打印机实例
  lodop: any;
  // 打印机列表
  printers = [];
  // 打印机初始化状态订阅主体对象
  private _lodopInitStatus$ = new BehaviorSubject<boolean>(false);

  // 打印机的状态
  printStatus: any;

  constructor(
    private configService: ConfigService,
    private lodopSrv: LodopService,
    @Inject(DOCUMENT) private doc) {

    this.settings = this.configService.getSettings('signPad');

    this.lodopUrl = this.settings.lodopUrl;
    this.lodopSrv.cog.url = this.lodopUrl;
    this.lodopMainLicense = this.settings.lodopMainLicense;
    this.lodopCompanyName = this.settings.lodopCompanyName;
    this.lodopLicenseA = this.settings.lodopLicenseA;
    this.lodopLicenseB = this.settings.lodopLicenseB;
    this.lodopCompanyNameEng = this.settings.lodopCompanyNameEng;
    this.lodopLicenseARegistName = this.settings.lodopLicenseARegistName;
    this.lodopLicenseBStr = this.settings.lodopLicenseBStr;
    this.lodopSrv.lodop.subscribe(({lodop, ok}) => {
      console.log('lodop print service 实例化', lodop, ok);
      if (!ok) {
        this.error = true;
        this.setLodopStatus();
        // this.msg.warning('打印机加载失败，请检查打印机的驱动是否启动');
        return;
      }
      this.error = false;
      this.setLodopStatus();
      this.lodop = lodop as Lodop;
      this.printers = this.lodopSrv.printer;
      this.lodopInit();
    });
  }

  /**
   * 获取打印机初始化的状态
   */
  getLodopStatus() {
    return this._lodopInitStatus$.asObservable();
  }

  /**
   * 设置打印机初始化状态
   * @param status
   */
  setLodopStatus() {
    this._lodopInitStatus$.next(this.error);
  }

  /**
   * lodop 打印 licenses 初始化
   */
  lodopInit() {
    let LODOP = this.lodop as Lodop;
    LODOP.SET_LICENSES(
      this.lodopCompanyName,
      this.lodopMainLicense,
      this.lodopLicenseA,
      this.lodopLicenseB
    );
    LODOP.SET_LICENSES(
      this.lodopCompanyNameEng,
      '',
      this.lodopLicenseARegistName,
      this.lodopLicenseBStr
    );
  }

  /**
   * 设置收费票据打印内容
   * @param templateJson 打印票据的模板参数，比如位置坐标，打印预览的背景图
   * @param contentJson 打印的具体内容
   * @param province 省份编码
   */
  setPrintReceiptContent(
    templateJson: any,
    contentJson: any,
    province: string
  ) {
    let LODOP = this.lodop as Lodop;
    // 安徽
    if (province === '34') {
      LODOP = PrintUtils.setAnhuiReceiptTemplate(
        LODOP,
        templateJson,
        contentJson
      );
    }
    // 上海
    if (province === '31') {
      LODOP = PrintUtils.setShangHaiReceiptTemplate(
        LODOP,
        templateJson,
        contentJson
      );
    }
    // 江西
    if (province === '36') {
      LODOP = PrintUtils.setJiangXiReceiptTemplate(
        LODOP,
        templateJson,
        contentJson
      );
    }
    // 云南
    if (province === '53') {
      LODOP = PrintUtils.setYunNamReceiptTemplate(
        LODOP,
        templateJson,
        contentJson
      );
    }
  }

  /**
   * 打印功能
   * @param preview 是否预览，true - 是, false - 否
   * @param printId 待打印内容的id
   * @param top 距离上边距
   * @param left 距离左边距
   */
  print(
    preview: boolean,
    printId: string,
    top = 0,
    left = 0,
    width = '100%',
    height = '100%',
  ) {
    console.log('lodopService', this.lodop);
    if (!this.lodop) {
      if (!this.error) {
        this.error = true;
        this.setLodopStatus();
        return;
      }
    }
    let LODOP = this.lodop as Lodop;
    LODOP.ADD_PRINT_HTM(
      top,
      left,
      width,
      height,
      this.doc.getElementById(printId).innerHTML
    );
    if (preview) {
      LODOP.PREVIEW();
    } else {
      LODOP.PRINT();
      /*LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', 'true');
      this.printStatus = '';
      if (LODOP.CVERSION) {
        LODOP.On_Return = (TaskID, Value) => {
          this.printStatus = Value ? Value : 0;
          func(this.printStatus);
          // this.printStatus$.next(this.printStatus);
        };
        LODOP.PRINTA();
        return;
      } else {
        this.printStatus = 0;
        func(this.printStatus);
        // this.printStatus$.next(this.printStatus);
        return;
      }*/

    }
  }

  /*currentPrint() {
    let LODOP = this.lodop as Lodop;
    LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', 1); // 执行该语句之后，PRINT指令不再返回那个所谓“打印成功”，才能获取到打印状态
    LODOP.On_Return = (TaskID, Value) => { // TaskID:任务id，Value：job代码
      let timer = setInterval(() => {
        if (this.printStatus !== 0) {
          clearInterval(timer);
          this.printStatus$.next(this.printStatus);
          return;
        }
        // PRINT_STATUS_BUSY
        this.getStatusValue('PRINT_STATUS_OK', Value); // 查询打印任务完成状态
      }, 500);
    };
    LODOP.PRINT();
  }

  getStatusValue(valueName, job) { // 根据job代码，获取是否打印成功
    let LODOP = this.lodop as Lodop;
    LODOP.On_Return = (TaskID, Value) => { // TaskID:任务id，Value：打印成功状态
      console.log('打印成功状态:' + this.printStatus);
      this.printStatus = Value ? Value : 0;
      this.printStatus$.next(this.printStatus);
    };
    LODOP.GET_VALUE(valueName, job);
  }*/

  // 方法暴露出状态
  getPrintStatusAsObservable() {
    return this.printStatus$.asObservable();
  }

  /**
   * 打印接种记录
   * @params model  选择的打印模板
   * @params currentPage  选择的哪一个页面
   * @params printRecordData  打印的的接种记录
   * @params images  打印接种记录背景图
   * @params settings  打印设置内容
   */
  setPrintVaccRecord(
    model: any,
    currentPage: any,
    printRecordData: any,
    images: any,
    settings: any
  ) {
    let LODOP = this.lodop as Lodop;
    LODOP = PrintUtils.setVaccRecordTemplate(
      LODOP,
      model,
      currentPage,
      printRecordData,
      images,
      settings
    );
  }

  /**
   * 接种记录选择的模板打印or预览
   * @params preview: 打印or预览 true 预览 false打印
   */
  printRecord(preview: boolean) {
    if (!this.lodop) {
      if (!this.error) {
        this.error = true;
        this.setLodopStatus();
        return;
      }
    }
    let LODOP = this.lodop as Lodop;
    if (preview) {
      LODOP.PREVIEW();
    } else {
      LODOP.PRINT();
    }
  }

  /**
   * @author ainy
   * @params: templateJson:选择的背景图,固定的位置
   * @params: contentJson 打印的内容
   * @params: chooseType 当前选择的模板
   * @params: settings 额外的设置
   * @date 2019/10/18 0018
   */
  setChildCaseContent(
    templateJson: any,
    contentJson: any,
    chooseType: string,
    settings: any
  ) {
    let LODOP = this.lodop as Lodop;
    // 安徽省预防接种证2019版包河制
    if (chooseType === 'ah2019bhMade') {
      LODOP = PrintUtils.setAh2019bhMadeTemplate(
        LODOP,
        templateJson,
        contentJson,
        settings
      );
    }
    // 安徽省预防接种证2019版(小)
    if (chooseType === 'ah2019Small') {
      LODOP = PrintUtils.setAh2019SmallTemplate(
        LODOP,
        templateJson,
        contentJson,
        settings
      );
    }
    // 安徽省预防接种证2016版(小)
    if (chooseType === 'ah2016') {
      LODOP = PrintUtils.setAh2016SmallTemplate(
        LODOP,
        templateJson,
        contentJson,
        settings
      );
    }
    // 安徽省预防接种证2017版(小)
    if (chooseType === 'ah2017') {
      LODOP = PrintUtils.setAh2017SmallTemplate(
        LODOP,
        templateJson,
        contentJson,
        settings
      );
    }
    // 安徽省预防接种证ahNation版
    if (chooseType === 'ahNation') {
      LODOP = PrintUtils.setAhNationTemplate(
        LODOP,
        templateJson,
        contentJson,
        settings
      );
    }
    // 上海预防接种证sh2018版(大)
    if (chooseType === 'sh2018') {
      LODOP = PrintUtils.setSh2018BigTemplate(
        LODOP,
        templateJson,
        contentJson,
        settings
      );
    }
  }
}

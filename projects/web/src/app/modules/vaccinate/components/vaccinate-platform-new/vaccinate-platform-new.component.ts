import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ProfileService, SysConfInitService } from '@tod/svs-common-lib';
import { ConfigService } from '@ngx-config/core';
import { VaccinatePlatformService } from './vaccinate-platform.service';
import { VaccinatingWebsocketService } from './vaccinating-websocket.service';
import { WaitingWebsocketService } from './waiting-websocket.service';
import { DeviceWebsocketService } from './device-websocket.service';
import { VACCINATE_CHECK_TYPE } from './vaccinate.const';
import { Subscription } from 'rxjs';

@Component({
  selector: 'uea-vaccinate-platform-new',
  templateUrl: './vaccinate-platform-new.component.html',
  styleUrls: ['./vaccinate-platform-new.component.scss'],
  providers: [
    VaccinatingWebsocketService,
    WaitingWebsocketService,
    DeviceWebsocketService,
    VaccinatePlatformService
  ]
})
export class VaccinatePlatformNewComponent implements OnInit, OnDestroy {
  // pulsar 配置信息
  private pulsarJson: any;
  // 连接地址的key
  private readonly pulsarUrlKey = 'pulsarUrl';
  // pulsar key
  private readonly pulsarJsonKey = 'pulsar';

  globalListenFunc: Function;
  // 扫描结果
  private scanInput: string = '';

  visible: boolean = false;

  private subscription: Subscription[] = [];
  /**
   * 核验项目(包含疫苗和人员信息)
   */
  vaccineCheckType: string;

  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private eventManager: EventManager,
    private configSvc: ConfigService,
    private profileService: ProfileService,
    private sysConfSvc: SysConfInitService,
    protected platformService: VaccinatePlatformService) {
  }

  ngOnInit(): void {
    this.initSysConf();
    this.initKeyboardEvent();
  }

  ngOnDestroy(): void {
    this.destroyKeyboardEvent();
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  /**
   * 初始化系统配置项
   */
  initSysConf() {
    this.pulsarJson = this.configSvc.getSettings(this.pulsarJsonKey);
    this.platformService.pulsarUrl = this.sysConfSvc.getConfValue(this.pulsarUrlKey);
    this.platformService.pulsarNs = this.pulsarJson.pulsarNameSpace;
    this.platformService.vaccinateWaitTopicShared = this.pulsarJson.vaccinateWaitTopicShared;
    this.platformService.vaccinateWaitTopic = this.pulsarJson.vaccinateWaitTopic;
    this.platformService.vaccinateCalledTopicShared = this.pulsarJson.vaccinateCalledTopicShared;
    this.platformService.vaccinateCalledTopic = this.pulsarJson.vaccinateCalledTopic;
    // 订阅核验项目
    const sub = this.platformService.getVaccineCheckType().subscribe(res => {
      this.vaccineCheckType = res;
      console.log('当前校验项目是', res);
    });
    this.subscription.push(sub);
  }

  /**
   * 初始化键盘事件
   */
  initKeyboardEvent() {
    this.globalListenFunc = this.eventManager.addGlobalEventListener(
      'window',
      'keyup',
      (keyboard: KeyboardEvent) => {
        if (!isNaN(Number(keyboard.key))) {
          this.scanInput += String(keyboard.key);
        } else if (keyboard.code.toLowerCase().startsWith('key')) {
          this.scanInput += String(keyboard.key.toUpperCase());
        } else if (keyboard.key.toLowerCase().startsWith('enter')) {
          console.log('扫码结果处理之前的值', this.scanInput);
          this.scanInput = this.clearScanInput(this.scanInput);
          console.log('1.当前核验类型', this.scanInput, this.vaccineCheckType);
          if (this.vaccineCheckType === VACCINATE_CHECK_TYPE.PROFILE && this.scanInput !== '') {
            // 小于12位则扫描的是加密的免疫卡号，需要通过后台查询档案信息，
            if (this.scanInput.length === 12 || this.scanInput.length === 10) {
              console.log('开始根据免疫卡号核验档案');
              this.profileService.queryProfileByImmunityVacCard(this.scanInput, resp => {
                console.log('核验结果', resp);
                if (resp['code'] === 0) {
                  if (resp['data'].length === 0) {
                    this.platformService.warning('未查询到档案，请确认扫描的证件！');
                  } else {
                    this.checkRegisterAndScanProfileInfo(resp['data'][0]['profileCode']);
                  }
                } else {
                  this.platformService.error('查询档案失败！');
                }
              });
            } else {
              // 获取到受种人的档案编码，将档案编码发送给 vaccinate-injection-list.component 组件去核验受种人档案
              console.log('扫描的二维码', this.scanInput);
              this.checkRegisterAndScanProfileInfo(this.scanInput);
            }
          } else if (this.vaccineCheckType === VACCINATE_CHECK_TYPE.VACCINE && this.scanInput !== '') {
            console.log('开始核验疫苗啦 - checkRegisterAndScanVaccineInfo', this.scanInput);
            this.checkRegisterAndScanVaccineInfo(this.scanInput);
          }
          this.scanInput = '';
        }
      });
  }

  destroyKeyboardEvent() {
    if (typeof this.globalListenFunc === 'function') {
      this.globalListenFunc();
    } else {

    }
  }

  /**
   * 核验登记接种人信息与扫描接种人信息，如果信息一致则进入下一步骤
   * 如果不一致则在队列中查询是否存在登记接种人，如果存在提医护人员是否插队
   * 如果队列中不存在接种队列中则提示受种人先进行预检登记
   * @profileCode 档案编码
   */
  checkRegisterAndScanProfileInfo(profileCode?: string) {
    console.log('checkRegisterAndScanProfileInfo 根据档案编码查询档案信息', profileCode);
    console.log('此时的正在接种数据是', this.platformService.vaccinatingQueueData);
    if (profileCode === '') {
      this.platformService.openRed();
      this.modalService.warning({
        nzTitle: '警告',
        nzContent: '接种人信息扫描失败，请重新扫描！'
      });
    } else {
      console.log('-----------');
      if (this.platformService.vaccinatingQueueData.length === 0) {
        console.log('有档案');
        const isExistQueue = this.checkIsExistQueue(profileCode);
        console.log('isExistQueue', isExistQueue);
        if (isExistQueue) {
          console.log('llllllllll');
          this.platformService.consultVaccinatePersonInfo(isExistQueue);
        } else {
          this.queueUpConfirm();
        }
      } else {
        console.log('7899999999999999999999999999');
        this.platformService.setScanInput(profileCode);
      }
    }
  }

  /**
   * 核验登记接种疫苗信息与扫描疫苗信息，如果信息一致则进入下一步骤
   * 如果不一致则提示医生疫苗扫描失败，请确认选择疫苗
   *
   */
  checkRegisterAndScanVaccineInfo(input?: string) {
    if (input === '') {
      this.platformService.openRed();
      this.modalService.warning({
        nzTitle: '提示',
        nzContent: '疫苗扫描失败，请重新扫描！'
      });
      return;
    } else {
      this.platformService.setScanInput(input);
    }
  }

  /**
   * 检查扫描到的接种人是否存在队列中
   * @param scanProfileCode
   * @returns {boolean}
   */
  checkIsExistQueue(scanProfileCode: string): any {
    let resultData = null;
    this.platformService.waitingQueueData.forEach(data => {
      const profileCode = data.profileCode;
      if (scanProfileCode === profileCode) {
        resultData = data;
        return;
      }
    });
    this.platformService.passedQueueData.forEach(data => {
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

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  /**
   * 清除输入内容中前面的字符串，比如：asdfafafasdfafd9999999，只保留9999999
   * @param inputStr
   */
  clearScanInput(inputStr: string) {
    if (!inputStr || inputStr.trim() === '' || inputStr.length === 0) return undefined;
    let index = 0;
    for (let i = 0; i < inputStr.length; i++) {
      const charStr = inputStr.charAt(i);
      if (charStr.match(/^\d$/g)) {
        index = i;
        break;
      }
    }
    return inputStr.substr(index);
  }


}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventManager} from '@angular/platform-browser';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {SysConfInitService} from '@tod/svs-common-lib';
import {ConfigService} from '@ngx-config/core';
import {VaccinatePlatformService} from './vaccinate-platform.service';
import {VaccinatingWebsocketService} from './vaccinating-websocket.service';
import {WaitingWebsocketService} from './waiting-websocket.service';
import {DeviceWebsocketService} from './device-websocket.service';

@Component({
  selector: 'uea-vaccinate-platform-new',
  templateUrl: './vaccinate-platform-new.component.html',
  styleUrls: ['./vaccinate-platform-new.component.scss'],
  providers: [
    VaccinatingWebsocketService,
    WaitingWebsocketService,
    DeviceWebsocketService,
    VaccinatePlatformService]
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

  constructor(private modalService: NzModalService,
              private eventManager: EventManager,
              private configSvc: ConfigService,
              private sysConfSvc: SysConfInitService,
              protected platformService: VaccinatePlatformService) {
  }

  ngOnInit(): void {
    this.initSysConf();
    this.initKeyboardEvent();
  }

  ngOnDestroy(): void {
    this.destroyKeyboardEvent();
    this.modalService.closeAll();
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
  }

  initKeyboardEvent() {
    this.globalListenFunc = this.eventManager.addGlobalEventListener('window', 'keyup', (keyboard: KeyboardEvent)  => {
      if (!isNaN(Number(keyboard.key))) {
        this.scanInput += String(keyboard.key);
      } else if (keyboard.code.toLowerCase().startsWith('key')) {
        this.scanInput += String(keyboard.key.toUpperCase());
      } else if (keyboard.key.toLowerCase().startsWith('enter')) {
        if (this.platformService.eventListenerFlag === 'scanProfile' && this.scanInput !== '') {
          this.checkRegisterAndScanProfileInfo(this.scanInput);
        } else if (this.platformService.eventListenerFlag === 'scanVaccine' && this.scanInput !== '') {
          this.checkRegisterAndScanVaccineInfo(this.scanInput);
        }
        console.warn(this.scanInput);
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
   */
  checkRegisterAndScanProfileInfo(input?: string) {
    if (input === '') {
      this.modalService.warning({
        nzTitle: '警告',
        nzContent: '接种人信息扫描失败，请重新扫描！'
      });
      return;
    }
    if (this.platformService.vaccinatingQueueData.length === 0) {
      const isExistQueue = this.checkIsExistQueue(input);
      if (isExistQueue) {
        this.platformService.consultVaccinatePersonInfo(isExistQueue, false);
      } else {
        this.queueUpConfirm();
      }
      return;
    }
    this.platformService.setScanInput(input);
  }

  /**
   * 核验登记接种疫苗信息与扫描疫苗信息，如果信息一致则进入下一步骤
   * 如果不一致则提示医生疫苗扫描失败，请确认选择疫苗
   *
   */
  checkRegisterAndScanVaccineInfo(input?: string) {
    if (input === '') {
      this.modalService.warning({
        nzTitle: '警告',
        nzContent: '疫苗扫描失败，请重新扫描!'
      });
      return;
    }
    this.platformService.setScanInput(input);
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

}

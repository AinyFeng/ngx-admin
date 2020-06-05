import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { VaccinatePlatformService } from '../vaccinate-platform.service';
import { LOCAL_STORAGE, SysConfInitService, VACCINATE_STATUS } from '@tod/svs-common-lib';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { UserService } from '@tod/uea-auth-lib';
import { VACCINATE_CHECK_TYPE } from '../vaccinate.const';

@Component({
  selector: 'uea-vaccinate-queue-list',
  templateUrl: './vaccinate-queue-list.component.html',
  styleUrls: ['./vaccinate-queue-list.component.scss']
})
export class VaccinateQueueListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  showCard = true;

  /**
   * 疫苗核验标识 - 默认核验
   */
  checkVaccineFlag = true;
  /**
   * 受种人核验标识 - 默认核验
   */
  checkProfileFlag = true;
  /**
   * 用户信息
   */
  userInfo: any;

  @ViewChild('nzSwitchCom', {static: false}) nzSwitchCom: any;

  @ViewChild('nzSwitchProfileCom', {static: false}) nzSwitchProfileCom: any;


  constructor(public platformService: VaccinatePlatformService,
              private sysConfService: SysConfInitService,
              private localSt: LocalStorageService,
              private userSvc: UserService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.userSvc.getUserInfoByType().subscribe(user => {
      if (user) {
        this.userInfo = user;
        this.initSysConf();
      }
    });
  }

  // 初始化系统配置
  initSysConf() {
    const checkVaccineFlag = this.localSt.retrieve(LOCAL_STORAGE.CHECK_VACCINE_FLAG + this.userInfo.userCode);
    console.log('疫苗核验标志vaccineFlag', checkVaccineFlag);
    if (checkVaccineFlag !== null) {
      this.checkVaccineFlag = checkVaccineFlag;
    }
    this.platformService.setCheckVaccineFlag(this.checkVaccineFlag);

    const checkProfileFlag = this.localSt.retrieve(LOCAL_STORAGE.CHECK_PROFILE_FLAG + this.userInfo.userCode);
    if (checkProfileFlag !== null) {
      this.checkProfileFlag = checkProfileFlag;
    }
    this.platformService.setCheckProfileFlag(this.checkProfileFlag);
    console.log('队列初始化的时候，是否核验档案', this.checkProfileFlag, checkProfileFlag);
    if (!this.checkProfileFlag) {
      console.log('========');
      this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.VACCINE);
    } else {
      console.log('-------');
      this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.PROFILE);
    }
  }

  ngOnDestroy(): void {
  }

  /**
   * 获取待叫号队列长度
   */
  getWaitingQueueLength(): number {
    if (this.platformService.waitingQueueData) {
      return this.platformService.waitingQueueData.length;
    }
    return 0;
  }

  /**
   * 获取已叫号队列长度
   */
  getPassedQueueLength(): number {
    if (this.platformService.passedQueueData) {
      return this.platformService.passedQueueData.length;
    }
    return 0;
  }

  /**
   * 获取已完成队列长度
   */
  getSuccessQueueLength(): number {
    if (this.platformService.successQueueData) {
      return this.platformService.successQueueData.length;
    }
    return 0;
  }

  /**
   * 查看队列中接种人信息
   */
  consultVaccinatePersonInfo(data, flag) {
    let temp = JSON.parse(JSON.stringify(data));
    if (flag) {
      temp.queueCode = temp.businessType + temp.queueCode;
    }
    this.platformService.consultVaccinatePersonInfo(temp, flag);
  }


  refreshTopic(ev) {
    this.platformService.initTopic(this.platformService.vaccinateWaitTopicShared, this.platformService.vaccinateWaitTopic);
    this.platformService.initTopic(
      this.platformService.vaccinateCalledTopicShared + '_' + this.platformService.selectedDepartmentCode,
      this.platformService.vaccinateCalledTopic + '_' + this.platformService.selectedDepartmentCode);
  }

  /**
   * 核验状态切换
   * @param event
   */
  switchVaccineFlag(event) {
    // 如果核验的按钮存在，则在核验之后去掉核验按钮的焦点事件
    if (this.nzSwitchCom) {
      this.nzSwitchCom.blur();
    }
    // 将核验按钮的核验判断标识符存储到local storage中
    this.localSt.store(LOCAL_STORAGE.CHECK_VACCINE_FLAG + this.userInfo.userCode, event);
    this.platformService.setCheckVaccineFlag(event);
  }

  /**
   * 受种人状态切换
   * @param event
   */
  switchProfileFlag(event) {
    // 如果核验的按钮存在，则在核验之后去掉核验按钮的焦点事件
    if (this.nzSwitchProfileCom) {
      this.nzSwitchProfileCom.blur();
    }
    if (!event) {
      this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.VACCINE);
    } else {
      this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.PROFILE);
    }
    console.log('受种人档案核验变化时的档案校验', event);
    // 将核验按钮的核验判断标识符存储到local storage中
    this.localSt.store(LOCAL_STORAGE.CHECK_PROFILE_FLAG + this.userInfo.userCode, event);
    this.platformService.setCheckProfileFlag(event);
  }
}

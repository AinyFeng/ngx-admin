import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ColdStorageFacilityService, DateUtils,
  DepartmentConfigService,
  DepartmentInitService,
  IotInitService, LOCAL_STORAGE,
  QueueApiService, SysConfInitService, SysConfKey,
  VACCINATE_STATUS,
  VaccinateService,
} from '@tod/svs-common-lib';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { UserService } from '@tod/uea-auth-lib';
import { interval, Subscription } from 'rxjs';
import { DialogDepartmentComponent } from '../../vaccinate-department-dialog/department.dialog.template';
import { NbDialogService } from '@nebular/theme';
import { VaccinatePlatformService } from '../vaccinate-platform.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { WaitingWebsocketService } from '../waiting-websocket.service';
import { VaccinatingWebsocketService } from '../vaccinating-websocket.service';
import { VACCINATE_CHECK_TYPE } from '../vaccinate.const';

@Component({
  selector: 'uea-vaccinate-call-bar',
  templateUrl: './vaccinate-call-bar.component.html',
  styleUrls: ['./vaccinate-call-bar.component.scss'],
})
export class VaccinateCallBarComponent implements OnInit, OnDestroy {
  @Input()
  showCard: boolean = true;
  // 当前排号信息
  currentQueueItem: any;
  // 下一个排号信息
  nextQueueItem: any;
  // 是否禁用叫号按钮
  isCallNumberDisabled: boolean = false;
  // 是否禁用下一号按钮
  isNextNumberDisabled: boolean = false;

  vaccinatingQueueData: any[] = [];

  waitingQueueData: any[] = [];

  passedQueueData: any[] = [];
  // 接种科室选项
  departmentOption = [];
  // 选择的接种科室
  selectedDepartmentCode: string = '';
  // 选择的接种科室
  selectedDepartmentName: string = '';
  // 出库冰箱选项
  coldStorageFacilitiesOption: any = [];
  // 选择出库冰箱编码
  selectedFacilityCode: string = '';
  // 冰箱下没有设备时记录弹出的次数
  index = 0;
  // 用于 LocalStorage 保存选择的科室
  private readonly curVaccinationRoom: string = 'curVaccinationRoom';

  private subscription: Subscription[] = [];

  private waitingSubscription: Subscription[] = [];

  private vaccinatingSubscription: Subscription[] = [];
  /**
   * 接种台冰箱配置策略， 1 - 自由配置，2 - 固定配置
   */
  vaccinateRefrigeratorStrategy = '1';
  /**
   * 加载中
   */
  loading = false;

  /**
   * 核验受种人开关
   */
  checkProfileFlag: boolean;
  /**
   * 核验疫苗开关
   */
  checkVaccineFlag: boolean;

  constructor(private router: Router,
              private message: NzMessageService,
              private modalService: NzModalService,
              private nbDialogService: NbDialogService,
              private iotInitSvc: IotInitService,
              private localSt: LocalStorageService,
              private userService: UserService,
              private vaccinateService: VaccinateService,
              private departmentInitSvc: DepartmentInitService,
              private departmentConfigService: DepartmentConfigService,
              private coldStorageFacilityService: ColdStorageFacilityService,
              private waitingWs: WaitingWebsocketService,
              private vaccinatingWs: VaccinatingWebsocketService,
              private queueApiSvc: QueueApiService,
              private platformService: VaccinatePlatformService,
              private sysConfSvc: SysConfInitService) {
    this.initSysConf();
  }

  ngOnInit() {
    // 初始化部门信息
    this.initDepartmentOption();
    this.initUserInfo();
    // 初始化疫苗核验和受种人核验的开关状态
    this.initCheckVaccineFlag();
    this.initCurrentQueueItem();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
    this.waitingSubscription.forEach(sub => sub.unsubscribe());
    this.vaccinatingSubscription.forEach(sub => sub.unsubscribe());
  }

  /**
   * 初始化系统配置字典信息
   */
  initSysConf() {
    this.vaccinateRefrigeratorStrategy = this.sysConfSvc.getConfValue(SysConfKey.vaccinateRefrigeratorStrategy);
  }

  /**
   * 初始化疫苗核验和受种人核验的开关状态
   */
  initCheckVaccineFlag() {
    console.log('叫号bar中 初始化疫苗核验开关和受种人核验开关');
    // 获取核验疫苗的开关状态
    const sub = this.platformService.getCheckVaccineFlag().subscribe(flag => {
      console.log('叫号bar中 疫苗核验开关变化', flag);
      this.checkVaccineFlag = flag;
    });
    this.subscription.push(sub);

    // 获取核验受种人的开关状态
    const sub1 = this.platformService.getCheckProfileFlag().subscribe(flag => {
      this.checkProfileFlag = flag;
      console.log('叫号bar中 受种人核验开关变化', flag);
    });
    this.subscription.push(sub1);
  }

  initDepartmentOption() {
    this.departmentOption = this.departmentInitSvc.getDepartmentData('1');
    console.log('departmentOption', this.departmentOption);
  }

  /**
   * 初始化接种台信息
   */
  initUserInfo() {
    // console.log('----------------------获取接种台用户信息');
    const sub = this.userService.getUserInfoByType().subscribe(user => {
      // console.log('接种台用户信息', user);
      this.platformService.userInfo = user;
      if (user) {
        // 获取接种室选项
        this.getDepartmentOption();
        this.platformService.queryVaccineDoseInfo();
      }
    });
    this.subscription.push(sub);
  }

  initCurrentQueueItem() {
    const sub = this.platformService.getCurrentQueueItem().subscribe(queueItem => this.currentQueueItem = queueItem);
    this.subscription.push(sub);
  }


  /**
   * 通过部门编码查询可接种疫苗列表
   */
  loadVaccineListByDept() {
    const params = {belongDepartmentCode: this.selectedDepartmentCode};
    this.departmentConfigService.getVaccineListByDept(params, resp => {
      if (resp.code === 0) {
        if (resp.data.length === 0) {
          this.platformService.warning('本部门暂无可接种疫苗，请先配置部门可接种疫苗！', () => this.loadVaccineListByDept());
        } else {
          this.platformService.vaccineList = resp.data;
        }
      }
    });
  }

  /**
   * 加载设备表信息
   */
  loadFacilityInfo() {
    if (!this.platformService.userInfo) return;
    let belongDepartmentCode = this.selectedDepartmentCode;
    // 如果是自由配置
    if (this.vaccinateRefrigeratorStrategy === '1') {
      belongDepartmentCode = null;
    }
    // 先从缓存中获取已经选择过的冰箱数据
    const facilityCode = this.localSt.retrieve(LOCAL_STORAGE.VACCINATE_REFRIGERATOR + this.selectedDepartmentCode);
    const params = {
      belongPovCode: this.platformService.userInfo.pov,
      belongDepartmentCode: belongDepartmentCode,
      facilityStatus: '0'
    };
    this.coldStorageFacilityService.queryColdStorageFacilityInfo(params, resp => {
        if (resp['code'] === 0) {
          if (!!resp['data'] && resp['data'].length > 0) {
            console.log('resp.data', resp.data);
            this.platformService.coldStorageFacilities = resp.data;
            this.coldStorageFacilitiesOption = resp.data;
            // 如果已经选择过冰箱数据，则默认选中曾经选择过的数据
            if (facilityCode && this.vaccinateRefrigeratorStrategy === '1') {
              const facility = resp.data.find(d => d['facilityCode'] === facilityCode);
              this.selectedFacilityCode = facility['facilityCode'];
              this.platformService.selectedFacilityCode = facility['facilityCode'];
            } else {
              this.selectedFacilityCode = resp.data[0]['facilityCode'];
              this.platformService.selectedFacilityCode = resp.data[0]['facilityCode'];
            }

          } else {
            /* console.log('----------------------------', this.index);*/
            if (this.index++ > 3) {
              this.index = 0;
              return;
            } else {
              this.platformService.error('接种台没有配置冰箱设备！', () => this.loadFacilityInfo());
              // this.platformService.error('接种台没有配置冰箱设备！', () => this.loadFacilityInfo());
              this.platformService.coldStorageFacilities = [];
              this.coldStorageFacilitiesOption = [];
            }
          }
        } else {
          this.platformService.error('获取冰箱设备失败！');
          // this.platformService.error('获取冰箱设备失败！', () => this.loadFacilityInfo());
        }
      }
    );
  }

  /**
   * 获取科室选项
   */
  getDepartmentOption() {
    if (!this.platformService.userInfo) return;
    const temp = this.localSt.retrieve(this.curVaccinationRoom);
    const isCorrect = this.departmentOption.some(department => department.departmentCode === temp);
    if (isCorrect) {
      this.selectedDepartmentCode = temp;
      this.changeDepartment(this.selectedDepartmentCode);
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
          this.changeDepartment(this.selectedDepartmentCode);
        }
      });
    }
  }

  /**
   * 切换科室时需要更新的疫苗数据
   * @param department
   */
  changeDepartment(department) {
    this.initQueueList(department);
    this.loadVaccineListByDept();
    this.loadFacilityInfo();
    this.platformService.querySuccessData();
    this.platformService.queryVaccineDoseInfo();
  }

  callNumber(event) {
    if (!this.currentQueueItem) {
      this.platformService.warning('当前无叫号信息！');
      return;
    }
    if (this.platformService.vaccinationStatus === VACCINATE_STATUS.finished) {
      this.platformService.success('已完成接种！');
      return;
    }
    if (this.platformService.vaccinationStatus === VACCINATE_STATUS.cancel) {
      this.platformService.success('已取消接种！');
      return;
    }
    this.isCallNumberDisabled = true;
    this.currentQueueItem = this.platformService.initQueueData(this.currentQueueItem);
    console.log('当前点击了叫号的按钮，开始叫号了........................................');
    console.log('当前叫号时的 currentQueueItem', this.currentQueueItem);
    console.log('当前叫号状态', this.platformService.vaccinationStatus, this.checkProfileFlag);
    if (this.platformService.vaccinationStatus === VACCINATE_STATUS.viewing || this.platformService.vaccinationStatus === VACCINATE_STATUS.vaccinating || this.platformService.vaccinationStatus === VACCINATE_STATUS.calling) {
      this.queueApiSvc.vaccinateCallNumber(this.currentQueueItem, resp => {
        if (resp.hasOwnProperty('code') && resp.code === 0) {
          this.message.success('叫号成功');
          this.platformService.vaccinationStatus = VACCINATE_STATUS.calling;
          // 在叫号成功之后，如果需要验证受种人，则将核验类型修改为受种人，同时核验结果修改为false
          if (this.checkProfileFlag) {
            this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.PROFILE);
            this.platformService.setIsCheckSuccess(false);
          } else {
            // 如果不需要核验受种人，则将核验类型修改为疫苗，同时受种人核验结果修改为true
            this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.VACCINE);
            this.platformService.setIsCheckSuccess(true);
          }
        } else {
          this.platformService.error('出错了！');
        }
      });
    }
    // else {
    //   this.queueApiSvc.repeatCallQueueCode(this.currentQueueItem, _ => {
    //     if (_.code === 0) {
    //       this.message.success('叫号成功');
    //     } else {
    //       this.platformService.error('出错了！');
    //     }
    //   });
    // }
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
        console.log('叫号bar中的叫号状态时', this.platformService.vaccinationStatus);
        // if (this.platformService.vaccinationStatus !== VACCINATE_STATUS.vaccinating) {
        //   this.platformService.vaccinationStatus = VACCINATE_STATUS.calling;
        //   console.log('叫号bar中的叫号状态时', this.platformService.vaccinationStatus);
        // }
        this.isCallNumberDisabled = false;
      }
    );
  }

  /**
   * 下一号的信息
   */
  nextNumber(event) {
    if (this.waitingQueueData.length === 0 && this.vaccinatingQueueData.length === 0) {
      this.platformService.warning('当前无排队受种人！');
      return;
    }
    if (this.platformService.vaccinationStatus === VACCINATE_STATUS.vaccinating) {
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
  }

  /**
   * 过号
   * @param event
   */
  passNumber() {
    if (this.vaccinatingQueueData.length === 1) {
      if (this.currentQueueItem) {
        this.currentQueueItem['actionTime'] = DateUtils.getFormatDateTime(this.currentQueueItem['actionTime']);
        this.currentQueueItem['createDate'] = DateUtils.getFormatDateTime(this.currentQueueItem['createDate']);
      }
      this.loading = true;
      this.queueApiSvc.vaccinatePassNumber(this.currentQueueItem, resp => {
        this.loading = false;
        if (resp.hasOwnProperty('code') && resp.code === 0) {
          this.message.success('过号成功!');
          this.platformService.setCurrentQueueItem(null);
          this.currentQueueItem = null;
          this.platformService.vaccinationStatus = VACCINATE_STATUS.none;
        } else {
          this.message.success('过号失败,请重试!');
        }
      });
    } else {
      this.platformService.warning('当前情况无需过号');
    }
  }

  /**
   * 叫下一号
   * @param queueItem
   * @param event
   */
  callNextNumber(queueItem, event) {
    this.isNextNumberDisabled = true;
    this.platformService.setCurrentQueueItem(null);
    // 如果需要核验受种人，则设置核验结果为不通过
    if (this.checkVaccineFlag) {
      this.platformService.setIsCheckSuccess(false);
    }
    // 排号信息里添加 当前科室编码
    queueItem = this.platformService.initQueueData(queueItem);
    // 叫下一号
    this.queueApiSvc.vaccineCallNextNumber(queueItem, resp => {
      // code === 0 说明叫号成功
      if (resp.hasOwnProperty('code') && resp.code === 0) {
        this.platformService.vaccinationStatus = VACCINATE_STATUS.calling;
        if (this.waitingQueueData.length > 0) {
          this.message.success('叫号成功');
          if (this.checkProfileFlag) {
            this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.PROFILE);
          } else {
            this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.VACCINE);
          }
          if (this.waitingQueueData.length > 3) {
            const param = {
              povCode: this.platformService.userInfo['pov'],
              profileName: this.waitingQueueData.length > 3 ? this.waitingQueueData[2]['profileName'] : this.waitingQueueData[this.waitingQueueData.length - 1]['profileName'],
              profileCode: this.waitingQueueData.length > 3 ? this.waitingQueueData[2]['profileCode'] : this.waitingQueueData[this.waitingQueueData.length - 1]['profileCode'],
              templateCode: 'vaccinateCallNum',
              order: this.waitingQueueData[2]['queueCode'],
              waitCount: '15',
            };
            this.vaccinateService.jPushCallNum(param, result => {
            });
          }
        }
      }
    });
    interval(1000).pipe(take(4)).subscribe((x: number) => {
        event.srcElement.innerHTML = '叫号中(' + (3 - x) + ')s';
      },
      error => {
      },
      () => {
        event.srcElement.innerHTML = '下一号';
        this.isNextNumberDisabled = false;
        // this.platformService.eventListenerFlag = 'scanProfile';
        // this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.PROFILE);
      }
    );
  }

  /**
   * 根据门诊接种台科室编码初始化队列信息
   * @param departmentCode 接种台科室编码
   */
  initQueueList(departmentCode) {
    if (this.departmentOption.length > 0) {
      this.selectedDepartmentName = this.departmentOption.find(option => option.departmentCode === departmentCode).departmentName;
      this.platformService.setSelectedDepartment(this.departmentOption.find(option => option.departmentCode === departmentCode));
    }
    this.platformService.iotTopic = this.iotInitSvc.getIotTopicByDepartmentCode(departmentCode);
    this.platformService.observeIotTopic = this.iotInitSvc.getObserveIotTopic();
    // 将选择的 科室 保存至 LocalStorage
    this.localSt.store(this.curVaccinationRoom, departmentCode);
    this.loadFacilityInfo();
    const vaccinateWaitMonitorTopic = this.platformService.vaccinateWaitTopic;
    const vaccinateWaitMonitorTopicWithDepartmentCode = this.platformService.vaccinateWaitTopic + '_' + departmentCode;
    const vaccinateCalledMonitorTopicShared = this.platformService.vaccinateCalledTopicShared + '_' + departmentCode;
    const vaccinateCalledMonitorTopic = this.platformService.vaccinateCalledTopic + '_' + departmentCode;
    const tenant = this.platformService.userInfo.pov;
    if (tenant === undefined || tenant.trim() === '') {
      this.platformService.warning('参数获取异常，请重新登录！');
      return;
    }
    // 接种台待叫号队列
    const waitUrl = this.platformService.pulsarUrl + tenant + '/' + this.platformService.pulsarNs + '/' + vaccinateWaitMonitorTopicWithDepartmentCode + '?messageId=latest';
    // 接种台叫号中队列
    const calledUrl = this.platformService.pulsarUrl + tenant + '/' + this.platformService.pulsarNs + '/' + vaccinateCalledMonitorTopic + '?messageId=latest';
    // if (this.waitingWs.connectSuccess) {
    //   this.waitingWs.onClose();
    // }
    this.waitingWs.connect(waitUrl);
    this.vaccinatingWs.connect(calledUrl);
    this.getWebsocketMessage();

    this.waitingWs.isOpen().subscribe(ev => {
      setTimeout(_ => {
        this.initTopic(this.platformService.vaccinateWaitTopicShared, vaccinateWaitMonitorTopic);
      }, 1000);
    });
    this.vaccinatingWs.isOpen().subscribe(ev => {
      setTimeout(_ => {
        this.initTopic(vaccinateCalledMonitorTopicShared, vaccinateCalledMonitorTopic);
      }, 1000);
    });
    this.platformService.setVaccinateDep(departmentCode);
  }

  changeFacility(event) {
    this.selectedFacilityCode = event;
    this.platformService.selectedFacilityCode = event;
    this.localSt.store(LOCAL_STORAGE.VACCINATE_REFRIGERATOR + this.selectedDepartmentCode, event);
  }

  /**
   * 从 websocket 连接中获取数据
   */
  getWebsocketMessage() {
    this.waitingSubscription.forEach(sub => sub.unsubscribe());
    this.vaccinatingSubscription.forEach(sub => sub.unsubscribe());
    // 排队中队列 - 待叫号队列
    const waitingSub = this.waitingWs.getMessage().subscribe(message => {
      if (!message.error) {
        // const data = JSON.parse(message.data);
        const properties = message.properties;
        if (properties.hasOwnProperty('msg')) {
          const wd = JSON.parse(properties.msg);
          this.waitingQueueData = wd.filter(msg => !msg.hasOwnProperty('passCount') || Number(msg.passCount).valueOf() === 0);
          this.passedQueueData = wd.filter(msg => msg.hasOwnProperty('passCount') && Number(msg.passCount).valueOf() > 0);
          this.platformService.waitingQueueData = this.waitingQueueData;
          this.platformService.passedQueueData = this.passedQueueData;
          if (this.waitingQueueData.length > 0) {
            this.nextQueueItem = this.platformService.initQueueData(this.waitingQueueData[0]);
          }
        }
      }
    });
    this.waitingSubscription.push(waitingSub);
    // 接种中队列 - 正在接种中的受种人
    const vaccinatingSub = this.vaccinatingWs.getMessage().subscribe(message => {
      console.log(' 接种中队列 - 当前正在接种的受种人信息', message);
      if (message && !message.error) {
        // const data = JSON.parse(message.data);
        const properties = message.properties;
        if (properties.hasOwnProperty('msg')) {
          this.vaccinatingQueueData = JSON.parse(properties.msg);
          this.platformService.vaccinatingQueueData = this.vaccinatingQueueData;
          console.log('消息队列中的接种中消息是', this.vaccinatingQueueData);
          if (this.vaccinatingQueueData.length > 0) {
            this.currentQueueItem = this.vaccinatingQueueData[0];
            this.platformService.setCurrentQueueItem(this.vaccinatingQueueData[0]);
            // if (!this.checkProfileFlag) {
            //   this.platformService.setIsCheckSuccess(true);
            // } else {
            //   this.platformService.setIsCheckSuccess(false);
            // }
            this.vaccinateService.queryVaccinateRecordSingleCount({globalRecordNumber: this.currentQueueItem.globalRecordNumber}, countResp => {
              console.log('消息队列中，查询接种记录的返回值是', countResp);
              if (countResp.code === 0 && countResp.data[0].count > 0) {
                // 如果需要核验受种人，则提示
                if (this.checkProfileFlag) {
                  this.platformService.warning('请核验受种人信息！');
                }
                // 当前叫号状态改为接种中
                this.platformService.vaccinationStatus = VACCINATE_STATUS.vaccinating;
                this.platformService.setCurrentQueueItem(this.currentQueueItem);
              } else {
                this.platformService.vaccinationStatus = VACCINATE_STATUS.calling;
                if (this.checkProfileFlag) {
                  this.platformService.warning('请核验受种人信息！');
                }
              }
            });
          }
        }
      }
    });
    this.vaccinatingSubscription.push(vaccinatingSub);
  }

  initTopic(shared, monitor) {
    this.queueApiSvc.initQueueList(this.platformService.userInfo.pov, this.platformService.pulsarNs, shared, monitor, resp => {
      // console.log(resp);
    });
  }

  showVaccinateLog() {
    this.router.navigate(['/modules/vaccinate/vaccinate-log']);
  }

  breakageOpen() {
    this.platformService.setBreakageVisible(true);
  }

  getStatus() {
    return this.platformService.vaccinationStatus === '' ? '' : `(${this.platformService.vaccinationStatus})`;
  }
}

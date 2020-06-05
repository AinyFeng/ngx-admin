import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ColdStorageFacilityService,
  DepartmentConfigService,
  DepartmentInitService,
  IotInitService,
  QueueApiService,
  VACCINATE_STATUS,
  VaccinateService,
} from '@tod/svs-common-lib';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { UserService } from '@tod/uea-auth-lib';
import { Subscription } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { VaccinatePlatformService } from '../vaccinate-platform.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { WaitingWebsocketService } from '../waiting-websocket.service';
import { VaccinatingWebsocketService } from '../vaccinating-websocket.service';

@Component({
  selector: 'uea-obsvaccinate-call-bar',
  templateUrl: './vaccinate-call-bar.component.html',
  styleUrls: ['./vaccinate-call-bar.component.scss'],
})
export class VaccinateCallBarComponent implements OnInit, OnDestroy {

  @Input()
  isShow: boolean = true;
  @Input()
  showCard: boolean = true;
  // 当前排号信息
  currentQueueItem: any;

  waitingQueueData: any[] = [];
  vaccinatingQueueData: any[] = [];
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
  // 用于 LocalStorage 保存选择的科室
  private readonly curVaccinationRoom: string = 'curVaccinationRoom';

  private subscription: Subscription[] = [];

  private waitingSubscription: Subscription[] = [];

  private vaccinatingSubscription: Subscription[] = [];

  constructor(
    private router: Router,
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
    private platformService: VaccinatePlatformService) {
  }

  ngOnInit() {
    this.initUserInfo();
    this.initCurrentQueueItem();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
    this.waitingSubscription.forEach(sub => sub.unsubscribe());
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
    const params = { belongDepartmentCode: this.selectedDepartmentCode };
    this.departmentConfigService.getVaccineListByDept(params, resp => {
      if (resp.code === 0) {
        this.platformService.vaccineList = resp.data;
      }
    });
  }

  /**
   * 加载设备表信息
   */
  loadFacilityInfo() {
    if (!this.platformService.userInfo) return;
    const params = {
      belongPovCode: this.platformService.userInfo.pov,
      belongDepartmentCode: this.selectedDepartmentCode,
      facilityStatus: '0'
    };
    this.coldStorageFacilityService.queryColdStorageFacilityInfo(params, resp => {
      if (resp['code'] === 0) {
        if (!!resp['data'] && resp['data'].length > 0) {
          console.log('resp.data', resp.data);
          this.platformService.coldStorageFacilities = resp.data;
          this.coldStorageFacilitiesOption = resp.data;
          this.selectedFacilityCode = resp.data[0]['facilityCode'];
          this.platformService.selectedFacilityCode = resp.data[0]['facilityCode'];
        } else {
          this.platformService.error('接种台没有配置冰箱设备！', () => this.loadFacilityInfo());
          this.platformService.coldStorageFacilities = [];
          this.coldStorageFacilitiesOption = [];
        }
      } else {
        this.platformService.error('获取冰箱设备失败！', () => this.loadFacilityInfo());
      }
    }
    );
  }

  /**
   * 获取科室选项
   */
  getDepartmentOption() {
    if (!this.platformService.userInfo) return;
    this.departmentOption = this.departmentInitSvc.getDepartmentData('1');
    const defaultDepartment = this.departmentInitSvc.getDepartmentData('1')[0].departmentCode;
    this.selectedDepartmentCode = defaultDepartment;
    this.initQueueList(defaultDepartment);
    this.loadVaccineListByDept();
    this.loadFacilityInfo();
    this.platformService.querySuccessData();
  }

  initQueueList(event) {
    if (this.departmentOption.length > 0) {
      this.selectedDepartmentName = this.departmentOption.find(option => option.departmentCode === event).departmentName;
      this.platformService.setSelectedDepartment(this.departmentOption.find(option => option.departmentCode === event));
    }
    this.platformService.iotTopic = this.iotInitSvc.getIotTopicByDepartmentCode(event);
    this.platformService.observeIotTopic = this.iotInitSvc.getObserveIotTopic();
    // 将选择的 科室 保存至 LocalStorage
    this.localSt.store(this.curVaccinationRoom, event);
    this.loadFacilityInfo();
    const vaccinateWaitMonitorTopic = this.platformService.vaccinateWaitTopic;
    const vaccinateWaitMonitorTopicWithDepartmentCode = this.platformService.vaccinateWaitTopic + '_' + event;
    const vaccinateCalledMonitorTopicShared = this.platformService.vaccinateCalledTopicShared + '_' + event;
    const vaccinateCalledMonitorTopic = this.platformService.vaccinateCalledTopic + '_' + event;
    const tenant = this.platformService.userInfo.pov;
    if (tenant === undefined || tenant.trim() === '') {
      this.platformService.warning('参数获取异常，请重新登录！');
      return;
    }

    const waitUrl = this.platformService.pulsarUrl + tenant + '/' + this.platformService.pulsarNs + '/' + vaccinateWaitMonitorTopicWithDepartmentCode + '?messageId=latest';
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
  }

  changeFacility(event) {
    this.selectedFacilityCode = event;
    this.platformService.selectedFacilityCode = event;
  }
  /**
   * 从 websocket 连接中获取数据
   */
  getWebsocketMessage() {
    this.waitingSubscription.forEach(sub => sub.unsubscribe());
    this.vaccinatingSubscription.forEach(sub => sub.unsubscribe());
    // 排队中队列
    const waitingSub = this.waitingWs.getMessage().subscribe(message => {
      if (!message.error) {
        const properties = message.properties;
        if (properties.hasOwnProperty('msg')) {
          this.waitingQueueData = JSON.parse(properties.msg);
          this.platformService.waitingQueueData = this.waitingQueueData;
          this.platformService.refreshWaitingQueueData();
        }
      }
    });
    this.waitingSubscription.push(waitingSub);
    // 接种中队列
    const vaccinatingSub = this.vaccinatingWs.getMessage().subscribe(message => {
      if (message && !message.error) {
        // const data = JSON.parse(message.data);
        const properties = message.properties;
        if (properties.hasOwnProperty('msg')) {
          this.vaccinatingQueueData = JSON.parse(properties.msg);
          this.platformService.vaccinatingQueueData = this.vaccinatingQueueData;
          if (this.vaccinatingQueueData.length > 0) {
            this.platformService.setCurrentQueueItem(this.vaccinatingQueueData[0]);
            this.platformService.eventListenerFlag = 'scanVaccine';
            this.platformService.vaccinationStatus = VACCINATE_STATUS.vaccinating;
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

  breakageOpen() {
    this.platformService.setBreakageVisible(true);
  }

  getStatus() {
    return this.platformService.vaccinationStatus === '' ? '' : `(${this.platformService.vaccinationStatus})`;
  }
}

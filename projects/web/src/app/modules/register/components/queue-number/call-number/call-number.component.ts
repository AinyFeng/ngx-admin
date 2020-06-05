import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output, ViewChild, ViewContainerRef,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';
import { ConfigService } from '@ngx-config/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import {
  QueueApiService,
  RegQueueService,
  QueueListService,
  IotInitService,
  DepartmentInitService,
  PROFILE,
  QUEUE_ROOM_TYPE
} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-s-queue-number',
  templateUrl: './call-number.component.html',
  styleUrls: ['./call-number.component.scss'],
  providers: [QueueApiService]
})
/**
 * 叫号 排号 组件
 * 功能： 叫号 下一个
 */
export class CallNumberComponent implements OnInit, OnDestroy {
  expand = false;

  // pulsar key
  private readonly pulsarJsonKey = 'pulsar';

  callPause = false;

  collapse = false;

  // 叫号按钮文本
  callBtn = '叫号';
  // 叫下一个
  callNextBtn = '下一个';
  // 用户信息
  userInfo: any;

  // 当前叫号信息
  regQueue: any;

  // 下一个叫号信息
  nextRegQueue: any;
  // 已选择的登记台，用于叫号播报
  selectedRegistDesk: any;
  // 登记台的数量，理论上应该从后台获取
  registDeskOption = [];
  // 已选择的登记台对象
  selectedRegistDeskObj: any;
  // iotTopic
  iotTopic: any;
  // name space
  nameSpace: string;
  // pulsar json 数据
  pulsarJson: any;

  private readonly subscription: Subscription[] = [];

  queueWaiting = 0;

  // 叫号操作触发之后，将叫号的受种人信息全部传递到父组件 register中
  @Output()
  readonly callNumberEvent = new EventEmitter<any>();

  constructor(
    private regQueueApi: RegQueueService,
    private userSvc: UserService,
    private queueListSvc: QueueListService,
    private msg: NzMessageService,
    private queueApiSvc: QueueApiService,
    private iotInitSvc: IotInitService,
    private configSvc: ConfigService,
    private localSt: LocalStorageService,
    private departmentInitSvc: DepartmentInitService,
    private hostEle: ElementRef
  ) {
    this.pulsarJson = this.configSvc.getSettings(this.pulsarJsonKey);
    this.nameSpace = this.pulsarJson.pulsarNameSpace;
    const sub = this.userSvc
      .getUserInfoByType()
      .subscribe(user => (this.userInfo = user));
    this.subscription.push(sub);
    const desk = this.localSt.retrieve(PROFILE.REGISTER_DESK);
    if (desk) {
      this.selectedRegistDeskObj = desk;
      this.selectedRegistDesk = desk.departmentName + '.' + desk.departmentCode;
      this.queueListSvc.setRegistDesk(desk);
    }
  }

  ngOnInit() {
    // 获取部门(登记台科室)信息
    // 登记台可叫号科室类别
    const registerCallableDepartment = ['0'];
    this.registDeskOption = this.departmentInitSvc.getDepartmentDataByDepartmentList(registerCallableDepartment);
    const sub = this.queueListSvc
      .getCallNumber()
      .subscribe((regQueueNumber: any) => {
        // console.log('叫号队列传递过来的是************', regQueueNumber);
        // 如果传递过来的值不为空，则将值显示在叫号中
        // if (!CommonUtils.checkJsonObjectEmpty(regQueueNumber)) {
        // this.regQueue = regQueueNumber;
        if (regQueueNumber && Object.keys(regQueueNumber).length > 0) {
          this.regQueue = regQueueNumber;
        }
        // }
      });
    const sub2 = this.queueListSvc.getNextQueueItem().subscribe(nextQueueItem => {
      this.nextRegQueue = nextQueueItem;
    });
    this.subscription.push(sub);
    this.subscription.push(sub2);

    // 订阅排队队列的数量，如果没有叫号，则直接显示count 总数，如果已经叫号，则显示count - 1的数量
    const sub4 = this.queueListSvc
      .getQueueCount()
      .subscribe(count => (this.queueWaiting = count));
    this.subscription.push(sub4);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  /**
   * 只是叫号功能，不修改状态
   */
  callQueueCode() {
    if (!this.selectedRegistDesk) {
      this.msg.info('请先选择登记台科室');
      return;
    }
    if (!this.regQueue) {
      this.msg.info('当前无可叫号信息');
      return;
    }
    this.callPause = true;
    this.iotTopic = this.iotInitSvc.getIotTopicByDepartmentCode(
      this.selectedRegistDeskObj.departmentCode
    );
    const param = {
      queueCode: this.regQueue['queueCode'],
      povCode: this.regQueue['povCode'],
      curRoom: this.selectedRegistDeskObj['departmentCode'],
      curRoomName: this.selectedRegistDeskObj['departmentName'],
      iotTopic: this.iotTopic,
      queueRoomType: QUEUE_ROOM_TYPE.regist,
      nameSpace: this.nameSpace,
      profileName: this.regQueue['profileName'] ? this.regQueue['profileName'] : ''
    };
    this.queueApiSvc.repeatCallQueueCode(param, _ => {
      if (_.code === 0) {
        this.msg.success('叫号成功');
        this.callNumberEvent.emit(this.regQueue);
      }
    });
    let number = interval(1000);
    this.callBtn = '3s后叫号';
    const sub = number.pipe(take(3)).subscribe(num => {
      this.callBtn = `${2 - num}s后叫号`;
      this.callPause = 2 - num !== 0;
      if (!this.callPause) {
        this.callBtn = '叫号';
      }
    });
    this.subscription.push(sub);
  }

  /**
   * 登记台台号切换事件
   * @param ev
   */
  selectRegistDeskChange(ev) {
    // console.log(ev);
    ev.split('.');
    const desk = {
      departmentCode: ev.split('.')[1],
      departmentName: ev.split('.')[0]
    };
    this.localSt.store(PROFILE.REGISTER_DESK, desk);
    this.selectedRegistDeskObj = desk;
    this.iotTopic = this.iotInitSvc.getIotTopicByDepartmentCode(
      desk.departmentCode
    );
    if (this.iotTopic[0] === IotInitService.INVALID_TOPIC) {
      this.msg.warning('该登记台没有关联叫号设备，请及时设置，否则无法在叫号屏中进行叫号');
    }
    this.queueListSvc.setRegistDesk(desk);
  }

  /**
   * 叫 下一号 的方法
   * 如果传了 globalRecordNumber 则表示叫当前号，不修改当前号的状态，也不刷新队列
   * 如果没有传，则叫下一号
   */
  callNextQueueCode() {
    if (!this.selectedRegistDesk) {
      this.msg.info('请先选择登记台科室');
      return;
    }
    if (this.queueWaiting === 0) {
      this.msg.info('当前无可叫号数据');
      return;
    }
    // 叫下一号的方法在本功能中，只是触发这个叫下一号的操作，具体的叫号逻辑交付给 queue-list 组件去做
    this.queueListSvc.setCallNext(this.nextRegQueue);
    let number = interval(1000);
    this.callNextBtn = '3s后叫号';
    this.callPause = true;
    const sub = number.pipe(take(3)).subscribe(num => {
      this.callNextBtn = `${2 - num}s后叫号`;
      this.callPause = 2 - num !== 0;
      if (!this.callPause) {
        this.callNextBtn = '下一个';
      }
    });
    this.subscription.push(sub);
    // console.info('当前叫号', globalRecordNumber);
  }

  /**
   * 叫号事件传递
   * @param ev
   */
  onCallNumber(ev) {
    this.callNumberEvent.emit(ev);
  }
}

import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { NbDialogService } from '@nebular/theme';
import { ConfigService } from '@ngx-config/core';
import { distinctUntilChanged, throttleTime } from 'rxjs/operators';
import {
  RegQueueService, WebsocketService, WebsocketPassService, QueueApiService,
  QueueListService, IotInitService, SysConfInitService, REG_QUEUE_STATUS,
  REG_QUEUE_ACTION, QUEUE_ROOM_TYPE
} from '@tod/svs-common-lib';
import { ConfirmDialogComponent } from '../../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'uea-queue-list-drawer',
  templateUrl: './queue-list.component.html',
  styleUrls: ['./queue-list.component.scss'],
  providers: [
    RegQueueService,
    WebsocketService,
    WebsocketPassService,
    QueueApiService
  ]
})
export class QueueListComponent implements OnInit, OnDestroy {
  collapse = false;

  // pulsar key
  private readonly pulsarJsonKey = 'pulsar';

  private readonly pulsarUrlKey = 'pulsarUrl';

  // 待叫号列表
  lineData = [];
  // 已过号队列
  passedQueueData = [];

  private subscription: Subscription[] = [];

  userInfo: any;

  lineDataLoading = false;
  passedQueueDataLoading = false;

  // pulsar 配置信息
  pulsarJson: any;
  // pulsar 命名空间
  pulsarNs: string;
  // pulsar 订阅类型
  registSubType: string;
  // 已发送给叫号小屏的数据
  sendData: any = null;


  /**
   * 登记台待叫号共享队列
   */
  registWaitSharedTopic: string;
  /**
   * 登记台已叫号共享队列
   */
  registPassSharedTopic: string;
  /**
   * 登记台待叫号订阅队列
   */
  registWaitTopic: string;

  /**
   * 登记台已叫号订阅队列
   */
  registPassTopic: string;

  /**
   * 登记台台号
   */
  registDesk: any;
  /**
   * iot 设备主题
   */
  iotTopic: any;

  private queueCallDelay = 0;

  pulsarUrl: string;

  private callNextNumber$ = new BehaviorSubject<any>(null);

  @Output()
  readonly callNumberEvent = new EventEmitter();
  /**
   * 已过号队列，状态为已叫号或者叫号中
   */
  calledData = [];

  constructor(
    private regQueueApi: RegQueueService,
    private user: UserService,
    private msg: NzMessageService,
    private queueListSvc: QueueListService,
    private dialogSvc: NbDialogService,
    private waitingWs: WebsocketService,
    private passedWs: WebsocketPassService,
    private queueApiSvc: QueueApiService,
    private iotInitSvc: IotInitService,
    private configSvc: ConfigService,
    private sysConfSvc: SysConfInitService
  ) {
    this.initSysConfSettings();
    this.pulsarJson = this.configSvc.getSettings(this.pulsarJsonKey);
    this.registWaitSharedTopic = this.pulsarJson.registWaitTopicShared;
    this.registPassSharedTopic = this.pulsarJson.registPassTopicShared;
    this.registWaitTopic = this.pulsarJson.registWaitTopic;
    this.registPassTopic = this.pulsarJson.registPassTopic;
    this.pulsarNs = this.pulsarJson.pulsarNameSpace;
    this.registSubType = this.pulsarJson.registSubscriptionType;
    const sub = this.user
      .getUserInfoByType()
      .subscribe(resp => {
        this.userInfo = resp;
        // 使用用户编码作为订阅websocket的订阅号码
        // 使用 reader 模式
        // 租户 当前暂时使用povCode，topic 所有的用户固定使用同一个，订阅者 所有的用户使用自己的 povCode
        // messageId = earliest 用来保证获取所有的数据
        const tenant = this.userInfo.pov,
          pov = this.userInfo.pov;

        const passedUrl = this.pulsarUrl + tenant + '/' + this.pulsarNs + '/' + this.registPassTopic + '/' + pov + '?messageId=latest';
        this.passedWs.connect(passedUrl);

        const url = this.pulsarUrl + tenant + '/' + this.pulsarNs + '/' + this.registWaitTopic + '/' + pov + '?messageId=latest';
        this.waitingWs.connect(url);
      });
    this.subscription.push(sub);
  }

  ngOnInit() {
    // 订阅从登记台叫号小屏传递过来的叫号数据
    const sub1 = this.queueListSvc.getCallNext().subscribe(nextData => {
      this.callNextNumber$.next(nextData);
    });
    this.subscription.push(sub1);

    const sub = this.callNextNumber$.pipe(distinctUntilChanged()).subscribe(nextData => {
      if (nextData === '0') return;
      if (nextData) {
        this.regCall(nextData);
      } else {
        if (this.lineData.length > 0) {
          this.regCall(this.lineData[0]);
        }
      }
    });

    this.subscription.push(sub);

    // 订阅登记台台号
    const sub2 = this.queueListSvc.getRegistDesk().pipe(distinctUntilChanged()).subscribe(desk => {
      // console.log('登记台台号是', desk);
      if (desk === '0') return;
      if (desk) {
        // console.log(desk);
        this.registDesk = desk;
        this.iotTopic = this.iotInitSvc.getIotTopicByDepartmentCode(
          desk.departmentCode
        );
        // console.log(this.iotTopic);
      }
    });
    this.subscription.push(sub2);

    // 订阅待叫号队列
    const sub3 = this.waitingWs.getMessage().subscribe(message => {
      if (message) {
        const data = JSON.parse(message.data);
        if (data.hasOwnProperty('error')) return;
        // console.log('待叫号队列获取到的消息', data);
        const properties = data.properties;
        if (!properties.hasOwnProperty('msg')) return;
        const wd = JSON.parse(properties.msg);
        // console.log('待叫号队列获取到的消息', wd);
        this.lineData = wd;
        if (this.lineData.length > 0) {
          this.queueListSvc.setNextQueueItem(this.lineData[0]);
        } else {
          this.queueListSvc.setNextQueueItem(null);
        }
        this.queueListSvc.setQueueCount(this.lineData.length);
      }
    });
    this.subscription.push(sub3);

    // 初始化待叫号队列信息
    this.lineDataLoading = true;
    const sub4 = this.waitingWs.isOpen().subscribe(_ => {
      timer(500).subscribe(
        __ => {
          // 初始化待叫号队列信息
          this.initQueueList(
            this.userInfo.pov,
            this.pulsarNs,
            this.registWaitSharedTopic,
            this.registWaitTopic,
            true
          );
        },
        error => {
        },
        () => this.lineDataLoading = false);
    });
    this.subscription.push(sub4);

    // 订阅已叫号队列
    const sub5 = this.passedWs.getMessage().subscribe(message => {
      if (message) {
        console.log('订阅已叫号队列', message);
        // const data = message;
        const data = JSON.parse(message.data);
        if (data.hasOwnProperty('error')) return;
        // console.log('已叫号队列获取到的消息', data)
        const pd = JSON.parse(data.properties.msg);
        pd.sort((a, b) => {
          return b['actionTime'] - a['actionTime'];
        });
        // const passedQueueData = [];
        // const calledData = [];
        // pd.forEach(p => {
        //   // 状态为 0 - 待登记， 1 - 登记中
        //   if (p.curStatus === '1' || p.curStatus === '0') {
        //     calledData.push(p);
        //   } else {
        //     passedQueueData.push(p);
        //   }
        // });
        // passedQueueData.sort((a, b) => {
        //   return b['actionTime'] - a['actionTime'];
        // });
        // calledData.sort((a, b) => {
        //   return b['actionTime'] - a['actionTime'];
        // });
        console.log('2.已叫号队列获取到的消息', pd);
        this.passedQueueData = pd;
        // this.calledData = calledData;
      }
    });
    this.subscription.push(sub5);

    // 初始化已叫号队列信息
    this.passedQueueDataLoading = true;
    const sub6 = this.passedWs.isOpen().subscribe(_ => {
      timer(1000).subscribe(
        __ => {
          // 初始化已叫号队列信息
          this.initQueueList(
            this.userInfo.pov,
            this.pulsarNs,
            this.registPassSharedTopic,
            this.registPassTopic,
            false
          );
        },
        error => {
        },
        () => this.passedQueueDataLoading = false);
    });
    this.subscription.push(sub6);

    // const delayTimeSub = timer(4000).subscribe(_ => {
    //   this.refreshQueue();
    //   this.lineDataLoading = false;
    //   this.passedQueueDataLoading = false;
    // });
    // this.subscription.push(delayTimeSub);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
    this.queueListSvc.clearQueueListMessage();
  }

  /**
   * 初始化系统配置项
   */
  initSysConfSettings() {
    this.pulsarUrl = this.sysConfSvc.getConfValue(this.pulsarUrlKey);
  }

  // 叫号 - 待叫号列表的操作
  regCall(data: any) {
    // console.info(data);
    if (data === null) return;
    if (!this.registDesk) {
      this.msg.info('请先设置登记台');
      return;
    }
    this.lineDataLoading = true;
    let param = {
      povCode: this.userInfo.pov,
      curStatus: REG_QUEUE_STATUS.TO_REGISTER, // 0 --> 后台接口会将状态修改为 1 --- 即登记中
      curAction: REG_QUEUE_ACTION.REGISTER_CALL, // 1
      curRoom: this.userInfo.department,
      curRoomName: this.registDesk['departmentName'],
      curDoc: this.userInfo.userCode,
      messageId: data['messageId'],
      registWaitTopic: this.registWaitTopic,
      registPassTopic: this.registPassTopic,
      globalRecordNumber: data['globalRecordNumber'],
      nameSpace: this.pulsarNs,
      businessType: data['businessType'],
      passStatus: data['passStatus'],
      queueCode: data['queueCode'],
      registWaitTopicShared: this.registWaitSharedTopic,
      registPassTopicShared: this.registPassSharedTopic,
      iotTopic: this.iotTopic,
      queueRoomType: QUEUE_ROOM_TYPE.regist,
      profileName: data['profileName'] ? data['profileName'] : '',
      profileCode: data['profileCode'],
      queueDelay: this.queueCallDelay
    };

    this.queueApiSvc.callNextQueueCode(param, resp => {
      this.lineDataLoading = false;
      // console.info('4. 叫完下一号的返回值', resp);
      // code === 0 说明叫号成功
      console.log('resp ', resp);
      let call = null;
      if (resp.code === 0) {
        if (Object.keys(resp.data).length === 0) {
          this.msg.info('已无可叫号数据');
        } else {
          call = resp.data;
        }
        this.sendData = call;
        // 将当前叫号的信息发给叫号组件
        this.queueListSvc.setCallNumber(this.sendData);
        this.callNumberEvent.emit(data);
      } else {
        this.msg.warning('叫号失败，请重试');
      }
    });
  }

  // 从叫号列表中直接叫号
  regDirectlyCall(data: any) {
    if (!this.registDesk) {
      this.msg.info('请先设置登记台');
      return;
    }
    let param = {
      povCode: this.userInfo.pov,
      curStatus: REG_QUEUE_STATUS.TO_REGISTER, // 0 --> 后台接口会将状态修改为 1 --- 即登记中
      curAction: REG_QUEUE_ACTION.REGISTER_CALL, // 1
      curRoom: this.userInfo.department,
      curRoomName: this.registDesk['departmentName'],
      curDoc: this.userInfo.userCode,
      messageId: data['messageId'],
      registWaitTopic: this.registWaitTopic,
      registPassTopic: this.registPassTopic,
      globalRecordNumber: data['globalRecordNumber'],
      nameSpace: this.pulsarNs,
      businessType: data['businessType'],
      passStatus: data['passStatus'],
      queueCode: data['queueCode'],
      registWaitTopicShared: this.registWaitSharedTopic,
      registPassTopicShared: this.registPassSharedTopic,
      iotTopic: this.iotTopic,
      queueRoomType: QUEUE_ROOM_TYPE.regist,
      profileName: data['profileName'] ? data['profileName'] : '',
      profileCode: data['profileCode']
    };
    this.queueApiSvc.callQueueCode(param, resp => {
      this.passedQueueDataLoading = false;
      if (resp.code === 0) {
        this.sendData = data;
        // 将当前叫号的信息发给叫号组件
        this.queueListSvc.setCallNumber(this.sendData);
        // 将当前叫号的count 数据传递给 call-number
        this.callNumberEvent.emit(data);
      }
    });
  }

  /**
   * 重新叫号 - 已叫号列表，并不修改排队数据的状态
   * 将当前叫号的排队数据发送到叫号小屏
   * 也不需要将数据发送到其他任何消息队列
   * @param data
   */
  reRegCall(data: any) {
    if (!this.registDesk) {
      this.msg.info('请先设置登记台');
      return;
    }
    this.dialogSvc.open(ConfirmDialogComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: false,
      closeOnEsc: false,
      context: {
        title: '消息提示',
        content: `号码【${data['queueCode']}】-【${data['profileName'] ? data['profileName'] : ''}】已经叫过号了，是否重新叫号？`
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        // console.log('待叫号列表重新叫号', data);
        this.passedQueueDataLoading = true;
        let param = {
          povCode: this.userInfo.pov,
          curStatus: REG_QUEUE_STATUS.TO_REGISTER, // 0 --> 后台接口会将状态修改为 1 --- 即登记中
          curAction: REG_QUEUE_ACTION.REGISTER_CALL, // 1
          curRoom: this.userInfo.department,
          curRoomName: this.registDesk['departmentName'],
          curDoc: this.userInfo.userCode,
          messageId: data['messageId'],
          registWaitTopic: this.registWaitTopic,
          registPassTopic: this.registPassTopic,
          globalRecordNumber: data['globalRecordNumber'],
          nameSpace: this.pulsarNs,
          businessType: data['businessType'],
          passStatus: data['passStatus'],
          queueCode: data['queueCode'],
          registWaitTopicShared: this.registWaitSharedTopic,
          registPassTopicShared: this.registPassSharedTopic,
          iotTopic: this.iotTopic,
          queueRoomType: QUEUE_ROOM_TYPE.regist,
          profileName: data['profileName'] ? data['profileName'] : '',
          profileCode: data['profileCode']
        };
        this.queueApiSvc.repeatCallQueueCode(param, resp => {
          this.passedQueueDataLoading = false;
          if (resp.code === 0) {
            this.sendData = data;
            // 将当前叫号的信息发给叫号组件
            this.queueListSvc.setCallNumber(data);
            // 将当前叫号的count 数据传递给 call-number
            this.callNumberEvent.emit(data);
          }
        });
      }
    });
  }

  toggle() {
    this.collapse = !this.collapse;
  }

  /**
   * 初始化待叫号队列和已叫号队列
   */
  initQueueList(povCode: string, nameSpace: string, waitTopicSharedPath: string, waitTopicPath: string, showAlert: boolean) {
    this.queueApiSvc.initQueueList(
      povCode,
      nameSpace,
      waitTopicSharedPath,
      waitTopicPath,
      resp => {
        // console.log(resp);
        if (resp.code === 0 && !!showAlert) {
          this.msg.success('待叫号数据刷新成功');
        }
      }
    );
  }

  refreshQueue() {
    // 初始化待叫号队列信息
    this.initQueueList(
      this.userInfo.pov,
      this.pulsarNs,
      this.registWaitSharedTopic,
      this.registWaitTopic,
      true
    );
    // 初始化已叫号队列信息
    this.initQueueList(
      this.userInfo.pov,
      this.pulsarNs,
      this.registPassSharedTopic,
      this.registPassTopic,
      false
    );
  }
}

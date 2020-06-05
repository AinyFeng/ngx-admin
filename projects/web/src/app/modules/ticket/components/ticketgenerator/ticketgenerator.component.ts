import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { NbDialogService } from '@nebular/theme';
import { ScanDialogComponent } from '../scan-dialog/scan-dialog.component';
import { UserService } from '@tod/uea-auth-lib';
import { Subscription, timer } from 'rxjs';
import { ConfigService } from '@ngx-config/core';
import {
  QueueApiService,
  WaitingSelfService,
  RegQueueService,
  ProfileService,
  QUEUE_ROOM_TYPE,
  DateUtils,
  SysConfInitService
} from '@tod/svs-common-lib';

@Component({
  selector: 'mds-ticketgenerator-component',
  templateUrl: './ticketgenerator.component.html',
  styleUrls: ['./ticketgenerator.component.scss'],
  providers: [QueueApiService]
})
export class TicketGeneratorComponent implements OnInit, OnDestroy {
  childCode = '';
  count = 0;
  // 用户信息
  userInfo: any;
  // 展示的待叫号数据
  waitingData = [];
  // 步骤
  stepIndex = '1';
  // 设置锁定屏幕的密码
  lockCode = '';

  // 待叫号公共队列
  registWaitTopicShared: string;

  // 待叫号订阅队列
  registWaitTopic: string;

  /**
   * 选中的一条记录
   */
  selectedRecord: any;

  vaccineCode = '';

  private readonly subscription: Subscription[] = [];

  // pulsar 配置信息
  pulsarJson: any;

  pulsarUrl: string;
  nameSpace: string;

  vaccineOptions = [
    { label: '乙肝', value: '02', checked: false },
    { label: '麻腮风', value: '09', checked: false },
    { label: '肺炎球菌', value: '25', checked: false },
    { label: '流感', value: '21', checked: false },
    { label: '狂犬', value: '28', checked: false },
    { label: '人乳头瘤', value: '55', checked: false }];

  // 全屏
  fullScreen = false;
  // 提示对话框
  dialogRefTemplate: any;
  // 密码输入错误提示
  errorMsg: string;
  // 打印小票 template
  @ViewChild('printCall', { static: false }) printReceipt: any;
  // 选择一条记录
  @ViewChild('profiledDialog', { static: false }) profileResultTemplate: any;
  // 当前叫号信息
  callNumber: any;
  /**
   * 是否打印小票
   */
  printQueueNo = false;

  printQueueNoKey = 'printQueueNoAfterRetrieving';

  constructor(
    private api: WaitingSelfService,
    private regQueueApi: RegQueueService,
    private msg: NzMessageService,
    private dialogService: NbDialogService,
    private userService: UserService,
    private profileSvc: ProfileService,
    private userSvc: UserService,
    private queueApiSvc: QueueApiService,
    private configService: ConfigService,
    private sysConfSvc: SysConfInitService
  ) {
  }

  ngOnInit() {
    this.printQueueNo = this.sysConfSvc.getConfValue(this.printQueueNoKey) === '1';
    this.pulsarJson = this.configService.getSettings('pulsar');
    this.userSvc.getUserInfoByType().subscribe(user => (this.userInfo = user));
    this.registWaitTopicShared = this.pulsarJson.registWaitTopicShared;
    this.registWaitTopic = this.pulsarJson.registWaitTopic;
    this.nameSpace = this.pulsarJson.pulsarNameSpace;
    this.pulsarUrl = this.pulsarJson.pulsarUrl;
    const sub1 = this.userService.getUserInfoByType().subscribe(user => {
      // console.info('获取user信息', user);
      this.userInfo = user;
      // 使用用户编码作为订阅websocket的订阅号码
      // 使用 reader 模式
      // 租户 当前暂时使用povCode，topic 所有的用户固定使用同一个，订阅者 所有的用户使用自己的 povCode
      // messageId = earliest 用来保证获取所有的数据
      // const tenant = this.userInfo.pov, pov = this.userInfo.pov;

      // const waitingUrl = this.pulsarUrl + tenant + '/' + this.nameSpace + '/' + this.registWaitTopic + '/' + pov + '?messageId=latest';
      // this.waitingWs.connect(waitingUrl);
    });
    this.subscription.push(sub1);

    // 订阅待叫号队列
    // this.waitingWs.getMessage().subscribe(message => {
    //   const data = JSON.parse(message.data);
    //   const properties = data.properties;
    //   if (!properties.hasOwnProperty('msg')) return;
    //   this.waitingData = JSON.parse(properties.msg);
    //   console.log('待叫号队列获取到的消息', this.waitingData);
    // });

    // const refreshSub = timer(4000).subscribe(_ => {
    //   this.refreshQueue();
    // });
    // this.subscription.push(refreshSub);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  getInjectInfo(businessType) {
    this.dialogService.open(ScanDialogComponent, {
      context: {
        businessType: businessType
      }
    }).onClose.subscribe(resp => {
      if (resp && resp.hasOwnProperty('regQueueCode')) {
        const regQueueCode = resp['regQueueCode'];
        this.addToCallNumberQueue(regQueueCode, businessType);
      }
      if (resp && resp.hasOwnProperty('idCardNo')) {
        const idCardNo = resp['idCardNo'];
        this.addToCallNumberQueue(null, businessType, idCardNo);
      }
    });
  }

  /**
   * 模拟取号
   * 使用档案编码 - 18位或者免疫接种卡号
   * @param isNull
   */
  simulation(isNull = false) {
    // 使用档案编码取号
    const profilesArr = [
      '340603060220180008',
      '340621030120180570',
      // '340604080120190107',
      '340621030120180570',
      '340621030120010005',
      '340621030120180570',
      '340621030119760012',
      '340621030120180571',
      '340621030120190003',
      '340621030120180569',
      '340621030119690005',
      '340621030120190074',
      '340621030120190008',
      '340621030120180584',
      '340621030120180585'
    ];
    const profile = profilesArr[Math.floor(Math.random() * profilesArr.length)];
    if (isNull) {
      this.addToCallNumberQueue('');
      return;
    }
    this.addToCallNumberQueue(profile);
  }

  /**
   * 将查到的档案信息添加到拍好队列中
   * @param businessType
   * @param regQueueCode
   * @param idCardNo 证件号码
   * @param vaccineCode 成人疫苗编号
   */
  addToCallNumberQueue(regQueueCode: string, businessType = 'A', idCardNo?: string) {
    let retrieveParam = {
      regQueueCode: regQueueCode,
      povCode: this.userInfo.pov,
      businessType: businessType,
      registWaitTopic: this.registWaitTopic,
      nameSpace: this.nameSpace,
      curDoc: this.userInfo.userCode,
      registWaitTopicShared: this.registWaitTopicShared,
      queueRoomType: QUEUE_ROOM_TYPE.regist,
      vaccineCode: this.vaccineCode
    };
    // 如果是儿童，则为监护人身份证号
    if (idCardNo) {
      retrieveParam['regQueueCode'] = idCardNo;
    }
    if (businessType === 'A' && regQueueCode !== '') {
      // 如果是儿童接种，则先查询受种人档案信息
      this.queueApiSvc.queryProfileBeforeRetrieve(retrieveParam, res => {
        if (res.code === 0) {
          const result = res.data;
          // 只查到一条数据
          if (result.length === 1) {
            retrieveParam['birthDate'] = result[0]['birthDate'] ? DateUtils.getFormatDateTime(result[0].birthDate) : null;
            retrieveParam['immunityVacCard'] = result[0]['immunityVacCard'] ? result[0]['immunityVacCard'] : null;
            retrieveParam['profileName'] = result[0]['name'] ? result[0]['name'] : '';
            retrieveParam['profileCode'] = result[0]['profileCode'] ? result[0]['profileCode'] : null;
            this.retrieveQueueCode(retrieveParam);
          }
          if (result.length > 1) {
            console.log(result);
            this.profileResultTemplate = this.dialogService.open(this.profileResultTemplate, {
              closeOnBackdropClick: false,
              closeOnEsc: false,
              context: {
                data: result
              }
            });
            this.profileResultTemplate.onClose.subscribe(r => {
              if (r) {
                console.log(r);
                retrieveParam['birthDate'] = r['birthDate'] ? DateUtils.getFormatDateTime(r['birthDate']) : null;
                retrieveParam['immunityVacCard'] = r['immunityVacCard'] ? r['immunityVacCard'] : null;
                retrieveParam['profileName'] = r['name'] ? r['name'] : '';
                retrieveParam['profileCode'] = r['profileCode'] ? r['profileCode'] : null;
                this.retrieveQueueCode(retrieveParam);
              }
            });
          }
          if (result.length === 0) {
            this.retrieveQueueCode(retrieveParam);
          }
        }
      });
    } else {
      this.retrieveQueueCode(retrieveParam);
    }
  }

  /**
   * 请求取号
   * @param retrieveParam
   */
  retrieveQueueCode(retrieveParam: any) {
    // 取号
    this.queueApiSvc.retrieve(retrieveParam, res => {
      console.log('取号返回值', res);
      if (res.code === 0) {
        this.msg.success('取号成功');
        this.callNumber = res.data;
        // TODO: print tips
        if (this.printQueueNo) {
          const sub = timer(1000).subscribe(_ => {
            this.printReceipt.print(false);
          });
          this.subscription.push(sub);
        }
      } else {
        // this.msg.warning(res.msg);
      }
    });
  }

  /**
   * 锁定全屏
   */
  lockFullScreen(dialog: TemplateRef<any>) {
    if (!this.fullScreen) {
      this.fullScreen = !this.fullScreen;
      return;
    }

    this.dialogRefTemplate = this.dialogService.open(dialog, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: false
    });
  }

  closeDialog(close?: boolean) {
    if (close) {
      this.dialogRefTemplate.close();
      this.errorMsg = '';
      this.lockCode = '';
    } else {
      if (this.lockCode === this.userInfo.userCode) {
        this.dialogRefTemplate.close();
        this.fullScreen = false;
        this.errorMsg = '';
      } else {
        this.errorMsg = '密码输入错误';
      }
      this.lockCode = '';
    }
  }

  changeLockCode() {
    this.errorMsg = '';
  }

  testRetrieve() {
    this.addToCallNumberQueue('110101199003076202', 'A');
  }

  /**
   * 选择事件监听
   * @param ev
   * @param indx
   */
  onCheckedChange(ev, indx) {
    if (!ev) {
      return;
    }
    for (let i = 0; i < this.vaccineOptions.length; i++) {
      if (i === indx) {
        this.vaccineCode = this.vaccineOptions[i]['value'];
        continue;
      }
      this.vaccineOptions[i].checked = false;
    }
  }
}

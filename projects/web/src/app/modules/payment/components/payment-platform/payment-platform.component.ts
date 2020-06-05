/**
 * Created by Administrator on 2019/5/20.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '@ngx-config/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { interval, Subscription, timer } from 'rxjs';
import {
  DateUtils,
  DicDataService,
  DictionaryPipe,
  PaymentService,
  PovInfoService,
  ProfileDataService,
  ProfileService,
  QueueApiService,
  REG_QUEUE_ACTION,
  REG_QUEUE_STATUS,
  RegistRecordService,
  RegQueueService,
  SysConfInitService,
  TransformUtils,
  WebsocketService,
  LodopPrintService
} from '@tod/svs-common-lib';
import { NbMomentDateService } from '@nebular/moment';
import { UserService } from '@tod/uea-auth-lib';
import { take } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { AlipayDialogComponent } from '../alipay-dialog/alipay-dialog.component';

@Component({
  selector: 'uea-payment-component',
  templateUrl: './payment-platform.component.html',
  styleUrls: ['./payment-platform.component.scss'],
  providers: [WebsocketService, QueueApiService, NbMomentDateService]
})
export class PaymentPlatformComponent implements OnInit, OnDestroy {
  error: boolean = false;

  // 设置点击的时间不能大于当前的时间
  currentDate = new Date();

  waitQueueLoading = false;
  passQueueLoading = false;

  orderLoading = false;

  // pulsar相关参数

  private subscription: Subscription[] = [];

  // pulsar 配置信息
  pulsarJson: any;
  // pulsar key
  private readonly pulsarJsonKey = 'pulsar';
  // pulsarUrl 链接地址
  pulsarUrl: string;
  // 连接地址的key
  pulsarUrlKey = 'pulsarUrl';
  // pulsar 命名空间
  pulsarNs: string;
  // pulsar 订阅类型
  paySubType: string;
  // 待缴费公共队列
  payWaitTopicShared: string;
  // 待缴费订阅队列
  payWaitTopic: string;
  // 已缴费公共队列
  payPassTopicShared: string;
  // 已缴费订阅队列
  payPassTopic: string;
  // 待接种公共队列
  vaccinateWaitTopicShared: string;
  // 待接种订阅队列
  vaccinateWaitTopic: string;

  // 收费信息查询表格
  searchForm: FormGroup;
  loading = false;

  currentNumber = '0000';

  // 待缴费号码/已缴费号码
  queueCode = '';


  // 受种人姓名
  // vaccinatePersonName = '';
  /**
   * 受种人档案信息
   */
  profile: any;

  // 受种人性别
  vaccinatePersonGender = '';

  // 订单号
  vaccinatePersonAge = '';

  //  等待缴费队列
  waitingPayQueues = [];

  // 已完成缴费队列
  finishPayQueues = [];

  // 订单数据
  orderData = [];

  // 订单数据
  orderFinishDatas = [];
  /**
   * 订单信息全选
   */
  selectPayAll = false;

  // 订单详情数据
  orderFinishDetailDatas = [];

  // 支付方式
  payWays = [];

  oldChooseData: any = [];
  chooseData: any = [];

  // 选择支付方式
  selectPayWay = '0';

  // 是否显示回执输入框
  isShowInput = false;

  // 订单总金额
  orderSumMoney: number = 0;

  // 支付金额
  payMoney: number = 0;

  // 找零金额
  changeMoney = 0;

  // 回执码
  receiptCode = '';

  // 支付按钮状态
  payBtnStatus = true;

  // 打印按钮状态
  printInvoiceBtnStatus = true;

  // 禁用状态
  disableStatus = true;

  // 支付方式是否禁用状态
  disableStatusA = false;

  // 工具款状态
  toolsVisible = false;

  // 支付宝状态码
  alipayStatusNumber;

  // 发票编码
  invoiceNumber;


  // 收银用户登录信息,登录用户信息
  userInfo: any;

  // 当前正在缴费的排队信息
  handlingQueueItem: any;

  // 消息发送延时设置
  queueCallDelay: any;
  private readonly queueCallDelayKey = 'queueDelay';

  // 是否点击了全选
  allCheck = false;

  // 切换订单信息的tab
  tabIndex = '0';

  // 切换到已缴费队列tab栏,禁止缴费,取消订单,金额的输入
  forbidBtn = false;
  /**
   * 待付款的订单编号集合
   */
  payArray = [];
  /**
   * 订单状态待缴费
   */
  ORDER_STATUS_FREE = '0'; // 免费
  ORDER_STATUS_TO_PAY = '1'; // 待缴费
  ORDER_STATUS_PAID = '2'; // 已缴费
  ORDER_STATUS_CANCEL = '3'; // 已取消
  ORDER_STATUS_VACCINATE_SUCCESS = '8'; // 接种完成
  ORDER_STATUS_VACCINATE_REFUND = '9'; // 已退款
  ORDER_STATUS_NO_NEED_TO_PAY = '4'; // 无需付款
  /**
   * 包含全部订单信息的数据
   */
  originalOrderData = [];
  /**
   * 当前受种人的全局流水号
   */
  globalRecordNumber: string;
  /**
   * 缴费金额正则校验
   */
  private numberReg = new RegExp('(^([1-9][0-9]*)+(\\.[0-9]{1,2})?$)|(^[1-9]\\d*$)');

  // 显示温馨提示
  showTips = false;
  // 拿到支付宝状态
  payAlipayStatus = false;

  // 打印机加载错误
  showError: boolean;

  constructor(
    private queueApiSvc: QueueApiService,
    private profileService: ProfileService,
    private dicDataService: DicDataService,
    private dictionaryPipe: DictionaryPipe,
    private paymentService: PaymentService,
    private userService: UserService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private povApiSvc: PovInfoService,
    private profileDataSvc: ProfileDataService,
    private waitingWs: WebsocketService,
    private configSvc: ConfigService,
    private regQueueService: RegQueueService,
    private msg: NzMessageService,
    private sysConfSvc: SysConfInitService,
    private momentSvc: NbMomentDateService,
    private regApiSvc: RegistRecordService,
    private dialogSvc: NbDialogService,
    private modalSvc: NzModalService,
    private printSvc: LodopPrintService
  ) {
    this.initSysConf();
    this.pulsarJson = this.configSvc.getSettings(this.pulsarJsonKey);
    this.payWaitTopicShared = this.pulsarJson.payWaitTopicShared;
    this.payWaitTopic = this.pulsarJson.payWaitTopic;
    this.payPassTopicShared = this.pulsarJson.payPassTopicShared;
    this.payPassTopic = this.pulsarJson.payPassTopic;
    this.vaccinateWaitTopicShared = this.pulsarJson.vaccinateWaitTopicShared;
    this.vaccinateWaitTopic = this.pulsarJson.vaccinateWaitTopic;

    this.pulsarNs = this.pulsarJson.pulsarNameSpace;
    this.paySubType = this.pulsarJson.registSubscriptionType;
    const sub = this.userService
      .getUserInfoByType()
      .subscribe(user => {
        this.userInfo = user;
        // 使用用户编码作为订阅websocket的订阅号码
        const tenant = this.userInfo.pov;
        const pov = this.userInfo.pov;
        const url = this.pulsarUrl + tenant + '/' + this.pulsarNs + '/' + this.payWaitTopic + '/' + pov + '?messageId=latest';
        this.waitingWs.connect(url);
      });
    this.subscription.push(sub);

    const sub5 = this.printSvc.getLodopStatus().subscribe(status => {
      // console.log('是否加载成功', status);
      this.showError = status ? status : !status;
    });
    this.subscription.push(sub5);
  }

  ngOnInit(): void {
    this.loadPayWays();
    this.waitQueueLoading = true;
    this.passQueueLoading = true;

    // 订阅待叫号队列
    const sub1 = this.waitingWs.getMessage().subscribe(message => {
      const data = JSON.parse(message.data);
      console.log('待叫号队列获取到的消息', data);
      const properties = data.properties;
      if (!properties.hasOwnProperty('msg')) return;
      const wd = JSON.parse(properties.msg);
      console.log('待叫号队列获取到的消息', wd.length);
      this.waitingPayQueues = wd;
    });
    this.subscription.push(sub1);

    // 初始化待叫号队列信息
    this.waitQueueLoading = true;
    this.passQueueLoading = true;
    const sub4 = this.waitingWs.isOpen().subscribe(_ => {
      timer(1000).subscribe(
        __ => {
          // 初始化待叫号队列信息
          this.initQueueList(
            this.userInfo.pov,
            this.pulsarNs,
            this.payWaitTopicShared,
            this.payWaitTopic
          );
          this.querySuccessData();
        },
        error => {
        },
        () => {
          this.waitQueueLoading = false;
          this.passQueueLoading = false;
        });
    });
    this.subscription.push(sub4);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  /**
   * 初始化系统配置项
   */
  initSysConf() {
    // 获取延时设置
    this.queueCallDelay = this.sysConfSvc.getConfValue(this.queueCallDelayKey);
    this.pulsarUrl = this.sysConfSvc.getConfValue(this.pulsarUrlKey);
  }

  /**
   * 获取受种人基本信息
   */
  getVaccinatePersonInfo(regQueueData) {
    const profileCode = regQueueData.profileCode;
    const query = {
      profileCode: profileCode
    };
    this.profileService.queryProfile(query, resp => {
      // console.log('基本信息', resp);
      if (resp.code === 0 && resp.data.length > 0) {
        this.profile = resp.data[0];
        const birthDayTime = resp.data[0].birthDate;
        let transFormAge = TransformUtils.getAgeFromBirthDate(birthDayTime);
        console.log(transFormAge);
        this.vaccinatePersonAge =
          transFormAge.age + '岁' + (transFormAge.age >= 16 ? '' : transFormAge.month + '月龄');
        // this.queryOrderInfos(regQueueData.globalRecordNumber);
      } else {
        this.createMessage('warning', '查询档案信息失败', 3000);
      }
    });
  }

  /**
   * 订单选择change事件
   * @param ev
   * @param order
   */
  onOrderCheckChange(ev, order) {
    if (this.selectPayWay === '1') {
      // 切换点击了要重新填写金额和找零
      this.payMoney = 0;
      this.changeMoney = 0;
      if (order.status === this.ORDER_STATUS_TO_PAY) {
        // 如果是选中的状态,只能是单选
        this.payArray = [];
        if (ev) {
          for (let j = 0; j < this.orderData.length; j++) {
            if (order.orderSerial !== this.orderData[j].orderSerial) {
              this.orderData[j].checked = false;
            }
          }
          this.orderSumMoney = Number(order.totalAmount.toFixed(2));
          this.payArray.push(order);
        } else {
          this.orderSumMoney = 0;
          this.payArray = [];
        }
      }
    } else {
      if (order.status === this.ORDER_STATUS_TO_PAY) {
        if (ev) {
          this.payArray.push(order);
        } else {
          this.payArray = this.payArray.filter(orderInfo => orderInfo.orderSerial !== order.orderSerial);
        }
        this.orderSumMoney = Number((this.orderSumMoney + order.totalAmount).toFixed(2));
        if (this.orderSumMoney === 0) {
          this.changeMoney = 0;
          this.payMoney = 0;
        } else {
          if (this.payMoney === 0) {
            this.changeMoney = 0;
          } else {
            this.changeMoney = Number((this.payMoney - this.orderSumMoney).toFixed(2));
          }
        }
        this.selectPayAll = this.payArray.length === this.orderData.filter(o => o.status === this.ORDER_STATUS_TO_PAY).length;
      }
    }

  }

  /**
   * 全选所有订单
   * @param ev
   */
  onSelectAllOrders(ev) {
    if (ev) {
      this.orderData.forEach(order => {
        if (!order.checked && order.status === this.ORDER_STATUS_TO_PAY) {
          order.checked = true;
          this.orderSumMoney = Number((this.orderSumMoney + order.totalAmount).toFixed(2));
          this.payArray.push(order);
        }
      });
    } else {
      this.orderData.forEach(order => order.checked = false);
      this.resetPayOrderInfo();
    }
    if (this.payMoney === 0) {
      this.changeMoney = 0;
    } else {
      this.calculateChangeMoney();
    }
  }

  /**
   * 取消订单
   * 缴费之后，不想接种了，所以需要将钱退回
   */
  cancelOrder() {
    if (this.orderLoading) return;
    if (!this.queueCode) {
      this.msg.warning('请查看订单,再执行取消');
      return;
    }
    if (this.payArray.length === 0) {
      this.msg.info('请选择需要取消的订单');
      return;
    }
    if (!this.handlingQueueItem) {
      return;
    }
    this.modalSvc.confirm({
      nzTitle: '提示',
      nzContent: `<p>是否确认取消订单?</p>`,
      nzMaskClosable: true,
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        // 待取消订单集合
        const paramList = [];
        const cancelRegRecordList = [];
        this.payArray.forEach(order => {
          paramList.push(order.orderSerial);
          cancelRegRecordList.push({
            orderSerial: order.orderSerial,
            povCode: order.povCode
          });
        });
        // 更新接种队队列状态为  '已取消' 接种操作为 '取消排号'
        this.handlingQueueItem['curStatus'] = REG_QUEUE_STATUS.CANCEL_STATUS;
        this.handlingQueueItem['curAction'] = REG_QUEUE_ACTION.CANCEL_CALL_NUMBER;
        this.handlingQueueItem['povCode'] = this.userInfo.pov;
        this.handlingQueueItem['curDoc'] = this.userInfo.userCode;
        this.handlingQueueItem['curRoom'] = this.userInfo.department;
        this.handlingQueueItem['payPassTopicShared'] = this.payPassTopicShared;
        this.handlingQueueItem['payPassTopic'] = this.payPassTopic;
        this.handlingQueueItem['actionTime'] = DateUtils.getFormatDateTime(this.handlingQueueItem['actionTime']);
        this.handlingQueueItem['createDate'] = DateUtils.getFormatDateTime(this.handlingQueueItem['createDate']);
        this.orderLoading = true;
        // 0. 取消订单信息  跟新登记记录表和订单表
        this.paymentService.cancelOrderByOrderSerialListAndGeneFree(paramList, cancelResp => {
          console.log('批量取消订单返回值', cancelResp);
          if (cancelResp.code === 0) {

            // 1. 再次查询订单信息，确保一旦生成新的订单之后能及时查到
            this.queryOrderDataByGlobalRecordNumber(this.globalRecordNumber, orderResp => {
              if (orderResp.code === 0) {
                this.orderLoading = false;
                this.msg.success('订单取消成功');
                // 重新将新的订单刷新到页面上
                this.filterFreeOrders(orderResp.data);
                this.resetPayOrderInfo();

                // 2. 取消排号信息
                if (this.checkAllOrdersFinished()) {
                  this.queueApiSvc.cancelPayOrder(this.handlingQueueItem, cancelQueueResp => {
                    this.orderLoading = false;
                    if (cancelQueueResp.code === 0) {
                      // 批量取消订单信息
                      this.resetOrderDataAfterCancellingQueueItem();
                    }
                  });
                }

                // 4. 判断所有的订单是否全都已付款
                if (this.checkAllOrdersPayed()) {
                  // 查询有效登记记录，将有效登记记录中的小类编码添加到queueItem的 vaccList 中
                  this.queryValidRegRecord(this.globalRecordNumber, regRecord => {
                    // 刷新待缴费队列和已缴费队列，已经有记录就只推送
                    if ( regRecord.length > 0) {
                      const globalRecordNumber = regRecord[0].globalRecordNumber;
                      if ((this.finishPayQueues.some( d => d.globalRecordNumber === globalRecordNumber))) {
                        this.sendToVaccinationQueue(regRecord, true);
                      } else {
                        this.sendToVaccinationQueue(regRecord);
                      }
                    }
                    timer(2000).pipe(take(1)).subscribe(() => this.refreshQueue(false));
                  });
                }
              }
            });
          }
        });
      }
    });
  }

  /**
   * 取消订单之后，清空所有数据，包括全局流水号
   */
  resetOrderDataAfterCancellingQueueItem() {
    this.handlingQueueItem = null;
    this.profile = null;
    this.vaccinatePersonAge = null;
    this.orderData = [];
    this.globalRecordNumber = null;
  }

  /**
   * 检查是否所有的订单都已经付款
   * 如果还有待缴费 - false
   * 如果没有待缴费 - true
   */
  checkAllOrdersPayed() {
    // console.log(this.orderData);
    // 检查是否存在未交费的
    const isSomeOrderUnpaid = this.orderData.some(od => od['status'] === this.ORDER_STATUS_TO_PAY);
    // 查看是否存在已缴费订单，免费的也算进去，因为免费的也需要接种
    const isSomOrderPaid = this.orderData.some(od => od['status'] === this.ORDER_STATUS_PAID || od['status'] === this.ORDER_STATUS_FREE);
    console.log(isSomeOrderUnpaid, isSomOrderPaid);
    return !isSomeOrderUnpaid && isSomOrderPaid;
  }

  /**
   * 检查所有的订单是否都已经全部完成
   */
  checkAllOrdersFinished() {
    // 检查所有的订单是否都已经全部完成，且可以取消排队了
    return this.orderData.every(od => od['status'] === this.ORDER_STATUS_CANCEL || od['status'] === this.ORDER_STATUS_NO_NEED_TO_PAY || od['status'] === this.ORDER_STATUS_VACCINATE_REFUND || od['status'] === this.ORDER_STATUS_VACCINATE_SUCCESS);
  }

  /**
   * 查询有效的登记记录
   * 条件：全局流水号、订单状态、付款状态
   */
  queryValidRegRecord(globalRecordNumber: string, func: Function) {
    const query = {
      globalRecordNumber: globalRecordNumber,
      registPovCode: this.userInfo.pov
    };
    this.regApiSvc.queryRegistRecord(query, resp => {
      if (resp.code === 0) {
        // 只保留待接种，且付款状态为未付款或者已付款的登记记录
        const data = resp.data.filter(d => d.registStatus === '1' && d.orderStatus !== '3');
        func(data);
        return;
      }
      func([]);
    });
  }

  /**
   * 检查是否是所有的订单都已经取消
   * 如果全部都已经取消，则会删除该受种人的排队信息
   * 如果是 - true
   * 如果否 - false
   */
  checkAllOrderCancelled() {
    console.log(this.originalOrderData);
    for (let i = 0; i < this.originalOrderData.length; i++) {
      const order = this.originalOrderData[i];
      if (order['status'] === this.ORDER_STATUS_TO_PAY ||
        order['status'] === this.ORDER_STATUS_FREE ||
        order['status'] === this.ORDER_STATUS_PAID) {
        return false;
      }
    }
    return true;
  }

  /**
   * 计算找零金额
   */
  calculateChangeMoney() {
    const changeMoney: number = this.payMoney - this.orderSumMoney;
    this.payBtnStatus = changeMoney < 0;
    this.changeMoney = Number(changeMoney.toFixed(2));
  }


  /**
   * 等待排队缴费总数
   * @returns {number}
   */
  waitingPayQueueLength() {
    if (this.waitingPayQueues) {
      return this.waitingPayQueues.length;
    }
    return 0;
  }

  /**
   * 已完成排队缴费总数
   * @returns {number}
   */
  successPayingQueuesLength() {
    if (this.finishPayQueues) {
      return this.finishPayQueues.length;
    }
    return 0;
  }

  /**
   * 查询已完成接种
   */
  querySuccessData() {
    const today = new Date();
    const params = {
      curStatus: '5',
      createDate: {
        start: DateUtils.formatStartDate(today),
        end: DateUtils.formatEndDate(today)
      },
      povCode: this.userInfo.pov,
      curRoom: this.userInfo.department,
      pageEntity: {page: 1, pageSize: 999, sortBy: ['createDate,DESC']}
    };
    this.regQueueService.regQueueStatusChangeRecord(params, resp => {
      this.finishPayQueues = resp.data;
    });
  }

  /**
   * 加载支付方式
   */
  loadPayWays() {
    this.payWays = this.dicDataService.getDicDataByKey('payWay');
  }

  /**
   * 展示订单数据
   * @param data
   */
  showOrderData(data) {
    // console.log('查看已缴费', data);
    this.tabIndex = '0';
    this.handlingQueueItem = data;
    this.forbidBtn = true;
    this.queueCode = data.queueCode;
    // 应找零钱清零
    this.changeMoney = 0;
    // 应收费清零
    this.orderSumMoney = 0;
    // 查询受种人基本信息
    this.getVaccinatePersonInfo(data);
    this.globalRecordNumber = data.globalRecordNumber;
    // 查询订单信息
    this.paymentService.queryListByGlobalSerial(
      this.globalRecordNumber,
      resp => {
        console.log('查看已缴费订单', resp);
        if (resp.code === 0) {
          const orderData = resp.data.filter(item => item.status !== '1');
          this.originalOrderData = orderData;
          this.filterFreeOrders(orderData);
        }
      }
    );
  }

  /**
   * 选择值(支付的方式)
   * @param data
   */
  selectWayValue(data) {
    this.isShowInput = data === '1';
    if (data === '1') {
      // 移动支付只能选择一个订单支付,全选不显示置为false
      this.selectPayAll = false;
      // 将选中的全置false
      this.orderData.forEach(item => item.checked = false);
      this.orderSumMoney = 0;
      this.payArray = [];
      this.payMoney = 0;
      this.changeMoney = 0;
      this.showTips = true;
    } else {
      this.showTips = false;
      if (this.payArray.length === 0) {
        this.selectPayAll = false;
      } else {
        this.selectPayAll = this.payArray.length === this.orderData.filter(o => o.status === this.ORDER_STATUS_TO_PAY).length;
      }
    }

  }

  /**
   * 支付
   */
  pay() {
    if (!this.userInfo) return;
    if (!this.queueCode) {
      this.msg.info('请先查看订单,再执行缴费');
      return;
    }
    if (this.payArray.length === 0 || this.orderSumMoney === 0) {
      this.msg.info('请选择订单');
      return;
    }
    // 选择移动支付(支付宝支付)
    if (this.selectPayWay === '1') {
      this.dialogSvc.open(AlipayDialogComponent, {}).onClose.subscribe(resp => {
        if (resp && resp.hasOwnProperty('receiptCode')) {
          const receiptCode = resp['receiptCode'];
          // 获取支付宝付款码
          const params = {
            userCode: this.userInfo.userCode, // 用户编码
            dataSource: '1', // 数据来源 1web收银台 2一体机 3app
            authCode: receiptCode, // 支付宝付款码，扫描支付宝得到的付款码
            orders: this.payArray[0].orderSerial // 订单编号，缴费订单
          };
          this.orderLoading = true;
          // 支付方式 1当面付 2扫码付 3app支付 去支付的结果
          this.paymentService.payByAlipay(params, res => {
            // console.log('支付结果', res);
            if (res && res.code === 0) {
              const orderInfo = {
                orderSerial: this.payArray[0].orderSerial
              };
              console.log('订单号', orderInfo);
              if (res && res.code === 0) {
                // 调用3次
                for (let i = 0; i < 3; i++) {
                  // 调用支付宝返回的值
                  this.paymentService.queryPayByAlipayResult(orderInfo, re => {
                    // console.log('返回的结果', re);
                    if (re && re.code === 0) {
                      // 待缴费订单集合
                      const paramList = [];
                      const list = [];
                      this.payArray.forEach(order => {
                        paramList.push({
                          orderSerial: order.orderSerial,
                          payChannel: this.selectPayWay,
                          povCode: this.userInfo.pov,
                          cashier: this.userInfo.userCode,
                          useMedicalInsurance: '0'
                        });
                        list.push({
                          orderSerial: order.orderSerial,
                          status: '2'
                        });
                      });
                      this.regApiSvc.updateOrderStatus(list, el => {
                        console.log('结果', el);
                        this.orderLoading = false;
                        if (el && el.code === 0) {
                          // 待缴费订单集合
                          this.orderData.forEach(order => {
                            // console.log('单个的订单', order);
                            // console.log('单个的订单2', this.payArray[0].orderSerial);
                            if (this.payArray[0].orderSerial === order.orderSerial) {
                              // console.log('进来了', order);
                              order['status'] = '2';
                              order['checked'] = false;
                            }
                          });
                          // console.log('sult', this.orderData);
                          // 清空付款订单信息
                          this.resetPayOrderInfo();
                          // 更新需要付款的登记记录订单为已付款
                          this.updateRegisterRecordOrderStatus(paramList);
                          // this.regApiSvc.updateRecordOrderStatusByOrderSerial(paramList, updateResp => {
                          //   console.log('更新登记记录订单付款状态返回值', updateResp);
                          //   // 必须要全部缴费完成之后才能推送到接种台
                          //   if (this.checkAllOrdersPayed()) {
                          //     // 查询有效登记记录，将有效登记记录中的小类编码添加到queueItem的 vaccList 中
                          //     this.queryValidRegRecord(this.globalRecordNumber, regRecord => {
                          //       // 刷新待缴费队列和已缴费队列
                          //       this.sendToVaccinationQueue(regRecord);
                          //       timer(1000).pipe(take(3)).subscribe(() => this.refreshQueue(false));
                          //     });
                          //   }
                          // });
                        }
                      });
                      return;
                    } else {
                      this.orderLoading = false;
                      if (i === 2) {
                        this.msg.warning('支付失败');
                        return;
                      }
                    }
                  });
                }
              } else {
                this.orderLoading = false;
              }
            } else {
              this.orderLoading = false;
              this.msg.warning('支付失败');
              return;
            }
          });
        }

      });

    } else {
      // 现金支付需要判断是否填写了金额
      if (this.payMoney < this.orderSumMoney || !this.numberReg.test(this.payMoney.toString())) {
        this.msg.info('请输入正确的缴费金额');
        return;
      }
      this.modalSvc.confirm({
        nzTitle: '提示',
        nzContent: `<p>是否确认缴费?</p>`,
        nzMaskClosable: true,
        nzOkText: '确定',
        nzCancelText: '取消',
        nzOnOk: () => {
          // 待缴费订单集合
          const paramList = [];
          const payedSuccessParamsList = [];
          this.payArray.forEach(order => {
            paramList.push({
              orderSerial: order.orderSerial,
              payChannel: this.selectPayWay,
              povCode: this.userInfo.pov,
              cashier: this.userInfo.userCode,
              useMedicalInsurance: '0'
            });
          });
          console.log('payParams', paramList);
          const successSign = 'success';
          this.orderLoading = true;
          this.paymentService.payOrderList(paramList, resp => {
            console.log('批量缴费返回值', resp);
            if (resp.code === 0) {
              this.msg.success('缴费成功');
              const payResultData = resp.data;
              this.orderData.forEach(order => {
                if (payResultData.hasOwnProperty(order.orderSerial) && payResultData[order.orderSerial] === successSign) {
                  order['status'] = '2';
                  order['checked'] = false;
                }
              });
              // 清空付款订单信息
              this.resetPayOrderInfo();
              // 更新需要付款的登记记录订单为已付款
              this.updateRegisterRecordOrderStatus(paramList);
              // this.regApiSvc.updateRecordOrderStatusByOrderSerial(paramList, updateResp => {
              //   console.log('更新登记记录订单付款状态返回值', updateResp);
              //   this.orderLoading = false;
              //   if (updateResp.code === 0) {
              //     // 必须要全部缴费完成之后才能推送到接种台
              //     if (this.checkAllOrdersPayed()) {
              //       // 查询有效登记记录，将有效登记记录中的小类编码添加到queueItem的 vaccList 中
              //       this.queryValidRegRecord(this.globalRecordNumber, regRecord => {
              //         // 刷新待缴费队列和已缴费队列
              //         this.sendToVaccinationQueue(regRecord);
              //         interval(1000).pipe(take(3)).subscribe(() => this.refreshQueue(false));
              //       });
              //     }
              //   }
              // });

            } else {
              this.orderLoading = false;
            }
          });
        }
      });
    }
  }

  /**
   * 更新已付款订单的登记状态，同时
   */
  updateRegisterRecordOrderStatus(param?: any[]) {
    if (!this.userInfo) return;
    console.log('orderData is ', this.orderData);
    let paramList = [];
    if (param) {
      paramList = [...param];
    } else {
      this.orderData.forEach(od => {
        if (od.status === '2') {
          paramList.push({
            orderSerial: od.orderSerial,
            povCode: this.userInfo.pov
          });
        }
      });
    }
    console.log(paramList);
    if (paramList.length === 0) return;
    // 更新需要付款的登记记录订单为已付款
    this.regApiSvc.updateRecordOrderStatusByOrderSerial(paramList, updateResp => {
      console.log('更新登记记录订单付款状态返回值', updateResp);
      this.orderLoading = false;
      if (updateResp.code === 0) {
        // 必须要全部缴费完成之后才能推送到接种台
        if (this.checkAllOrdersPayed()) {
          // 查询有效登记记录，将有效登记记录中的小类编码添加到queueItem的 vaccList 中
          this.queryValidRegRecord(this.globalRecordNumber, regRecord => {
            // 刷新待缴费队列和已缴费队列
            this.sendToVaccinationQueue(regRecord);
            interval(1000).pipe(take(3)).subscribe(() => this.refreshQueue(false));
          });
        }
      }
    });
  }

  /**
   * 更新登记记录的状态，且不会推送到接种台
   */
  updateRegisterRecordOrderStatusAndNoPushToVaccination() {
    if (!this.userInfo) return;
    console.log('orderData is ', this.orderData);
    let paramList = [];

    this.orderData.forEach(od => {
      if (od.status === '2') {
        paramList.push({
          orderSerial: od.orderSerial,
          povCode: this.userInfo.pov
        });
      }
    });
    const pulsarConfig = this.configSvc.getSettings('pulsar');
    const namespace = pulsarConfig['pulsarNameSpace'];
    const paySharedTopic = pulsarConfig['payWaitTopicShared'];
    const payMonitorTopic = pulsarConfig['payWaitTopic'];
      this.queueApiSvc.deleteQueueItem(this.userInfo.pov, namespace, paySharedTopic, payMonitorTopic, this.globalRecordNumber, deleteResp => {
        if (deleteResp.code === 0) {
          this.resetPayOrderInfo();
        }
      });
    // TODO 将剩下的订单状态进行更新，后端接口还没有写

  }

  /**
   * 开始缴费
   * 查询待缴费订单
   */
  startPay(data) {
    // console.log(data);
    this.tabIndex = '0';
    this.forbidBtn = false;
    this.payArray = [];
    this.payMoney = 0;
    this.orderSumMoney = 0;
    this.selectPayAll = false;
    // 应找的清零
    this.changeMoney = 0;

    this.handlingQueueItem = data;
    this.payBtnStatus = true;
    // this.printInvoiceBtnStatus = true;
    // this.cancelBtnStatus = false;
    this.globalRecordNumber = data.globalRecordNumber;
    this.queueCode = data.queueCode; // 待缴费号码
    // 查询受种人信息
    this.getVaccinatePersonInfo(data);
    this.orderData = [];
    this.globalRecordNumber = data.globalRecordNumber;
    this.queryOrderDataByGlobalRecordNumber(data.globalRecordNumber, orderResp => {
      console.log('待缴费订单查询结果', orderResp);
      if (orderResp.code === 0 && orderResp.data.length > 0) {
        this.disableStatus = false;
        const orderData = orderResp.data;
        this.originalOrderData = orderData;
        this.filterFreeOrders(orderData);
        console.log(this.userInfo);
        if (this.checkAllOrdersPayed()) {
          this.modalSvc.confirm({
            nzTitle: '提示',
            nzContent: '当前订单已经全部完成缴费，是否需要推送给接种台？',
            nzOkText: '确定推送',
            nzCancelText: '关闭',
            nzOnOk: () => {
              console.log('点击了确定');
              this.updateRegisterRecordOrderStatus();
            }
          });
        }
        if (this.checkAllOrdersFinished()) {
          this.modalSvc.confirm({
            nzTitle: '提示',
            nzContent: '当前订单已经全部完成，是否需要从代缴费排队中把他删除？',
            nzOkText: '确定删除',
            nzCancelText: '关闭',
            nzOnOk: () => {
              console.log('点击了确定');
              this.updateRegisterRecordOrderStatusAndNoPushToVaccination();
            }
          });
        }
      } else {
        this.createMessage('warning', '未找到订单信息!', 3000);
        this.disableStatus = true;
      }
    });
  }

  /**
   * 根据全局流水号查询订单信息
   * @param globalRecordNumber
   * @param fn
   */
  queryOrderDataByGlobalRecordNumber(globalRecordNumber: string, fn: Function) {
    if (!globalRecordNumber) {
      this.msg.warning('全局流水号不可为空，请查询订单');
      return;
    }
    this.paymentService.queryListByGlobalSerial(
      globalRecordNumber,
      orderResp => {
        fn(orderResp);
      }
    );
  }


  /**
   * 过滤掉免费订单，只保留收费订单
   * @param orders
   */
  filterFreeOrders(orders: any[]) {
    const orderData = [];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      if (order.totalAmount === 0) continue;
      const details = order.details;
      let detailArr = [];
      for (let j = 0; j < details.length; j++) {
        const detail = details[j];
        if (detail.totalAmount > 0) {
          detailArr.push(detail);
        }
      }
      order.details = detailArr;
      orderData.push(order);
    }
    this.orderData = orderData.sort((a, b) => a['status'] - b['status']);
  }

  /**
   * 付款或取消之后需要清空缴费信息
   * 包括：应付金额、收款金额、找零金额、全选按钮、付款集合
   *
   */
  resetPayOrderInfo() {
    this.payArray = [];
    this.orderSumMoney = 0;
    this.changeMoney = 0;
    this.payMoney = 0;
    this.selectPayAll = false;
    // this.globalRecordNumber = null;
  }

  /**
   * 消息提示
   * @param type
   * @param message
   * @param time
   */
  createMessage(type: string, message: string, time: number): void {
    this.message.create(type, message, {
      nzDuration: time
    });
  }

  /**
   * 将缴费成功之后的排队信息添加到待接种队列中
   * 排队状态修改为 - 已缴费
   * 排队操作修改为 - 缴费完成
   */
  sendToVaccinationQueue(regRecord: any[], ifCancel?: boolean) {
    if (!this.handlingQueueItem) {
      return;
    }
    const vaccineList = [];
    regRecord.forEach(reg => {
      vaccineList.push(reg['vaccineSubclassCode']);
    });
    this.handlingQueueItem['curStatus'] = REG_QUEUE_STATUS.TO_VACCINATE;
    this.handlingQueueItem['curAction'] = REG_QUEUE_ACTION.PAYED_COMPLETE;
    this.handlingQueueItem['povCode'] = this.userInfo.pov;
    this.handlingQueueItem['curDoc'] = this.userInfo.userCode;
    this.handlingQueueItem['curRoom'] = this.userInfo.department;
    this.handlingQueueItem['actionTime'] = null;
    this.handlingQueueItem['createDate'] = DateUtils.getFormatDateTime(
      this.handlingQueueItem['createDate']
    );
    this.handlingQueueItem['vaccinateWaitTopic'] = this.vaccinateWaitTopic;
    this.handlingQueueItem[
      'vaccinateWaitTopicShared'
      ] = this.vaccinateWaitTopicShared;
    this.handlingQueueItem['payWaitTopicShared'] = this.payWaitTopicShared;
    this.handlingQueueItem['payWaitTopic'] = this.payWaitTopic;
    this.handlingQueueItem['payPassTopicShared'] = this.payPassTopicShared;
    this.handlingQueueItem['payPassTopic'] = this.payPassTopic;
    this.handlingQueueItem['queueDelay'] = this.queueCallDelay;
    this.handlingQueueItem['vaccineList'] = vaccineList;


    // console.log('待推送的消息是', this.handlingQueueItem);
    if (ifCancel) {
      this.queueApiSvc.addToVaccinationOnlyFromPayQueue(
        this.handlingQueueItem,
        resp => {
          if (resp.code === 0) {
            console.log('已缴费信息推送到接种台 - 成功,只推送不操作');
          }
        }
      );
    } else {
      this.queueApiSvc.addToVaccinationFromPayQueue(
        this.handlingQueueItem,
        resp => {
          if (resp.code === 0) {
            console.log('已缴费信息推送到接种台 - 成功');
          }
        }
      );
    }
  }
  /**
   * 跳转报表管理界面
   */
  reportManager() {
    this.router.navigateByUrl('/modules/charge/charge');
  }

  /**
   * 初始化待叫号队列和已叫号队列
   */
  initQueueList(povCode: string, nameSpace: string, waitTopicSharedPath: string, waitTopicPath: string, info = true) {
    this.queueApiSvc.initQueueList(
      povCode,
      nameSpace,
      waitTopicSharedPath,
      waitTopicPath,
      resp => {
        // console.log(resp);
        if (resp.code === 0 && info) {
          this.msg.info('队列数据刷新成功!');
        }
      }
    );
  }

  refreshQueue(info = true) {
    // 初始化待叫号队列信息
    this.initQueueList(
      this.userInfo.pov,
      this.pulsarNs,
      this.payWaitTopicShared,
      this.payWaitTopic,
      info
    );
    this.querySuccessData();
    // 初始化已叫号队列信息
    // this.initQueueList(this.userInfo.pov, this.pulsarNs, this.payPassTopicShared, this.payPassTopic);
  }

  // 切换tab
  onChangeTab(ev) {
    this.tabIndex = ev.tabTitle === '订单信息' ? '0' : '1';
  }

  /**
   * 打印机链接关闭提示
   */
  closeAlert() {
    this.showError = false;
  }

}

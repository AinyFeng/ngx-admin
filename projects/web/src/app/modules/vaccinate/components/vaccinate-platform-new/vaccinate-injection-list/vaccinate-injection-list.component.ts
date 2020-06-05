import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  AdministrativeDivisionService,
  DateUtils,
  DicDataService,
  EleSuperviseCodeService,
  LOCAL_STORAGE,
  QueueApiService,
  RegistRecordService,
  SysConfInitService,
  TransformUtils,
  VACCINATE_STATUS,
  VaccinateService,
  VaccinateSignatureService
} from '@tod/svs-common-lib';
import { VaccinateMemoDialogComponent } from '../../vaccinate-memo-dialog/vaccinate-memo-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { VaccinatePlatformService } from '../vaccinate-platform.service';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { DeviceWebsocketService } from '../device-websocket.service';
import { VACCINATE_CHECK_TYPE } from '../vaccinate.const';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'uea-vaccinate-injection-list',
  templateUrl: './vaccinate-injection-list.component.html',
  styleUrls: ['./vaccinate-injection-list.component.scss'],
  providers: [SysConfInitService]
})
export class VaccinateInjectionListComponent implements OnInit, OnDestroy {
  @Input()
  showCard: boolean = true;
  // 当前叫号信息
  currentQueueItem: any;
  // 待接种列表
  currentVaccinateRecords: any[] = [];
  // 登记记录
  registerVaccinateRecords: any[] = [];
  // 疫苗是否核验成功，疫苗核验结果
  checkProfileRet: boolean = false;
  // 是否开始疫苗核验
  checkProfileFlag: boolean = false;
  // 是否开启受种人核验，默认开启
  checkVaccineFlag: boolean;
  // 受种人核验结果
  checkVaccineRet: boolean;
  // 档案核验结果集合，长度固定为2，只用来判断一种情况，那就是第0个状态和第1个状态的变化，如果是 false -> true,则需要提示用户重新核验
  checkProfileFlagArr = [];
  // 疫苗核验结果集合，长度固定为2，只用来判断一种情况，那就是第0个状态和第1个状态的变化，如果是 false -> true,则需要提示用户重新核验疫苗
  checkVaccineFlagArr = [];

  // 接种部位选项
  vaccinateParts: any[] = [];
  // 接种类型选项
  vaccinateTypes: any[] = [];
  // 省份
  province: string = '';
  // 职员列表
  staffList: any[] = [];
  // 当前核验疫苗是否完成接种或取消
  isFinished: boolean = true;
  // 疫苗是否完成签字
  isSigned: boolean = false;
  // 当前接种疫苗产品列表
  currentVaccineProductList: any[] = [];
  // 告情通知书签字核验
  checkSign: boolean = false;
  /**
   * 加载状态
   */
  loading = false;
  /**
   * 核验项目
   */
  vaccineCheckType: string;
  /**
   * 当前科室编码
   */
  departmentCode: string;

  private subscription: Subscription[] = [];

  constructor(private nbDialogService: NbDialogService,
              private modalService: NzModalService,
              private message: NzMessageService,
              private vaccinateService: VaccinateService,
              private registerRecordService: RegistRecordService,
              private dicDataService: DicDataService,
              private queueApiSvc: QueueApiService,
              private divisionService: AdministrativeDivisionService,
              private localStorage: LocalStorageService,
              private signatureService: VaccinateSignatureService,
              private sysConfService: SysConfInitService,
              private deviceWebsocketService: DeviceWebsocketService,
              private eleSuperviseCodeService: EleSuperviseCodeService,
              private platformService: VaccinatePlatformService,
              private notifier: NotifierService) {
    this.staffList = this.localStorage.retrieve(LOCAL_STORAGE.POV_STAFF);
    this.checkSign = this.sysConfService.getConfValue('checkSign') === '1';
  }

  ngOnInit() {
    this.initCurrentQueueItem();
    this.initIsCheckSuccess();
    this.initCheckVaccineFlag();
    this.loadVaccinatePart();
    this.loadVaccinateType();
    this.initScanInput();
    // 初始化设备连接
    if (this.checkProfileFlag) {
      this.initDeviceWebSocket();
    }
    this.divisionService.queryAdministrativeDivision({code: this.platformService.userInfo['pov'].substring(0, 2) + '0000'}, resp => {
      if (resp['data'] === 0) {
        this.province = resp['data']['name'];
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  /**
   * 当前排队信息 - 当前正在接种的排号信息
   * 在叫号之后，就会触发这个方法
   */
  initCurrentQueueItem() {
    const sub = this.platformService.getCurrentQueueItem().subscribe(queueItem => {
      console.log('订阅获取当前正在叫号的排队信息 - initCurrentQueueItem', queueItem);
      console.log('当前的叫号状态是', this.platformService.vaccinationStatus, this.checkProfileFlag);
      if (queueItem) {
        console.log('进来了A');
        this.currentQueueItem = queueItem;
        // 需要核验，则先查看登记记录表
        if (this.checkProfileFlag) {
          console.log('BBBB - - - - 需要核验，则先展示登记记录表');
          this.showRegisterVaccinateRecord(queueItem['globalRecordNumber']);
        } else {
          // 无需核验，则直接查看接种记录表
          console.log('CCCC - - - - 无需核验，则可以直接查询档案信息');
          this.checkProfileInfo(queueItem['profileCode']);
        }
        // if (!this.checkProfileFlag && this.platformService.vaccinationStatus === VACCINATE_STATUS.calling) {
        //   console.log('无需核验，则开始查询档案信息 - checkProfileInfo');
        //   this.checkProfileInfo(queueItem['profileCode']);
        // } else if (this.platformService.vaccinationStatus === VACCINATE_STATUS.finished) {
        //   console.log('接种完成，则开始查询档案信息 - checkProfileInfo');
        //   this.checkProfileInfo(queueItem['profileCode']);
        // } else {
        //   // 如果需要校验，则状态时查看中
        //   console.log('需要核验，则');
        //   if (this.platformService.vaccinationStatus !== VACCINATE_STATUS.finished) {
        //     // this.platformService.vaccinationStatus = VACCINATE_STATUS.viewing;
        //     this.showRegisterVaccinateRecord(queueItem['globalRecordNumber']);
        //     this.checkProfileRet = false;
        //   }
        // }
        console.log('当前的叫号状态是', this.platformService.vaccinationStatus);
        // this.showRegisterVaccinateRecord(queueItem['globalRecordNumber']);
      } else {
        this.registerVaccinateRecords = [];
        this.currentVaccinateRecords = [];
        this.registerVaccinateRecords = [];
        this.checkProfileRet = false;
      }
    });
    this.subscription.push(sub);

    const sub1 = this.platformService.getVaccinateDep().subscribe(departmentCode => {
      this.departmentCode = departmentCode;
      console.log('当前接受到的科室编码是', departmentCode);
    });
    this.subscription.push(sub1);
  }

  /**
   * 初始化疫苗和受种人核验状态
   */
  initIsCheckSuccess() {
    // 受种人核验状态
    const sub = this.platformService.getIsCheckSuccess().subscribe(isSuccess => this.checkProfileRet = isSuccess);
    this.subscription.push(sub);
    // 疫苗核验状态
    const sub1 = this.platformService.getCheckVaccineRet().subscribe(ret => this.checkVaccineRet = ret);
    this.subscription.push(sub1);
  }

  /**
   * 初始化疫苗核验和受种人核验的开关状态
   */
  initCheckVaccineFlag() {
    console.log('init 初始化疫苗核验开关和受种人核验开关');
    // 获取核验疫苗的开关状态
    const sub = this.platformService.getCheckVaccineFlag().subscribe(flag => {
      console.log('疫苗核验开关变化', flag);
      // 如果是已接种状态，则不能修改页面信息
      // if (this.platformService.vaccinationStatus === VACCINATE_STATUS.finished || this.platformService.vaccinationStatus === VACCINATE_STATUS.viewing) {
      //   // 如果true，则初始化数衍科技验证疫苗
      //
      //   return;
      // }
      this.checkVaccineFlag = flag;
      if (this.checkVaccineFlag !== null) {
        this.checkVaccineFlagArr.push(this.checkVaccineFlag);
        this.addDisabledForVaccinateRecord();
      }
      if (flag) {
        this.checkVaccineFlagChange();
        this.initDeviceWebSocket();
        this.checkVaccineRet = false;
      } else {
        // 如果不核验疫苗信息，则关闭数衍科技验证，同时使疫苗核验通过
        this.deviceWebsocketService.close();
        this.checkVaccineRet = true;
      }
      // this.changeCheckType();
    });
    this.subscription.push(sub);

    // 获取核验受种人的开关状态
    const sub1 = this.platformService.getCheckProfileFlag().subscribe(flag => {
      if (flag !== null) {
        this.checkProfileFlagArr.push(flag);
      }
      this.checkProfileFlag = flag;
      console.log('受种人核验开关变化', flag);
      console.log('此时的接种记录是', this.currentVaccinateRecords);
      console.log('此时的登记记录', this.registerVaccinateRecords);
      console.log('此时的叫号号码是', this.currentQueueItem);
      // 如果是已接种状态，则不能修改页面信息
      // if (this.platformService.vaccinationStatus === VACCINATE_STATUS.finished || this.platformService.vaccinationStatus === VACCINATE_STATUS.viewing) {
      //
      //   return;
      // }

      if (!flag) {
        // 如果不核验受种人，则默认受种人核验通过
        this.checkProfileRet = true;
        this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.VACCINE);
        if (this.currentVaccinateRecords.length === 0 && this.currentQueueItem && (this.platformService.vaccinationStatus === VACCINATE_STATUS.vaccinating || this.platformService.vaccinationStatus === VACCINATE_STATUS.calling)) {
          const profileCode = this.currentQueueItem['profileCode'];
          this.checkProfileInfo(profileCode);
        }
      } else {
        this.checkProfileFlagChange();
        this.checkProfileRet = false;
        this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.PROFILE);
      }
    });
    this.subscription.push(sub1);

    // 订阅核验项目
    const sub2 = this.platformService.getVaccineCheckType().subscribe(res => {
      this.vaccineCheckType = res;
    });
    this.subscription.push(sub2);
  }

  /**
   * 检查受种人核验状态变化，当由 false -> true 时，需要提醒重新核验受种人信息
   */
  checkProfileFlagChange() {
    if (this.checkProfileFlagArr.length >= 3) {
      const length = this.checkProfileFlagArr.length;
      this.checkProfileFlagArr = [this.checkProfileFlagArr[length - 2], this.checkProfileFlagArr[length - 1]];
    }
    if (this.checkProfileFlagArr.length === 2) {
      const preProfileFlag = this.checkProfileFlagArr[0];
      const curProfileFlag = this.checkProfileFlagArr[1];
      if (!preProfileFlag && curProfileFlag && (this.platformService.vaccinationStatus === VACCINATE_STATUS.vaccinating || this.platformService.vaccinationStatus === VACCINATE_STATUS.calling)) {
        this.platformService.warning('请核验受种人信息');
      }
    }
  }

  /**
   * 检查受种人核验状态变化，当由 false -> true 时，需要提醒重新核验受种人信息
   */
  checkVaccineFlagChange() {
    if (this.checkVaccineFlagArr.length >= 3) {
      const length = this.checkVaccineFlagArr.length;
      this.checkVaccineFlagArr = [this.checkVaccineFlagArr[length - 2], this.checkVaccineFlagArr[length - 1]];
    }
    if (this.checkVaccineFlagArr.length === 2) {
      const preVaccineFlag = this.checkVaccineFlagArr[0];
      const curVaccineFlag = this.checkVaccineFlagArr[1];
      if (!preVaccineFlag && curVaccineFlag && this.platformService.vaccinationStatus === VACCINATE_STATUS.vaccinating) {
        this.platformService.warning('请核验疫苗信息');
      }
    }
  }

  /**
   * 初始化获取扫描，这里才是真正核验疫苗和受种人的地方
   */
  initScanInput() {
    const sub = this.platformService.getScanInput().subscribe(input => {
      console.log('1. 疫苗开始进入核验系统', this.checkVaccineFlag, this.checkProfileFlag, this.checkProfileRet);
      console.log('2. 开始疫苗核验的input 值是', input, this.vaccineCheckType);
      if (input && input.trim() !== '') {
        input = input.trim();
        // 如果核验受种人
        if (this.vaccineCheckType === VACCINATE_CHECK_TYPE.PROFILE) {
          console.log('啦啦啦啦啦');
          this.checkProfileInfo(input);
        } else if (this.vaccineCheckType === VACCINATE_CHECK_TYPE.VACCINE) {
          console.log('为什么要核验疫苗');
          // 如果核验疫苗
          this.checkVaccineInfo(input);
        } else {
          console.log('走入死胡同了');
          this.platformService.setScanInput('');
        }
      }
    });
    this.subscription.push(sub);
  }

  /**
   * 初始化查验设备websocket
   */
    // 初始化计数
  initDeviceCount = 1;

  initDeviceWebSocket() {
    this.deviceWebsocketService.connect('ws://127.0.0.1:18500');
    this.deviceWebsocketService.isOpen().subscribe(resp => {
      this.deviceWebsocketService.sendCheck();
    });
    this.deviceWebsocketService.isClose().subscribe(error => {
      this.platformService.error('安心接种客户端未启动,正在重连[' + this.initDeviceCount + ']...', callBack => {
        if (this.initDeviceCount++ < 3) {
          this.initDeviceWebSocket();
        } else {
          this.initDeviceCount = 1;
          this.checkProfileFlag = false;
        }
      });
    });
    this.deviceWebsocketService.getMessage().subscribe(message => {
      if (message) {
        this.getMessage(message);
      }
    });
  }

  /**
   * 向设备推送消息
   */
  sendCheckedMessage(value, isSuccess = true, alertMessage?: string) {
    if (isSuccess) {
      value.params.vaccineInfoList[0]['checkStatus'] = '0';
    } else {
      value.params.vaccineInfoList[0]['checkStatus'] = '1';
    }
    if (alertMessage) {
      value.params.vaccineInfoList[0]['checkErrorMsg'] = alertMessage;
    }
    this.deviceWebsocketService.sendMessage(value);
  }

  /**
   * 获取查验设备返回结果
   */
  getMessage(message: any) {
    switch (message['ntype']) {
      // 推送消息签字后返回结果
      case '10101':
        if (message['status'] === 'S') {
          let signature: any = {
            globalRecordNumber: this.currentQueueItem['globalRecordNumber'],
            registerRecordNumber: message['orderId'],
            povCode: this.platformService.userInfo['pov'],
            profileCode: this.currentQueueItem['profileCode'],
            signature: message['signImage'],
            isSuccess: '1'
          };
          this.saveSignature(signature);
        } else {
          this.platformService.error('获取签名失败，请重新签名！', () => this.deviceWebsocketService.reSendMessage());
        }
        break;
      //  电子监管码查询返回结果
      case '10201':
        break;
      //  设备连接状态返回结果
      default:
        if (message['status'] === 'S') {
          // console.warn('数衍设备连接成功');
        } else {
          // this.platformService.error('设备连接失败！', () => this.deviceWebsocketService.sendCheck());
          this.platformService.error('安心接种设备连接失败！', () => {
            if (this.initDeviceCount++ < 3) {
              // this.initDeviceWebSocket();
            } else {
              // 如果超过了三次就关闭获取设备的连接(关闭数衍设备的连接)
              this.deviceWebsocketService.close();
              this.initDeviceCount = 1;
              this.checkProfileFlag = false;
            }
          });
        }
        break;
    }
  }

  /**
   * 保存签字信息
   * @param signature
   */
  saveSignature(signature) {
    console.log('开始存储数衍科技的签字信息');
    console.log('当前接种疫苗产品列表', this.currentVaccineProductList);
    this.signatureService.saveSignature(signature, resp => {
      if (resp['code'] === 0 && resp['data']) {
        const param: any[] = [];
        this.currentVaccineProductList.forEach(product => {
          param.push({
            globalRecordNumber: signature['globalRecordNumber'],
            registerRecordNumber: signature['registerRecordNumber'],
            vaccineBatchNo: product['batchNo'],
            electronicSupervisionCode: product['electronicSupervisionCode']
          });
        });
        this.vaccinateService.addVaccRecordElcSupervisionBatch(param, addVaccinateElcResp => {
          const result = addVaccinateElcResp.data;
          if (result > 0) {
            this.isSigned = true;
            this.queryCurrentVaccinateRecords(this.currentQueueItem['profileCode'], this.currentQueueItem['globalRecordNumber']);
            this.platformService.eventListenerFlag = '';
          } else {
            this.platformService.error('电子监管码保存失败，是否重试！', _ => this.saveSignature(signature));
          }
        });
      } else {
        this.platformService.error('保存签名文件失败，是否重试！', _ => this.saveSignature(signature));
      }
    });
  }

  /**
   * 查询当前受种人的接种信息
   * @param profileCode 受种人档案编码
   * @param globalRecordNumber 受种人本次接种全局流水号
   * @param status
   */
  queryCurrentVaccinateRecords(profileCode: string, globalRecordNumber: string) {
    console.log('查询接种记录 - queryCurrentVaccinateRecords， 第324行代码');
    const query: any = {
      profileCode: profileCode,
      globalRecordNumber: globalRecordNumber,
      pageEntity: {page: 1, pageSize: 10}
    };
    if (profileCode && globalRecordNumber) {
      this.vaccinateService.queryCurrentVaccinateRecords(query, resp => {
        console.log('首次查到的接种记录 - queryCurrentVaccinateRecords，第333行代码', resp.data);
        this.currentVaccinateRecords = resp.data;
        if (resp.data.length > 0 && this.checkProfileFlag) {
          this.platformService.eventListenerFlag = VACCINATE_CHECK_TYPE.VACCINE;
        } else {
          this.platformService.eventListenerFlag = VACCINATE_CHECK_TYPE.PROFILE;
        }
        this.addDisabledForVaccinateRecord();
      });
    } else {
      this.currentVaccinateRecords = [];
    }
  }

  /**
   * 根据接种状态判断该记录是否被禁用属性
   * @param currentVaccinateRecords
   */
  addDisabledForVaccinateRecord() {
    console.log('开始设置禁用按钮，此时的接种记录为', this.currentVaccinateRecords);
    this.currentVaccinateRecords.forEach(item => {
      // 按钮初始化全禁用
      this.disabledAll(item);
      // 并且核验该疫苗是否为本部门可接种疫苗
      const isDepartmentVaccine: boolean = this.platformService.vaccineList.some(vaccineListItem => vaccineListItem === item['subclassCode']);
      // 如果是部门的疫苗则按钮放开
      if (isDepartmentVaccine) {
        // 根据 接种状态 判断 判断按钮禁用情况
        this.addDisabledByStatus(item);
        console.log('进入到修改疫苗完成按钮中');
        // 如果受种人和疫苗都不用核验，则可以点击所有的完成按钮
        if (!this.checkVaccineFlag) {
          // 疫苗核验开关开启，如果vaccinateStatus状态不为1，禁用完成按钮
          if (item['vaccinateStatus'] === '1' || item['vaccinateStatus'] === '0') {
            item['finishBtnStatus'] = false;
          } else {
            item['finishBtnStatus'] = true;
          }
        } else {
          if (item['vaccinateStatus'] === '1') {
            item['finishBtnStatus'] = false;
          } else {
            item['finishBtnStatus'] = true;
          }
        }
        // 如果接种部位为空，禁用完成按钮
        if (isNaN(Number(item['vaccinatePart']))) {
          item['finishBtnStatus'] = true;
        }
        this.platformService.loadManyDoseAvailable(item['vaccineBatchNo']);
      }
    });
    console.log('修改之后的可接种疫苗列表', this.currentVaccinateRecords);
  }

  // 根据 接种状态 判断 判断按钮禁用情况
  addDisabledByStatus(item) {
    // 根据 接种状态 判断 判断按钮禁用情况
    if (item['vaccinateStatus'] === '0' || item['vaccinateStatus'] === '1') {
      // 如果状态为0 表示待接种，按钮放开, 如果状态为1 表示疫苗核验已经通过，按钮放开,
      this.passedAll(item);
      this.platformService.computerVaccinateDoseNumber(item);
    }
  }

  // 禁用全部按钮
  disabledAll(item) {
    item['edit'] = false;
    item['cancelBtnStatus'] = true;
    item['finishBtnStatus'] = true;
  }

  // 放开全部按钮
  passedAll(item) {
    item['edit'] = true;
    item['finishBtnStatus'] = false;
    item['cancelBtnStatus'] = false;
  }

  /**
   * 加载接种部位字典数据
   */
  loadVaccinatePart() {
    this.vaccinateParts = this.dicDataService.getDicDataByKey('vaccinatePart');
  }

  /**
   * 加载接种类型字典数据
   */
  loadVaccinateType() {
    this.vaccinateTypes = this.dicDataService.getDicDataByKey('vaccinateType');
    // console.log('vaccinateTypes', this.vaccinateTypes);
  }

  /**
   * 核验受种人档案
   * @param scanInput
   */
  checkProfileInfo(scanInput: string) {
    console.log('checkProfileInfo --- ', this.currentQueueItem);
    console.log('说明到了 checkProfileInfo', scanInput.length === 18, scanInput === this.currentQueueItem['profileCode']);
    console.log('开始核验档案信息时的叫号状态', this.platformService.vaccinationStatus);
    // 验证成功
    if (scanInput.length === 18 && scanInput === this.currentQueueItem['profileCode']) {
      console.log('开始各种检查判断');
      this.platformService.setIsCheckSuccess(true);
      if (this.checkProfileFlag && this.platformService.vaccinationStatus !== VACCINATE_STATUS.finished) {
        console.log('123');
        this.platformService.openGreen();
        this.platformService.success('受种人信息核验成功！');
        // 如果档案核验成功，则开始核验疫苗，同时状态修改为接种中
        this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.VACCINE);
        this.platformService.vaccinationStatus = VACCINATE_STATUS.vaccinating;
      }
      // 如果当前叫号状态是叫号中，则可以核验受种人信息
      if (this.platformService.vaccinationStatus === VACCINATE_STATUS.calling || this.platformService.vaccinationStatus === VACCINATE_STATUS.vaccinating) {
        console.log('5201314');
        this.platformService.openGreen();
        if (this.checkProfileFlag)
          this.platformService.success('受种人信息核验成功！');
        // 如果档案核验成功，则开始核验疫苗
        this.platformService.setVaccineCheckType(VACCINATE_CHECK_TYPE.VACCINE);
        this.platformService.vaccinationStatus = VACCINATE_STATUS.vaccinating;
        console.log('5201314 checkProfileInfo 开始初始化接种记录 initVaccinateRecord');
        this.initVaccinateRecord(this.currentQueueItem.globalRecordNumber);
      }
      // 验证成功，且叫号状态不是已完成接种，则状态修改为接种中
      // if (this.platformService.vaccinationStatus !== VACCINATE_STATUS.finished && this.platformService.vaccinationStatus !== VACCINATE_STATUS.viewing) {
      //   console.log('456');
      //   this.platformService.vaccinationStatus = VACCINATE_STATUS.vaccinating;
      //   console.log('checkProfileInfo 开始初始化接种记录 initVaccinateRecord');
      //   this.initVaccinateRecord(this.currentQueueItem.globalRecordNumber);
      // }
      if (this.platformService.vaccinationStatus === VACCINATE_STATUS.viewing) {
        console.log('789');
        const globalRecordNumber = this.currentQueueItem['globalRecordNumber'];
        this.showRegisterVaccinateRecord(globalRecordNumber);
        this.checkProfileRet = false;
      }
      // 如果已经接种完成，则只需要查出当前已接种的接种记录即可
      if (this.platformService.vaccinationStatus === VACCINATE_STATUS.finished) {
        console.log('10');
        const profileCode = this.currentQueueItem['profileCode'];
        const globalRecordNumber = this.currentQueueItem['globalRecordNumber'];
        this.queryCurrentVaccinateRecords(profileCode, globalRecordNumber);
      }
      if (this.registerVaccinateRecords.length === 0 && this.currentQueueItem) {
        console.log('11');
        const globalRecordNumber = this.currentQueueItem['globalRecordNumber'];
        this.showRegisterVaccinateRecord(globalRecordNumber);
      }
      console.log('没有人要我了');
    } else {
      console.log('糟了，身份核验失败了');
      // 验证失败
      if (this.checkVaccineFlag) {
        this.showCheckFailure();
      }
    }
  }

  showCheckFailure() {
    this.platformService.openRed();
    this.modalService.warning({
      nzTitle: '提示',
      nzContent: '受种人信息核验失败，请确认受种人信息！'
    });
    // 接种中是否核验成功
    this.platformService.setIsCheckSuccess(false);
    this.platformService.vaccinationStatus = VACCINATE_STATUS.calling;
  }

  checkVaccineInfo(scanInput) {
    // 判断当前核验的接种疫苗是否完成，如果完成，
    this.checkCode(scanInput);
  }

  /**
   * 疫苗电子监管码核验
   * @param scanInput
   */
  checkCode(scanInput) {
    this.eleSuperviseCodeService.checkCode(scanInput, findBatchNoResp => {
      console.log('电子监管码核验结果', findBatchNoResp);
      if (findBatchNoResp.code === 0) {
        // 返回的产品信息
        const productInfo = findBatchNoResp.data;
        // 在接种记录中找到符合该批号的有效的接种记录
        const currentVaccinateRecord = this.currentVaccinateRecords.find(item => item['vaccineBatchNo'] === productInfo['batchNo']);
        // 如果没有找到符合的接种记录，则返回提示
        if (currentVaccinateRecord === null || currentVaccinateRecord === undefined) {
          this.platformService.setCurrentVaccineInfo({});
          this.platformService.openRed();
          this.platformService.warning('没有与该疫苗匹配的接种记录，请确认所选择疫苗!');
          return;
        }
        // 如果状态为3，则该接种疫苗已完成
        if (currentVaccinateRecord['vaccinateStatus'] === '3') {
          this.platformService.warning('该疫苗已完成接种，请确认选择疫苗是否正确!');
          return;
        }
        // 如果当前接种的疫苗列表 和 扫描的疫苗不匹配，则提示
        if (this.currentVaccineProductList.length > 0) {
          if (!this.currentVaccineProductList.some(p => p['batchNo'] === productInfo['batchNo'])) {
            this.platformService.warning('请完成或取消当前接种疫苗！');
            return;
          }
          if (this.currentVaccineProductList.some(p => scanInput === p['electronicSupervisionCode'])) {
            this.platformService.warning('请勿重复扫描！');
            return;
          }
        }
        // 在登记记录中找到currentVaccinateRecord的登记记录
        const registerVaccinateRecord = this.registerVaccinateRecords.find(item => item['registerRecordNumber'] === currentVaccinateRecord['registerRecordNumber']);
        // 初始化数衍设备调用参数
        let pushMessage = this.initPushMessage(registerVaccinateRecord);
        const currentVaccineInfo = {
          vaccineProductCode: currentVaccinateRecord.vaccineProductCode,
          vaccineBatchNo: currentVaccinateRecord.vaccineBatchNo,
          electronicSupervisionCode: scanInput,
          vaccinateCount: currentVaccinateRecord.vaccinateCount,
        };
        this.platformService.setCurrentVaccineInfo(currentVaccineInfo);
        this.platformService.vaccineBatches.push(currentVaccineInfo['vaccineBatchNo']);
        this.platformService.eleSuperviseCodes.push(currentVaccineInfo['electronicSupervisionCode']);
        // 核验疫苗有效期
        // new Date(productInfo['loseEfficacyDate']) < new Date()
        if (1 !== 1) {
          this.platformService.error('疫苗信息核验失败，疫苗已过期！');
          pushMessage['params']['vaccineInfoList'].push({
            traceCode: productInfo['electronicSupervisionCode'],
            vaccineName: productInfo['productName'],
            vaccineSpecification: productInfo['spec'],
            vaccineDosage: productInfo['dosageForm'],
            vaccineCreateDate: productInfo['produceDate'],
            vaccineValidDate: productInfo['loseEfficacyDate'],
            vaccineBatchNum: productInfo['batchNo'],
            vaccineProduceEnterprise: productInfo['produceName'],
            vaccinateDosageTime: currentVaccinateRecord['vaccinateDoseNumber'],
            vaccinatePart: this.vaccinateParts.find(part => part['value'] === currentVaccinateRecord['vaccinatePart'])['label'],
            vaccinateType: this.vaccinateTypes.find(part => part['value'] === currentVaccinateRecord['vaccinateType'])['label'],
          });
          this.sendCheckedMessage(pushMessage, false, '疫苗已过期，请勿接种！');
          this.platformService.openRed();
        } else {
          this.currentVaccineProductList.push(productInfo);
          // 判断当前要接种的疫苗支数
          if (Number(registerVaccinateRecord['vaccinateCount']) === 1) {
            // 当前接种疫苗支数为1, 直接将数据推送至数衍设备，受种人或家长签字
            this.sendToDevice(pushMessage, currentVaccinateRecord);
          } else {
            // 当前接种疫苗支数 大于1 , 直接将数据推送至数衍设备，受种人或家长签字
            if (this.currentVaccineProductList.length === Number(currentVaccinateRecord['vaccinateCount'])) {
              // 当前 扫描的疫苗数量 和 接种疫苗支数相同时， 数据推送至数衍设备，受种人或家长签字
              this.sendToDevice(pushMessage, currentVaccinateRecord);
            } else {
              // 当前 扫描的疫苗数量 和 接种疫苗支数不相同时， 提示继续扫描下一支疫苗
              this.platformService.openGreen();
              this.platformService.success('请继续核验下一支疫苗！');
            }
          }
        }
      } else {
        this.platformService.openRed();
        this.platformService.warning('电子监管码校验不成功,请确认所选择疫苗!');
      }
    });
  }

  // 初始化 数衍推送数据
  initPushMessage(registerVaccinateRecord) {
    // 初始化数衍设备调用参数
    let transFormAge = TransformUtils.getAgeFromBirthDate(this.platformService.profileInfo['birthDate']);
    const staff = this.staffList.find(item => item.number === registerVaccinateRecord['registDoctorCode']);
    const povName = this.localStorage.retrieve(LOCAL_STORAGE.VACC_POV + registerVaccinateRecord['registPovCode']);
    return {
      ntype: '101',
      params: {
        orderId: registerVaccinateRecord['registerRecordNumber'],
        vaccinateUnit: povName ? povName : registerVaccinateRecord['registPovCode'],
        deviceId: this.platformService.selectedDepartmentCode,
        vaccinateRegDoctor: staff ? staff['realName'] : registerVaccinateRecord['registDoctorCode'],
        vaccinateDate: DateUtils.getFormatTime(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        vaccinateRealName: this.platformService.profileInfo['name'],
        immuneCardNo: this.platformService.profileInfo['profileCode'],
        immuneCardNo2: this.platformService.profileInfo['immunityVacCard'] ? this.platformService.profileInfo['immunityVacCard'] : '',
        vaccinateBirthday: DateUtils.getFormatTime(this.platformService.profileInfo['birthDate'], 'YYYY-MM-DD'),
        vaccinateAge: `${transFormAge.age}岁${transFormAge.month ? transFormAge.month : 0}月`,
        vaccinateGender: this.platformService.profileInfo['gender'] === 'f' ? '女' : '男',
        vaccinateFatherName: this.platformService.profileInfo['fatherName'] ? this.platformService.profileInfo['fatherName'] : '',
        vaccinateMotherName: this.platformService.profileInfo['motherName'] ? this.platformService.profileInfo['motherName'] : '',
        userProvince: this.province ? this.province : this.platformService.userInfo['pov'],
        vaccineInfoList: []
      },
      timestamp: this.getTimestamp()
    };
  }

  // 添加数衍推送数据疫苗列表
  sendToDevice(pushMessage, currentVaccinateRecord) {
    this.currentVaccineProductList.forEach((p, index) => {
      pushMessage['params']['vaccineInfoList'].push({
        traceCode: p['electronicSupervisionCode'],
        vaccineName: p['productName'],
        vaccineSpecification: p['spec'],
        vaccineDosage: p['dosageForm'],
        vaccineCreateDate: p['produceDate'],
        vaccineValidDate: p['loseEfficacyDate'],
        vaccineBatchNum: p['batchNo'],
        vaccineProduceEnterprise: p['produceName'],
        vaccinateDosageTime: currentVaccinateRecord['vaccinateDoseNumber'],
        vaccinatePart: this.vaccinateParts.find(part => part['value'] === currentVaccinateRecord['vaccinatePart'])['label'],
        vaccinateType: this.vaccinateTypes.find(part => part['value'] === currentVaccinateRecord['vaccinateType'])['label'],
        checkStatus: '0',
        checkErrorMsg: index === 0 ? `疫苗核验成功，${this.platformService.profileInfo['name']}, 您当前接种的是${p['productName']}在有效期以内,请签字确认！` : ''
      });
    });
    this.isFinished = false;
    this.isSigned = false;
    this.platformService.openGreen();
    this.platformService.success('疫苗信息核验成功，请让家长签字确认！');
    this.sendCheckedMessage(pushMessage, true);
  }


  /**
   * 初始化本次接种所需要的接种记录，如果不存在就插入
   * @param globalRecordNumber
   */
  initVaccinateRecord(globalRecordNumber: string) {
    const params = {globalRecordNumber: globalRecordNumber, registerStatus: ['1']};
    this.vaccinateService.initVaccinateRecord(params, resp => {
      if (resp.code === 0) {
        // this.platformService.success('接种记录初始化成功!');
        this.queryCurrentVaccinateRecords(this.currentQueueItem['profileCode'], this.currentQueueItem['globalRecordNumber']);
      } else if (resp.code === 10901702) {
        console.warn('接种记录已存在,无需初始化！');
        this.queryCurrentVaccinateRecords(this.currentQueueItem['profileCode'], this.currentQueueItem['globalRecordNumber']);
      } else if (resp.code === 10901703) {
        // this.platformService.warning('登记记录不存在，请到登记台核验!');
        // TODO 如果没有查到登记记录，则需要删除当前排队信息
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: '当前叫号信息没有登记记录，是否删除该排队信息?',
          nzOkText: '确定删除',
          nzCancelText: '取消',
          nzOnOk: () => {
            this.deleteQueueItem();
          }
        });
      } else if (resp.code === 10901798) {
        this.platformService.error('初始化接种记录失败，请重试!');
      } else if (resp.code === 10901799) {
        this.platformService.error('初始化接种记录失败，请联系管理员!');
      }
    });
  }

  /**
   * 接种完按成confirm
   * @param data
   */
  vaccinateFinishConfirm(data) {
    if (this.platformService.coldStorageFacilities.length === 0) {
      this.platformService.warning('冰箱设备获取失败!');
      return;
    }
    // 如果在None 的状态下是不可以接种的
    if (this.platformService.vaccinationStatus !== VACCINATE_STATUS.vaccinating && this.platformService.vaccinationStatus !== VACCINATE_STATUS.calling) {
      this.platformService.warning('当前不是接种中的状态，无法执行任何操作');
      return;
    }
    this.modalService.confirm({
      nzTitle: '<i>接种确认</i>',
      nzContent: '<b>' + '确认完成?' + '</b>',
      nzOkText: '确认',
      nzCancelText: '返回',
      nzWrapClassName: 'confirm',
      nzOnOk: () => this.vaccinateFinish(data, '3')
    });
  }

  /**
   * 接种完成，完成以下操作
   * 1.更新接种记录表：接种状态、接种时间、
   * 2.调用库存接口，完成接种出库
   * 3.更新排队数据，如果为受种人最后一条接种记录，则更改状态为留观，否则更新状态为待接种
   * 4. 调用数衍设备平台接口，查询签字图片数据并保存
   */
  vaccinateFinish(data, vaccinateStatus) {
    console.log('接种完成疫苗的剂次', data);
    console.log('排队数据', this.currentQueueItem);
    this.loading = true;
    // const id = data.id;
    const vaccinateTime = DateUtils.getFormatDateTime(new Date());
    // const currentVaccinateRecord = this.currentVaccinateRecords.find(item => item.id === id);
    const checkProfileStr = this.checkProfileFlag ? '系统核验受种人' : '人工核验受种人';
    const checkVaccineStr = this.checkVaccineFlag ? '系统核验疫苗' : '人工核验疫苗';
    const params = {
      vaccinateRecordId: data['id'],
      globalRecordNumber: data['globalRecordNumber'],
      registerRecordNumber: data['registerRecordNumber'],
      vaccinateDoctorCode: this.platformService.userInfo['userCode'],
      vaccinateDepartmentCode: this.platformService.selectedDepartmentCode,
      vaccinatePovCode: this.platformService.userInfo['pov'],
      vaccinateTime: vaccinateTime,
      facilityCode: this.platformService.selectedFacilityCode,
      currentVaccinateRecordCount: this.currentVaccinateRecords.length,
      profileCode: this.currentQueueItem.profileCode,
      profileName: this.currentQueueItem.profileName,
      vaccinateDoseNumber: data.vaccinateDoseNumber,
      vaccineProductCode: data.vaccineProductCode,
      vaccinateStatus: vaccinateStatus,
      dosageByEach: data.dosageByEach,
      vaccinateMemo: checkProfileStr + '，' +  checkVaccineStr
    };
    if (data.vaccinateMemo) {
      params['vaccinateMemo'] = data.vaccinateMemo;
    }
    this.vaccinateService.vaccinateFinish(params, resp => {
      this.loading = false;
      if (resp.code === 0) {
        const resultData = resp.data;
        const subclassCodes = resultData.subclassCodes;
        const resultCode = resultData.resultCode;
        if (resultCode === '0') {
          this.vaccinateFinished(subclassCodes);
          this.isFinished = true;
          this.platformService.success('所有接种已完成，进入留观！');
          // 查询历史接种信息
          this.platformService.queryHistoryVaccinateRecords(this.currentQueueItem.profileCode);
          this.platformService.eventListenerFlag = '';
          if (this.currentQueueItem) {
            const globalRecordNumber = this.currentQueueItem['globalRecordNumber'];
            this.showRegisterVaccinateRecord(globalRecordNumber);
          }
        } else if (resultCode === '1') {
          this.platformService.success('请继续接种其他疫苗！');
          this.isFinished = true;
          // 查询历史接种信息
          this.platformService.queryHistoryVaccinateRecords(this.currentQueueItem.profileCode);
        } else if (resultCode === '2') {
          this.vaccinateFinished(subclassCodes);
          this.isFinished = true;
          this.platformService.success('本部门接种已完成，请到其他部门继续接种！');
          // 查询历史接种信息
          this.platformService.queryHistoryVaccinateRecords(this.currentQueueItem.profileCode);
          this.platformService.eventListenerFlag = '';
        } else if (resultCode === '3') {
          this.vaccinateUnqualified();
          this.isFinished = true;
          this.platformService.success('已取消接种！');
          // 查询历史接种信息
          this.platformService.queryHistoryVaccinateRecords(this.currentQueueItem.profileCode);
          this.platformService.eventListenerFlag = '';
        }
        this.currentVaccineProductList = [];
        // 查询多剂次信息
        this.platformService.queryVaccineDoseInfo();
        this.queryCurrentVaccinateRecords(this.currentQueueItem.profileCode, data.globalRecordNumber);
      } else if (resp.code === 10901601) {
        this.platformService.error('接种单位编码不能为空，请重试！');
      } else if (resp.code === 10901602) {
        this.platformService.error('接种记录更新失败，请重试！');
      } else if (resp.code === 10901603) {
        this.platformService.error('疫苗出库失败,请重试！');
      } else if (resp.code === 10901604) {
        this.platformService.error(resp['msg']);
      } else if (resp.code === 10901605) {
        this.platformService.error('留观数据插入失败,请重试！');
      } else if (resp.code === 10901699) {
        this.platformService.error('完成接种失败，请联系管理员！');
      } else {
        this.platformService.error(resp['msg']);
      }
    });
  }


  vaccinateUnqualified() {
    this.currentQueueItem = this.platformService.initQueueData(this.currentQueueItem);
    if (this.platformService.iotTopic) {
      this.currentQueueItem.iotTopic = this.platformService.iotTopic;
    }
    this.platformService.vaccinationStatus = VACCINATE_STATUS.cancel;
    this.queueApiSvc.vaccinateUnqualified(this.currentQueueItem, resp => {
      if (resp.hasOwnProperty('code') && resp.code === 0) {
        this.platformService.querySuccessData();
      }
    });
  }

  /**
   * 接种完成
   */
  vaccinateFinished(finishedSubclassCodes: any[]) {
    this.currentQueueItem['calledMessageId'] = this.currentQueueItem['messageId'];
    const unfinishedVaccinateList = [];
    // 过滤待接种的疫苗
    this.currentVaccinateRecords.forEach(record => {
      //
      if (!finishedSubclassCodes.some(code => code === record['subclassCode'])) {
        unfinishedVaccinateList.push(record['subclassCode']);
      }
    });
    // 模拟接种完成，打完一针疫苗，向finishedVaccineList添加一条
    this.currentQueueItem['finishedVaccineList'] = finishedSubclassCodes;
    this.currentQueueItem['vaccineList'] = unfinishedVaccinateList;
    this.currentQueueItem = this.platformService.initQueueData(this.currentQueueItem);
    if (this.platformService.iotTopic) {
      this.currentQueueItem.iotTopic = this.platformService.observeIotTopic;
    }
    this.platformService.vaccinationStatus = VACCINATE_STATUS.finished;
    this.queueApiSvc.vaccinateFinished(this.currentQueueItem, resp => {
      if (resp.hasOwnProperty('code') && resp.code === 0) {
        this.platformService.querySuccessData();
      } else {
        this.vaccinateFinished(finishedSubclassCodes);
      }
    });
  }


  /**
   * 打开接种记录备注Dialog
   */
  vaccinateMemo(data) {
    // 如果在None 的状态下是不可以接种的
    if (this.platformService.vaccinationStatus !== VACCINATE_STATUS.vaccinating && this.platformService.vaccinationStatus !== VACCINATE_STATUS.calling) {
      this.platformService.warning('当前不是接种中的状态，无法执行任何操作');
      return;
    }
    const id = data.id;
    const currentVaccinateRecord = this.currentVaccinateRecords.find(
      item => item.id === id
    );
    this.nbDialogService
      .open(VaccinateMemoDialogComponent, {
        context: {
          currentVaccinateRecord: currentVaccinateRecord,
          userCode: this.platformService.userInfo.department
        }
      })
      .onClose.subscribe(result => {
      if (result) {
        data.vaccinateMemo = result.memo;
        if (result.status === '99') {
          this.vaccinateFinish(data, result.status);
        }
      }
    });
  }

  /**
   * 查询登记接种信息
   * 用来验证用户的登记记录有没有签字
   * 用于产科接种台使用，门诊接种台不适用，因为门诊的签字是可以去掉的，门诊的签字不是必须的
   * @param globalRecordNumber
   */
  showRegisterVaccinateRecord(globalRecordNumber: string) {
    const params = {
      globalRecordNumber: globalRecordNumber,
      registPovCode: this.platformService.userInfo.pov,
      registStatus: ['1', '2'],
      pageEntity: {
        page: 1,
        pageSize: 200
      }
    };
    this.registerRecordService.queryRegistRecord(params, resp => {
      if (resp['code'] === 0) {
        const temp: any[] = resp.data;
        const notSigned = temp.some(record => !record['signature'] || record['signature'] === '0');
        if (notSigned && this.checkSign) {
          this.platformService.warning('请家长在智慧接种APP上对知情告知书进行签字！', () => {
            this.showRegisterVaccinateRecord(globalRecordNumber);
          });
          return;
        }
        this.registerVaccinateRecords = resp.data;
        // 检查是否有待接种的疫苗，如果没有，则提示用户是否需要删除当前队列信息
        const regRecordToVaccinate = this.registerVaccinateRecords.some(rd => rd['registStatus'] === '1');
        if (!regRecordToVaccinate && this.platformService.vaccinationStatus !== VACCINATE_STATUS.finished) {
          this.modalService.confirm({
            nzTitle: '提示',
            nzContent: '当前登记记录中没有可以进行接种的记录，是否需要删除当前排队信息？',
            nzOkText: '删除',
            nzCancelText: '取消',
            nzOnOk: () => {
              this.deleteQueueItem();
            }
          });
        }
      } else {
        this.registerVaccinateRecords = [];
      }
    });
  }

  /**
   * 更新接种记录
   */
  updateVaccinateRecord(id, modifyType, modifyData, func?: Function) {
    const paramsStr = '{"id": ' + id + ', "' + modifyType + '": "' + modifyData + '"}';
    const params = JSON.parse(paramsStr);
    this.vaccinateService.updateVaccinateRecord(params, resp => {
      if (resp.code === 0) {
        this.platformService.success('接种记录更新成功！');
        this.addDisabledForVaccinateRecord();
        if (typeof func === 'function') {
          func(true);
        }
        return;
      }
      func(false);
    });
  }

  getTimestamp() {
    const date = new Date();
    return '' + date.getFullYear() + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
  }

  /**
   * 删除消息队列中没有登记记录的消息，因为没有登记记录就不会有接种记录，就没有必要进行接种
   * profileName: "王蔓灵"
   queueCount: "3"
   actionTime: 1579483406000
   vaccinateCalledTopic: "vaccinate_called_topic"
   departmentCode: "340111050111"
   registPassTopic: "regist_pass_topic"
   curStatus: "7"
   registPassTopicShared: "regist_pass_topic_shared"
   curDoc: "15155123526"
   payWaitTopicShared: "pay_wait_topic_shared"
   vaccineList: (2) ["0202", "5401"]
   queueCode: "A006"
   curRoomName: "接种台1"
   nameSpace: "default"
   vaccineCode: ""
   createDate: 1579483026000
   vaccinateWaitTopicShared: "vaccinate_wait_topic_shared"
   povCode: "3401110501"
   curRoom: "340111050111"
   vaccinateCalledTopicShared: "vaccinate_called_topic_shared"
   messageId: "124424:17:-1:0"
   payWaitTopic: "pay_wait_topic"
   globalRecordNumber: "7af37b6c5864453bafe11906e2a539d6"
   curAction: "5"
   vaccinateWaitTopic: "vaccinate_wait_topic"
   passCount: "4"
   registWaitTopicShared: "regist_wait_topic_shared"
   immunityVacCard: "3491482869"
   registWaitTopic: "regist_wait_topic"
   queueRoomType: "1"
   iotTopic: ["88bc06c71d814fd483c0e6186f615347"]
   regQueueCode: "041166509486"
   passStatus: "0"
   profileCode: "341181230320110018"
   queueDelay: "3"
   businessType: "A"
   needToPay: "0"
   */
  deleteQueueItem() {
    console.log(this.currentQueueItem, this.departmentCode);
    if (this.currentQueueItem && this.departmentCode) {
      const vaccinateWaitMonitorTopic = this.platformService.vaccinateWaitTopic;
      const vaccinateWaitMonitorTopicWithDepartmentCode = this.platformService.vaccinateWaitTopic + '_' + this.departmentCode;
      const vaccinateCalledMonitorTopicShared = this.platformService.vaccinateCalledTopicShared + '_' + this.departmentCode;
      const vaccinateCalledMonitorTopic = this.platformService.vaccinateCalledTopic + '_' + this.departmentCode;
      const povCode = this.currentQueueItem['povCode'];
      const nameSpace = this.currentQueueItem['nameSpace'];
      const messageId = this.currentQueueItem['messageId'];
      // if (this.platformService.vaccinationStatus === VACCINATE_STATUS.calling || this.platformService.vaccinationStatus === VACCINATE_STATUS.vaccinating) {
      this.queueApiSvc.deleteQueueItem(povCode, nameSpace, vaccinateCalledMonitorTopicShared, vaccinateCalledMonitorTopic, messageId, res => {
        console.log('删除叫号中队列消息返回值', res);
        if (res.code === 0) {
          // this.notifier.notify('success', '成功删除排队信息');
        }
      });
      // }
      // if (this.platformService.vaccinationStatus === VACCINATE_STATUS.viewing) {
      const sharedTopic = this.currentQueueItem['vaccinateWaitTopicShared'];
      const monitorTopic = this.currentQueueItem['vaccinateWaitTopic'];
      this.queueApiSvc.deleteQueueItem(povCode, nameSpace, sharedTopic, monitorTopic, messageId, res => {
        console.log('删除待叫号队列消息返回值', res);
        if (res.code === 0) {
          this.notifier.notify('success', '成功删除排队信息');
          this.platformService.vaccinatingQueueData = [];
          this.platformService.setCurrentQueueItem(null);
        }
      });
      // }
    }
  }
}

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {
  AdministrativeDivisionService,
  DateUtils,
  DicDataService,
  EleSuperviseCodeService, LOCAL_STORAGE,
  QueueApiService,
  RegistRecordService, RegObstetricsService, SysConfInitService,
  TransformUtils,
  VACCINATE_STATUS,
  VaccinateService,
  VaccinateSignatureService
} from '@tod/svs-common-lib';
import {VaccinateMemoDialogComponent} from '../../vaccinate-memo-dialog/vaccinate-memo-dialog.component';
import {NbDialogService} from '@nebular/theme';
import {VaccinatePlatformService} from '../vaccinate-platform.service';
import {LocalStorageService} from '@tod/ngx-webstorage';
import {DeviceWebsocketService} from '../device-websocket.service';

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
  // 是否开始疫苗核验
  checkVaccineFlag: boolean = false;
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
  // 当前接种疫苗产品
  currentVaccineProduct: any;
  // 告情通知书签字核验
  checkSign: boolean = false;

  private subscription: Subscription[] = [];

  constructor(
    private nbDialogService: NbDialogService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private vaccinateService: VaccinateService,
    private registerRecordService: RegistRecordService,
    private dicDataService: DicDataService,
    private queueApiSvc: QueueApiService,
    private divisionService: AdministrativeDivisionService,
    private localStorage: LocalStorageService,
    private regObstetricsService: RegObstetricsService,
    private signatureService: VaccinateSignatureService,
    private sysConfService: SysConfInitService,
    private deviceWebsocketService: DeviceWebsocketService,
    private eleSuperviseCodeService: EleSuperviseCodeService,
    private platformService: VaccinatePlatformService) {
    this.staffList = this.localStorage.retrieve(LOCAL_STORAGE.POV_STAFF);
    this.checkSign = this.sysConfService.getConfValue('checkSign') === '1';
  }

  ngOnInit() {
    this.initCurrentQueueItem();
    this.initCheckVaccineFlag();
    this.loadVaccinatePart();
    this.loadVaccinateType();
    this.initScanInput();
    if (this.checkVaccineFlag) {
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

  initCurrentQueueItem() {
    const sub = this.platformService.getCurrentQueueItem().subscribe(queueItem => {
      if (queueItem) {
        this.currentQueueItem = queueItem;
        this.initVaccinateRecord(this.currentQueueItem.globalRecordNumber);
        this.showRegisterVaccinateRecord(queueItem['globalRecordNumber']);
        this.queryCurrentVaccinateRecords(queueItem['profileCode'], queueItem['globalRecordNumber']);
      } else {
        this.registerVaccinateRecords = [];
        this.currentVaccinateRecords = [];
      }
    });
    this.subscription.push(sub);
  }

  initCheckVaccineFlag() {
    const sub = this.platformService.getCheckVaccineFlag().subscribe(flag => {
      this.checkVaccineFlag = flag;
      if (flag) {
        this.initDeviceWebSocket();
      } else {
        this.deviceWebsocketService.close();
      }
    });
    this.subscription.push(sub);
  }

  initScanInput() {
    const sub = this.platformService.getScanInput().subscribe(input => {
      if (input !== '') {
        if (this.checkVaccineFlag) {
          this.checkVaccineInfo(input);
        }
        this.platformService.setScanInput('');
      }
    });
    this.subscription.push(sub);
  }

  /**
   * 初始化查验设备websocket
   */
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
          this.checkVaccineFlag = false;
        }
      });
    });
    this.deviceWebsocketService.getMessage().subscribe( message => {
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
    value.params.vaccineInfoList[0]['checkErrorMsg'] = alertMessage;
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
          console.warn('数衍设备连接成功');
        } else {
          // this.platformService.error('设备连接失败！', () => this.deviceWebsocketService.sendCheck());
          this.platformService.error('安心接种设备连接失败！', () => {
            if (this.initDeviceCount++ < 3) {
              // this.initDeviceWebSocket();
            } else {
              this.initDeviceCount = 1;
              this.checkVaccineFlag = false;
            }
          });
        }
        break;
    }
  }

  saveSignature(signature) {
    this.signatureService.saveSignature(signature, resp => {
      if (resp['code'] === 0 && resp['data']) {
        const addVaccinateElcParam = {
          globalRecordNumber: signature['globalRecordNumber'],
          registerRecordNumber: signature['registerRecordNumber'],
          vaccineBatchNo: this.currentVaccineProduct['batchNo'],
          electronicSupervisionCode: this.currentVaccineProduct['electronicSupervisionCode']
        };
        this.vaccinateService.addVaccRecordElcSupervision(addVaccinateElcParam, addVaccinateElcResp => {
          const result = addVaccinateElcResp.data;
          if (result === 1) {
            this.isSigned = true;
            this.queryCurrentVaccinateRecords(this.currentQueueItem.profileCode, this.currentQueueItem.globalRecordNumber);
            this.platformService.eventListenerFlag = '';
          } else {
            this.platformService.success('请继续核验下一支疫苗!');
          }
        });
      } else {
        this.platformService.error('保存签名文件失败，是否重试！', _ => this.saveSignature(signature));
      }
    });
  }

  /**
   * 查询当前接种人的接种信息
   * @param profileCode 接种人档案编码
   * @param globalRecordNumber 接种人本次接种全局流水号
   * @param status
   */
  queryCurrentVaccinateRecords(profileCode: string, globalRecordNumber: string) {
    const query: any = {
      profileCode: profileCode,
      globalRecordNumber: globalRecordNumber,
      pageEntity: {page: 1, pageSize: 10}
    };
    if (profileCode && globalRecordNumber) {
      this.vaccinateService.queryCurrentVaccinateRecords(query, resp => {
        this.currentVaccinateRecords = resp.data;
        this.platformService.eventListenerFlag = 'scanVaccine';
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
    this.currentVaccinateRecords.forEach(item => {
      item['broadHeadingCode'] = item['subclassCode'].substring(0, 2);
      // 当接种状态为 '已完成' 和 '取消接种' 接种记录不可修改
      if (item.vaccinateStatus === '3' || item.vaccinateStatus === '99') {
        item.edit = false;
        item.cancelBtnStatus = true;
        item.finishBtnStatus = true;
      } else if (item.vaccinateStatus === '1') {
        // 如果状态为1 表示疫苗核验已经通过
        item.edit = true;
        item.finishBtnStatus = false;
        item.cancelBtnStatus = false;
        this.platformService.computerVaccinateDoseNumber(item);
      } else if (item.vaccinateStatus === '0' && !this.checkVaccineFlag) {
        // 如果状态为0 并且checkVaccineFlag为false 表示关闭疫苗核验 则完成按钮不被禁用
        // 并且核验该疫苗是否为本部门可接种疫苗
        const vaccineSubclassCode = this.platformService.vaccineList.find(
          vaccineListItem => vaccineListItem === item.subclassCode
        );
        if (vaccineSubclassCode) {
          item.edit = true;
          item.finishBtnStatus = false;
          item.cancelBtnStatus = false;
          this.platformService.computerVaccinateDoseNumber(item);
        } else {
          item.edit = false;
          item.finishBtnStatus = true;
          item.cancelBtnStatus = true;
        }
      } else {
        item.edit = true;
        item.cancelBtnStatus = false;
        item.finishBtnStatus = true;
        this.platformService.computerVaccinateDoseNumber(item);
      }
      if (isNaN(Number(item['vaccinatePart']))) {
        item.cancelBtnStatus = false;
        item.finishBtnStatus = true;
      }
      this.platformService.loadManyDoseAvailable(item.vaccineBatchNo);
    });
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
    console.log('vaccinateTypes', this.vaccinateTypes);
  }

  checkVaccineInfo(scanInput) {
    if (this.isFinished) {
      this.checkCode(scanInput);
    } else {
      if (!this.currentVaccineProduct) {
          return;
      }
      if (scanInput === this.currentVaccineProduct['electronicSupervisionCode']) {
        this.checkCode(scanInput);
      } else {
        this.platformService.warning('请完成或取消当前接种疫苗！');
      }
    }
  }

  checkCode(scanInput) {
    this.eleSuperviseCodeService.checkCode(scanInput, findBatchNoResp => {
      if (findBatchNoResp.code === 0) {
        const productInfo = findBatchNoResp.data;
        this.currentVaccineProduct = productInfo;
        const batchNo = productInfo['batchNo'];
        const currentVaccinateRecord = this.currentVaccinateRecords.find(item => item.vaccineBatchNo === batchNo && item.edit === true);
        const registerVaccinateRecord = this.registerVaccinateRecords.find(item => item.vaccineBatchNo === batchNo);
        if (currentVaccinateRecord === null || currentVaccinateRecord === undefined || currentVaccinateRecord.edit === false) {
          this.platformService.openRed();
          this.platformService.warning('没有与该疫苗匹配的接种记录，请确认所选择疫苗!');
          return;
        }
        if (currentVaccinateRecord.vaccinateStatus === '3') {
          this.platformService.openRed();
          this.platformService.warning('该疫苗已完成接种，请确认选择疫苗是否正确!');
          return;
        }
        // 初始化数衍设备调用参数
        let transFormAge = TransformUtils.getAgeFromBirthDate(this.platformService.profileInfo['birthDate']);
        const staff = this.staffList.find(item => item.number === registerVaccinateRecord['registDoctorCode']);
        const povName =  this.localStorage.retrieve(LOCAL_STORAGE.VACC_POV + registerVaccinateRecord['registPovCode']);
        let data = {
          'ntype': '101',
          'params': {
            'orderId': currentVaccinateRecord['registerRecordNumber'],
            'vaccinateUnit': povName ? povName : registerVaccinateRecord['registPovCode'],
            'deviceId': this.platformService.selectedDepartmentCode,
            'vaccinateRegDoctor': staff ? staff['realName'] : registerVaccinateRecord['registDoctorCode'],
            'vaccinateDate': DateUtils.getFormatTime(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            'vaccinateRealName': this.platformService.profileInfo['name'],
            'immuneCardNo': this.platformService.profileInfo['profileCode'],
            'immuneCardNo2': this.platformService.profileInfo['immunityVacCard'] ? this.platformService.profileInfo['immunityVacCard'] : '',
            'vaccinateBirthday': DateUtils.getFormatTime(this.platformService.profileInfo['birthDate'], 'YYYY-MM-DD'),
            'vaccinateAge': `${transFormAge.age}岁${transFormAge.month ? transFormAge.month : 0}月`,
            'vaccinateGender': this.platformService.profileInfo['gender'] === 'f' ? '女' : '男',
            'vaccinateFatherName': this.platformService.profileInfo['fatherName'] ? this.platformService.profileInfo['fatherName'] : '',
            'vaccinateMotherName': this.platformService.profileInfo['motherName'] ? this.platformService.profileInfo['motherName'] : '',
            'userProvince': this.province ? this.province : this.platformService.userInfo['pov'],
            'vaccineInfoList': [
              {
                'traceCode': productInfo['electronicSupervisionCode'],
                'vaccineName': productInfo['productName'],
                'vaccineSpecification': productInfo['spec'],
                'vaccineDosage': productInfo['dosageForm'],
                'vaccineCreateDate': productInfo['produceDate'],
                'vaccineValidDate': productInfo['loseEfficacyDate'],
                'vaccineBatchNum': productInfo['batchNo'],
                'vaccineProduceEnterprise': productInfo['produceName'],
                'vaccinateDosageTime': currentVaccinateRecord['vaccinateDoseNumber'],
                'vaccinatePart': this.vaccinateParts.find(part => part['value'] === currentVaccinateRecord['vaccinatePart'])['label'],
                'vaccinateType': this.vaccinateTypes.find(part => part['value'] === currentVaccinateRecord['vaccinateType'])['label'],
              }
            ]
          },
          'timestamp': this.getTimestamp()
        };
        if (currentVaccinateRecord) {
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
          if (new Date(productInfo['loseEfficacyDate']) < new Date()) {
            this.platformService.error('疫苗信息核验失败，疫苗已过期！');
            this.sendCheckedMessage(data, false, '疫苗已过期，请勿接种！');
            this.platformService.openRed();
          } else {
            this.isFinished = false;
            this.isSigned = false;
            this.platformService.success('疫苗信息核验成功，请让家长签字确认！');
            this.sendCheckedMessage(data, true, `疫苗核验成功，${this.platformService.profileInfo['name']}, 当前接种的是${productInfo['productName']},请签字确认！`);
            this.platformService.openGreen();
          }
        } else {
          this.platformService.setCurrentVaccineInfo({});
          this.platformService.openRed();
          this.platformService.warning('没有与该疫苗匹配的接种记录，请确认所选择疫苗!');
        }
      } else {
        this.platformService.openRed();
        this.platformService.warning('电子监管码校验不成功,请确认所选择疫苗!');
      }
    });
  }


  /**
   * 初始化本次接种所需要的接种记录，如果不存在就插入
   * @param globalRecordNumber
   */
  initVaccinateRecord(globalRecordNumber: string) {
    const params = {globalRecordNumber: globalRecordNumber, registerStatus: ['1']};
    this.vaccinateService.initVaccinateRecord(params, resp => {
      if (resp.code === 0) {
        this.platformService.success( '接种记录初始化成功!');
        this.queryCurrentVaccinateRecords(this.currentQueueItem['profileCode'], this.currentQueueItem['globalRecordNumber']);
      } else if (resp.code === 10901702) {
        console.warn('接种记录已存在,无需初始化！');
        this.queryCurrentVaccinateRecords(this.currentQueueItem['profileCode'], this.currentQueueItem['globalRecordNumber']);
      } else if (resp.code === 10901703) {
        this.platformService.warning('登记记录不存在，请到登记台核验!');
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
      this.platformService.warning( '冰箱设备获取失败!');
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
   * 3.更新排队数据，如果为接种人最后一条接种记录，则更改状态为留观，否则更新状态为待接种
   * 4. 调用数衍设备平台接口，查询签字图片数据并保存
   */
  vaccinateFinish(data, vaccinateStatus) {
    // const id = data.id;
    const vaccinateTime = DateUtils.getFormatDateTime(new Date());
    // const currentVaccinateRecord = this.currentVaccinateRecords.find(item => item.id === id);
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
      profileName: this.platformService.vaccinatingQueueData[0].profileName,
      vaccinateDoseNumber: data.vaccinateDoseNumber,
      vaccineProductCode: data.vaccineProductCode,
      vaccinateStatus: vaccinateStatus
    };
    if (data.vaccinateMemo) {
      params['vaccinateMemo'] = data.vaccinateMemo;
    }
    this.vaccinateService.vaccinateFinish(params, resp => {
      if (resp.code === 0) {
        const resultData = resp.data;
        const subclassCodes = resultData.subclassCodes;
        const resultCode = resultData.resultCode;
        if (resultCode === '0') {
          this.vaccinateFinished(subclassCodes);
          this.isFinished = true;
          this.platformService.success('所有接种已完成，进入留观！');
          this.regObstetricsService.update({
            povCode: this.platformService.userInfo['pov'],
            globalRecordNumber: data['globalRecordNumber'],
            vaccinateStatus: '1'
          }, () => {
            this.platformService.refreshWaitingQueueData();
            this.platformService.querySuccessData();
          });
          // 查询历史接种信息
          this.platformService.queryHistoryVaccinateRecords(this.currentQueueItem.profileCode);
          this.platformService.eventListenerFlag = '';
        } else if (resultCode === '1') {
          this.platformService.success( '请继续接种其他疫苗！');
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
        this.currentVaccineProduct = null;
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
  vaccinateFinished(subclassCodes) {
    this.currentQueueItem['calledMessageId'] = this.platformService.vaccinatingQueueData[0]['messageId'];
    // 模拟接种完成，打完一针疫苗，向finishedVaccineList添加一条
    this.currentQueueItem['finishedVaccineList'] = subclassCodes;
    this.currentQueueItem = this.platformService.initQueueData(this.currentQueueItem);
    if (this.platformService.iotTopic) {
      this.currentQueueItem.iotTopic = this.platformService.observeIotTopic;
    }
    this.platformService.vaccinationStatus = VACCINATE_STATUS.finished;
    this.queueApiSvc.vaccinateFinished(this.currentQueueItem, resp => {
      if (resp.hasOwnProperty('code') && resp.code === 0) {
        this.platformService.querySuccessData();
      } else {
        this.vaccinateFinished(subclassCodes);
      }
    });
  }


  /**
   * 打开接种记录备注Dialog
   */
  vaccinateMemo(data) {
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
          this.platformService.error('请家长在智慧接种APP上对告情通知书签字！', () => {
            this.showRegisterVaccinateRecord(globalRecordNumber);
          });
          return;
        }
        this.registerVaccinateRecords = resp.data;
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
        this.platformService.success( '接种记录更新成功！');
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
}

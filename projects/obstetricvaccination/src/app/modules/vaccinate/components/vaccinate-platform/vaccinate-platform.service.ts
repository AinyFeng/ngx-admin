import {ElementRef, Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {
  DateUtils,
  QUEUE_ROOM_TYPE,
  QueueApiService,
  RegObstetricsService,
  RegQueueService,
  VACCINATE_STATUS,
  VaccinateService, VoiceService
} from '@tod/svs-common-lib';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VaccinatePlatformService implements OnDestroy {
  get selectedFacilityCode(): string {
    return this._selectedFacilityCode;
  }

  set selectedFacilityCode(value: string) {
    this._selectedFacilityCode = value;
  }

  get profileInfo(): any {
    return this._profileInfo;
  }

  set profileInfo(value: any) {
    this._profileInfo = value;
  }
  get observeIotTopic(): any {
    return this._observeIotTopic;
  }

  set observeIotTopic(value: any) {
    this._observeIotTopic = value;
  }


  constructor(private modalService: NzModalService,
              private queueApiSvc: QueueApiService,
              private regQueueService: RegQueueService,
              private voiceService: VoiceService,
              private vaccinateService: VaccinateService, private regObstetricsService: RegObstetricsService) {
  }

  // 当前科室用户信息
  public _userInfo: any;
  // pulsar 地址
  public _pulsarUrl: string;
  // pulsar 命名空间
  public _pulsarNs: string;
  // 接种室共享队列
  public _vaccinateWaitTopicShared = '';
  // 接种室监控队列
  public _vaccinateWaitTopic = '';
  // 接种室已叫号队列
  public _vaccinateCalledTopicShared = '';
  // 接种室已叫号监控队列
  public _vaccinateCalledTopic = '';
  // 接种室iot叫号队列
  public _iotTopic = '';
  // 接种室iot叫号队列
  public _observeIotTopic = '';
  // 选择的接种科室
  public _selectedDepartmentCode = '';
  // 选择的接种科室
  public _selectedDepartmentName = '';
  // 选择的冰箱编码
  private _selectedFacilityCode = '';
  // 多剂次
  public _vaccineDoseDatas: any[] = [];
  // 可用多剂次数量
  public _manyDoseAvailables: any[]  = [];
  // 疫苗批次号编码
  public _vaccineBatches: any[] = [];
  // 电子监管码编码
  public _eleSuperviseCodes: any[] = [];
  // 设备信息
  public _coldStorageFacilities: any[] = [];
  // 冷藏设备编码
  public _breakageFacilityCodeOptions: any[] = [];
  // 疫苗产品编码
  public _breakageVaccineProductOptions: any[] = [];
  // 接种状态
  public _vaccinationStatus: string = '';
  // 监听类型flag
  public _eventListenerFlag: string = '';
  // 排号队列数据
  public _waitingQueueData: any[] = [];
  // 排号队列数据
  public _waitingQueueDataDisplay: any[] = [];
  // 过号队列数据
  public _passedQueueData: any[] = [];
  // 接种中队列数据
  public _vaccinatingQueueData: any[] = [];
  // 已完成队列数据
  public _successQueueData: any[] = [];
  // 部门可接种疫苗列表
  public _vaccineList: any[] = [];
  // 档案信息
  public _profileInfo: any = {};

  // 当前叫号信息
  private currentQueueItemSubject = new Subject<any>();
  // 是否开启疫苗核验
  private checkVaccineFlagSubject = new Subject<boolean>();
  // 扫描输入的字符串
  private scanInputSubject = new Subject<string>();
  // 是否显示报损Form
  private breakageVisibleSubject = new Subject<boolean>();
  // 是否显示报损Form
  private currentVaccineInfoSubject = new Subject<any>();
  // 历史接种记录
  private vaccinateHistoryRecordsSubject = new Subject<any>();

  public setCurrentQueueItem(queueItem: any) {
    this.currentQueueItemSubject.next(queueItem);
  }

  public getCurrentQueueItem(): Observable<any> {
    return this.currentQueueItemSubject.asObservable().pipe(distinctUntilChanged());
  }

  public setCheckVaccineFlag(isSuccess: boolean) {
    this.checkVaccineFlagSubject.next(isSuccess);
  }

  public getCheckVaccineFlag(): Observable<boolean> {
    return this.checkVaccineFlagSubject.asObservable();
  }

  public setSelectedDepartment(department: any) {
    this.selectedDepartmentCode = department['departmentCode'];
    this.selectedDepartmentName = department['departmentName'];
  }

  public setScanInput(isSuccess: string) {
    this.scanInputSubject.next(isSuccess);
  }

  public getScanInput(): Observable<string> {
    return this.scanInputSubject.asObservable().pipe(distinctUntilChanged());
  }

  public setBreakageVisible(isShow: boolean) {
    this.breakageVisibleSubject.next(isShow);
  }

  public getBreakageVisible(): Observable<boolean> {
    return this.breakageVisibleSubject.asObservable();
  }

  public setCurrentVaccineInfo(vaccineInfo: any) {
    this.currentVaccineInfoSubject.next(vaccineInfo);
  }

  public getCurrentVaccineInfo(): Observable<any> {
    return this.currentVaccineInfoSubject.asObservable().pipe(distinctUntilChanged());
  }

  public setVaccinateHistoryRecords(data: any) {
    this.vaccinateHistoryRecordsSubject.next(data);
  }

  public getVaccinateHistoryRecords(): Observable<any> {
    return this.vaccinateHistoryRecordsSubject.asObservable().pipe(distinctUntilChanged());
  }


  get breakageVaccineProductOptions(): any[] {
    return this._breakageVaccineProductOptions;
  }

  set breakageVaccineProductOptions(value: any[]) {
    this._breakageVaccineProductOptions = value;
  }
  get breakageFacilityCodeOptions(): any[] {
    return this._breakageFacilityCodeOptions;
  }

  set breakageFacilityCodeOptions(value: any[]) {
    this._breakageFacilityCodeOptions = value;
  }
  get vaccineList(): any[] {
    return this._vaccineList;
  }

  set vaccineList(value: any[]) {
    this._vaccineList = value;
  }
  get successQueueData(): any[] {
    return this._successQueueData;
  }

  set successQueueData(value: any[]) {
    this._successQueueData = value;
  }
  get vaccinatingQueueData(): any[] {
    return this._vaccinatingQueueData;
  }

  set vaccinatingQueueData(value: any[]) {
    this._vaccinatingQueueData = value;
  }
  get passedQueueData(): any[] {
    return this._passedQueueData;
  }

  set passedQueueData(value: any[]) {
    this._passedQueueData = value;
  }
  get waitingQueueData(): any[] {
    return this._waitingQueueData;
  }

  set waitingQueueData(value: any[]) {
    this._waitingQueueData = value;
  }

  get waitingQueueDataDisplay(): any[] {
    return this._waitingQueueDataDisplay;
  }
  set waitingQueueDataDisplay(value: any[]) {
    this._waitingQueueDataDisplay = value;
  }

  get eventListenerFlag(): string {
    return this._eventListenerFlag;
  }

  set eventListenerFlag(value: string) {
    this._eventListenerFlag = value;
  }
  get vaccinationStatus(): string {
    return this._vaccinationStatus;
  }

  set vaccinationStatus(value: string) {
    this._vaccinationStatus = value;
  }
  get vaccineBatches(): any[] {
    return this._vaccineBatches;
  }
  set vaccineBatches(value: any[]) {
    this._vaccineBatches = value;
  }

  get coldStorageFacilities(): any[] {
    return this._coldStorageFacilities;
  }
  set coldStorageFacilities(value: any[]) {
    this._coldStorageFacilities = value;
  }

  get eleSuperviseCodes(): any[] {
    return this._eleSuperviseCodes;
  }
  set eleSuperviseCodes(value: any[]) {
    this._eleSuperviseCodes = value;
  }

  get manyDoseAvailables(): any[] {
    return this._manyDoseAvailables;
  }
  set manyDoseAvailables(value: any[]) {
    this._manyDoseAvailables = value;
  }

  get vaccineDoseDatas(): any[] {
    return this._vaccineDoseDatas;
  }
  set vaccineDoseDatas(value: any[]) {
    this._vaccineDoseDatas = value;
  }

  get iotTopic(): any {
    return this._iotTopic;
  }
  set iotTopic(value: any) {
    this._iotTopic = value;
  }

  get selectedDepartmentName(): string {
    return this._selectedDepartmentName;
  }
  set selectedDepartmentName(value: string) {
    this._selectedDepartmentName = value;
  }

  get selectedDepartmentCode(): string {
    return this._selectedDepartmentCode;
  }
  set selectedDepartmentCode(value: string) {
    this._selectedDepartmentCode = value;
  }

  get vaccinateCalledTopic(): string {
    return this._vaccinateCalledTopic;
  }
  set vaccinateCalledTopic(value: string) {
    this._vaccinateCalledTopic = value;
  }

  get vaccinateCalledTopicShared(): string {
    return this._vaccinateCalledTopicShared;
  }
  set vaccinateCalledTopicShared(value: string) {
    this._vaccinateCalledTopicShared = value;
  }

  get vaccinateWaitTopic(): string {
    return this._vaccinateWaitTopic;
  }
  set vaccinateWaitTopic(value: string) {
    this._vaccinateWaitTopic = value;
  }

  get vaccinateWaitTopicShared(): string {
    return this._vaccinateWaitTopicShared;
  }
  set vaccinateWaitTopicShared(value: string) {
    this._vaccinateWaitTopicShared = value;
  }

  get pulsarNs(): string {
    return this._pulsarNs;
  }
  set pulsarNs(value: string) {
    this._pulsarNs = value;
  }

  get pulsarUrl(): string {
    return this._pulsarUrl;
  }
  set pulsarUrl(value: string) {
    this._pulsarUrl = value;
  }

  get userInfo(): any {
    return this._userInfo;
  }

  set userInfo(value: any) {
    this._userInfo = value;
  }
  /**
   * 查看队列中接种人信息
   */
  consultVaccinatePersonInfo(data, flag) {
    if (this.vaccinatingQueueData.length === 0) {
      if (flag) {
        this.vaccinationStatus = VACCINATE_STATUS.finished;
      } else {
        this.vaccinationStatus = VACCINATE_STATUS.viewing;
      }
      this.setCurrentQueueItem(data);
    } else {
      if (this.vaccinationStatus === VACCINATE_STATUS.vaccinating || this.vaccinationStatus === VACCINATE_STATUS.calling) {
        this.warning(`${this.vaccinationStatus}不能查看其他接种人信息!`);
      }
    }
  }

  /**
   * 初始化排号信息
   * @param queueItem
   * @param observe
   */
  initQueueData(queueItem: any, observe?: boolean): any {
    if (!!!queueItem) {
      queueItem = {};
    }
    delete queueItem['motherConcatPhone'];
    delete queueItem['motherIdCardNo'];
    delete queueItem['motherName'];
    delete queueItem['vaccinateStatus'];
    delete queueItem['birthDate'];
    queueItem['curStatus'] = '5';
    queueItem['passStatus'] = '0';
    queueItem['messageId'] = '00000000';
    queueItem['povCode'] = this.userInfo.pov;
    queueItem['nameSpace'] = this.pulsarNs;
    queueItem['departmentCode'] = this.selectedDepartmentCode;
    queueItem['curRoom'] = this.selectedDepartmentCode;
    queueItem['curRoomName'] = this.selectedDepartmentName;
    queueItem['curDoc'] = this.userInfo.userCode;
    if ( typeof queueItem['vaccineList'] === 'string') {
      queueItem['vaccineList'] = JSON.parse(queueItem['vaccineList']);
    }
    // queueItem['birthDate'] = DateUtils.getFormatDateTime(queueItem['birthDate']);
    // 添加队列数据属性
    queueItem['queueRoomType'] = QUEUE_ROOM_TYPE.vaccinate;
    // 日期格式转换
    queueItem['createDate'] = DateUtils.getFormatDateTime(queueItem['createDate']);
    // 日期格式转换
    queueItem['actionTime'] = DateUtils.getFormatDateTime(queueItem['actionTime']);
    queueItem['vaccinateWaitTopicShared'] = this.vaccinateWaitTopicShared;
    queueItem['vaccinateWaitTopic'] = this.vaccinateWaitTopic;
    queueItem['vaccinateCalledTopicShared'] = this.vaccinateCalledTopicShared;
    queueItem['vaccinateCalledTopic'] = this.vaccinateCalledTopic;
    queueItem['iotTopic'] = observe ? this.observeIotTopic : this.iotTopic;
    return queueItem;
  }

  /**
   * 查询已完成接种
   */
  querySuccessData() {
    if (!this.userInfo) return;
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const todayStart = new Date(year, month, day, 0, 0, 0);
    const todayEnd = new Date(year, month, day, 23, 59, 59);
    const param = {
      povCode: this.userInfo['pov'],
      vaccinateStatus: '1',
      updateTime: {
        start: DateUtils.formatStartDate(todayStart),
        end: DateUtils.formatEndDate(todayEnd)
      },
      pageEntity: {page: 1, pageSize: 999, sortBy: ['updateTime,DESC']}
    };
    this.regObstetricsService.query(param, resp => {
      if (resp.code === 0) {
        this.successQueueData = resp.data;
      }
    });
  }

  /**
   * 查询历史接种记录
   */
  queryHistoryVaccinateRecords(profileCode: string, page = 1) {
    if (profileCode) {
      const params: any = {
        profileCode: profileCode,
        vaccinateStatus: ['3'],
        pageEntity: {page: page, pageSize: 10, sortBy: ['vaccinateTime,desc']}
      };
      this.vaccinateService.queryVaccinateRecordAndCount(params, (queryData, countData) => {
          if (queryData.code !== 0 || countData.code !== 0) {
            console.warn('查询接种记录失败!');
            this.setVaccinateHistoryRecords({records: [], count: 0});
          } else {
            this.setVaccinateHistoryRecords({records: queryData.data, count: countData.data[0].count});
          }
        }
      );
    } else {
      this.setVaccinateHistoryRecords({records: [], count: 0});
    }
  }

  /**
   * 查询疫苗的多剂次信息
   */
  queryVaccineDoseInfo() {
    if (!this.userInfo) return;
    const params = {
      vaccinatePovCode: this.userInfo.pov,
      vaccinateDepartmentCode: this.selectedDepartmentCode
    };
    this.vaccinateService.queryVaccineDoseInfo(params, resp => {
      if (resp.code === 0 && resp.data.length > 0) {
        this.vaccineDoseDatas = resp.data;
      } else {
        this.vaccineDoseDatas = [];
      }
    });
  }

  /**
   * 计算疫苗多剂次数量
   * @param item
   * @param data
   */
  computerVaccinateDoseNumber(data) {
    const vaccineDoseData = this.vaccineDoseDatas.find(item => item.vaccineBatchNo === data.vaccineBatchNo && item.departmentCode === this.selectedDepartmentCode);
    if (vaccineDoseData) {
      data.vaccinateDoseNumber = vaccineDoseData.vaccinateDoseNumber + 1;
    } else {
      data.vaccinateDoseNumber = 1;
    }
  }

  /**
   * 加载多剂次疫苗剩余可用次数
   */
  loadManyDoseAvailable(batchNo: string) {
    this.manyDoseAvailables = [];
    const vaccineDoseData = this.vaccineDoseDatas.find(item => item.vaccineBatchNo === batchNo);
    if (!!vaccineDoseData) {
      const availableCount = vaccineDoseData.dosageByEach - vaccineDoseData.vaccinateDoseNumber;
      this.manyDoseAvailables = this.splitCount(vaccineDoseData.vaccinateDoseNumber, availableCount);
    } else {
      this.manyDoseAvailables.push(1);
    }
  }

  /**
   * 将数字转化为数组
   * @param vaccinateDoseNumber
   * @param availableCount
   * @returns {Array}
   */
  splitCount(vaccinateDoseNumber, availableCount): number[] {
    let availables = [];
    for (let i = 1; i <= availableCount; i++) {
      availables.push(vaccinateDoseNumber + i);
    }
    return availables;
  }

  initTopic(shared, monitor) {
    this.queueApiSvc.initQueueList(this.userInfo.pov, this.pulsarNs, shared, monitor, resp => {
      // console.log(resp);
    });
  }


  successRef: NzModalRef;
  success(content, func?: Function) {
    if (this.successRef) {
      this.successRef.destroy();
    }
    this.voiceService.play('./assets/voice/success.wav');
    this.modalService.success({
      nzTitle: '成功',
      nzContent: content,
      nzWrapClassName: 'success',
      nzMask: false,
      nzOnOk: instance => {
        if (typeof func === 'function') {
          func(instance);
        }
      }
    });
  }

  warningRef: NzModalRef;
  warning(content, func?: Function) {
    if (this.warningRef) {
      this.warningRef.destroy();
    }
    this.voiceService.play('./assets/voice/alert.wav');
    this.modalService.warning({
      nzTitle: '警告',
      nzContent: content,
      nzWrapClassName: 'warning',
      nzMask: false,
      nzOnOk: instance => {
        if (typeof func === 'function') {
          func(instance);
        }
      }
    });
  }

  errorRef: NzModalRef;
  error(content, func?: Function) {
    if (this.errorRef) {
      this.errorRef.destroy();
    }
    this.voiceService.play('./assets/voice/alert.wav');
    this.errorRef = this.modalService.error({
      nzTitle: '错误',
      nzContent: content,
      nzWrapClassName: 'error',
      nzMask: false,
      nzOnOk: instance => {
        if (typeof func === 'function') {
          func(instance);
        }
      }
    });
  }

  refreshWaitingQueueData() {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const todayStart = new Date(year, month, day, 0, 0, 0);
    const todayEnd = new Date(year, month, day, 23, 59, 59);
    const param = {
      povCode: this.userInfo['pov'],
      vaccinateStatus: '0',
      // createTime: {
      //   start: DateUtils.formatStartDate(todayStart),
      //   end: DateUtils.formatEndDate(todayEnd)
      // },
      pageEntity: {page: 1, pageSize: 999, sortBy: ['createTime,ASC']},
    };
    this.regObstetricsService.query(param, resp => {
      if (resp['code'] === 0) {
        this.waitingQueueDataDisplay = resp['data'];
      }
    });
  }

  openRed() {
    const headers = new HttpHeaders({});
    const params = {type: 'openRed'};
    this.vaccinateService.openLight('http:localhost:19980', headers, params);
  }

  openGreen() {
    const headers = new HttpHeaders({});
    const params = {type: 'openGreen'};
    this.vaccinateService.openLight('http:localhost:19980', headers, params);
  }


  ngOnDestroy(): void {
    this.breakageVisibleSubject.error({code: 1000, msg: '正常退出'});
    this.scanInputSubject.error({code: 1000, msg: '正常退出'});
    this.checkVaccineFlagSubject.error({code: 1000, msg: '正常退出'});
    this.currentQueueItemSubject.error({code: 1000, msg: '正常退出'});
    this.currentVaccineInfoSubject.error({code: 1000, msg: '正常退出'});
    this.vaccinateHistoryRecordsSubject.error({code: 1000, msg: '正常退出'});
  }
}

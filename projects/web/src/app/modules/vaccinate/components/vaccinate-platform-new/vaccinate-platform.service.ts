import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import {
  DateUtils,
  QUEUE_ROOM_TYPE,
  QueueApiService,

  RegQueueService,
  VACCINATE_STATUS,
  VaccinateService, VoiceService
} from '@tod/svs-common-lib';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { HttpHeaders } from '@angular/common/http';
import { VACCINATE_CHECK_TYPE } from './vaccinate.const';

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
              private vaccinateService: VaccinateService) {
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
  public _manyDoseAvailables: any[] = [];
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
  public _eventListenerFlag: string = VACCINATE_CHECK_TYPE.PROFILE;
  // 排号队列数据
  public _waitingQueueData: any[] = [];
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

  // ------------------------------------------------------------------------

  // 当前叫号信息
  private currentQueueItemSubject = new BehaviorSubject<any>(null);
  // 接种证是否核验成功
  private isCheckSuccessSubject = new Subject<boolean>();
  // 是否开启疫苗核验
  private checkVaccineFlagSubject = new BehaviorSubject<boolean>(null);
  // 是否开启受种人核验
  private checkProfileFlag$ = new BehaviorSubject<boolean>(null);
  // 疫苗核验结果
  private checkVaccineRet$ = new BehaviorSubject<boolean>(null);
  // 扫描输入的字符串
  private scanInputSubject = new Subject<string>();
  // 是否显示报损Form
  private breakageVisibleSubject = new Subject<boolean>();
  // 是否显示报损Form
  private currentVaccineInfoSubject = new Subject<any>();
  // 历史接种记录
  private vaccinateHistoryRecordsSubject = new Subject<any>();
  // 核验项目，包括：疫苗和受种人两种
  private vaccineCheckType$ = new Subject<string>();
  // 门诊接种科室发生变化
  private vaccinateDep = new BehaviorSubject<string>(null);

  // ------------------------------------------------------------------------

  /**
   * 设置当前接种科室
   * @param departmentCode
   */
  public setVaccinateDep(departmentCode: string) {
    this.vaccinateDep.next(departmentCode);
  }

  /**
   * 获取当前接种科室
   */
  public getVaccinateDep() {
    return this.vaccinateDep.asObservable();
  }

  /**
   * 设置核验项目
   * @param val
   */
  public setVaccineCheckType(val: string) {
    this.vaccineCheckType$.next(val);
  }

  /**
   * 获取核验项目
   */
  public getVaccineCheckType() {
    return this.vaccineCheckType$.asObservable();
  }

  /**
   * 获取疫苗核验结果
   */
  public getCheckVaccineRet() {
    return this.checkVaccineRet$.asObservable();
  }

  /**
   * 设置疫苗核验结果
   * @param ret
   */
  public setCheckVaccineRet(ret: boolean) {
    this.checkVaccineRet$.next(ret);
  }

  /**
   * 订阅受种人核验状态
   */
  public getCheckProfileFlag() {
    return this.checkProfileFlag$.asObservable();
  }

  public setCheckProfileFlag(data: any) {
    this.checkProfileFlag$.next(data);
  }


  /**
   * 设置受种人核验结果
   * @param isSuccess
   */
  public setIsCheckSuccess(isSuccess: boolean) {
    this.isCheckSuccessSubject.next(isSuccess);
  }

  /**
   * 订阅受种人档案核验结果
   */
  public getIsCheckSuccess(): Observable<boolean> {
    return this.isCheckSuccessSubject.asObservable();
  }

  /**
   * 订阅疫苗核验结果
   * @param isSuccess
   */
  public setCheckVaccineFlag(isSuccess: boolean) {
    this.checkVaccineFlagSubject.next(isSuccess);
  }

  public getCheckVaccineFlag(): Observable<boolean> {
    return this.checkVaccineFlagSubject.asObservable();
  }

  /*
  * 订阅当前叫号信息
  * */
  public setCurrentQueueItem(queueItem: any) {
    this.currentQueueItemSubject.next(queueItem);
  }

  public getCurrentQueueItem(): Observable<any> {
    return this.currentQueueItemSubject.asObservable();
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
  consultVaccinatePersonInfo(data, flag?: boolean) {
    // 如果正在接种中的数据为0，也就是有正在接种的受种人，则
    if (this.vaccinatingQueueData.length === 0) {
      if (flag) {
        // 如果状态修改为已接种，则设置受种人档案核验状态为已核验
        this.vaccinationStatus = VACCINATE_STATUS.finished;
        this.setIsCheckSuccess(true);
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
    queueItem['povCode'] = this.userInfo.pov;
    queueItem['nameSpace'] = this.pulsarNs;
    queueItem['departmentCode'] = this.selectedDepartmentCode;
    queueItem['curRoom'] = this.selectedDepartmentCode;
    queueItem['curRoomName'] = this.selectedDepartmentName;
    queueItem['curDoc'] = this.userInfo.userCode;
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
    const params = {
      curStatus: '8',
      povCode: this.userInfo.pov,
      curRoom: this.selectedDepartmentCode,
      createDate: {
        start: DateUtils.getFormatDateTime(todayStart),
        end: DateUtils.formatEndDate(todayEnd)
      },
      pageEntity: {page: 1, pageSize: 999, sortBy: ['createDate,DESC']}
    };
    this.regQueueService.regQueueStatusChangeRecord(params, resp => {
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
        const date = new Date();
        resp.data.forEach(info => {
          info['effectiveTime'] = Number(new Date(info['effectiveTime']));
          let leftTime = (info['effectiveTime'] - date.valueOf());
          info['leftTime'] = (leftTime > 0 ? leftTime : 0) / 1000;
        });
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
    console.log('计算剂次 - computerVaccinateDoseNumber，第 554行代码', data);
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
      nzTitle: '提示',
      nzContent: content,
      nzWrapClassName: 'success',
      // nzMask: false,
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
      nzTitle: '提示',
      nzContent: content,
      nzWrapClassName: 'warning',
      // nzMask: false,
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
    this.errorRef = this.modalService.warning({
      nzTitle: '提示',
      nzContent: content,
      nzWrapClassName: 'error',
      // nzMask: false,
      nzOnOk: instance => {
        if (typeof func === 'function') {
          func(instance);
        }
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
    this.isCheckSuccessSubject.error({code: 1000, msg: '正常退出'});
    this.vaccinateHistoryRecordsSubject.error({code: 1000, msg: '正常退出'});
  }

  reset() {
    this.setCurrentQueueItem(null);
    this.setCheckVaccineFlag(null);
    this.setCheckProfileFlag(null);
    this.setCheckVaccineRet(null);
    this.setVaccinateDep(null);
  }
}

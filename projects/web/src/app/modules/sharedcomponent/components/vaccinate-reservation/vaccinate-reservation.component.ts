import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { NbMomentDateService } from '@nebular/moment';
import {
  VaccinateStrategyApiService,
  WorkingDayInitService,
  ProfileDataService,
  ApiSystemWorkingDayService,
  ApiSystemWorkingTimeService,
  ReservationRecordService,
  WorkDatetimeService,
  ProfileChangeService,
  DateUtils,
  PROFILE_CHANGE_KEY,
  RegRecordDataService, SysConfInitService
} from '@tod/svs-common-lib';

import * as moment_ from 'moment';

const moment = moment_;
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'ngx-s-vaccination-appointment',
  templateUrl: './vaccinate-reservation.component.html',
  styleUrls: ['./vaccinate-reservation.component.scss'],
  providers: [VaccinateStrategyApiService, NbMomentDateService]
})
/**
 * 弹出层 - 预约登记
 */
export class VaccinateReservationComponent implements OnInit, OnDestroy {
  // 可选
  static readonly USEABLE_YES = '1';
  // 不可选
  static readonly USEABLE_NO = '0';
  // 单周
  static readonly WORKING_ROUND_ODD_WEEK = '0';
  // 双周
  static readonly WORKING_ROUND_EVEN_WEEK = '1';
  // 月
  static readonly WORKING_ROUND_MONTH = '2';
  // 加载推荐疫苗
  loadingRecommend = false;

  closeAlert = false;

  loadingWorkingTime = false;

  page = 1;

  pageSize = 20;

  loading = false;

  // 档案信息
  @Input()
  profile: any;

  // 已选的工作时间
  selectTime: any;
  // 预约备注
  memo: string;

  // 今天
  // @Input()
  date: Date;

  // 单周 双周工作日集合
  @Input()
  oddWorkingDay: any;
  // 双周
  @Input()
  evenWorkingDay: any;
  // 工作日数据
  @Input()
  workingDay: any[] = [];

  /**
   * 工作日数据，不分周，单双周，月，数据都在一起
   */
  workingDayData: any;

  /**
   * 节假日数据
   */
  /* holidayData: any[] = [{'holiday_date': '2019-11-21'}];*/
  holidayData: any[] = [];

  /**
   * 工作日类型，默认为 - 周
   */
  workingDayType = WorkingDayInitService.WORKING_DAY_TYPE_WEEK;

  // 用户信息
  userInfo: any;

  countDays = 0;
  selectDay: any;
  countDaysOptions: any;

  // 工作时间段，及该工作时间段的已预约人数 - radio 选择项
  workingTimeData = [];
  // 接种策略推荐疫苗
  recommendedVacData = [];
  // 免费疫苗
  freeVacData = [];
  originFreeVacData = [];
  showFreeVacDataAlert = true;
  // 自费疫苗
  nonFreeVacData = [];
  originNonFreeVacData = [];
  showNonFreeVacData = true;
  /**
   * 有效的登记记录
   */
  regRecords = [];

  private subscription: Subscription[] = [];

  fileDeleted = false;
  /**
   * 是否开启预约测试，默认不开启 - false，开启 - true
   */
  reservationTest = false;

  constructor(
    private ref: NbDialogRef<VaccinateReservationComponent>,
    private profileDataSvc: ProfileDataService,
    private workingDaysSvc: ApiSystemWorkingDayService,
    private userSvc: UserService,
    private workingTimeSvc: ApiSystemWorkingTimeService,
    private reservationRecordSvc: ReservationRecordService,
    private workDatetimeSvc: WorkDatetimeService,
    private profileChangeSvc: ProfileChangeService,
    private workingDayInitSvc: WorkingDayInitService,
    private vacStrategyApiSvc: VaccinateStrategyApiService,
    private momentSvc: NbMomentDateService,
    private msg: NzMessageService,
    private regDataSvc: RegRecordDataService,
    private notifier: NotifierService,
    private sysInitSvc: SysConfInitService
  ) {
    this.initSysConf();
    const countDaysOptions = [
      { label: '今天', value: 0, disable: false },
      { label: '2周岁', value: 2, disable: false },
      { label: '3周岁', value: 3, disable: false },
      { label: '4周岁', value: 4, disable: false },
      { label: '5周岁', value: 5, disable: false },
      { label: '6周岁', value: 6, disable: false }
    ];
    const sub = this.profileDataSvc.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
        // console.log(resp);
        this.fileDeleted = resp['profileStatusCode'] === '10';
        const age = resp['age'];
        this.countDaysOptions = countDaysOptions.filter(
          option => option.value >= age || option.value === 0
        );
        this.selectDay = countDaysOptions[0].value;
      }
    });
    this.subscription.push(sub);
    const sub1 = this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
    this.subscription.push(sub1);
    // 获取工作日数据
    this.workingDayData = this.workingDayInitSvc.getWorkingDayData();
    if (this.workingDayData.length > 0) {
      this.workingDayType = this.workingDayData[0]['workingRound'];
    }
    // 获取节假日数据
    /*this.holidayData = this.workingDayInitSvc.get*/
  }

  /**
   * 初始化系统配置字典项
   */
  initSysConf() {
    // 判断是否关闭
    this.reservationTest = this.sysInitSvc.getConfValue('reservationTest') === '1';
  }

  ngOnInit() {
    this.initDate();
    const sub = this.regDataSvc.getRegRecords().subscribe(rec => {
      this.regRecords = rec;
      this.queryRecommendedVacStrategy();
    });
    this.subscription.push(sub);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  handleDateChange(e: Date) {
    // console.log(e);
    // const e = moment(ev);
    const md = moment(e);
    const date = md.format('YYYY-MM-DD HH:mm:ss');
    // const serial = this.getWorkingDaySerialByDayNumber(day);
    this.queryWorkingTimeByWorkingDay(date);
    this.countDays = md.diff(moment(), 'days');
    this.filterVacDataBySelectedDate();
  }

  initDate() {
    this.date = new Date();
    this.handleDateChange(this.date);
  }

  /**
   * 根据pov编码和档案编码查询可推荐疫苗列表
   */
  queryRecommendedVacStrategy() {
    // if (!this.profile || !this.userInfo) return;
    // const profileCode = this.profile['profileCode'];
    // 目前先试用测试的档案编码 2019092702 或 2019092701
    // const profileCode = this.profile['profileCode'];
    // const povCode = this.userInfo.pov;
    // this.recommendedVacData = [];
    this.loadingRecommend = true;
    // const query = {
    //   profileCode: profileCode,
    //   registPovCode: povCode
    // };
    const records = this.regRecords;
    // console.log('查询条件', records);
    if (records.length > 0) {
      records.forEach(r => r['registDate'] = DateUtils.getFormatDateTime(r['registDate']));
      this.vacStrategyApiSvc.queryRecommendInAppointment(records, resp => {
        console.log('有登记记录可预约疫苗', resp);
        this.loadingRecommend = false;
        if (resp.code === 0) {
          this.recommendedVacData = resp.data;
          this.originFreeVacData = this.recommendedVacData;
          // this.originFreeVacData = this.recommendedVacData.filter(
          //   vac => vac.povVaccPrice === 0
          // );
          // this.originNonFreeVacData = this.recommendedVacData.filter(
          //   vac => vac.povVaccPrice !== 0
          // );
          this.filterVacDataBySelectedDate();
        }
      });
    } else if (records.length === 0) {
      const povCode = this.userInfo.pov;
      const profileCode = this.profile['profileCode'];
      this.vacStrategyApiSvc.getRecommendedVaccine(povCode, profileCode, {}, resp => {
        console.log('无登记记录查询可预约疫苗', resp);
        this.loadingRecommend = false;
        if (resp.code === 0) {
          this.recommendedVacData = resp.data;
          this.originFreeVacData = this.recommendedVacData;
          // this.originFreeVacData = this.recommendedVacData.filter(
          //   vac => vac.povVaccPrice === 0
          // );
          // this.originNonFreeVacData = this.recommendedVacData.filter(
          //   vac => vac.povVaccPrice !== 0
          // );
          this.filterVacDataBySelectedDate();
        }
      });
    }
  }

  /**
   * 日期有效范围筛选
   * 判断当前日期是否在工作日期范围内，如果是---true 可选
   * 如果否---false 不可选
   * d 是 moment 对象
   */
  filterValidateDate = (d: Date) => {
    // console.log(d);
    // 获取当前日期
    const md = moment(d);
    const day = md.day(); // day of the week
    const date = md.format('YYYY-MM-DD'); // 具体的日期 eg:2019-10-01
    switch (this.workingDayType) {
      case WorkingDayInitService.WORKING_DAY_TYPE_WEEK:
        return (
          this.holidayData.findIndex(holiday => holiday['holiday_date'] === date) > 0 ||
          this.workingDayData.findIndex(workDay => workDay['workingDay'] === day) === -1
        );
      case WorkingDayInitService.WORKING_DAY_TYPE_DOUBLE_WEEK:
        const weekNumber = md.isoWeek();
        // 双周
        if (weekNumber % 2 === 0) {
        } else {
          // 单周
        }
        break;
      case WorkingDayInitService.WORKING_DAY_TYPE_MONTH:
        break;
    }
  }

  /**
   * 根据传入日期过滤可筛选疫苗
   * approvalNumber: "S20150033"
   baseWeight: 5000
   biologyCategory: "2"
   containerType: "3"
   count: 212
   currentStatus: "1"
   diseaseCategory: "04"
   dosageByCarton: 1
   dosageByEach: 1
   dosageForm: "4"
   earliestVaccDate: 1560960000000
   importClearanceNumber: ""
   isImport: "1"
   largePackage: "0"
   latestVaccDate: 1742400000000
   loseEfficacyDate: 1594310400000
   manufacturer: "巴斯德"
   manufacturerCode: "13"
   measureUnitCode: "0"
   memo: ""
   nodeCode: "IPP-0401-102"
   openedEffectiveTime: "-1"
   povVaccPrice: 305
   prodBatchNumber: "POA371M"
   shanghaiBroadHeadingCode: "50"
   shanghaiVaccineProductCode: "50130520"
   vaccOrder: 1
   vaccinateWay: "1"
   vaccineEngName: ""
   vaccineProductCode: "50130520"
   vaccineProductCraftCode: "0"
   vaccineProductName: "五联-巴斯德-0.5ml-D-DPTPV液预HIB冻西1支装"
   vaccineProductShortName: "五联"
   vaccineProductShortNameAbbreviation: ""
   vaccineSpecification: "0.5ml"
   vaccineSubclassCode: "5001"
   vaccineSubclassName: "百白破 IPV和Hib五联疫苗"
   * @param d
   */
  filterVacDataBySelectedDate(d = new Date()) {
    const nowTime = d.getTime();
    const freeVacData = this.originFreeVacData.filter(v => nowTime >= v['earliestVaccDate'] && nowTime <= v['latestVaccDate']);
    // console.log(freeVacData);
    this.freeVacData = [];
    freeVacData.forEach(fvd => {
      // console.log(fvd);
      const vac = this.freeVacData.find(fvd1 => fvd1['vaccineProductCode'] === fvd['vaccineProductCode']);
      if (!vac) {
        this.freeVacData.push(fvd);
      }
    });
    // this.nonFreeVacData = this.originNonFreeVacData.filter(v => nowTime >= v['earliestVaccDate'] && nowTime <= v['latestVaccDate']);
  }

  /**
   * 存储预约记录
   * {
    "channel": "1", // 预约来源
    "createBy": "1", // 创建人
    "memo": "3", // 备注
    "povCode": "3",
    "profileCode": "3",
    "reservationDate": "2019-01-01 00:00:00",
    "workingTimeSerial": "3",
    "details": [{
                  "price": 9, // 建议零售价
                  "reservationGroup": "9", // 大类
                  "reservationProduct": "9", // 产品
                  "reservationVaccine": "9", // 小类类型
                  "status": "0" // 状态 0-正常状态 1-已完成 2-取消状态
              },{
                  "price": 4,
                  "reservationGroup": "4",
                  "reservationProduct": "4",
                  "reservationVaccine": "4",
                  "status": "0"
              }]
    }
   */
  submitAppointment() {
    if (!this.profile) return;
    if (this.fileDeleted) {
      this.notifier.notify('error', '当前受种人档案已经被删除，无法预约');
      return;
    }
    if (!DateUtils.isAfter(this.date) && !this.reservationTest) {
      this.notifier.notify('warning', '不可以选择今天或者更早的日期，请重新选择');
      return;
    }
    const count = this.getSelectCount();
    if (count === 0) {
      this.notifier.notify('info', '请选择疫苗，最多选择5个');
      return;
    }
    if (!this.selectTime) {
      this.notifier.notify('warning', '请选择预约时间');
      return;
    }
    const selectedVacList = this.getSelectedVac();
    // console.log(selectedVacList);
    const save = {
      channel: '0', // 预约来源，默认： pov
      createBy: this.userInfo.userCode, // 创建人，默认为当前登录用户
      memo: this.memo, // 当前预约备注信息
      povCode: this.userInfo.pov, // 当前登录用户的Pov
      profileCode: this.profile['profileCode'], // 当前被预约人的档案编码
      reservationDate: DateUtils.getFormatDateTime(this.date), // 预约日期
      workingTimeSerial: this.selectTime,
      profileName: this.profile['name'],
      status: '0', // 0 - 待确认，1 - 已确认
      details: [...selectedVacList]
    };
    this.loading = true;
    // console.log('待存储的预约信息', save);
    this.reservationRecordSvc.saveReservationRecord(save, resp => {
      // console.log('存储预约信息结果', resp);
      this.loading = false;
      if (resp.code === 0) {
        this.notifier.notify('success', '预约成功');
        this.profileChangeSvc.setProfileChange(PROFILE_CHANGE_KEY.RESERVATION);
        this.closeDialog();
      }
    });
  }

  closeDialog() {
    this.ref.close();
  }

  /**
   * 根据工作日查询工作时间段
   * @param workingDaySerial
   */
  queryWorkingTimeByWorkingDay(date: string) {
    const selectedDate = moment(date);
    const dayOfWeek = selectedDate.day();
    const query = {
      povCode: this.userInfo.pov,
      useAble: '1',
      workingDay: dayOfWeek,
      pageEntity: {
        page: this.page,
        pageSize: this.pageSize
      }
    };
    this.workingTimeData = [];
    this.loadingWorkingTime = true;
    this.selectTime = null;
    // console.log('查询条件为', query);
    this.workingTimeSvc.queryUseAbleWorkingTime(query, resp => {
      this.loadingWorkingTime = false;
      // console.log('查询工作时间段返回值', resp);
      if (resp.code === 0 && resp['data'].length > 0) {
        this.workingTimeData = resp.data;
        this.getWorkingTimeCountByWorkingTimeSerial(date);
        // this.selectTime = this.workingTimeData[0]['workingTimeSerial'];
      }
      this.closeAlert = resp.data.length === 0;
    });
  }

  /**
   * 根据日期序号查询当天的工作日序列号
   * @param day 一周的第几天
   * @param workingRound 排班类型，单周 双周
   */
  getWorkingDaySerialByDayNumber(day: number) {
    if (this.workingDayType === WorkingDayInitService.WORKING_DAY_TYPE_WEEK) {
      const index = this.workingDayData.findIndex(
        item => item['workingDay'] === day
      );
      return this.workingDayData[index]['workingDaySerial'];
    }
    // for (let i = 0; i < this.workingDay.length; i++) {
    //   const wd = this.workingDay[i]['workingDay'];
    //   const wr = this.workingDay[i]['workingRound'];
    //   const wds = this.workingDay[i]['workingDaySerial'];
    //   if (wd === day && wr === workingRound) return wds;
    // }
  }

  /**
   * 根据当前点击的日期 + 预约时间段查询
   * 根据预约时间段查询已预约人数
   */
  getWorkingTimeCountByWorkingTimeSerial(date: string) {
    const query = [];
    query.push(moment(date).format('YYYY-MM-DD'));
    this.workingTimeData.forEach(t => query.push(t['workingTimeSerial']));
    // console.log('当前点击的日期 + 预约时间段查询', query);
    this.reservationRecordSvc.countByWorkingTime(query, resp => {
      // console.log('查询预约时间段的已预约人数', resp);
      if (resp.code === 0) {
        const data = resp.data;
        this.workingTimeData.forEach(wtd => {
          const d = data.filter(
            dt => wtd['workingTimeSerial'] === dt['workingTimeSerial']
          );
          // console.log(d, d.length);
          if (d.length > 0) {
            wtd['count'] = d[0]['count'];
          } else {
            wtd['count'] = 0;
          }
        });
        // console.log(this.workingTimeData);
        for (let i = 0; i < this.workingTimeData.length; i++) {
          const wtd = this.workingTimeData[i];
          const count = wtd['count'];
          const reservationCount = wtd['reservationCount'];
          if (count < reservationCount) {
            this.selectTime = wtd['workingTimeSerial'];
            break;
          }
        }
      }
    });
  }

  /**
   * 选择了一个年龄
   * @param age
   */
  selectAge(age: any) {
    this.selectDay = age.value;
    if (this.selectDay === 0) {
      this.date = new Date();
      this.handleDateChange(this.date);
      return;
    }
    const birthDate = this.profile['birthDate'];
    console.log(birthDate);
    const d = moment(birthDate);
    console.log(d);
    const year = d.year();
    console.log(year);
    this.date = new Date(
      year + this.selectDay,
      d.month(),
      d.day()
    );
    console.log(this.date);
    this.handleDateChange(this.date);
  }

  /**
   * 选择了免费疫苗
   */
  selectFreeVacChange(e, index) {
    console.log(e, index);
    if (!e) return;
    const count = this.getSelectCount();
    if (count > 5) {
      this.msg.info('一次最多选择5支疫苗');
      this.freeVacData[index]['checked'] = false;
      const vac1 = JSON.parse(JSON.stringify(this.freeVacData));
      this.freeVacData = [];
      this.freeVacData = vac1;
      return;
    }
    const vac = this.freeVacData[index];
    const broadHeadingCode = vac['vaccineSubclassCode'].substr(0, 2);
    for (let j = 0; j < this.freeVacData.length; j++) {
      if (j === index) continue;
      const vac1 = this.freeVacData[j];
      const subclassCode1 = vac1['vaccineSubclassCode'];
      if (vac['vaccineSubclassCode'] === subclassCode1) {
        this.freeVacData[j]['checked'] = false;
      }
    }
    for (let j = 0; j < this.nonFreeVacData.length; j++) {
      const vac1 = this.nonFreeVacData[j];
      const broadHeadingCode1 = vac1['vaccineSubclassCode'].substr(0, 2);
      if (broadHeadingCode === broadHeadingCode1) {
        this.nonFreeVacData[j]['checked'] = false;
      }
    }
  }

  /**
   * 选择了自费yimiao
   */
  selectNonFreeVacChange(e, index) {
    // console.log(e, index);
    if (!e) return;
    const count = this.getSelectCount();
    if (count > 5) {
      this.msg.info('一次最多选择5支疫苗');
      this.nonFreeVacData[index]['checked'] = false;
      const vac1 = JSON.parse(JSON.stringify(this.nonFreeVacData));
      this.nonFreeVacData = [];
      this.nonFreeVacData = vac1;
      return;
    }
    const vac = this.nonFreeVacData[index];
    // console.log(vac);
    const broadHeadingCode = vac['vaccineSubclassCode'].substr(0, 2);
    for (let j = 0; j < this.nonFreeVacData.length; j++) {
      if (j === index) continue;
      const vac1 = this.nonFreeVacData[j];
      const broadHeadingCode1 = vac1['vaccineSubclassCode'].substr(0, 2);
      if (broadHeadingCode === broadHeadingCode1) {
        this.nonFreeVacData[j]['checked'] = false;
      }
    }
    for (let j = 0; j < this.freeVacData.length; j++) {
      const vac1 = this.freeVacData[j];
      const broadHeadingCode1 = vac1['vaccineSubclassCode'].substr(0, 2);
      if (broadHeadingCode === broadHeadingCode1) {
        this.freeVacData[j]['checked'] = false;
      }
    }
  }

  /**
   * 获取已选择的疫苗数量
   */
  getSelectCount() {
    let count = 0;
    // console.log(this.freeVacData);
    // console.log(this.nonFreeVacData);
    this.freeVacData.forEach(vac => {
      if (vac['checked']) count++;
    });
    this.nonFreeVacData.forEach(vac => {
      if (vac['checked']) count++;
    });
    // console.log(count);
    return count;
  }

  /**
   * 获取已选择的疫苗列表
   * vaccineProductShortName,
   vaccineProductName,
   vaccinateCount,
   vaccineManufactureCode,
   vaccineManufactureName,
   vaccinateInjectNumber
   */
  getSelectedVac() {
    let selectedVac = [];
    this.freeVacData.forEach(vac => {
      if (vac['checked']) {
        selectedVac.push({
          price: vac['povVaccPrice'], // 建议零售价
          reservationGroup: vac['vaccineSubclassCode'].substring(0, 2), // 大类
          reservationProduct: vac['vaccineProductCode'], // 产品
          reservationVaccine: vac['vaccineSubclassCode'], // 小类类型
          vaccineBatchNumber: vac['prodBatchNumber'], // 疫苗产品批次号
          status: '0', // 状态 0-正常状态 1-已完成 2-取消状态， 预约操作中默认值为 0
          vaccineProductShortName: vac['vaccineProductShortName'],
          vaccineProductName: vac['vaccineProductName'],
          vaccinateCount: 1,
          vaccineManufactureCode: vac['manufacturerCode'],
          vaccineManufactureName: vac['manufacturer'],
          vaccinateInjectNumber: vac['vaccOrder']
        });
      }
    });
    this.nonFreeVacData.forEach(vac => {
      if (vac['checked']) {
        selectedVac.push({
          price: vac['povVaccPrice'], // 建议零售价
          reservationGroup: vac['vaccineSubclassCode'].substring(0, 2), // 大类
          reservationProduct: vac['vaccineProductCode'], // 产品
          reservationVaccine: vac['vaccineSubclassCode'], // 小类类型
          vaccineBatchNumber: vac['prodBatchNumber'], // 疫苗产品批次号
          status: '0', // 状态 0-正常状态 1-已完成 2-取消状态， 预约操作中默认值为 0
          vaccineProductShortName: vac['vaccineProductShortName'],
          vaccineProductName: vac['vaccineProductName'],
          vaccinateCount: 1,
          vaccineManufactureCode: vac['manufacturerCode'],
          vaccineManufactureName: vac['manufacturer'],
          vaccinateInjectNumber: vac['vaccOrder']
        });
      }
    });
    return selectedVac;
  }
}

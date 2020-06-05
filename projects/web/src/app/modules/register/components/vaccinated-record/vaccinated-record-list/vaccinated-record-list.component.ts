import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription
} from 'rxjs';
import {
  filter,
} from 'rxjs/operators';
import { UserService } from '@tod/uea-auth-lib';
import { PrintAgreementDialogComponent } from '../../print-dialog/print-agreement-dialog/print-agreement-dialog.component';
import { SingleDosageRecordComponent } from '../single-dosage-record/single-dosage-record.component';
import { BatchDosageRecordComponent } from '../batch-dosage-record/batch-dosage-record.component';
import {
  VaccinateService,
  ProfileDataService,
  ApiSystemWorkingDayService,
  WorkDatetimeService,
  VaccineSubclassInitService,
  VaccinateRecordsDataService,
  VaccinateReservationDataService,
  AgreementService, VaccBroadHeadingDataService, RecommendVaccineNotificationService,
  RECOMMEND_VACCINE_REFRESH, SysConfInitService,
  RegRecordDataService, ProfileChangeService, DateUtils, RegistRecordService
} from '@tod/svs-common-lib';
import { VaccinateReservationComponent } from '../../../../sharedcomponent/components/vaccinate-reservation/vaccinate-reservation.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'uea-vaccinated-list',
  templateUrl: './vaccinated-record-list.component.html',
  styleUrls: ['./vaccinated-record-list.component.scss']
})
/**
 * 已接种列表 或 接种记录
 */
export class VaccinatedRecordListComponent implements OnInit, OnDestroy {
  profileDeleted: boolean;

  profile: any;
  // 接种人年龄
  age: number;
  // 接种人月龄
  month: number;

  // 数目总条数
  total: number;

  showDetailVac: any;

  rowspan = 'rowspan';

  // 调用接种记录接口获取的接种记录的数据
  vacRecordData = [];
  // 订阅集合
  private subscription: Subscription[] = [];

  // 用户信息
  userInfo: any;

  // 表格查看类型，full 表示查看全部数据，part 表示只查看有数据的条目
  tableViewModel = 'full';

  tableViewModelOptions = [
    { label: '查看全部数据', value: 'full' },
    { label: '只看已接种数据', value: 'part' },
    // { label: '根据疾病大类查看', value: 'disease' }
  ];

  // 预约详情
  reservationDetail: any;

  // 登记记录详情
  registerRecordDetail: any;

  /**
   * 判断是否有接种记录
   */
  private hasVaccinateRecords$ = new BehaviorSubject<boolean>(false);

  // 表格展现内容
  tableData: any;
  // 选择疫苗的告知书模板
  agreementTemplate: any;

  /**
   *
   "actualVaccinatePovCode": "3406211353",
   "dataSourceType": "2",
   "id": 285,
   "managePovCode": "98277245155541266",
   "profileCode": "c958d553f3c543c79bcc9f458693aba3",
   "vaccinateCount": 1,
   "vaccinateDepartmentCode": "98277245155541266",
   "vaccinateDoseNumber": 1,
   "vaccinateInjectNumber": 1,
   "vaccinatePart": "0",
   "vaccinateStatus": "3",
   "vaccinateTime": 1566403200000,
   "vaccinateType": "0",
   "vaccinateWay": "0",
   "vaccineBatchNo": "201710YB28",
   "vaccineBroadHeadingCode": "02",
   "vaccineManufactureCode": "02",
   "vaccineProductCode": "01281024B",
   "vaccineSubclassCode": "0201",
   "vaccineType": "0"
   */
  originalVaccinatedRecordBaseTable = [
    {
      vaccineBroadHeadingCode: '01', // 大类code
      vaccineBroadHeadingName: '卡介苗', // 大类名称
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['L'], // 是否活疫苗 - 减毒活疫苗
      rowspan: 1
    },
    {
      vaccineBroadHeadingCode: '02', // 大类code
      vaccineBroadHeadingName: '乙肝疫苗', // 大类名称
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['D'], // 是否活疫苗 - 灭活疫苗
      rowspan: 3
    },
    {
      vaccineBroadHeadingCode: '02', // 大类code
      vaccineBroadHeadingName: '乙肝疫苗', // 大类名称
      vaccinateInjectNumber: 2, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '02', // 大类code
      vaccineBroadHeadingName: '乙肝疫苗', // 大类名称
      vaccinateInjectNumber: 3, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '03', // 大类code
      vaccineBroadHeadingName: '脊灰疫苗', // 大类名称
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['L', 'D'], // 是否活疫苗 - 减毒活疫苗 和 灭活疫苗
      rowspan: 4
    },
    {
      vaccineBroadHeadingCode: '03', // 大类code
      vaccineBroadHeadingName: '脊灰疫苗', // 大类名称
      vaccinateInjectNumber: 2, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '03', // 大类code
      vaccineBroadHeadingName: '脊灰疫苗', // 大类名称
      vaccinateInjectNumber: 3, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '03', // 大类code
      vaccineBroadHeadingName: '脊灰疫苗', // 大类名称
      vaccinateInjectNumber: 4, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '04', // 大类code
      vaccineBroadHeadingName: '百白破疫苗', // 大类名称
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['D'], // 是否活疫苗 -  灭活疫苗
      rowspan: 4
    },
    {
      vaccineBroadHeadingCode: '04', // 大类code
      vaccineBroadHeadingName: '百白破疫苗', // 大类名称
      vaccinateInjectNumber: 2, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '04', // 大类code
      vaccineBroadHeadingName: '百白破疫苗', // 大类名称
      vaccinateInjectNumber: 3, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '04', // 大类code
      vaccineBroadHeadingName: '百白破疫苗', // 大类名称
      vaccinateInjectNumber: 4, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '06', // 大类code
      vaccineBroadHeadingName: '白破疫苗', // 大类名称
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['D'], // 是否活疫苗 -  灭活疫苗
      rowspan: 1
    },
    {
      vaccineBroadHeadingCode: '14', // 大类code
      vaccineBroadHeadingName: '麻风疫苗', // 大类名称
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['L'], // 是否活疫苗 -  减毒活疫苗
      rowspan: 1
    },
    {
      vaccineBroadHeadingCode: '12', // 大类code
      vaccineBroadHeadingName: '麻腮风疫苗', // 大类名称
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['L'], // 是否活疫苗 -  减毒活疫苗
      rowspan: 1
    },
    {
      vaccineBroadHeadingCode: '18', // 大类code
      vaccineBroadHeadingName: '乙脑灭活疫苗', // 大类名称
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['D'], // 是否活疫苗 -  灭活疫苗
      rowspan: 4
    },
    {
      vaccineBroadHeadingCode: '18', // 大类code
      vaccineBroadHeadingName: '乙脑灭活疫苗', // 大类名称
      vaccineSubclassCode: '',
      vaccinateInjectNumber: 2, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '18', // 大类code
      vaccineBroadHeadingName: '乙脑灭活疫苗', // 大类名称
      vaccineSubclassCode: '',
      vaccinateInjectNumber: 3, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '18', // 大类code
      vaccineBroadHeadingName: '乙脑灭活疫苗', // 大类名称
      vaccinateInjectNumber: 4, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '18', // 大类code
      vaccineBroadHeadingName: '乙脑减毒活疫苗', // 大类名称
      vaccineSubclassCode: '',
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['L'], // 是否活疫苗 -  灭活疫苗
      rowspan: 2
    },
    {
      vaccineBroadHeadingCode: '18', // 大类code
      vaccineBroadHeadingName: '乙脑减毒活疫苗', // 大类名称
      vaccineSubclassCode: '',
      vaccinateInjectNumber: 2, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '16', // 大类code
      vaccineBroadHeadingName: 'A群流脑多糖疫苗', // 大类名称
      vaccineSubclassCode: '',
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['D'], // 是否活疫苗 -  灭活疫苗
      rowspan: 2
    },
    {
      vaccineBroadHeadingCode: '16', // 大类code
      vaccineBroadHeadingName: 'A群流脑多糖疫苗', // 大类名称
      vaccineSubclassCode: '',
      vaccinateInjectNumber: 2, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '17', // 大类code
      vaccineBroadHeadingName: 'A群C群流脑多糖疫苗', // 大类名称
      vaccineSubclassCode: '',
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['D'], // 是否活疫苗 -  灭活疫苗
      rowspan: 2
    },
    {
      vaccineBroadHeadingCode: '17', // 大类code
      vaccineBroadHeadingName: 'A群C群流脑多糖疫苗', // 大类名称
      vaccineSubclassCode: '',
      vaccinateInjectNumber: 2, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    },
    {
      vaccineBroadHeadingCode: '19', // 大类code
      vaccineBroadHeadingName: '甲肝减毒活疫苗', // 大类名称
      vaccineSubclassCode: '',
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['L'], // 是否活疫苗 -  减毒活疫苗
      rowspan: 1
    },
    {
      vaccineBroadHeadingCode: '19', // 大类code
      vaccineBroadHeadingName: '甲肝灭活疫苗', // 大类名称
      vaccineSubclassCode: '',
      vaccinateInjectNumber: 1, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null, // 批号
      isLiveVaccine: ['D'], // 是否活疫苗 -  灭活疫苗
      rowspan: 2
    },
    {
      vaccineBroadHeadingCode: '19', // 大类code
      vaccineBroadHeadingName: '甲肝灭活疫苗', // 大类名称
      vaccineSubclassCode: '',
      vaccinateInjectNumber: 2, // 针次
      vaccinateTime: null, // 接种日期
      vaccineBatchNo: null // 批号
    }
  ];
  // 表格数据，包括已查出来的数据和空行(基本的表格)
  vaccinatedRecordBaseTable = [];
  // 表格数据，只包括已查出来的数据，过滤掉空行
  vaccinatedRecordBaseTableDataWithoutEmptyRow = [];

  // 疫苗子类编码集合(用于展示的所有的子类编码)
  vacSubclassCode = [];
  /**
   * 平均宽度像素距离
   */
  evenWid = 28;
  /**
   * 预约记录
   */
  reservationRecords = [];

  /*
  * 当天的登记记录
  * */
  registerRecords = [];

  // 设置失效的登记记录
  availableRec = [];

  loading = false;
  /**
   * 是否开启预约测试，默认不开启 - false， 开启 - true
   */
  reservationTest = false;

  constructor(
    private dialogService: NbDialogService,
    private vacSvc: VaccinateService,
    private profileDataSvc: ProfileDataService,
    private workingDaysSvc: ApiSystemWorkingDayService,
    private userSvc: UserService,
    private msg: NzMessageService,
    private workDatetimeSvc: WorkDatetimeService,
    private subclassSvc: VaccineSubclassInitService,
    private vaccinateRecordsDataSvc: VaccinateRecordsDataService,
    private vacReservationDataSvc: VaccinateReservationDataService,
    private agreementSvc: AgreementService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private recommendedNotificationSvc: RecommendVaccineNotificationService,
    private notifier: NotifierService,
    private sysConfSvc: SysConfInitService,
    private regRecDataSvc: RegRecordDataService,
    private profileChangeSvc: ProfileChangeService,
    private registSvc: RegistRecordService
  ) {
    const sub = this.profileDataSvc.getProfileData().subscribe(resp => {
      // 初始化小类编码的表格
      this.initTableSubclassCode();
      if (resp) {
        this.profile = resp;
        this.profileDeleted = resp['profileStatusCode'] === '10';
        this.age = resp['age'];
        this.month = resp['month'];
        // 在查询此人的接种记录的时候将接种记录设置为空(这样在新增档案的时候如果没有接种记录才不会查询出上一个人的接种记录)
        this.profileDataSvc.setVaccinatedRecords(null);
        this.vaccinateRecordsDataSvc.setVaccinateRecord(null);
        // 将已接种的表格置空
        this.vaccinatedRecordBaseTableDataWithoutEmptyRow = [];
        // 查询此人的接种记录
        this.queryVacRecord(1, 200);
        // 有人员信息的时候需要查询此人当天的登记记录信息
        this.queryRegistRecord();
      }
    });
    const sub1 = this.profileDataSvc
      .getProfileDeletedStatus()
      .subscribe(status => (this.profileDeleted = status));
    this.subscription.push(sub);
    this.subscription.push(sub1);
    const sub2 = this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
    });
    this.subscription.push(sub2);
  }

  initSysConf() {
    this.reservationTest = this.sysConfSvc.getConfValue('reservationTest') === '1';
  }

  ngOnInit() {
    this.vacSubclassCode = this.subclassSvc.getVaccineSubClassData();
    // this.initTableSubclassCode();
    const sub = combineLatest([this.vacReservationDataSvc.getVaccinateReservation(), this.regRecDataSvc.getRegRecords(), this.getHasVaccinateRecordsStatus()]).subscribe(([reservation, registerRecordData, b]) => {
      console.log('预约记录的记录11111', reservation);
      console.log('登记记录的记录2222', registerRecordData);
      console.log('是否存在接种记录3333', b);
      // 如果取消了某条登记记录的话就要把表格里面的登记记录全部删除,此时需要修改rowspan的属性,重新赋值,
      this.clearRegisterFlag();
      // this.initTableSubclassCode();
      // 预约记录
      if (reservation.length > 0) {
        this.addReservationDetailToVaccinateRecords(reservation);
        this.reservationRecords = reservation;
      }
      if (reservation.length === 0) {
        this.clearReservationFlag();
      }
      // 不能改变登记记录的原有的信息
      let registerRecord = JSON.parse(JSON.stringify(registerRecordData));
      // 登记记录
      if (registerRecord.length > 0) {
        // console.log('登记记录发生变化的时候产生的', registerRecord);
        // 获取接种记录(拿到接种记录与登记记录对比,自动增加针次,如果没有接种记录的话就自动加)
        this.profileDataSvc.getVaccinatedRecords().subscribe(realRecord => {
          let record = JSON.parse(JSON.stringify(realRecord));
          // 改变登记记录的针次,相同的疫苗剂次要自增1
          let registerChangeAfter = this.changeVaccineInjectNum(registerRecord);
          // console.log('在有变化的时候调用接种记录的是否存在', record);
          if (record) {
            // 删除添加到接种记录中的所有的登记记录
            for (let i = 0; i < record.length; i++) {
              const d = record[i];
              if (d['reservedFlag'] === '2') {
                record.splice(i, 1);
              }
            }
            // 将相同小类的疫苗组合在一起
            let afterChangeRecord = this.regroupArrObj(record);
            // console.log('组合之后的接种记录为===', afterChangeRecord);
            // 存放接种记录中每种疫苗的剂次的最大的疫苗对象
            let maxChangeRecord = [];
            if (afterChangeRecord.length) {
              for (let k = 0; k < afterChangeRecord.length; k++) {
                  const singleData = afterChangeRecord[k]['dataInfo'];
                  if (singleData.length) {
                    // 升序排列,最后一个是此类苗的最大值
                    singleData.sort((x, y) => x['vaccinateInjectNumber'] - y['vaccinateInjectNumber']);
                    // 取出每个相同属性中的最大的一条值
                    maxChangeRecord.push(singleData[singleData.length - 1]);
                  }
              }
            }
            if (maxChangeRecord.length) {
              // 拿到每一类疫苗的最大值后,将登记记录中重新排列的疫苗的剂次上面加上相同疫苗的最大剂次就可以得到最后的剂次.
              maxChangeRecord.forEach(item => {
                for (let n = 0; n < registerChangeAfter.length; n++) {
                  if (item.vaccineSubclassCode === registerChangeAfter[n]['vaccineSubclassCode']) {
                    // 在改变后的值的上面加上原有的最大的值就可以得到新的针次
                    registerChangeAfter[n]['vaccinateInjectNumber'] = registerChangeAfter[n]['vaccinateInjectNumber'] + item['vaccinateInjectNumber'];
                  }
                }
              });
            }
            // console.log('改变登记记录改变后的数据', registerChangeAfter);
            for (let m = 0; m < registerChangeAfter.length; m++) {
              record.push(registerChangeAfter[m]);
            }
            // console.log('登记记录和接种记录合并后的数据', record);
            let tempArr = record.sort((n, m) => n['vaccineSubclassCode'] - m['vaccineSubclassCode']);
            this.setVacRecordDataToBaseTable(record);
            this.registerRecords = [];
            this.registerRecords = registerChangeAfter;
          } else {
            // console.log('接种记录不存在', record);
            // 接种记录不存在(登记记录的针次自动+1)
             let changeRegisterRecord = this.changeVaccineInjectNum(registerRecord);
            // console.log('改造后的', changeRegisterRecord);
            // this.addRegisterRecords(regRecord);
            this.setVacRecordDataToBaseTable(changeRegisterRecord);
            this.registerRecords = [];
            this.registerRecords = changeRegisterRecord;
          }
        });
        // 改变登记记录中相同疫苗的剂次(相同疫苗的剂次自增)
        /*let newRegisterRecord = [];
        for (let i = 0; i < registerRecord.length; i++) {
          let flag = true;
          if (newRegisterRecord.length > 0) {
            for (let j = 0; j < newRegisterRecord.length; j++) {
              let singleData = newRegisterRecord[j];
              singleData['reservedFlag'] = '2';
              if (singleData.vaccineSubclassCode === registerRecord[i].vaccineSubclassCode) {
                singleData['vaccinateInjectNumber']++;
                flag = false;
                break;
              }
            }
          }
          if (flag) {
            registerRecord[i]['reservedFlag'] = '2';
            newRegisterRecord.push(registerRecord[i]);
          }
        }*/
       /* let changeRegisterRecord = this.changeVaccineInjectNum(registerRecord);
        console.log('改造后的', changeRegisterRecord);
        // this.addRegisterRecords(regRecord);
        this.setVacRecordDataToBaseTable(changeRegisterRecord);
        this.registerRecords = changeRegisterRecord;*/
      }
      if (registerRecord.length === 0) {
        // this.clearRegisterFlag();
        // this.initTableSubclassCode();
        this.profileDataSvc.getVaccinatedRecords().subscribe(records => {
          // console.log('么有登记记录的时候', records);
          let record = JSON.parse(JSON.stringify(records));
          if (record) {
            for (let i = 0; i < record.length; i++) {
              const d = record[i];
              if (d['registDate']) {
                record.splice(i, 1);
              }
            }
            this.setVacRecordDataToBaseTable(record);
          } else {
            this.clearRegisterFlag();
          }

        });
      }
    });
    this.subscription.push(sub);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
    this.vaccinateRecordsDataSvc.setVaccinateRecord(null);

  }

  /**
   * 相同属性的组合为新的数组对象
   */
  regroupArrObj(record: any) {
    let arrA = [];
    let arrB = [];
    for (let m = 0; m < record.length; m++) {
      if (arrA.indexOf(record[m].vaccineSubclassCode) === -1) {
        arrB.push({
          vaccineSubclassCode: record[m].vaccineSubclassCode,
          dataInfo: [record[m]]
        });
        arrA.push(record[m].vaccineSubclassCode);
      } else {
        for (let j = 0; j < arrB.length; j++) {
          if (arrB[j].vaccineSubclassCode === record[m].vaccineSubclassCode) {
            arrB[j].dataInfo.push(record[m]);
            break;
          }
        }
      }
    }
    return arrB;
  }

  /**
   * 改变登记记录的剂次(登记相同的疫苗,剂次自动增加)
   */
  changeVaccineInjectNum(arr: any[]) {
    let tempArr = [];
    let Data = [];
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (tempArr.indexOf(arr[i].vaccineSubclassCode) === -1) {
        Data.push({
          vaccineSubclassCode: arr[i].vaccineSubclassCode,
          dataInfo: [arr[i]]
        });
        tempArr.push(arr[i].vaccineSubclassCode);
      } else {
        for (let j = 0; j < Data.length; j++) {
          if (Data[j].vaccineSubclassCode === arr[i].vaccineSubclassCode) {
            Data[j].dataInfo.push(arr[i]);
            break;
          }
        }
      }
    }
    if (Data.length) {
      Data.forEach(item => {
        let singleData = item['dataInfo'];
        if (singleData.length) {
          for (let i = 0; i < singleData.length; i++) {
            let single = singleData[i];
            // 改变剂次
            single['vaccinateInjectNumber'] = i + 1;
            // 登记记录的标志
            single['reservedFlag'] = '2';
            newArr.push(single);
          }
        }
      });
    }
    return newArr;
  }

  /**
   * 根据小类编码查询该小类编码对应的大类(且活性相同)所包括的所有小类编码
   * @param subclassCode
   */
  getVaccineSubClassArrayBySubclassCode(subclassCode: string) {
    // 找到小类编码集合中对应的小类对象
    const subclassObj = this.vacSubclassCode.find(vac => subclassCode === vac['value']);
    // 找到此小类对应的活性
    const isLiveVaccine = subclassObj['isLiveVaccine'];
    let isLiveVaccineArr = [];
    isLiveVaccineArr.push(isLiveVaccine);
    let vaccineSubclassCodeArr = [];
    // 找到此小类的大类编码
    const vaccineBroadHeadingCode = subclassObj['value'].substring(0, 2);
    this.vacSubclassCode.forEach(subclz => {
      // 截取子类编码的前两位，前两位是大类编码
      const code = subclz['value'].substring(0, 2);
      const isLiveVaccine1 = subclz['isLiveVaccine'];
      const subclzCode = subclz['value'];
      if (code === vaccineBroadHeadingCode && isLiveVaccine1 === isLiveVaccine) {
        vaccineSubclassCodeArr.push(subclzCode);
      }
    });
    return {
      vaccineSubclassCodeArr: vaccineSubclassCodeArr,
      isLiveVaccineArr: isLiveVaccineArr
    };
  }

  /**
   * 初始化疫苗小类数据
   * 将疫苗小类数据归集到预设的疫苗表格数据中，用来作为接种记录显示到哪一个疫苗小类的判断参数
   */
  initTableSubclassCode() {
    this.vaccinatedRecordBaseTable = JSON.parse(
      JSON.stringify(this.originalVaccinatedRecordBaseTable)
    );
    // console.log('第一步之前的表格数据', this.vaccinatedRecordBaseTable);
    // 第一步，给每个需要执行 rowspan 的数据添加用于判断是否是属于当前大类的小类编码
    for (let i = 0; i < this.vaccinatedRecordBaseTable.length; i++) {
      if (this.vaccinatedRecordBaseTable[i].hasOwnProperty(this.rowspan)) {
        this.vaccinatedRecordBaseTable[i]['vaccineSubclassCodeArr'] = [];
      }
    }
    // console.log('添加完成rowspan之后', this.vaccinatedRecordBaseTable);
    // console.log('用于展示的子类编码', this.vacSubclassCode);
    // 第二步，将符合表格展示条件的疫苗小类code 添加到包含rowspan的数据行的 vaccineSubclassCodeArr 数组中，并不添加其他数据
    for (let i = 0; i < this.vaccinatedRecordBaseTable.length; i++) {
      const vac = this.vaccinatedRecordBaseTable[i];
      if (!vac.hasOwnProperty(this.rowspan)) continue;
      const vaccineBroadHeadingCode = vac['vaccineBroadHeadingCode'];
      const isLiveVaccineArr = vac['isLiveVaccine'];
      this.vacSubclassCode.forEach(subclz => {
        // 截取子类编码的前两位，前两位是大类编码
        const code = subclz['value'].substring(0, 2); // 大类编码
        const isLiveVaccine = subclz['isLiveVaccine']; // 是否活性 L - 减毒 D - 灭活
        const subclzCode = subclz['value']; // 小类编码
        if (
          code === vaccineBroadHeadingCode &&
          isLiveVaccineArr.indexOf(isLiveVaccine) !== -1
        ) {
          vac['vaccineSubclassCodeArr'].push(subclzCode);
        }
      });
    }
    // console.log('初始化好的数据表格是', this.vaccinatedRecordBaseTable);
  }

  /**
   * 打开相应的对话框(单剂补录)
   * @param indx
   */
  openSingleDosage() {
    if (this.checkProfileDeleteStatus() || !this.profile || !this.userInfo) {
      return;
    }
    // 单剂补录
    const sub = this.dialogService
      .open(SingleDosageRecordComponent, {
        context: {
          isStop: true,
          vacRecordData: this.vacRecordData
        },
        closeOnEsc: false
      })
      .onClose.subscribe(resp => {
        if (resp) {
          this.queryVacRecord(1, 200);
          this.recommendedNotificationSvc.setVaccineStrategyNotification(RECOMMEND_VACCINE_REFRESH);
        }
      });
    this.subscription.push(sub);
  }

  checkProfileDeleteStatus(): boolean {
    if (this.profileDeleted) {
      this.notifier.notify('warning', '当前档案已经被删除，无法操作');
      return true;
    }
    if (!this.profile) {
      this.notifier.notify('warning', '请先查询档案信息再执行后续操作');
      return true;
    }
    return false;
  }

  // 批量补录
  openBatchDosage() {
    if (this.checkProfileDeleteStatus() || !this.profile || !this.userInfo) {
      return;
    }
    const sub = this.dialogService
      .open(BatchDosageRecordComponent, {
        closeOnEsc: false,
        closeOnBackdropClick: false,
        context: {
          vaccinateRecords: this.vacRecordData,
          profile: this.profile
        }
      })
      .onClose
      .subscribe(r => {
        if (r) {
          this.queryVacRecord(1, 200);
          this.recommendedNotificationSvc.setVaccineStrategyNotification(RECOMMEND_VACCINE_REFRESH);
        }
      });
    this.subscription.push(sub);
  }

  /**
   * 查询接种记录，按照档案编码查询(接种记录里只包含接种完成的(3)和在册的状态(0))
   * vaccinateStatus 接种状态 关联字典表 0-未确认;1-可接种;2-接种中;3-接种完成
   * vaccinateStatusCode 接种记录状态Code 关联字典表 0-在册;10-省平台删除
   */
  queryVacRecord(page = 1, pageSize = 10) {
    if (!this.profile) return;
    this.loading = true;
    this.hasVaccinateRecords$.next(false);
    const query = {
      profileCode: this.profile['profileCode'],
      vaccinateStatus: ['3'], // 接种完成的(3 - 接种完成)
      vaccinateStatusCode: '0', // 在册的(也就是有效期)
      pageEntity: { page: page, pageSize: pageSize }
    };
    console.log('接种记录参数', query);
    this.initTableSubclassCode();
    // this.vacSvc.queryVaccinateRecordSingleAndCount(
    this.vacSvc.queryVaccinateRecordSingleWithVirtual(query, (queryData, countData) => {
        this.loading = false;
      console.log('查询到的接种记录=====>', queryData, countData);
        // if (!queryData || !countData) {
        if (!queryData) {
          console.warn('未查到接种记录数据');
          return;
        }
        // if (queryData.code !== 0 || countData.code !== 0) {
        if (queryData.code !== 0 ) {
          console.warn('未查到接种记录数据');
          return;
        }
        // 升序
        this.vacRecordData = queryData.data.sort((a, b) => a['vaccineSubclassCode'] - b['vaccineSubclassCode']);
      // console.log('接种记录接口得到的结果======', this.vacRecordData);
      // console.log('升序后的结果======', queryData.data);
        this.setVacRecordDataToBaseTable(queryData.data);
        if (queryData.data.length > 0) {
          this.hasVaccinateRecords$.next(true);
        }
      //  将接种记录发送到service中，用作打印入托证明（或者打印接种记录）
        this.profileDataSvc.setVaccinatedRecords(this.vacRecordData);
      // this.total = countData.data[0]['count'];
      }
    );
  }

  /**
   * 查询此接种人的当天的登记记录
   */
  queryRegistRecord() {
    if (!this.profile) return;
    this.loading = true;
    const today = new Date();
    const query = {
      profileCode: this.profile['profileCode'],
      registPovCode: this.userInfo.pov,
      registDate: {
        start: DateUtils.formatStartDate(today),
        end: DateUtils.formatEndDate(today)
      },
      pageEntity: {
        page: 1,
        pageSize: 999,
        sortBy: ['registDate,desc']
      }
    };
    this.availableRec = [];
    this.registSvc.queryRegistRecord(query, resp => {
      console.log('接口查询获取登记记录的最新数据', resp);
      this.loading = false;
      if (resp.code === 0 && resp.data.length !== 0) {
        // 0 已取消, 2 已接种, 1 待接种
        resp.data.forEach(item => {
          if (item.registStatus === '0' || item.registStatus === '2') {
            this.availableRec.push(item);
          }
        });
      }
    });
  }

  /**
   * 将获取到的数据依次放入到base table 中
   * 如果有，则放入相应的大类数据中
   * 如果没有，则追加到最后
   * @param data 查到的接种记录
   */
  setVacRecordDataToBaseTable(data: any[]) {
    // 使用一个新的表格数据对象替换原有的表格数据对象，不然数据无法刷新
    let vaccinatedRecordBaseTableData: any[];
    // console.log('待循环的原始数据为', JSON.parse(JSON.stringify(data)));
    // console.log('待循环的接种记录数据', JSON.parse(JSON.stringify(data)));
    // console.log(JSON.parse(JSON.stringify(this.vaccinatedRecordBaseTable)));
    for (let i = 0; i < data.length; i++) {
      // 获取单条接种记录数据
      let replaceData = data[i];
      // console.log('单条接种记录数据', replaceData);
      // 如果待替换的数据的接种状态是 3 - 接种完成 或者 接种记录的删除状态为 是 0 - 在册 则执行替换操作，
      // 反之则不执行替换操作
      // if (replaceData['vaccinateStatus'] !== '3' || replaceData['vaccinateStatusCode'] !== '0') {
      //   continue;
      // }

      // 位置索引值
      const replaceIndexObj: any = this.findIndexInBaseTableDataByVaccineRecord(replaceData);
      // console.log('找到新的位置的记录', replaceIndexObj);
      //  返回的位置索引值结构 { index: index, rowspan: rowspan, vaccinateInjectNumber: vaccinateInjectNumber }
      const replaceIndex = replaceIndexObj['index']; // 替代序号
      const vaccinateInjectNumber = replaceIndexObj['vaccinateInjectNumber']; // 针序
      const rowspan = replaceIndexObj[this.rowspan];

      // 如果接种针序大于 rowspan，且替代序号不为 -1，说明预设的表格中包含此条接种记录的预设表格信息，只需要将该条接种记录追加到所述表格中的相应位置即可
      if (vaccinateInjectNumber > rowspan && replaceIndex !== -1) {
        // 修改预设表格中的rowspan 信息
        const replace = this.changeTableDataRowspan(replaceData);
        // 说明找到了已有rowspan，执行了+1，则直接往后追加即可，需要将rowspan = null
        replaceData[this.rowspan] = null;
        // 新增一个元素到table中去,新增的位置为replace;
        this.vaccinatedRecordBaseTable.splice(replace, 0, replaceData);
        continue;
      }

      // 说明这是一个表格里没有预设数据的内容，需要：
      // 1. 根据小类编码查询大类信息
      // 2. 根据小类编码查询小类的集合信息
      // 3. 追加到所述表格中去
      if (replaceIndex === -1) {
        // console.log('没有预设表格内容的是', replaceData);
        replaceData[this.rowspan] = 1;
        const vaccineBroadHeadingCode = replaceData['vaccineBroadHeadingCode'];
        const vaccineBroadHeadingName = this.vacBroadHeadingSvc.getVaccBroadHeadingNameByBroadHeadingCode(vaccineBroadHeadingCode);
        replaceData['vaccineBroadHeadingName'] = vaccineBroadHeadingName;
        const vaccineSubclassCode = replaceData['vaccineSubclassCode'];
        // 通过小类编码来获取此小类的编码来获取大类编码,通过大类编码(和活性相同)判断出包含的所有的小类编码arr 和活性
        const vaccineSubclassCodeArrAndIsLiveVaccineArr = this.getVaccineSubClassArrayBySubclassCode(vaccineSubclassCode);
        replaceData['vaccineSubclassCodeArr'] = vaccineSubclassCodeArrAndIsLiveVaccineArr['vaccineSubclassCodeArr'];
        replaceData['isLiveVaccineArr'] = vaccineSubclassCodeArrAndIsLiveVaccineArr['isLiveVaccineArr'];
        this.vaccinatedRecordBaseTable.push(replaceData);
        continue;
      }

      const beReplaceData = this.vaccinatedRecordBaseTable[replaceIndex];
      if (beReplaceData.hasOwnProperty(this.rowspan)) {
        replaceData[this.rowspan] = beReplaceData[this.rowspan];
      }
      if (beReplaceData.hasOwnProperty('vaccineSubclassCodeArr')) {
        replaceData['vaccineSubclassCodeArr'] = beReplaceData['vaccineSubclassCodeArr'];
      }
      replaceData['vaccineBroadHeadingName'] = beReplaceData['vaccineBroadHeadingName'];
      // 如果接种针序大于rowspan ，说明该针序不在计划之中，需要修改显示rowspan 的值
      this.vaccinatedRecordBaseTable.splice(replaceIndex, 1, replaceData);
      // }
    }
    vaccinatedRecordBaseTableData = JSON.parse(JSON.stringify(this.vaccinatedRecordBaseTable));
    // console.log(JSON.parse(JSON.stringify(this.vaccinatedRecordBaseTable)));
    this.vaccinatedRecordBaseTable = [];
    this.vaccinatedRecordBaseTable = JSON.parse(JSON.stringify(vaccinatedRecordBaseTableData));
    this.vaccinateRecordsDataSvc.setVaccinateRecord(this.vaccinatedRecordBaseTable);
    /**
     * 根据已有的table 数据进行过滤，将空行去掉
     */
    this.vaccinatedRecordBaseTableDataWithoutEmptyRow = [];
    for (let i = 0; i < vaccinatedRecordBaseTableData.length; i++) {
      let vac = vaccinatedRecordBaseTableData[i];
      // 根据接种时间字段判断此条接种记录是否有效
      if (vac['vaccinateTime'] !== null && vac['reservedFlag'] !== '2') {
        vac[this.rowspan] = 1;
        this.vaccinatedRecordBaseTableDataWithoutEmptyRow.push(vac);
      }
    }
  }

  /**
   * 修改tableData的 rowspan(改变rowspan), 返回新的位置
   * @param replaceData
   */
  changeTableDataRowspan(replaceData: any) {
    for (let i = 0; i < this.vaccinatedRecordBaseTable.length; i++) {
      const d = this.vaccinatedRecordBaseTable[i];
      if (!d.hasOwnProperty(this.rowspan) || !d['vaccineSubclassCodeArr']) continue;
      const vaccineSubclassCodeArr: any[] = d['vaccineSubclassCodeArr'];
      const subclassCode = replaceData['vaccineSubclassCode'];
      if (vaccineSubclassCodeArr.includes(subclassCode)) {
        d[this.rowspan]++;
        return i + d[this.rowspan] - 1;
      }
    }
  }

  /**
   * 根据传入的单条接种记录数据，判断该接种数据应该在base table 中的位置 --- index
   * 然后根据得到的Index 执行数组替换
   * 如果查到了，则返回数据在 base table 中的位置索引，如果没有查到，则返回数组的长度值
   * @param data 单条接种记录，从数据库中获取
   */
  findIndexInBaseTableDataByVaccineRecord(data: any) {
    let index = -1;
    let rowspan = 0;
    // 传入一条待查询index 的接种记录，获取此条接种记录的疫苗子类编码
    const subclassCode = data['vaccineSubclassCode'];
    // 获取此条接种记录的接种针序，比如乙肝第二针，这个值就是2
    const vaccinateInjectNumber = data['vaccinateInjectNumber'];
    for (let i = 0; i < this.vaccinatedRecordBaseTable.length; i++) {
      const vac = this.vaccinatedRecordBaseTable[i];
      // 如果不包含 rowspan， 则跳过，因为子类code arr 在 包含 rowspan 的数据中，code arr 是主要判断条件
      if (!vac.hasOwnProperty(this.rowspan) || !vac[this.rowspan]) continue;
      const subclassCodeArr = vac['vaccineSubclassCodeArr'];
      // 如果 子类code arr 中 判断 当前 data 的子类编码 subclassCode  !== -1，说明是属于base table 中当前显示的数据行
      // 则根据 接种的针次（第几针）判断是数据当前数据的第几个位置，并获取到该位置index
      if (subclassCodeArr.includes(subclassCode)) {
        // 如果接种针序大于rowspan ，说明当前接种针序是错误的，说明此条接种记录即是错误的
        // 隐藏下面一段代码，如果当前接种针序大于预设针序，也需要显示出来
        // if (vaccinateInjectNumber > rowspan) {
        //   return -1;
        // }
        index = i + vaccinateInjectNumber - 1;
        rowspan = vac[this.rowspan];
      }
    }
    return { index: index, rowspan: rowspan, vaccinateInjectNumber: vaccinateInjectNumber };
  }

  /**
   * 展示接种记录详情
   * @param vac 一条接种记录
   */
  showDetail(vac) {
    this.showDetailVac = vac;
  }

  /*
  * 展示登记记录详情
  * */
  showRegisterDetail(vac) {
    this.registerRecordDetail = vac;
  }

  /**
   * 修改接种记录
   * @param vac 一条接种记录
   */
  updateRecord(vac) {
    this.dialogService
      .open(SingleDosageRecordComponent, {
        closeOnEsc: false,
        closeOnBackdropClick: false,
        context: {
          updateData: vac
        }
      })
      .onClose.subscribe(resp => {
      if (resp) {
        this.queryVacRecord(1, 200);
      }
    });
  }

  /**
   * 预约疫苗
   */
  makeReservation() {
    if (this.profileDeleted || !this.profile || !this.userInfo) {
      return;
    }
    this.dialogService.open(VaccinateReservationComponent);
  }

  /**
   * 获取判断是否有接种记录的判断结果标识符
   */
  getHasVaccinateRecordsStatus(): Observable<boolean> {
    return this.hasVaccinateRecords$
      .asObservable()
      .pipe(filter(b => b === true));
  }

  /**
   * 添加预约记录信息到接种记录中
   * @param reservationData
   */
  addReservationDetailToVaccinateRecords(reservationData: any[]) {
    const vaccinatedRecordBaseTable = JSON.parse(JSON.stringify(this.vaccinatedRecordBaseTable));
    // console.log('基础模板是', vaccinatedRecordBaseTable);
    for (let i = 0; i < vaccinatedRecordBaseTable.length; i++) {
      let record = vaccinatedRecordBaseTable[i];
      // 只判断带有rows属性的行
      if (!record.hasOwnProperty(this.rowspan) || !record[this.rowspan]) continue;
      const rowNum = record[this.rowspan];
      const vaccineSubclassCodeArr = record['vaccineSubclassCodeArr'];
      for (let j = 0; j < reservationData.length; j++) {
        const reservation = reservationData[j];
        const subclassCode = reservation['reservationVaccine'];
        // console.log(vaccineSubclassCodeArr, record);
        // 如果不等于 -1，说明是属于这个接种记录疫苗大类中
        if (vaccineSubclassCodeArr.indexOf(subclassCode) !== -1) {
          for (let k = 0; k < rowNum; k++) {
            const comparisonRecord = vaccinatedRecordBaseTable[i + k];
            if (comparisonRecord['vaccinateTime'] === null) {
              comparisonRecord['reserved'] = '1';
              comparisonRecord['channel'] = reservation['channel'];
              comparisonRecord['reservationDate'] =
                reservation['reservationDate'];
              comparisonRecord['finalDate'] = reservation['finalDate'];
              comparisonRecord['status'] = reservation['status'];
              break;
            }
          }
        }
      }
    }
    this.vaccinatedRecordBaseTable = vaccinatedRecordBaseTable;
  }

  /**
   * 添加当天登记记录信息到接种记录中(登记的疫苗可能是同一种苗,剂次也可能是同一个剂次)
   * @param registerRecord 登记记录的数据
   */
  addRegisterRecords(registerRecord: any[]) {
    const vaccinatedRecordBaseTable = JSON.parse(
      JSON.stringify(this.vaccinatedRecordBaseTable)
    );
    // console.log('基础模板是', vaccinatedRecordBaseTable);
    for (let i = 0; i < vaccinatedRecordBaseTable.length; i++) {
      let record = vaccinatedRecordBaseTable[i];
      // 只判断带有rows属性的行
      if (!record.hasOwnProperty(this.rowspan) || !record[this.rowspan]) continue;
      const rowNum = record[this.rowspan];
      const vaccineSubclassCodeArr = record['vaccineSubclassCodeArr'];
      for (let j = 0; j < registerRecord.length; j++) {
        const reservation = registerRecord[j];
        // console.log('登记记录', reservation);
        const subclassCode = reservation['vaccineSubclassCode'];
        // console.log('===', vaccineSubclassCodeArr, record);
        // 如果不等于 -1，说明是属于这个接种记录疫苗大类中
        if (vaccineSubclassCodeArr.indexOf(subclassCode) !== -1) {
          for (let k = 0; k < rowNum; k++) {
            const comparisonRecord = vaccinatedRecordBaseTable[i + k];
            if (comparisonRecord['vaccinateTime'] === null) {
              comparisonRecord['reservedFlag'] = '2'; // 预留给登记记录的标识
              comparisonRecord['vaccineProductName'] = reservation['vaccineProductName'];
              comparisonRecord['vaccineBroadHeadingCode'] = reservation['vaccineBroadHeadingCode'];
              comparisonRecord['vaccineBatchNo'] = reservation['vaccineBatchNo'];
              comparisonRecord['vaccinateType'] = reservation['vaccinateType'];
              comparisonRecord['vaccineManufactureName'] = reservation['vaccineManufactureName'];
              comparisonRecord['vaccinePrice'] = reservation['vaccinePrice'];
              // comparisonRecord['vaccinateInjectNumber'] = reservation['vaccinateInjectNumber'];
              comparisonRecord['registDoctorCode'] = reservation['registDoctorCode'];
              comparisonRecord['registDate'] = reservation['registDate'];
              comparisonRecord['registStatus'] = reservation['registStatus'];
              comparisonRecord['orderStatus'] = reservation['orderStatus'];
              comparisonRecord['memo'] = reservation['memo'];
              comparisonRecord['registRecordNumber'] = reservation['registRecordNumber'];
              break;
            }
          }
        }
      }
    }
    this.vaccinatedRecordBaseTable = vaccinatedRecordBaseTable;
    // console.log('tableData', this.vaccinatedRecordBaseTable);
  }

  /**
   * 设置用于展示的接种预约记录
   * @param detail
   */
  setReservationDetail(detail: any) {
    this.reservationDetail = detail;
  }

  /**
   * 查看疫苗告知书
   * @param record
   * @param flag 登记记录标识 true
   */
  queryAgreement(record, flag) {
    // 获取此疫苗的接种告知书
    if (
      this.agreementSvc.getAgreementByCode(record.vaccineBroadHeadingCode)
        .length
    ) {
      this.agreementTemplate = this.agreementSvc.getAgreementByCode(
        record.vaccineBroadHeadingCode
      )[0];
    } else {
      this.msg.warning('没有查到该疫苗的告知书');
      return;
    }
    this.dialogService.open(PrintAgreementDialogComponent, {
      context: {
        recordInfo: record,
        agreementTemplate: this.agreementTemplate,
        flag: flag
      }
    });
  }


  /**
   * 清除已预约标志，用于在删除预约记录时触发
   *
   */
  clearReservationFlag() {
    this.loading = true;
    const data = JSON.parse(JSON.stringify(this.vaccinatedRecordBaseTable));
    this.vaccinatedRecordBaseTable = [];
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      if (d['reservationDate']) {
        d['reserved'] = null;
        d['channel'] = null;
        d['finalDate'] = null;
        d['status'] = null;
        d['reservationDate'] = null;
        break;
      }
    }
    this.vaccinatedRecordBaseTable = JSON.parse(JSON.stringify(data));
    // console.log(this.vaccinatedRecordBaseTable);
    this.loading = false;
  }
  /**
  * 清除已登记标志,用在删除登记记录时触发
  * */

  /* clearRegisterFlag() {
     this.loading = true;
     let data = JSON.parse(JSON.stringify(this.vaccinatedRecordBaseTable));
     this.vaccinatedRecordBaseTable = [];
     console.log('需要清除前的记录', data);
     // 删除所有的登记记录
     let deleteRigesterRecord = [];
     for (let i = 0; i < data.length; i++) {
       const d = data[i];
       // 找到登记记录的的标志,删除此条记录,并且需要改变此条记录的小类行,并修改此行的rowspan
       // 有登记时间的都为登记记录
       if (d['registDate']) {
         // 找到此条的小类编码,
         // d['vaccineSubclassCode']
         deleteRigesterRecord.push(d);
         // 删除里面的所有的登记记录
         data.splice(i, 1);
       }
     }
     console.log('清空前的表格', data);
   /!*  let changeData = [...this.regroupArrObj(data)];
     console.log('changeData', changeData);
     let newData = [];
     if (changeData.length) {
       for (let x = 0; x < changeData.length; x++) {
         const changeSingle = changeData[x];
         if (changeSingle['vaccineSubclassCode'] !== undefined) {
           if (changeSingle['dataInfo'].length) {
             changeSingle['dataInfo'].forEach(val => {
               if (val['vaccinateInjectNumber'] === 1) {
                 val[this.rowspan] = changeSingle.length;
                 newData.push(val);
               }
             });
           }
         } else {
           if (changeSingle['dataInfo'].length) {
             changeSingle['dataInfo'].forEach(val => {
              /!* if (val['vaccinateInjectNumber'] === 1 && val[this.rowspan] !== null) {
                 val[this.rowspan] = changeSingle.length;
                 newData.push(val);
               }*!/
               newData.push(val);
             });
           }
         }
       }
       console.log('newData', newData);

     }*!/
     this.vaccinatedRecordBaseTable = JSON.parse(JSON.stringify(data));
     // console.log('清空后的表格', this.vaccinatedRecordBaseTable);
     this.loading = false;
   }*/
  clearRegisterFlag() {
    this.loading = true;
    let data = JSON.parse(JSON.stringify(this.originalVaccinatedRecordBaseTable));
    this.vaccinatedRecordBaseTable = [];
    // console.log('清空前的表格', data);
    this.vaccinatedRecordBaseTable = JSON.parse(JSON.stringify(data));
    // console.log('第一步之前的表格数据', this.vaccinatedRecordBaseTable);
    // 第一步，给每个需要执行 rowspan 的数据添加用于判断是否是属于当前大类的小类编码
    for (let i = 0; i < this.vaccinatedRecordBaseTable.length; i++) {
      if (this.vaccinatedRecordBaseTable[i].hasOwnProperty(this.rowspan)) {
        this.vaccinatedRecordBaseTable[i]['vaccineSubclassCodeArr'] = [];
      }
    }
    // console.log('添加完成rowspan之后', this.vaccinatedRecordBaseTable);
    // console.log('用于展示的子类编码', this.vacSubclassCode);
    // 第二步，将符合表格展示条件的疫苗小类code 添加到包含rowspan的数据行的 vaccineSubclassCodeArr 数组中，并不添加其他数据
    for (let i = 0; i < this.vaccinatedRecordBaseTable.length; i++) {
      const vac = this.vaccinatedRecordBaseTable[i];
      if (!vac.hasOwnProperty(this.rowspan)) continue;
      const vaccineBroadHeadingCode = vac['vaccineBroadHeadingCode'];
      const isLiveVaccineArr = vac['isLiveVaccine'];
      this.vacSubclassCode.forEach(subclz => {
        // 截取子类编码的前两位，前两位是大类编码
        const code = subclz['value'].substring(0, 2); // 大类编码
        const isLiveVaccine = subclz['isLiveVaccine']; // 是否活性 L - 减毒 D - 灭活
        const subclzCode = subclz['value']; // 小类编码
        if (
          code === vaccineBroadHeadingCode &&
          isLiveVaccineArr.indexOf(isLiveVaccine) !== -1
        ) {
          vac['vaccineSubclassCodeArr'].push(subclzCode);
        }
      });
    }
    // console.log('清空后的表格', this.vaccinatedRecordBaseTable);
    this.loading = false;
  }

}

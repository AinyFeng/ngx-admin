
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { NbDialogService, NbIconLibraries } from '@nebular/theme';
import { LodopService } from '@delon/abc';
import { UserService } from '@tod/uea-auth-lib';
import { DOCUMENT } from '@angular/common';
import {
  INOCULATION_TYPE, PAGE_SIZE, ProfileService, PovInfoService, VaccinateService,
  ProfileDataService, RegistRecordService, AgreementService, LodopPrintService,
  VaccRecordTransformService, BiteService, MedicalHistoryService, DateUtils,
  ApiAdminDailyManagementService
} from '@tod/svs-common-lib';
import { SearchResultComponent } from '../../@uea/components/dialog/search-result/search-result.component';
import { AppStateService } from '../../@uea/service/app.state.service';

@Component({
  selector: 'mds-print-component',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit, OnDestroy {
  // 接种记录底部显示的按钮
  recordBtn = true;
  // 个案信息
  caseInfoBtn = false;
  //  加载中
  loading = false;

  // 查询内容
  searchContent: string;

  // 档案信息
  profile: any;

  // 是否是儿童
  isChild: boolean;

  // 打印机加载错误
  error: boolean;
  showError: boolean;

  // 登录用户信息
  userInfo: any;
  fatherInfo: any;
  motherInfo: any;
  // pov 基本信息
  povInfo: any;
  // 已选择的tab
  selectedTab = '入托证明';
  // 告知书模板
  agreementTemplates = [];
  // 告知书选择的模板
  agreementSelectedId: string;
  // 发票票据打印参数
  receiptTemplateJson: any;
  // 打印上海内容的id
  shanghaiImmunityCardId: string;
  // 打印上海接种卡的接种记录
  shanghaiVacRecords = [];

  // 入托证明对象，用于传输打印入托证明需要的所有资料
  schoolAttendCertification: any = {
    oneVaccRecord: [],
    twoVaccRecord: [],
    addVaccRecord: [],
    motherInfo: {},
    fatherInfo: {},
    name: ''
  };

  // 打印档案信息对象，用于传输打印档案信息需要的所有资料，包括档案信息，pov信息，用户信息
  printProfileData: any = {
    // motherInfo: {},
    // fatherInfo: {},
    userInfo: {},
    povInfo: {}
  };

  // 打印接种本上面的个案信息(儿童接种本档案信息)
  childCaseInfo: any = {
    contraInfo: [], // 禁忌
    allergyInfo: [], // 过敏
    povInfo: {}, // pov
    fatherInfo: {},
    motherInfo: {}
  };
  // 病史情况
  medicalInfo: any;
  // 背景模板
  modelImg: any;
  // 打印接种记录需要的数据
  vaccinateRecordData = {
    historyRecordData: [],
    vaccCertificateType: INOCULATION_TYPE,
    pageTitles: PAGE_SIZE,
    vaccRecordData: [],
    prePage: true,
    showNextStep: false,
    allTitle: [],
    currentTab: ''
  };
  // 额外设置的内容
  settings = {
    startLine: 1,
    marginTop: 0,
    marginLeft: 0
  };
  // 打印个案信息的额外设置
  setMedia = {
    marginTop: 0,
    marginLeft: 0
  };
  marginTop = 0;
  marginLeft = 0;
  // 医生是否打印
  doctorNames = [{ label: '不打印', value: 0 }, { label: '打印', value: 1 }];
  doctorName = 1;
  // 选择打印模板对应的数据
  recordModeData: any;
  // 打印模板背景
  ahModeImg: any;
  // 打印当前模板的页码
  currentPage: any;
  // 最终选择打印的数据
  printRecord: any[] = [];
  // 医生签字图片
  doctorSign: any;
  // 选择打印的背景图片
  images: any = {};
  // 默认的证件类型选择
  chooseType = 'ahNation';
  idType = 'ah2019bhMade';

  // 犬伤记录
  rabiesBittenInfo = [];
  // 成人疫苗记录(特需疫苗)
  adultVaccineList = [];
  // 注射单btn
  injectSheet = false;

  constructor(
    private appStateService: AppStateService,
    private profileSvc: ProfileService,
    private msg: NzMessageService,
    private lodopSrv: LodopService,
    private povApiSvc: PovInfoService,
    private userSvc: UserService,
    @Inject(DOCUMENT) private doc,
    private vacApiSvc: VaccinateService,
    private profileDataSvc: ProfileDataService,
    private registApiSvc: RegistRecordService,
    private agreementSvc: AgreementService,
    private lodopPrintSvc: LodopPrintService,
    private dialogService: NbDialogService,
    private transformSvc: VaccRecordTransformService,
    iconLibraries: NbIconLibraries,
    private biteSvc: BiteService,
    private medicalSvc: MedicalHistoryService,
    private adminSvc: ApiAdminDailyManagementService
  ) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconLibraries.setDefaultPack('fas');

    this.lodopPrintSvc.getLodopStatus().subscribe(status => {
      this.showError = status ? status : !status;
      this.error = status;
    });
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      // 获取当前所在地区 - 市
      this.getCurDistrictCode();
      // 获取 pov 信息
      this.getPovInfo();
      // 添加打印档案信息的用户信息
      this.printProfileData.userInfo = user;
    });

    this.recordModeData = require('../../../assets/data/print/record-template.json');
    this.ahModeImg = require('../../../assets/data/print/images.json');
    this.modelImg = require('../../../assets/data/print/child-case-info.json');
  }

  ngOnInit(): void {
    this.appStateService.setSubTitle('打印中心');
    // 获取所有的告知书模板
    this.agreementTemplates = this.agreementSvc.getAgreementData();
  }

  ngOnDestroy() {
    this.appStateService.clearSubTitle();
  }

  /**
   * 查询档案，根据input 输入参数
   */
  searchProfile() {
    // 如果还在查询，则不执行查询操作
    if (this.loading) return;
    if (!this.searchContent || this.searchContent.trim() === '') {
      return;
    }
    this.loading = true;
    let query = {
      pageNo: 1,
      pageSize: 10
    };
    this.profileSvc.queryProfileByStr(this.searchContent, query, resp => {
      this.loading = false;
      console.log(resp);
      if (resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) {
        this.msg.info('没有查到数据，请重试');
        return;
      }
      if (resp[1].code !== 0 || !resp[1].hasOwnProperty('data')) {
        this.msg.info('没有查到数据，请重试');
        return;
      }
      if (resp[0].data.length === 0) {
        return;
      }
      this.dialogService
        .open(SearchResultComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: {
            data: resp[0].data,
            countDate: resp[1].data,
            queryString: this.searchContent,
            pageEntity: query
          }
        })
        .onClose.subscribe(res => {
        console.log('个案信息', res);
          if (res) {
            this.profile = res;
            this.isChild = res['age'] < 16;
            // 将档案信息添加剂到打印入托证明对象中
            Object.assign(this.schoolAttendCertification, res);
            // 将档案信息添加到打印档案信息对象中
            Object.assign(this.printProfileData, res);
            // 将档案信息添加到打印个案信息对象中
            Object.assign(this.childCaseInfo, res);
            // 查询监护人信息
            // 查询接种记录
            this.getVacRecordInfo();
            // 查询接种记录(日常管理中的接种记录含有 有效期)
            this.queryVacRecordInfo();

            // 获取犬伤信息
            // this.queryRabies();
            // 获取成人疫苗登记信息
            // this.queryAdultVaccineRecord();
            // 获取成人疫苗登记信息(包含成人疫苗和狂犬疫苗)
            this.queryRabiteAndAdultVaccineRecord();
            // 获取病史情况
            // this.queryMedical();
          }
        });
    });
  }

  /**
   * 根据登录用户查询接种门诊的基本信息，比如接种门诊的地址，电话，工作时间等
   */
  getPovInfo() {
    if (!this.userInfo) return;
    const query = {
      povCode: this.userInfo.pov
    };
    this.povApiSvc.queryPovInfo(query, resp => {
      if (resp.code === 0) {
        this.povInfo = resp.data[0];
        this.printProfileData.povInfo = resp.data[0];
        this.childCaseInfo.povInfo = resp.data[0];
        this.profileDataSvc.setPovInfo(resp.data[0]);
      }
    });
  }

  /**
   * 查询犬伤信息，根据档案编码
   */
  queryRabies() {
    if (!this.profile) return;
    const queryRabies = {
      profileCode: this.profile['profileCode']
    };
    this.rabiesBittenInfo = [];
    this.biteSvc.queryBiteRecord(queryRabies, resp => {
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp.data.length === 0
      ) {
        // this.msg.warning('没有查到犬伤记录，请重试！');
        console.warn('没有查到犬伤记录');
        return;
      }
      this.rabiesBittenInfo = resp.data;
    });
  }

  /*
   * 查询成人疫苗登记记录,根据档案编码
   * */
  queryAdultVaccineRecord() {
    if (!this.profile) return;
    this.loading = true;
    let query = {
      profileCode: this.profile['profileCode']
    };
    this.adultVaccineList = [];
    this.biteSvc.queryPavrVaccineRecord(query, resp => {
      this.loading = false;
      console.log('成人记录查询结果', resp);
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp.data.length === 0
      ) {
        return;
      }
      this.adultVaccineList = resp.data;
    });
  }

  /*
   * 查询犬伤和成人信息,根据档案编码查询特需疫苗
   * */
  queryRabiteAndAdultVaccineRecord() {
    if (!this.profile) return;
    const queryRabies = {
      profileCode: this.profile['profileCode']
    };
    this.adultVaccineList = [];
    this.biteSvc.queryRabiteAndAdultVaccineRecord(queryRabies, resp => {
      // console.log('result', resp);
      if (
        (resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) &&
        (resp[1].code !== 0 || !resp[1].hasOwnProperty('data'))
      ) {
        console.warn('没有查到特需疫苗记录');
        return;
      }
      if (resp[0].data.length) {
        resp[0].data.forEach(item => item['broadHeadingCode'] = '28');
        this.adultVaccineList.push({ special: [...resp[0].data] });
      }
      if (resp[1].data.length) {
        this.adultVaccineList.push({ special: [...resp[1].data] });
      }
      console.log('成人疫苗', this.adultVaccineList);
    });
  }

  // 打印个案信息
  /**
   * 查询病史信息, 根据档案编码
   */
  queryMedical() {
    if (!this.profile) return;
    const queryMedical = {
      profileCode: this.profile['profileCode']
    };
    this.medicalInfo = [];
    this.medicalSvc.queryMedicalRecord(queryMedical, resp => {
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp.data.length === 0
      ) {
        // this.msg.warning('没有查到病史记录，请重试！');
        console.warn('没有查询到病史记录,请重试!');
        return;
      }
      this.medicalInfo = resp.data;
      this.printProfileData.contraInfo = [];
      this.printProfileData.allergyInfo = [];
      this.medicalInfo.forEach(item => {
        if (item.type === '1') {
          this.printProfileData.contraInfo.push(item);
        }
        if (item.type === '2') {
          this.printProfileData.allergyInfo.push(item);
        }
      });
    });
  }

  // 保存设置
  storageMedia() {
    this.setMedia['marginTop'] = this.marginTop;
    this.setMedia['marginLeft'] = this.marginLeft;
    this.msg.warning('保存设置成功');
  }

  /**
   * 打印接种记录
   */
  // 显示下一步按钮
  showStep(event) {
    this.vaccinateRecordData.showNextStep = event;
  }

  // 下一步
  nextStep() {
    // 设置医生
    this.settings['doctorName'] = this.doctorName;
    // 当前所选模板的所有页码
    this.vaccinateRecordData.allTitle = [
      ...this.vaccinateRecordData.pageTitles[this.chooseType]
    ];
    let recordData = this.recordModeData[this.chooseType];
    this.nextStepRecord(recordData);
    Object.assign(this.images, this.ahModeImg[this.chooseType]);
    this.vaccinateRecordData.prePage = false;
    this.msg.info('打印设置保存成功');
  }

  // 选择打印的模板
  savePrintModel(model: string) {
    // console.log('选择的模板', model);
    let recordData = this.recordModeData[model];
    this.nextStepRecord(recordData);
    Object.assign(this.images, this.ahModeImg[model]);
  }

  // 下一步筛选的数据
  nextStepRecord(data: any) {
    this.vaccinateRecordData.vaccRecordData = [];
    let blankPage = [];
    let tempRecord = [];
    let recordsArr = [];
    let historyRecordData = JSON.parse(
      JSON.stringify(this.vaccinateRecordData.historyRecordData)
    );
    // 给空白页的记录添加一个序号,便于打印顺序
    let order = 50;
    for (let j = 0; j < historyRecordData.length; j++) {
      const item = historyRecordData[j];
      if (item.checked) {
        let notEqualArr = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            recordsArr.push(...data[key]);
            // 得到接种本上存在的数据
            for (let i = 0; i < data[key].length; i++) {
              if (
                data[key][i].vaccineSubclassCodeArr.indexOf(
                  item.vaccineSubclassCode
                ) > -1 &&
                data[key][i].vaccinateInjectNumber ===
                item.vaccinateInjectNumber
              ) {
                item['sort'] = data[key][i].sort;
                tempRecord.push({ id: key, data: item });
              }
            }
          }
        }
        // 判断接种本上面没有的数据,但接种记录上面有的数据(接种本上面不匹配的放在空白页)
        for (let k = 0; k < recordsArr.length; k++) {
          // 判断接种本上面没有的数据,但接种记录上面有的数据
          if (
            recordsArr[k].vaccineSubclassCodeArr.indexOf(
              item.vaccineSubclassCode
            ) < 0
          ) {
            notEqualArr.push(item);
          }
          // 接种本上面有的数据,但是剂次不相同,这个时候就要打印在空白页(接种本上的剂次不同,但包含相同的小类)
          if (recordsArr[k].vaccineSubclassCodeArr.indexOf(item.vaccineSubclassCode) > -1 && recordsArr[k].vaccinateInjectNumber !== item.vaccinateInjectNumber) {
            notEqualArr.push(item);
          }
        }
        if (notEqualArr.length === recordsArr.length) {
          item['sort'] = order++;
          blankPage.push({ id: 'empty', data: item });
        }
      }
    }
    if (tempRecord.length) {
      this.vaccinateRecordData.vaccRecordData = this.transFormData(tempRecord);
    }
    if (blankPage.length) {
      this.vaccinateRecordData.vaccRecordData = [
        ...this.transFormData(tempRecord),
        ...this.transFormData(blankPage)
      ];
    }
    console.log('下一步的数据', this.vaccinateRecordData.vaccRecordData);
  }

  // 合并相同id的对象方法{id:"page1",data:{}]
  transFormData(dataArr: any) {
    let orgUserList = [];
    let arrData = JSON.parse(JSON.stringify(dataArr)); // 数据深拷贝
    arrData.forEach((item, index) => {
      if (!item.del) {
        let obj = {
          id: item.id,
          data: [item.data],
          index: item.id !== 'empty' ? Number(item.id.substr(4, item.id.length)) : 100 // 排序,空白页默认数值为100
        };
        // 设置个参数记录数据是否已经添加
        item.del = true;
        for (let i = index + 1; i < arrData.length; i++) {
          if (arrData[i].id === item.id) {
            obj.data.push(arrData[i].data);
            arrData[i].del = true; // 数据添加后设置为true
          }
        }
        orgUserList.push(obj); // 把处理好的对象添加到新数组
      }
    });
    // 升序排列
    orgUserList = orgUserList.sort((a, b) => a['index'] - b['index']);
    return orgUserList;
  }

  // 上一步
  preStep() {
    this.vaccinateRecordData.prePage = true;
    this.vaccinateRecordData.showNextStep = this.vaccinateRecordData.historyRecordData.some(
      item => item.checked === true
    );
    this.doctorName = 1;
    this.settings['doctorName'] = 1;
    this.settings['startLine'] = 1;
    this.settings['marginTop'] = 0;
    this.settings['marginLeft'] = 0;
  }

  // 获取最终打印的参数
  getPrintRecord(event) {
    // console.log(event);
    this.printRecord = [];
    this.currentPage = '';
    this.printRecord = event.printRecord;
    this.currentPage = event.currentPage;
  }

  // 保存设置
  saveSetting() {
    this.settings['doctorName'] = this.doctorName;
    this.msg.info('打印设置保存成功');
  }

  /**
   *打印接种记录
   * @preview 是否预览 true预览 false打印
   * */
  prints(preview: boolean) {
    if (!this.printRecord.length) {
      this.msg.warning('请选择需要打印的记录');
      return;
    } else {
      let printData = [];
      for (let i = 0; i < this.printRecord.length; i++) {
        // 单条接种记录
        const singleRecord = { ...this.printRecord[i] };
        // 将需要打印的数据进行处理接种记录里面的code转换为名称
        singleRecord.vaccinateTime = DateUtils.formatToDate(
          this.printRecord[i].vaccinateTime
        );
        // 有效期日期的转换
        if (singleRecord.loseEfficacyDate) {
          singleRecord.loseEfficacyDate = DateUtils.formatToDate(this.printRecord[i].loseEfficacyDate);
        }
        this.transformSvc
          .transformPovName(this.printRecord[i].actualVaccinatePovCode)
          .subscribe(resp => {
            if (resp) {
              singleRecord.actualVaccinatePovCode = resp;
            }
          });
        singleRecord.vaccineManufactureCode = this.transformSvc.transformManufacture(
          this.printRecord[i].vaccineManufactureCode
        );
        singleRecord['part'] = VaccRecordTransformService.transformPart(
          this.printRecord[i].vaccinatePart
        );
        if (this.printRecord[i].hasOwnProperty('vaccineBroadHeadingCode')) {
          singleRecord[
            'vaccineBroadHeadingName'
          ] = this.transformSvc.transformVaccinateName(
            this.printRecord[i].vaccineBroadHeadingCode
          );
        }
        printData.push(singleRecord);
      }
      this.lodopPrintSvc.setPrintVaccRecord(
        this.chooseType,
        this.currentPage,
        printData,
        this.images,
        this.settings
      );
      this.lodopPrintSvc.printRecord(preview);
    }
  }

  /**
   * 打印功能
   * @param preview
   */
  print(preview: boolean) {
    console.log(this.error);
    if (this.error) {
      return;
    }
    const printId = this.getPrintId();
    // console.log(printId);
    if (printId === '' || printId === undefined) {
      this.msg.info('没有内容，无法打印');
      return;
    }
    this.lodopPrintSvc.print(preview, printId, 20);
    // if (printId === 'receipt') {
    //   console.log(this.receiptTemplateJson);
    //   const content = this.receiptMockData.anhui;
    //   this.lodopPrintSvc.setPrintReceiptContent(
    //     this.receiptTemplateJson.template,
    //     content,
    //     '34'
    //   );
    //   this.lodopPrintSvc.print(preview, this.receiptTemplateJson.id, 20);
    // } else {
    //   this.lodopPrintSvc.print(preview, printId, 20);
    // }
  }

  /*
   * 打印个案信息
   * */
  printChildCase(isPreview: boolean) {
    if (!this.profile) return;
    let contentJSON = {
      profileCode: this.profile.profileCode,
      idCardNo: this.profile.idCardNo,
      birthCardNo: this.profile.birthCardNo,
      name: this.profile.name,
      birthWeight: this.profile.birthWeight,
      liveDetail: this.profile.liveDetail,
      idCardDetail: this.profile.idCardDetail
    };
    if (this.profile.gender === 'm') {
      contentJSON['gender'] = '男';
      if (this.idType === 'sh2018') {
        contentJSON['woman'] = '';
        contentJSON['man'] = '✔';
      }
    } else {
      contentJSON['gender'] = '女';
      if (this.idType === 'sh2018') {
        contentJSON['woman'] = '✔';
        contentJSON['man'] = '';
      }
    }
    if (this.idType === 'sh2018') {
      if (this.profile.idCardType === '2') {
        contentJSON['selfCity'] = '✔';
        contentJSON['otherCity'] = '';
      } else {
        contentJSON['selfCity'] = '';
        contentJSON['otherCity'] = '✔';
      }
      if (this.childCaseInfo.povInfo) {
        contentJSON['povName'] = this.childCaseInfo.povInfo.name;
      }
      if (this.childCaseInfo.fatherInfo) {
        contentJSON['fatherName'] = this.childCaseInfo.fatherName;
        contentJSON[
          'fatherContactPhone'
          ] = this.childCaseInfo.fatherContactPhone;
      }
      if (this.childCaseInfo.motherInfo) {
        contentJSON['motherName'] = this.childCaseInfo.motherName;
        contentJSON[
          'motherContactPhone'
          ] = this.childCaseInfo.motherContactPhone;
      }
    }
    if (
      this.idType === 'ah2019Small' ||
      this.idType === 'ah2019bhMade' ||
      this.idType === 'ahNation'
    ) {
      if (this.childCaseInfo.fatherInfo) {
        contentJSON['fatherName'] = this.childCaseInfo.fatherName;
        contentJSON[
          'fatherContactPhone'
          ] = this.childCaseInfo.fatherContactPhone;
      }
      if (this.childCaseInfo.motherInfo) {
        contentJSON['motherName'] = this.childCaseInfo.motherName;
        contentJSON[
          'motherContactPhone'
          ] = this.childCaseInfo.motherContactPhone;
      }
      if (this.childCaseInfo.povInfo) {
        contentJSON['telephone'] = this.childCaseInfo.povInfo.telephone;
        contentJSON['povName'] = this.childCaseInfo.povInfo.name;
      }
      if (this.childCaseInfo.contraInfo.length) {
        contentJSON['contraindication'] = this.transformSvc.transform(
          this.childCaseInfo.contraInfo[0]['cartraindication'],
          'tabooType'
        );
      }
      if (this.childCaseInfo.allergyInfo.length) {
        contentJSON['allergies'] = this.transformSvc.transform(
          this.childCaseInfo.allergyInfo[0]['description'],
          'tabooType'
        );
      }
    } else {
      if (this.childCaseInfo.motherInfo) {
        if (this.childCaseInfo.motherInfo.relationshipCode === '2') {
          contentJSON['relationShip'] = '母亲';
          contentJSON['motherName'] = this.childCaseInfo.motherName;
        }
      }
      if (this.childCaseInfo.povInfo) {
        contentJSON['telephone'] = this.childCaseInfo.povInfo.telephone;
        contentJSON['povName'] = this.childCaseInfo.povInfo.name;
        contentJSON['injectUnit'] = this.childCaseInfo.povInfo.name;
      }
    }

    contentJSON['years'] = DateUtils.formatToDate(this.profile.birthDate).slice(
      0,
      4
    );
    contentJSON['month'] = DateUtils.formatToDate(this.profile.birthDate).slice(
      5,
      7
    );
    contentJSON['day'] = DateUtils.formatToDate(this.profile.birthDate).slice(
      8
    );
    contentJSON['newYears'] = DateUtils.formatToDate(new Date()).slice(0, 4);
    contentJSON['newMonth'] = DateUtils.formatToDate(new Date()).slice(5, 7);
    contentJSON['newDay'] = DateUtils.formatToDate(new Date()).slice(8);
    this.transformSvc
      .transformPovName(this.profile.birthHospitalCode)
      .subscribe(resp => {
        if (resp) {
          contentJSON['hospital'] = resp;
        }
      });
    if (this.profile.birthWeight) {
      contentJSON['birthWeight'] = (this.profile.birthWeight / 1000).toFixed(2);
    }
    if (this.profile.liveProvCode) {
      this.transformSvc
        .transformAdministrativeName(this.profile.liveProvCode)
        .subscribe(resp => {
          if (resp) {
            contentJSON['liveProvCode'] = resp;
          }
        });
    }
    if (this.profile.liveCityCode) {
      this.transformSvc
        .transformAdministrativeName(this.profile.liveCityCode)
        .subscribe(resp => {
          if (resp) {
            contentJSON['liveCityCode'] = resp;
          }
        });
    }
    if (this.profile.liveDistrictCode) {
      this.transformSvc
        .transformAdministrativeName(this.profile.liveDistrictCode)
        .subscribe(resp => {
          if (resp) {
            contentJSON['liveDistrictCode'] = resp;
          }
        });
    }
    if (this.profile.idCardProvCode) {
      this.transformSvc
        .transformAdministrativeName(this.profile.idCardProvCode)
        .subscribe(resp => {
          if (resp) {
            contentJSON['idCardProvCode'] = resp;
          }
        });
    }
    if (this.profile.idCardCityCode) {
      this.transformSvc
        .transformAdministrativeName(this.profile.idCardCityCode)
        .subscribe(resp => {
          if (resp) {
            contentJSON['idCardCityCode'] = resp;
          }
        });
    }
    if (this.profile.idCardDistrictCode) {
      this.transformSvc
        .transformAdministrativeName(this.profile.idCardDistrictCode)
        .subscribe(resp => {
          if (resp) {
            contentJSON['idCardDistrictCode'] = resp;
          }
        });
    }
    this.lodopPrintSvc.setChildCaseContent(
      this.modelImg[this.idType],
      contentJSON,
      this.idType,
      this.setMedia
    );
    this.lodopPrintSvc.printRecord(isPreview);
  }

  /**
   * tab 改变事件
   */
  changeTabEvent(ev: any) {
    // console.log(ev);
    this.recordBtn = ev.tabTitle === '接种记录';
    this.injectSheet = ev.tabTitle === '注射单';
    this.caseInfoBtn = ev.tabTitle === '个案信息';
    this.selectedTab = ev.tabTitle;
  }

  /**
   * 根据选择的tab 决定打印信息
   */
  getPrintId() {
    let printId = '';
    if (this.selectedTab === '告知书') {
      printId = this.agreementSelectedId;
    }
    if (this.selectedTab === '接种记录') {
      printId = '';
    }
    if (this.selectedTab === '个案信息') {
      printId = '';
    }
    if (this.selectedTab === '入托证明') {
      printId = 'school';
    }
    if (this.selectedTab === '注射单') {
      printId = '';
    }
    if (this.selectedTab === '档案信息') {
      printId = 'profile';
    }
    if (this.selectedTab === '收费票据') {
      printId = 'receipt';
    }
    if (this.selectedTab === '上海免疫接种卡') {
      printId = this.shanghaiImmunityCardId;
    }
    return printId;
  }

  // 获取接种记录
  getVacRecordInfo(page = 1, pageSize = 200) {
    if (!this.profile) return;
    // this.resetVacRecordData();
    // 表一
    let oneVaccRecord = [];
    // 表二
    let twoVaccRecord = [];
    // 表三
    let addVaccRecord = [];
    // vaccinateStatus为0的接种记录
    let historyRecord = [];
    const query = {
      profileCode: this.profile['profileCode'],
      pageEntity: { page: page, pageSize: pageSize }
    };
    this.vacApiSvc.queryVaccinateRecordSingle(query, queryData => {
      console.log('查询接种记录', queryData);
      if (queryData.code === 0) {
        // 获取接种记录的数据
        const vacRecordData = queryData.data;
        let shanghaiVacRecords = [];
        vacRecordData.forEach(item => {
          // 将接种状态为 已接种，接种记录状态为 在册的接种记录保存到上海的接种卡中vaccinateStatusCode
          if (item.vaccinateStatus === '3' && item.vaccinateStatusCode === '0') {
            shanghaiVacRecords.push(item);
          }
          // vaccineType 0 - 一类， 1 - 二类
          if (
            item.vaccinateStatus === '3' &&
            item.vaccineType === '0' &&
            item.vaccinateStatusCode === '0'
          ) {
            oneVaccRecord.push(item);
          }
          if (
            item.vaccinateStatus === '3' &&
            item.vaccineType === '1' &&
            item.vaccinateStatusCode === '0'
          ) {
            twoVaccRecord.push(item);
          }
          if (item.vaccinateStatus !== '3') {
            addVaccRecord.push(item);
          }
          /*打印的接种记录是只打印 0-在册的接种记录 recordStatusCode*/
          if (item.vaccinateStatusCode === '0') {
            historyRecord.push(item);
          }
        });
        this.schoolAttendCertification['oneVaccRecord'] = oneVaccRecord;
        this.schoolAttendCertification['twoVaccRecord'] = twoVaccRecord;
        this.schoolAttendCertification['addVaccRecord'] = addVaccRecord;
        // this.vaccinateRecordData['historyRecordData'] = historyRecord;
        this.shanghaiVacRecords = shanghaiVacRecords;
      } else {
        console.warn('未查到接种记录数据');
      }
    });
  }

  // 查询日常管理的接种记录
  // 获取受种人的接种记录(只查询在册的接种记录和接种完成的)
  queryVacRecordInfo() {
    if (!this.profile) return;
    if (this.loading) return;
    const query = {
      managePovCode: this.userInfo.pov,
      profileCode: this.profile.profileCode,
      vaccinateStatusCode: '0', // 在册状态
      pageEntity: {
        page: 1,
        pageSize: 200
      },
      sortBy: ['vaccinateTime,desc']
    };
    // console.log('接种记录参数2', query);
    this.vaccinateRecordData.historyRecordData = [];
    this.loading = true;
    this.adminSvc.queryVacRecord(query, resp => {
      this.loading = false;
      // console.log('接种记录2====', resp);
      if (resp && resp.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        this.vaccinateRecordData.historyRecordData = [...resp.data];
        this.vaccinateRecordData.historyRecordData.forEach(item => {
          item['vaccineBroadHeadingCode'] = item.vaccineSubclassCode.substr(0, 2);
        });
      } else {
        this.msg.warning('未查到接种记录数据');
        return;
      }
    });
  }

  /**
   * 关闭提示
   */
  closeAlert() {
    this.showError = false;
  }

  /**
   * 获取登录用户所在 pov的前6位，使用前六位的数字作为当前打印地区的编码
   */
  getCurDistrictCode() {
    this.schoolAttendCertification['curCityCode'] =
      this.userInfo.pov.substring(0, 4) + '00';
    this.schoolAttendCertification['curDistrictCode'] =
      this.userInfo.pov.substring(0, 6);
  }

  /**
   * 告知书模板选择了一个tab
   * @param tab
   */
  onSelectTab(tab) {
    this.agreementSelectedId = tab;
  }

  /**
   * 获取打印上海接种卡id
   * @param ev
   */
  onShanghaiPrint(ev) {
    this.shanghaiImmunityCardId = ev.id;
  }

}

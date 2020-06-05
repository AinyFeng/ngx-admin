import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import {
  INOCULATION_TYPE,
  ProfileDataService,
  MedicalHistoryService,
  LodopPrintService,
  PovInfoService,
  VaccRecordTransformService,
  DateUtils
} from '@tod/svs-common-lib';
import { ConfigService } from '@ngx-config/core';

@Component({
  selector: 'uea-print-child-case',
  templateUrl: './print-child-case.component.html',
  styleUrls: ['./print-child-case.component.scss']
})
export class PrintChildCaseComponent implements OnInit {
  error = false;
  printProfileData: any = {
    contraInfo: [], // 禁忌
    allergyInfo: [], // 过敏
    povInfo: {}, // pov
    fatherInfo: {},
    motherInfo: {}
  };
  // 上左页边距
  settings: any = {
    marginTop: 0,
    marginLeft: 0
  };
  marginTop = 0;
  marginLeft = 0;

  // 档案信息
  profile: any;
  userInfo: any;

  // 病史情况
  medicalInfo: any;

  // 默认为此类型
  chooseType = 'ah2019bhMade';
  vaccCertificateType = INOCULATION_TYPE; // 接种本的类型

  // 个案背景
  modelImg: any;

  constructor(
    private ref: NbDialogRef<PrintChildCaseComponent>,
    private profileDataSvc: ProfileDataService,
    private medicalSvc: MedicalHistoryService,
    private lodopPrintSvc: LodopPrintService,
    private povApiSvc: PovInfoService,
    private transformSvc: VaccRecordTransformService,
    private msg: NzMessageService,
    private configSvc: ConfigService
  ) {
    // 获取父母信息
    this.profileDataSvc.getParenets().subscribe(parents => {
      if (parents) {
        parents.forEach(p => {
          if (p['relationshipCode'] === '1') {
            this.printProfileData.fatherInfo = p;
          }
          if (p['relationshipCode'] === '2') {
            this.printProfileData.motherInfo = p;
          }
        });
      }
    });
    // 加载打印机
    this.lodopPrintSvc.getLodopStatus().subscribe(status => {
      this.error = status;
    });

    this.modelImg = this.configSvc.getSettings('child_case_info');
  }

  ngOnInit() {
    // 获取档案信息
    Object.assign(this.printProfileData, this.profile);
    // 查询病史
    this.queryMedical();
    // 查询pov信息
    this.getPovInfo();
    console.log(this.printProfileData);
  }

  closeAlert() {
    if (this.error) {
      this.error = false;
    }
  }

  close() {
    this.ref.close();
  }

  /**
   * 查询病史信息
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
        console.warn('没有查到病史记录');
        return;
      }
      this.medicalInfo = resp.data;
      this.printProfileData.contraInfo = [];
      this.printProfileData.allergyInfo = [];
      /*this.medicalInfo.forEach(item => {
        if (item.type === '1') {
          this.printProfileData.contraInfo.push(item);
        }
        if (item.type === '2') {
          this.printProfileData.allergyInfo.push(item);
        }
      });*/
    });
  }

  /**
   * 根据登录用户查询接种门诊的基本信息
   */
  getPovInfo() {
    const query = {
      povCode: this.userInfo.pov
    };
    this.povApiSvc.queryPovInfo(query, resp => {
      console.log('获取的povInfo', resp);
      if (resp.code === 0) {
        this.printProfileData.povInfo = resp.data[0];
      }
    });
  }

  // 选择接种本
  savePrintModel(ev) {
    this.chooseType = ev;
  }

  // 保存设置
  saveSetting() {
    this.settings['marginTop'] = this.marginTop;
    this.settings['marginLeft'] = this.marginLeft;
    this.msg.warning('保存设置成功');
  }

  // 打印
  print(isPreview: boolean) {
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
      if (this.chooseType === 'sh2018') {
        contentJSON['woman'] = '';
        contentJSON['man'] = '✔';
      }
    } else {
      contentJSON['gender'] = '女';
      if (this.chooseType === 'sh2018') {
        contentJSON['woman'] = '✔';
        contentJSON['man'] = '';
      }
    }
    if (this.chooseType === 'sh2018') {
      if (this.profile.idCardType === '2') {
        contentJSON['selfCity'] = '✔';
        contentJSON['otherCity'] = '';
      } else {
        contentJSON['selfCity'] = '';
        contentJSON['otherCity'] = '✔';
      }
      if (this.printProfileData.povInfo) {
        contentJSON['povName'] = this.printProfileData.povInfo.name;
      }
      if (this.printProfileData.fatherInfo) {
        contentJSON['fatherName'] = this.printProfileData.fatherName;
        contentJSON[
          'fatherContactPhone'
          ] = this.printProfileData.fatherInfo.contactPhone;
      }
      if (this.printProfileData.motherInfo) {
        contentJSON['motherName'] = this.printProfileData.motherName;
        contentJSON[
          'motherContactPhone'
          ] = this.printProfileData.motherInfo.contactPhone;
      }
    }
    if (
      this.chooseType === 'ah2019Small' ||
      this.chooseType === 'ah2019bhMade' ||
      this.chooseType === 'ahNation'
    ) {
      if (this.printProfileData.fatherInfo) {
        contentJSON['fatherName'] = this.printProfileData.fatherName;
        contentJSON[
          'fatherContactPhone'
          ] = this.printProfileData.fatherContactPhone;
      }
      if (this.printProfileData.motherInfo) {
        contentJSON['motherName'] = this.printProfileData.motherName;
        contentJSON[
          'motherContactPhone'
          ] = this.printProfileData.motherContactPhone;
      }
      if (this.printProfileData.contraInfo.length) {
        contentJSON['contraindication'] = this.transformSvc.transform(
          this.printProfileData.contraInfo[0]['cartraindication'],
          'tabooType'
        );
      }
      if (this.printProfileData.allergyInfo.length) {
        contentJSON['allergies'] = this.transformSvc.transform(
          this.printProfileData.allergyInfo[0]['description'],
          'tabooType'
        );
      }
      if (this.printProfileData.povInfo) {
        contentJSON['telephone'] = this.printProfileData.povInfo.telephone;
        contentJSON['povName'] = this.printProfileData.povInfo.name;
      }
    } else if (this.chooseType === 'ah2016' || this.chooseType === 'ah2017') {
      if (this.printProfileData.motherInfo) {
        if (this.printProfileData.motherInfo.relationshipCode === '2') {
          contentJSON['relationShip'] = '母亲';
          contentJSON['motherName'] = this.printProfileData.motherName;
        }
      }
      if (this.printProfileData.povInfo) {
        contentJSON['telephone'] = this.printProfileData.povInfo.telephone;
        contentJSON['povName'] = this.printProfileData.povInfo.name;
        contentJSON['injectUnit'] = this.printProfileData.povInfo.name;
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
      this.modelImg[this.chooseType],
      contentJSON,
      this.chooseType,
      this.settings
    );
    this.lodopPrintSvc.printRecord(isPreview);
  }
}

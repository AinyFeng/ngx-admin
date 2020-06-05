import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { ApiService } from '../api/api.service';
import {
  ADMINISTRATION_URLS_ADMIN,
  IOT_URLS,
  MASTER_URLS,
  SYSTEM_URLS,
  VACCINATE_STRATEGY_URLS,
  FIXED_ASSETS_URLS, PROFILE_URLS
} from '../api/url-params.const';
import { LOCAL_STORAGE } from '../base/localStorage.base';
import { AdministrativeService } from './administrative.service';
import { AefiCodeService } from './aefi.code.service';
import { AgreementService } from './agreement.service';
import { CommunityDataService } from './community-data.service';
import { DepartmentInitService } from './department.init.service';
import { DicDataService } from './dic.data.service';
import { IotInitService } from './iot.init.service';
import { NationDataInitService } from './nation.data.init.service';
import { SysConfInitService } from './sys-conf.init.service';
import { VaccBatchNoDataService } from './vacc-batch-no.data.service';
import { VaccBroadHeadingDataService } from './vacc-broad-heading.data.service';
import { VaccManufactureDataService } from './vacc-manufacture.data.service';
import {FixedAssetsDataService} from './fixed-assets.data.service';
import { VaccinatePovService } from './vaccinate-pov.service';
import { VaccineSubclassInitService } from './vaccine.subclass.init.service';
import { WorkingDayInitService } from './working.day.init.service';
import { SmsModelDicInitService } from './sms-model-dic.init.service';
import { UserService } from '@tod/uea-auth-lib';
import { zip } from 'rxjs';
import { PovStaffInitService } from './pov.staff.init.service';
import { DiseaseCategoryInitService } from './disease.category.init.service';
import { PovDataInit } from './pov.data.init';
import {RabiesStrategyProgramService} from './rabies.strategy.program.service';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  private userInfo;

  constructor(
    private dicSvc: DicDataService,
    private nationSvc: NationDataInitService,
    private api: ApiService,
    private localSt: LocalStorageService,
    private vaccineInitSvc: VaccineSubclassInitService,
    private batchNoSvc: VaccBatchNoDataService,
    private manufactureDataSvc: VaccManufactureDataService,
    private vaccBroadHeadingSvc: VaccBroadHeadingDataService,
    private vacPov: VaccinatePovService,
    private communitySvc: CommunityDataService,
    private admSvc: AdministrativeService,
    // private aefiSvc: AefiCodeService,
    private agreementSvc: AgreementService,
    private workingDaySvc: WorkingDayInitService,
    private departmentInitSvc: DepartmentInitService,
    private iotInitSvc: IotInitService,
    private sysConfInitService: SysConfInitService,
    private userSvc: UserService,
    private smsModelDicInitSvc: SmsModelDicInitService,
    private povStaffInitSvc: PovStaffInitService,
    private diseaseInitSvc: DiseaseCategoryInitService,
    private povInfoInitSvc: PovDataInit,
    private fixedAssetSvc: FixedAssetsDataService,
    private rabiesStrategySvc: RabiesStrategyProgramService
  ) {
  }

  start() {
    this.userSvc.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      if (resp) {
        this.load();
      }
    });
  }

  load() {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    zip(
      // 请求字典数据表，字典表数据不需要传任何额参数
      this.api.post(MASTER_URLS.queryDictionary, {}),
      this.api.post(MASTER_URLS.queryNationBaseInfo, {}), // 查询民族数据也不需要任何参数
      this.api.post(MASTER_URLS.queryVaccineSubclass, {
        pageEntity: { page: 1, pageSize: 1000 }
      }), // 疫苗小类信息，需要全部数据，暂时限定1000个
      // this.api.post(MASTER_URLS.queryBatchInfo, { page: 1, pageSize: 300 }),
      this.api.post(MASTER_URLS.queryManufacturerBaseInfo, {
        pageEntity: { page: 1, pageSize: 1000 }
      }), // 疫苗生产厂家数据
      // this.api.post(MASTER_URLS.queryVaccineBroadHeading, { pageEntity: { page: 1, pageSize: 100 } }), // 查询大类编码
      this.api.post(MASTER_URLS.queryVaccineBroadHeading, {
        page: 1,
        pageSize: 100
      }), // 目前查询大类编码还没有修改接口查询参数
      // this.api.post(MASTER_URLS.queryPovInfo, { page: 1, pageSize: 200 }),
      this.api.post(MASTER_URLS.queryCommunityBaseInfo, {
        povCode: this.userInfo['pov']
      }),
      this.api.get(MASTER_URLS.queryAdministrativeDivisionTreeData),
      this.api.get(MASTER_URLS.queryAdministrativeDivisionTreeLineData),
      // this.api.get(MASTER_URLS.queryAefiCodeAll),
      this.api.post(MASTER_URLS.queryVaccineAgreementModel, {}),
      this.api.post(SYSTEM_URLS.searchWorkingDay, {
        povCode: this.userInfo.pov,
        useAble: '1'
      }),
      this.api.post(MASTER_URLS.queryDepartmentInfo, {
        belongPovCode: this.userInfo.pov
      }),
      // 获取部门的数据
      this.api.post(IOT_URLS.queryIotFacilityQueue, {
        povCode: this.userInfo.pov,
        facilityStatus: ['0']
      }),
      this.api.get(SYSTEM_URLS.getConf + `/${this.userInfo.pov}`),
      // 获取短信模板的字典表
      this.api.post(ADMINISTRATION_URLS_ADMIN.querySmsTemplateDic, {}),
      this.api.post(MASTER_URLS.queryPovStaff, {
        povCode: this.userInfo.pov
      }),
      this.api.get(VACCINATE_STRATEGY_URLS.queryDiseaseCategory),
      this.api.post(MASTER_URLS.queryPovInfo, {
        povCode: this.userInfo.pov
      }),
      // 获取固定资产
      this.api.post(FIXED_ASSETS_URLS.queryFixedAssets, {
        povCode: this.userInfo.pov
      }),
      // 获取犬伤接种方案
      this.api.post(PROFILE_URLS.getStrategy, {'diseaseCategoryCode': '28'})
    ).subscribe(
      ([
         dicData,
         nationData,
         vaccineSubClassData,
         manufactureData,
         vacBroadData,
         communityData,
         adminData,
         adminTreeNode,
         // aefiCodeData,
         agreementData,
         workingDayData,
         departmentData,
         iotData,
         sysConfData,
         smsModelDicData,
         povStaffData,
         diseaseCategoryData,
         povData,
         assetsData,
         rabiesProgramData
       ]: any) => {
        if (
          dicData.code === 0 &&
          dicData.hasOwnProperty('data') &&
          dicData['data'].length !== 0
        ) {
          // console.log('设置字典表数据', dicData.data);
          this.dicSvc.setDicData(dicData.data);
          this.localSt.store(LOCAL_STORAGE.DIC_DATA, dicData.data);
        }

        if (
          nationData.code === 0 &&
          nationData.hasOwnProperty('data') &&
          nationData['data'].length !== 0
        ) {
          // console.log('设置民族数据');
          this.nationSvc.setNationData(nationData.data);
          this.localSt.store(LOCAL_STORAGE.NATION_DATA, nationData.data);
        }

        if (
          vaccineSubClassData.code === 0 &&
          vaccineSubClassData.hasOwnProperty('data') &&
          vaccineSubClassData['data'].length !== 0
        ) {
          // console.log('设置疫苗产品子类数据', vaccineSubClassData);
          this.vaccineInitSvc.setVaccineSubClassData(
            vaccineSubClassData.data
          );
          this.localSt.store(
            LOCAL_STORAGE.VACCINE_SUBCLASS,
            vaccineSubClassData.data
          );
        }

        // if (batchNoData.code === 0 && batchNoData.hasOwnProperty('data') && batchNoData['data'].length !== 0) {
        //   // console.log('产品批号数据', batchNoData);
        //   this.batchNoSvc.setVaccProductBatchNo(batchNoData.data);
        //   this.localSt.store(LOCAL_STORAGE.VACC_PRODUCT_BATCH_NO, batchNoData.data);
        // }

        if (
          manufactureData.code === 0 &&
          manufactureData.hasOwnProperty('data') &&
          manufactureData['data'].length !== 0
        ) {
          // console.log('产品厂商数据', manufactureData);
          this.manufactureDataSvc.setVaccProductManufactureData(
            manufactureData.data
          );
          this.localSt.store(
            LOCAL_STORAGE.VACC_PRODUCT_MANUFACTURE,
            manufactureData.data
          );
        }

        if (vacBroadData.code === 0 && vacBroadData.hasOwnProperty('data')) {
          // console.log('产品大类数据', vacBroadData);
          this.vaccBroadHeadingSvc.setVaccBoradHeadingData(vacBroadData.data);
          this.localSt.store(
            LOCAL_STORAGE.VACC_BROAD_HEADING,
            vacBroadData.data
          );
        }

        // 接种pov 的信息是需要按需查询
        // if (povData.code === 0 && povData.hasOwnProperty('data')) {
        //   // console.log('接种pov数据', povData);
        //   this.vacPov.setVaccPovData(povData.data);
        //   this.localSt.store(LOCAL_STORAGE.VACC_POV, povData.data);
        // }

        if (
          communityData.code === 0 &&
          communityData.hasOwnProperty('data')
        ) {
          // console.log('获取社区数据', communityData);
          this.communitySvc.setCommunityData(communityData.data);
          this.localSt.store(
            LOCAL_STORAGE.COMMUNITY_DATA,
            communityData.data
          );
        }

        if (adminData.code === 0 && adminData.hasOwnProperty('data')) {
          // console.log('行政区划数据', adminData);
          this.admSvc.setAdministrativeData(adminData.data);
          this.localSt.store(
            LOCAL_STORAGE.ADMINISTRATIVE_DATA,
            adminData.data
          );
        }

        if (
          adminTreeNode.code === 0 &&
          adminTreeNode.hasOwnProperty('data')
        ) {
          // console.log('行政区划树形节点数据', adminData);
          this.admSvc.setAdministrativeTreeData(adminTreeNode.data);
          this.localSt.store(
            LOCAL_STORAGE.ADMINISTRATIVE_TREE_DATA,
            adminTreeNode.data
          );
        }

        // if (aefiCodeData.code === 0 && aefiCodeData.hasOwnProperty('data')) {
        //   // console.log('aefi字典表数据', aefiCodeData);
        //   this.aefiSvc.setAefiData(aefiCodeData.data);
        //   this.localSt.store(LOCAL_STORAGE.AEFI_DATA, aefiCodeData.data);
        // }

        if (
          agreementData.code === 0 &&
          agreementData.hasOwnProperty('data')
        ) {
          // console.log('告知书数据', agreementData);
          this.agreementSvc.setAgreementData(agreementData.data);
          this.localSt.store(
            LOCAL_STORAGE.AGREEMENT_MODAL,
            agreementData.data
          );
        }

        if (
          workingDayData.code === 0 &&
          workingDayData.hasOwnProperty('data')
        ) {
          // 工作日数据
          this.workingDaySvc.setWorkingDayData(workingDayData.data);
        }
        if (
          departmentData.code === 0 &&
          departmentData.hasOwnProperty('data')
        ) {
          // 获取科室
          this.departmentInitSvc.setDepartmentData(departmentData.data);
          this.localSt.store(
            LOCAL_STORAGE.DEPARTMENT_DATA,
            departmentData.data
          );
        }
        if (iotData.code === 0 && iotData.hasOwnProperty('data')) {
          // iot 数据
          this.iotInitSvc.setIotData(iotData.data);
          this.localSt.store(LOCAL_STORAGE.IOT_DATA, iotData.data);
        }

        if (sysConfData.code === 0 && sysConfData.hasOwnProperty('data')) {
          // 系统配置数据
          this.sysConfInitService.setSysConfData(sysConfData.data);
        }
        // 短信模板字典表数据
        if (smsModelDicData.code === 0 && smsModelDicData.hasOwnProperty('data')) {
          // console.log(smsModelDicData.data);
          this.smsModelDicInitSvc.setSmsModelDic(smsModelDicData.data);
          this.localSt.store(LOCAL_STORAGE.SMS_MODEL_DIC, smsModelDicData.data);
        }
        // pov 门诊医护人员信息
        if (povStaffData.code === 0 && povStaffData.hasOwnProperty('data')) {
          // console.log(povStaffData.data);
          this.povStaffInitSvc.setPovStaffData(povStaffData.data);
        }
        // pov 疾病大类编码
        if (diseaseCategoryData.code === 0 && diseaseCategoryData.hasOwnProperty('data')) {
          // console.log(diseaseCategoryData.data);
          this.diseaseInitSvc.setDiseaseCategoryData(diseaseCategoryData.data);
          this.localSt.store(LOCAL_STORAGE.DISEASE_CATEGORY, diseaseCategoryData.data);
        }
        // pov 门诊信息
        if (povData.code === 0 && povData.hasOwnProperty('data')) {
          // console.log(diseaseCategoryData.data);
          this.povInfoInitSvc.setPovData(povData.data[0]);
          this.localSt.store(LOCAL_STORAGE.VACC_POV, povData.data[0]);
        }
        // 获取固定资产
        if (
          assetsData.code === 0 &&
          assetsData.hasOwnProperty('data') &&
          assetsData['data'].length !== 0
        ) {
          // console.log('固定资产数据', assetsData);
          this.fixedAssetSvc.setFixedAssetsData(
            assetsData.data
          );
          this.localSt.store(
            LOCAL_STORAGE.FIXED_ASSETS,
            assetsData.data
          );
        }
        // 获取犬伤接种方案rabiesProgramData
        if (
          rabiesProgramData.code === 0 &&
          rabiesProgramData.hasOwnProperty('data') &&
          rabiesProgramData['data'].length !== 0
        ) {
          // console.log('获取犬伤接种方案数据', rabiesProgramData);
          this.rabiesStrategySvc.setProgramsData(
            rabiesProgramData.data
          );
          this.localSt.store(
            LOCAL_STORAGE.RABIES_INJECT_STRATEGY,
            assetsData.data
          );
        }

      }
    );
  }
}

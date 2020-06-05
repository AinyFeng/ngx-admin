import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { ApiService } from '../api/api.service';
import {
  MASTER_URLS, PLATFORM_MASTER,
} from '../api/url-params.const';
import { LOCAL_STORAGE } from '../base/localStorage.base';
import { AdministrativeService } from '../service/administrative.service';
import { DicDataService } from '../service/dic.data.service';
import { NationDataInitService } from '../service/nation.data.init.service';
import { VaccBroadHeadingDataService } from '../service/vacc-broad-heading.data.service';
import { VaccManufactureDataService } from '../service/vacc-manufacture.data.service';
import { VaccineSubclassInitService } from '../service/vaccine.subclass.init.service';
import { UserService } from '@tod/uea-auth-lib';
import { zip } from 'rxjs';
import { InitPlatformTreenodeService } from '../coldchain-service/init-platform-treenode.service';
import { DEVICE_URLS } from '../coldchain-service/coldchain-url-params.const';
import { PovDataInit } from '../service/pov.data.init';
import { PovStaffInitService } from '../service/pov.staff.init.service';
import { PlatformOfficeInit } from '../service/platform.office.init.service';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class VacstockStartupService {
  private userInfo;

  constructor(
    private dicSvc: DicDataService,
    private nationSvc: NationDataInitService,
    private api: ApiService,
    private localSt: LocalStorageService,
    private vaccineInitSvc: VaccineSubclassInitService,
    private manufactureDataSvc: VaccManufactureDataService,
    private vaccBroadHeadingSvc: VaccBroadHeadingDataService,
    private admSvc: AdministrativeService,
    private userSvc: UserService,
    private platFormTreeInitSvc: InitPlatformTreenodeService,
    private povInitSvc: PovDataInit,
    private povStaffInitSvc: PovStaffInitService,
    private officeDataInitSvc: PlatformOfficeInit
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
      this.api.get(MASTER_URLS.queryAdministrativeDivisionTreeData),
      this.api.get(MASTER_URLS.queryAdministrativeDivisionTreeLineData),
      this.api.get(DEVICE_URLS.queryStockTreeDataByCityCode + '/' + this.userInfo.pov.substr(0, 4)),
      this.api.post(MASTER_URLS.queryPovInfo, { povCode: this.userInfo.pov }),
      this.api.get(PLATFORM_MASTER.queryPlatformOffice + '/' + this.userInfo.pov),
      this.api.post(MASTER_URLS.queryPovStaff, { povCode: this.userInfo.pov }),
    ).subscribe(
      ([
         dicData,
         nationData,
         vaccineSubClassData,
         manufactureData,
         vacBroadData,
         adminData,
         adminTreeNode,
         treeData,
         povData,
         officeData,
         povStaffData
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

        // 市平台组织树数据
        if (treeData.code === 0 && treeData.hasOwnProperty('data')) {
          this.platFormTreeInitSvc.setNzTreeNodes(treeData.data);
          this.localSt.store(LOCAL_STORAGE.PLATEFORM_TREE_DATA, treeData.data);
        }

        // pov 门诊基本信息
        if (povData.code === 0 && officeData.hasOwnProperty('data')) {
          this.povInitSvc.setPovData(povData.data[0]);
          this.localSt.store(LOCAL_STORAGE.VACC_POV, povData.data[0]);
        }

        // office 行政区划数据
        if (officeData.code === 0 && officeData.hasOwnProperty('data')) {
          this.officeDataInitSvc.setOfficeData(officeData.data[0]);
          this.localSt.store(LOCAL_STORAGE.PLATFORM_OFFICE, officeData.data[0]);
        }

        // pov 门诊员工数据
        if (povStaffData.code === 0 && povStaffData.hasOwnProperty('data')) {
          this.povStaffInitSvc.setPovStaffData(povStaffData.data);
          this.localSt.store(LOCAL_STORAGE.POV_STAFF, povStaffData.data);
        }
      }
    );
  }
}

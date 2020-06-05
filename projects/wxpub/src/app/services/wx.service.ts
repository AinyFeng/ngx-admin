import {Injectable} from '@angular/core';
import {ApiService, WX_URLS} from '@tod/svs-common-lib';

@Injectable({providedIn: 'root'})
export class WxService {
  constructor(private api: ApiService) {
  }

  /**
   *  查询字典表数据信息
   */
  queryDictionary(params: any, func: Function) {
    this.api
      .post(WX_URLS.queryDictionary, params)
      .subscribe(result => func(result));
  }

  /**
   *  查询行政区划数据树形结构数据
   */
  queryAdministrativeData(params: any, func: Function) {
    this.api
      .get(WX_URLS.queryAdministrativeData, params)
      .subscribe(result => func(result));
  }

  /**
   *  查询民族表数据
   */
  queryNationBaseInfo(params: any, func: Function) {
    this.api
      .post(WX_URLS.queryNationBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   *  查询医院列表
   */
  queryHospitalBaseInfo(params: any, func: Function) {
    this.api
      .post(WX_URLS.queryHospitalBaseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   *  发送短信验证码
   */
  sendSms(params: any, func: Function) {
    this.api.post(WX_URLS.sendSms, params).subscribe(result => func(result));
  }

  /**
   *  添加自助建档信息
   */
  addProfile(params: any, func: Function) {
    this.api.post(WX_URLS.addProfile, params).subscribe(result => func(result));
  }

  /**
   *  查询自助建档(列表)信息
   */
  queryProfileList(params: any, func: Function) {
    this.api
      .post(WX_URLS.queryProfile, params)
      .subscribe(result => func(result));
  }

  /**
   *  查询自助建档详情
   */
  queryProfileInfo(params: any, func: Function) {
    this.api
      .post(WX_URLS.queryProfile, params)
      .subscribe(result => func(result));
  }

  /**
   *  删除档案
   */
  deleteProfile(params: any, func: Function) {
    this.api
      .del(WX_URLS.deleteProfile + '/' + params, params)
      .subscribe(result => func(result));
  }

  /**
   *  查询自助建档信息Count
   */
  querySelfProfileCount(params: any, func: Function) {
    this.api
      .post(WX_URLS.querySelfProfileCount, params)
      .subscribe(result => func(result));
  }

  /**
   *  添加成人自助建档信息
   */
  addAdultProfile(params: any, func: Function) {
    this.api
      .post(WX_URLS.addAdultProfile, params)
      .subscribe(result => func(result));
  }

  /**
   *  根据用户账户查询预约的记录
   */
  queryAppointRecord(params: any, func: Function) {
    this.api
      .post(WX_URLS.queryAppointRecord, params)
      .subscribe(result => func(result));
  }

  /**
   *  存储预约签字信息
   */
  saveSignatureInfo(params: any, func: Function) {
    this.api
      .post(WX_URLS.saveSignatureInfo, params)
      .subscribe(result => func(result));
  }

  /**
   *  预约改期
   */
  changeAppoint(params: any, func: Function) {
    this.api
      .post(WX_URLS.changeAppoint, params)
      .subscribe(result => func(result));
  }

  /**
   *  根据预约时间获取一周可预约时间
   */
  getNextWorkingDay(params: any, func: Function) {
    this.api
      .post(WX_URLS.getNextWorkingDay, params)
      .subscribe(result => func(result));
  }

  /**
   *  根据日期查询可预约时段
   */
  getWorkingTimeByDate(params: any, func: Function) {
    this.api
      .post(WX_URLS.getWorkingTimeByDate, params)
      .subscribe(result => func(result));
  }

  /**
   *  根据条件查询告知书模板信息
   */
  queryAgreementModel(params: any, func: Function) {
    this.api
      .get(WX_URLS.queryAgreementModel, params)
      .subscribe(result => func(result));
  }

  /**
   *  日常管理接种记录查询
   */
  queryVaccinateRecord(params: any, func: Function) {
    this.api
      .post(WX_URLS.queryVaccinateRecord, params)
      .subscribe(result => func(result));
  }

  /**
   *  查询我的关注儿童列表
   */
  queryAttendList(params: any, func: Function) {
    this.api
      .post(WX_URLS.queryAttendList, params)
      .subscribe(result => func(result));
  }

  /**
   *  插入关注绑定数据
   */
  insertAttend(params: any, func: Function) {
    this.api
      .post(WX_URLS.insertAttend, params)
      .subscribe(result => func(result));
  }

  /**
   *  添加一条接种反馈
   */
  addOneObserveRecord(params: any, func: Function) {
    this.api
      .post(WX_URLS.addSelfObserveRecord, params)
      .subscribe(result => func(result));
  }

  /**
   *  查询接种反馈记录（自观记录）相关信息
   */
  queryObserveRecordList(params: any, func: Function) {
    this.api
      .post(WX_URLS.querySelfObserveRecordContent, params)
      .subscribe(result => func(result));
  }

  /**
   *  上传图片
   */
  uploadFile(params: any, func: Function) {
    this.api
      .post(WX_URLS.uploadFile, params, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      .subscribe(result => func(result));
  }

  resourceHandler(url: string, func: Function) {
    this.api.get(WX_URLS.serveFiles + url).subscribe(result => func(result));
  }

  getHFTongInfo(params: any, func: Function) {
    this.api
      .get('/hft/soical-hefei/static/index/api/hefeitong/getUserInfo', params)
      .subscribe(result => func(result));
  }
}


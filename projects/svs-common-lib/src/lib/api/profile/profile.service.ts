import { Injectable, Query } from '@angular/core';
import { ApiService } from '../api.service';
import { PROFILE_URLS } from '../url-params.const';
import { PageEntity } from '../entity/page.entity';
import { Observable, zip, forkJoin } from 'rxjs';

@Injectable()

/**
 * 档案操作相关请求service
 * 包括：档案存储、档案修改、档案删除
 */
export class ProfileService {
  constructor(private api: ApiService) {
  }

  /**
   * 档案存储 - 儿童档案
   * @param profile 档案数据，档案数据存储实体类，并非单一 profile实体
   * @param fun 回调函数
   */
  saveProfile(profile: any, fun: Function) {
    this.api
      .post(PROFILE_URLS.saveProfileByEntity, profile)
      .subscribe(result => fun(result));
  }

  /**
   * 保存成人档案
   * @param profile
   * @param func
   */
  saveAdultProfile(profile: any, func: Function) {
    this.api
      .post(PROFILE_URLS.saveProfile, profile)
      .subscribe(result => func(result));
  }

  /**
   * 更新成人档案信息
   * @param profile
   * @param func
   */
  updateAdultProfile(profile: any, func: Function) {
    this.api
      .put(PROFILE_URLS.updateAdultProfile, profile)
      .subscribe(result => func(result));
  }

  /**
   * 查询档案信息
   * @param profile
   * @param fun
   */
  queryProfile(profile: any, fun: Function) {
    this.api
      .post(PROFILE_URLS.queryProfile, profile)
      .subscribe(result => fun(result));
  }

  /**
   * 结合isHaveLocalProfilePipe管道查询数据库中是否含有该数据
   * @param profile
   */
  queryProfile2(profile: any): Observable<any> {
    return this.api.post(PROFILE_URLS.queryProfile, profile);
  }

  /**
   * 更新儿童档案信息，目前包括档案信息和监护人信息，没有免疫接种卡信息
   * @param profile
   * @param func
   */
  updateChildProfile(profile: any, func: Function) {
    this.api
      .put(PROFILE_URLS.updateChildProfile, profile)
      .subscribe(result => func(result));
  }

  /**
   * 统计档案信息
   * @param profile
   * profile 查询格式如下：
   * { condition: [{key: "name", value: "dick"，logic:"="},
   * {key:"birth_date", value:"2019-05-06", logic:">"},
   * {key:"birth_date", value:"2019-05-06", logic:"<"}]
   * @param func
   */
  countProfile(profile: any, func: Function) {
    this.api
      .post(PROFILE_URLS.countProfile, profile)
      .subscribe(result => func(result));
  }

  /**
   * 二合一接口，既查询数据，又统计数据总数
   */
  queryProfileAndCount(profile: any, func: Function) {
    zip(
      this.api.post(PROFILE_URLS.queryProfile, profile),
      this.api.post(PROFILE_URLS.countProfile, profile)
    ).subscribe(([queryData, countData]) => func(queryData, countData));
  }

  /**
   * 通过pathparam 查询档案信息
   * @param queryString
   * @param query
   * @param func
   */
  queryProfileByStr(queryString: string, query: PageEntity, func: Function) {
    forkJoin([
      this.api.post(PROFILE_URLS.queryProfile + '/' + queryString, query),
      this.api.get(PROFILE_URLS.countProfile + '/' + queryString)
    ]).subscribe(result => func(result));
  }

  /**
   * 通过pathparam 查询档案信息，不需要count
   * @param queryString
   * @param query
   * @param func
   */
  queryProfileByStrWithoutCount(
    queryString: string,
    query: PageEntity,
    func: Function
  ) {
    this.api
      .post(PROFILE_URLS.queryProfile + '/' + queryString, query)
      .subscribe(result => func(result));
  }

  queryProfileByGuardianIdCardNo(guardianIdCardNo: string, func: Function) {
    this.api
      .get(PROFILE_URLS.queryProfileByGuardianIdCardNo + '/' + guardianIdCardNo)
      .subscribe(ret => func(ret));
  }

  /**
   * 儿童自助建档查询接口
   * @profileId 自助建档编号
   * */
  queryChildSelfProfile(profileId: string, func: Function) {
    this.api
      .get(PROFILE_URLS.childSelfProfile + profileId + '.do')
      .subscribe(result => func(result));
  }

  /**
   * 成人建档查询接口
   * @profileId 自助建档编号
   * */
  queryAdultSelfProfile(profileId: string, func: Function) {
    this.api
      .get(PROFILE_URLS.adultSelfProfile + profileId + '.do')
      .subscribe(result => func(result));
  }

  queryCaseImmigrationByBaseInfo(caseParam: any, func: Function) {
    this.deleteEmptyProperty(caseParam);
    this.api.get(PROFILE_URLS.caseImmigrationQueryByBaseInfo + '/' + caseParam.povCode, caseParam).subscribe(result => func(result));
  }

  queryCaseImmigrationByCardNumber(caseParam: any, func: Function) {
    this.deleteEmptyProperty(caseParam);
    this.api.get(PROFILE_URLS.caseImmigrationQueryByCardNumber + '/' + caseParam.povCode, caseParam).subscribe(result => func(result));
  }

  commitCaseImmigration(caseParam: any, func: Function) {
    this.deleteEmptyProperty(caseParam);
    this.api.post(PROFILE_URLS.caseImmigrationCommit + '/' + caseParam.povCode, null, caseParam).subscribe(result => func(result));
  }

  queryCaseInProvincePlatformByChildInfo(caseParam: any, func: Function) {
    this.deleteEmptyProperty(caseParam);
    this.api.get(PROFILE_URLS.caseInProvincePlatformQueryByChildInfo + '/' + caseParam.povCode, caseParam).subscribe(result => func(result));
  }

  commitCaseInProvincePlatform(caseParam: any, func: Function) {
    this.deleteEmptyProperty(caseParam);
    this.api.post(PROFILE_URLS.caseInProvincePlatformCommit + '/' + caseParam.povCode, null, caseParam).subscribe(result => func(result));
  }

  queryCaseInProvincePlatformByImmunityCard(caseParam: any, func: Function) {
    this.deleteEmptyProperty(caseParam);
    this.api.get(PROFILE_URLS.caseInProvincePlatformQueryByImmunityCard + '/' + caseParam.povCode, caseParam).subscribe(result => func(result));
  }

  updateCaseImmunity(updateParam: any, func: Function) {
    this.deleteEmptyProperty(updateParam);
    this.api.put(PROFILE_URLS.caseImmunityUpdate + '/' + updateParam.povCode, null, updateParam).subscribe(result => func(result));
  }

  queryCaseInCityPlatform(caseParam: any, func: Function) {
    this.deleteEmptyProperty(caseParam);
    this.api.get(PROFILE_URLS.caseInCityPlatformQuery + '/' + caseParam.povCode, caseParam).subscribe(result => func(result));
  }

  commitCaseInCityPlatform(caseParam: any, func: Function) {
    this.deleteEmptyProperty(caseParam);
    this.api.post(PROFILE_URLS.caseInCityPlatformCommit + '/' + caseParam.povCode, null, caseParam).subscribe(result => func(result));
  }

  /**
   * 更新免疫接种卡信息
   * @param params
   * @param func
   */
  updateImmunityVacCard(params: any, func: Function) {
    this.api.post(PROFILE_URLS.updateImmunityVacCard, params).subscribe(result => func(result));
  }

  /**
   * 解密免疫卡号
   * @param encode 免疫卡号
   * @param func
   */
  decodeImmunityVacCard(encode: string, func: Function) {
    this.api.get(PROFILE_URLS.decodeEnCode + '/' + encode).subscribe(result => func(result));
  }

  deleteEmptyProperty(object) {
    for (const i of Object.keys(object)) {
      const value = object[i];
      if (value === '' || value === null || value === undefined) {
        delete object[i];
      }
    }
  }

  /**
   * 根据免疫卡号查询档案信息
   * @param immunityVacCard 免疫卡号
   * @param func
   */
  queryProfileByImmunityVacCard(immunityVacCard, func: Function) {
    this.api.get(PROFILE_URLS.queryProfileByImmunityVacCard + '/' + immunityVacCard).subscribe(result => func(result));
  }

  /**
   * 登记台执行档案删除
   * @param profileCode
   * @param func
   */
  deleteProfile(profileCode: string, func: Function) {
    this.api.del(PROFILE_URLS.deleteProfile + '/' + profileCode).subscribe(res => func(res));
  }
}

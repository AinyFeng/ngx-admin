import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {PROFILE_URLS} from '../url-params.const';
import {Observable, zip} from 'rxjs';

@Injectable()
export class BiteService {
  constructor(private api: ApiService) {
  }

  /**
   *
   * @Author sun
   * @Description 插入犬伤记录列表
   * @Date 2019-07-15 15:19
   *
   */
  insertBiteRecord(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.biteRecordInsert, params)
      .subscribe(result => func(result));
  }

  /**
   *
   * @Author sun
   * @Description 查询犬伤记录
   * @Date 2019-07-15 15:26
   *
   */
  queryBiteRecord(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.biteRecordQuery, params)
      .subscribe(result => func(result));
  }

  /**
   *
   * @Author sun
   * @Description 更新犬伤记录
   * @Date 2019-07-15 15:50
   *
   */
  udpateBiteRecord(params: any, func: Function) {
    this.api
      .put(PROFILE_URLS.biteRecordUpdate, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询接种策略（成人或犬伤，根据疫苗大类查询，不区分pov）
   * @param params
   * @param func
   */
  getStrategy(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.getStrategy, params)
      .subscribe(result => func(result));
  }

  /**
   *
   * @Author sun
   * @Description 根据犬伤记录编码删除犬伤记录
   * @Date 2019-07-15 15:53

   name = "rabiesCode", value = "犬伤记录编码"

   *
   */
  deleteBiteRecord(rabiesCode: string, func: Function) {
    this.api
      .del(PROFILE_URLS.biteRecordDelete + '/' + rabiesCode)
      .subscribe(result => func(result));
  }

  /**
   *
   * @Author ainy
   * @Description 储存成人疫苗登记信息
   * @Date 2019-10-10
   *
   */
  savePavrVaccineRecord(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.savePavrVaccineRecord, params)
      .subscribe(result => func(result));
  }

  /**
   *
   * @Author ainy
   * @Description 更新成人疫苗登记信息
   * @Date 2019-10-10
   *
   */
  updatePavrVaccineRecord(params: any, func: Function) {
    this.api
      .put(PROFILE_URLS.updatePavrVaccineRecord, params)
      .subscribe(result => func(result));
  }

  /**
   *
   * @Author ainy
   * @Description 查询成人疫苗登记信息
   * @Date 2019-10-10
   *
   */
  queryPavrVaccineRecord(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.queryPavrVaccineRecord, params)
      .subscribe(result => func(result));
  }

  /**
   *
   * @Author ainy
   * @Description 删除成人疫苗登记信息
   * @Date 2019-10-10
   * code = '疫苗大类编码'
   *
   */
  deletePavrVaccineRecord(code: string, func: Function) {
    this.api
      .del(PROFILE_URLS.deletePavrVaccineRecord + '/' + code)
      .subscribe(result => func(result));
  }


  /*
   * 合并犬伤和成人疫苗登记二合一接口
   * */
  queryRabiteAndAdultVaccineRecord(params: any, func: Function) {
    zip(
      this.api.post(PROFILE_URLS.biteRecordQuery, params),
      this.api.post(PROFILE_URLS.queryPavrVaccineRecord, params)
    ).subscribe(result => func(result));
  }
}

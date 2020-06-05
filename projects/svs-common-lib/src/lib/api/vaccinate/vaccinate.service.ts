/**
 * Created by Administrator on 2019/7/10.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { VACCINATE_STRATEGY_URLS, VACCINATE_URLS } from '../url-params.const';
import { Observable, zip } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class VaccinateService {
  constructor(private api: ApiService, private httpClient: HttpClient) {
  }

  /**
   * 查询接种记录(单表查询)
   * @param params
   * @param func
   */
  queryVaccinateRecordSingle(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.queryVaccinateRecordSingle, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询接种记录包含联合疫苗替代记录
   * @param params
   * @param func
   */
  queryVaccinateRecordSingleWithVirtual(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.queryVaccinateRecordSingleWithVirtual, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询接种记录(单表查询)Count
   * @param params
   * @param func
   */
  queryVaccinateRecordSingleCount(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.queryVaccinateRecordSingleCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 接种记录单表查询二合一接口
   * @param params
   * @param func
   */
  queryVaccinateRecordSingleAndCount(params: any, func: Function) {
    zip(
      this.api.post(VACCINATE_URLS.queryVaccinateRecordSingle, params),
      this.api.post(VACCINATE_URLS.queryVaccinateRecordSingleCount, params)
    ).subscribe(([queryData, countData]) => func(queryData, countData));
  }

  /**
   * 查询当前接种记录
   * @param params
   * @param func
   */
  queryCurrentVaccinateRecords(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.queryCurrentVaccinateRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询当前接种记录Count
   * @param params
   * @param func
   */
  queryCurrentVaccinateRecordsCount(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.queryCurrentVaccinateRecordCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询接种记录(关联查询)
   * @param params
   * @param func
   */
  queryVaccinateRecords(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.queryVaccinateRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询接种记录(关联查询)总数
   * @param params
   * @param func
   */
  queryVaccinateRecordsCount(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.queryVaccinateRecordCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 接种记录关联查询二合一接口
   * @param params
   * @param func
   */
  queryVaccinateRecordAndCount(params: any, func: Function) {
    zip(
      this.api.post(VACCINATE_URLS.queryVaccinateRecord, params),
      this.api.post(VACCINATE_URLS.queryVaccinateRecordCount, params)
    ).subscribe(([queryData, countData]) => func(queryData, countData));
  }

  /**
   * 添加接种记录
   * @param params
   * @param func
   */
  addVaccinateRecord(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.addVaccinateRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 更新接种记录
   * @param params
   * @param func
   */
  updateVaccinateRecord(params: any, func: Function) {
    this.api
      .put(VACCINATE_URLS.updateVaccinateRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除接种记录，根据id 删除接种记录
   * @param id
   * @param func
   */
  deleteVaccinateRecord(id: string | number, func: Function) {
    this.api
      .del(VACCINATE_URLS.deleteVaccinateRecord + '/' + id)
      .subscribe(result => func(result));
  }

  /**
   * 添加接种操作记录
   * @param params
   * @param func
   */
  addVaccinateOperateRecord(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.addVaccinateOperateRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询疫苗多剂次信息
   * @param params
   * @param func
   */
  queryVaccineDoseInfo(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.queryVaccineDoseInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询疫苗多剂次信息Count
   * @param params
   * @param func
   */
  queryVaccineDoseInfoCount(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.queryVaccineDoseInfoCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加与接种记录相关的疫苗电子监管码信息
   * @param params
   * @param func
   */
  addVaccRecordElcSupervision(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.addVaccRecordElcSupervision, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加与接种记录相关的疫苗电子监管码信息
   * @param params
   * @param func
   */
  addVaccRecordElcSupervisionBatch(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.addVaccRecordElcSupervisionBatch, params)
      .subscribe(result => func(result));
  }

  /**
   * 接种完成调用方法
   * @param params
   * @param func
   */
  vaccinateFinish(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.vaccinateFinish, params)
      .subscribe(result => func(result));
  }

  /**
   * 初始化接种记录调用方法
   * @param params
   * @param func
   */
  initVaccinateRecord(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.initVaccinateRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 批量或者单剂补录接口
   * @param params
   * @param func
   */
  addVaccinateRecordBatch(params: any[], func: Function) {
    this.api.post(VACCINATE_URLS.addVaccRecordBatch, params).subscribe(result => func(result));
  }

  jPushCallNum(param: any, func: Function) {
    this.api.post(VACCINATE_URLS.jPushCallNum, param).subscribe(resp => func(resp));
  }

  openLight(url, headers, params) {
    this.httpClient.get(url, {
      headers: headers,
      params: params
    }).subscribe(resp => {
    });
  }

  /**
   *
   * @param params
   * @param func
   */
  queryVaccinatedProfileByPeriodTime(params: any, func: Function) {
    this.api.post(VACCINATE_URLS.queryVaccinatedProfileByPeriodTime, params).subscribe(res => func(res));
  }

  /**
   * 查询电子监管码，pipe 使用
   * @param params
   */
  queryEleCode(params: any) {
    return this.api.post(VACCINATE_URLS.queryEleCode, params);
  }
}

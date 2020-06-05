import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { PROFILE_URLS } from '../url-params.const';

@Injectable()
export class MedicalHistoryService {
  constructor(private api: ApiService) { }

  /**
   * 存储病史信息
   * @param params
   * @param func
   */
  saveMedicalRecord(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.medicalRecordSave, params)
      .subscribe(result => func(result));
  }

  /**
   * 根据档案编码查询病史信息
   * @param params
   * @param func
   */
  queryMedicalRecord(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.medicalRecordQuery, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除病史数据，根据 medicalHistroyCode
   * @param medicalHistroyCode
   * @param func
   */
  deleteMedicalRecord(medicalHistroyCode: string, func: Function) {
    this.api
      .del(PROFILE_URLS.medicalRecordDelete + '/' + medicalHistroyCode)
      .subscribe(result => func(result));
  }

  /**
   * 更新病史数据
   * @param params
   * @param func
   */
  updateMedicalRecord(params: any, func: Function) {
    this.api
      .put(PROFILE_URLS.medicalRecordUpdate, params)
      .subscribe(result => func(result));
  }
}

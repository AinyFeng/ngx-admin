import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { PROFILE_URLS } from '../url-params.const';

@Injectable()
export class AefiService {
  constructor(private api: ApiService) { }

  /**
   * AEFI 查询接种记录
   * 根据profileCode 查询接种记录
   */
  queryVaccRecord(profileCode: any, func: Function) {
    this.api
      .get(PROFILE_URLS.aefiQueryVaccRecord + '/' + profileCode)
      .subscribe(result => func(result));
  }

  /**
   * 根据query entity 模式查询接种记录
   * @param params
   * @param func
   */
  queryVacRecordByParams(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.aefiQueryVacRecordByParams, params)
      .subscribe(result => func(result));
  }

  saveAefiRecord(params: any, func: Function) {
    this.api
      .post(PROFILE_URLS.aefiSaveRecord, params)
      .subscribe(result => func(result));
  }

  /**
   *
   * @Author sun
   * @Description 根据profileCode 查询aefi记录
   * @Date 2019-07-16 17:22

   	name = "profileCode",value = "档案编码"

   *
   */
  queryAefiRecordByProfileCode(profileCode: string, func: Function) {
    this.api
      .get(PROFILE_URLS.aefiQueryByProfileCode + '/' + profileCode)
      .subscribe(result => func(result));
  }

  /**
   *
   * @Author sun
   * @Description 根据aefiCode 删除aefi 记录
   * @Date 2019-07-16 17:43

   	name = "aefiCode",value = "aefi 记录编码"

   *
   */
  deleteAefiRecordByAefiCode(aefiCode: string, func: Function) {
    this.api
      .del(PROFILE_URLS.aefiDeleteByAefiCode + '/' + aefiCode)
      .subscribe(result => func(result));
  }

  /**
   *
   * @Author sun
   * @Description 更新aefi 记录
   * @Date 2019-07-16 19:24

   	name = "params",value = "更新的record 对象"

   *
   */
  updateAefiRecord(params: any, func: Function) {
    this.api
      .put(PROFILE_URLS.aefiUpdateRecord, params)
      .subscribe(result => func(result));
  }

  /**
   *
   * @Author sun
   * @Description 根据文件名称删除文件
   * @Date 2019-07-16 19:37

   	name = "fileName",value = "文件名"

   *
   */
  deleteFileByFileName(fileName: string, func: Function) {
    this.api
      .del(PROFILE_URLS.aefiFileDelete + '/' + fileName)
      .subscribe(result => func(result));
  }
}

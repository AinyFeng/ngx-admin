import {Injectable} from '@angular/core';
import {SYSTEM_URLS} from '../url-params.const';
import {zip} from 'rxjs';
import {ApiService} from '../api.service';

@Injectable()
export class SystemPreliminaryClinicalService {

  /*
  * 预诊接口
  * */
  constructor(private api: ApiService) {
  }

  /**
   * 预诊模板查询
   * @author AXF
   * @params:
   * @date 2019/12/17
   */
  queryPreliminaryClinical(params: any, func: Function) {
    this.api.post(SYSTEM_URLS.queryRegPreModel, params).subscribe(result => func(result));
  }

  // 查询预诊模板和总条数二合一
  queryPreliminaryClinicalAndCount(params: any, func: Function) {
    zip(
      this.api.post(SYSTEM_URLS.queryRegPreModel, params),
      this.api.post(SYSTEM_URLS.queryRegPreModelAndCount, params)
    ).subscribe(result => func(result));

  }

  // 插入一条模板
  addPreliminaryClinical(params: any, func: Function) {
    this.api.post(SYSTEM_URLS.insertRegPreModel, params).subscribe(result => func(result));
  }

  // 更新一条模板
  updatePreliminaryClinical(params: any, func: Function) {
    this.api.put(SYSTEM_URLS.updateRegPreModel, params).subscribe(result => func(result));
  }

  // 删除一条模板
  deletePreliminaryClinical(id: string, func: Function) {
    this.api.del(SYSTEM_URLS.deleteRegPreModel + '/' + id).subscribe(result => func(result));
  }

  /**
   * 查询预诊记录表
   * @author ainy
   * @params:
   * @date 2019/12/17 0017
   */
  queryRegPreRecord(params: any, func: Function) {
    this.api.post(SYSTEM_URLS.queryRegPreRecord, params).subscribe(result => func(result));
  }

  /**
   * 插入预诊记录表
   * @author ainy
   * @params:
   * @date 2019/12/17 0017
   */
  regPreDiagnosisRecordInsert(params: any, func: Function) {
    this.api.post(SYSTEM_URLS.regPreDiagnosisRecordInsert, params).subscribe(result => func(result));
  }

  /**
   * 日常管理 - 预诊记录信息和Count查询
   * @param params
   * @param func
   */
  queryPreRegRecordInfoAndCount(params: any, func: Function) {
    zip(
      this.api.post(SYSTEM_URLS.queryRegPreRecordInfo, params),
      this.api.post(SYSTEM_URLS.queryRegPreRecordInfoCount, params)
    ).subscribe(result => func(result));
  }

  /**
   * 查看预诊记录明细和count
   * @param params
   * @param func
   */
  queryPreRegRecordDetailAndCount(params: any, func: Function) {
    zip(
      this.api.post(SYSTEM_URLS.queryRegPreRecordDetail, params),
      this.api.post(SYSTEM_URLS.queryRegPreRecordDetailCount, params),
    ).subscribe(result => func(result));
  }
}

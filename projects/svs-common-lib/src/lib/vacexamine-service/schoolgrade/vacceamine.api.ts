import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { VACCINE_EXAMINE_URLS } from '../api.url.params';

@Injectable()
/**
 * 市平台 - 入学入托接种查验相关接口
 */
export class VaccExamineApi {

  constructor(private api: ApiService) {
  }

  /**
   * 根据归属门诊编码查询学校
   * @param params
   * @param func
   */
  querySchoolListByBelongPovCode(params: any, func: Function) {
    this.api.post(VACCINE_EXAMINE_URLS.querySchoolListByBelongPovCode, params).subscribe(res => func(res));
  }
}

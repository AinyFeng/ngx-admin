import { Injectable } from '@angular/core';
import { SYSTEM_URLS } from '../url-params.const';
import { zip } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable()
export class ApiSystemMessageInfoService {

  constructor(private api: ApiService) {
  }

  /**
   * 查询本地短信模板
   * @author ainy
   * @params:
   * @date 2019/11/4 0004
   */
  queryMessageTemplate(params: any, func: Function) {
    this.api.post(SYSTEM_URLS.queryMessageTemp, params).subscribe(result => func(result));
  }

  /*
  * 二合一接口
  * */
  queryMessageTemplateAndCount(params: any, func: Function) {
    zip(
      this.api.post(SYSTEM_URLS.queryMessageTemp, params),
      this.api.post(SYSTEM_URLS.queryMessageTempCount, params)
    ).subscribe(result => func(result));
  }

  /**
   * 插入一条短信模板
   * @author ainy
   * @params:
   * @date 2019/11/4 0004
   */
  insertMessageTemplate(params: any, func: Function) {
    this.api.post(SYSTEM_URLS.insertMessageTemp, params).subscribe(result => func(result));
  }

  /**
   * 修改本地信息模板
   * @author ainy
   * @params:
   * @date 2019/11/4 0004
   */
  updateMessageTemp(params: any, func: Function) {
    this.api.put(SYSTEM_URLS.updateMessageTemp, params).subscribe(result => func(result));
  }

  /**
   * 删除本地信息模板
   * @author ainy
   * @params:
   * @date 2019/11/4 0004
   */
  deleteMessageTemp(id: string, func: Function) {
    this.api.del(SYSTEM_URLS.deleteMessageTemp + '/' + id).subscribe(result => func(result));
  }

  /**
   * 查询短信记录
   * @author ainy
   * @params:
   * @date 2019/11/5 0005
   */
  queryMessageRecord(params, func: Function) {
    this.api.post(SYSTEM_URLS.queryMessageRecordInfo, params).subscribe(result => func(result));
  }

  /**
   * 短信记录和count
   * @author ainy
   * @params:
   * @date 2019/12/2 0002
   */
  querySmsRecordAndCount(params, func: Function) {
    zip(
      this.api.post(SYSTEM_URLS.queryMessageRecordInfo, params),
      this.api.post(SYSTEM_URLS.queryMessageRecordCount, params)
    ).subscribe(result => func(result));
  }

  /**
   * 短信计费
   * @author ainy
   * @params:
   * @date 2019/11/5 0005
   */
  querySmsBilling(params, func: Function) {
    this.api.post(SYSTEM_URLS.querySmsBilling, params).subscribe(result => func(result));
  }

  /**
   * 短信计费和count
   * @author ainy
   * @params:
   * @date 2019/12/2 0002
   */
  querySmsBillingAndCount(params, func: Function) {
    zip(
      this.api.post(SYSTEM_URLS.querySmsBilling, params),
      this.api.post(SYSTEM_URLS.querySmsBillingCount, params)
    ).subscribe(result => func(result));
  }

}

/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';

@Injectable()
export class DictionaryService {
  constructor(private api: ApiService) { }

  /**
   * 查询字典表数据
   * @param params
   * @param func
   */
  queryDictionary(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryDictionary, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加字典表数据
   * @param params
   * @param func
   */
  addDictionary(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addDictionary, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改疫苗产品
   * @param params
   * @param func
   */
  updateDictionary(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateDictionary, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除疫苗产品
   * @param params
   * @param func
   */
  deleteDictionary(params: any, func: Function) {
    this.api
      .del(MASTER_URLS.deleteDictionary, params)
      .subscribe(result => func(result));
  }
}

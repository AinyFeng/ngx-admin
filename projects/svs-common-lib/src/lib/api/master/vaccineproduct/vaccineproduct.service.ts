/**
 * Created by Administrator on 2019/7/14.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';
import { Observable } from 'rxjs';

@Injectable()
export class VaccineProductService {
  constructor(private api: ApiService) {}

  /**
   * 查询疫苗产品单表查询
   * @param params
   * @param func
   */
  queryVaccineProduct(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryVaccineProduct, params)
      .subscribe(result => func(result));
  }

  queryVaccineProductForPipe(params: any, query: any): Observable<any> {
    return this.api.post(MASTER_URLS.queryVaccineProduct, params, query);
  }

  /**
   * 查询疫苗产品单表查询Count
   * @param params
   * @param func
   */
  queryVaccineProductCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryVaccineProductCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加疫苗产品
   * @param params
   * @param func
   */
  addVaccineProduct(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addVaccineProduct, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改疫苗产品
   * @param params
   * @param func
   */
  updateVaccineProduct(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateVaccineProduct, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除疫苗产品
   * @param params
   * @param func
   */
  deleteVaccineProduct(params: any, func: Function) {
    this.api
      .del(MASTER_URLS.deleteVaccineProduct, params)
      .subscribe(result => func(result));
  }
}

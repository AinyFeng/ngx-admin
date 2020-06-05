import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { VacStockStorageUrl } from '../api.url.params';

@Injectable()
/**
 * 疫苗出入库 - 疫苗入库出库操作
 */
export class VacStockStorageApi {

  constructor(private api: ApiService) {
  }

  /**
   * 疫苗入库
   * @param params
   * @param func
   */
  storage(params: any, func: Function) {
    this.api.post(VacStockStorageUrl.storage, params).subscribe(res => func(res));
  }

  /**
   * 疫苗出库
   * @param params
   * @param func
   */
  outOfStock(params: any, func: Function) {
    this.api.post(VacStockStorageUrl.outOfStock, params).subscribe(res => func(res));
  }

  /**
   * 疫苗退回
   * @param params
   * @param func
   */
  sendBack(params: any, func: Function) {
    this.api.post(VacStockStorageUrl.sendBack, params).subscribe(res => func(res));
  }

  /**
   * 疫苗报损
   * @param params
   * @param func
   */
  scrap(params: any, func: Function) {
    this.api.post(VacStockStorageUrl.scrap, params).subscribe(res => func(res));
  }

  /**
   * 疫苗使用
   * @param params
   * @param func
   */
  use(params: any, func: Function) {
    this.api.post(VacStockStorageUrl.use, params).subscribe(res => func(res));
  }

  /**
   * 疫苗消耗
   * @param params
   * @param func
   */
  consume(params: any, func: Function) {
    this.api.post(VacStockStorageUrl.consume, params).subscribe(res => func(res));
  }

  /**
   * 疫苗冻结
   * @param params
   * @param func
   */
  freeze(params: any, func: Function) {
    this.api.post(VacStockStorageUrl.freeze, params).subscribe(res => func(res));
  }
}

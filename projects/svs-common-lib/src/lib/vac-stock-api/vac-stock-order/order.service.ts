import {Injectable} from '@angular/core';
import { zip } from 'rxjs';
import { ApiService } from '../../api/api.service';
import { VACCINE_IN_OUT_INFO_URLS } from '../../api/url-params.const';

/**
 * 出入库查询统计相关接口
 * @author ZQZ
 * @params:
 * @date 2019/12/17 0016
 */
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private api: ApiService,
  ) {
  }

  /**
   * 出入库信息查询
   * @author ZQZ
   * @params:
   */
  queryVacInOutInfo(params: any, func: Function) {
    zip(
      this.api.post(VACCINE_IN_OUT_INFO_URLS.queryVacInOutInfo, params),
      this.api.post(VACCINE_IN_OUT_INFO_URLS.queryVacInOutInfoCount, params),
    ).subscribe(result => func(result));
  }

  /**
   * 删除订单
   * @author ZQZ
   * @params:
   */
  deleteOrder(params: any, func: Function) {
    this.api.post(VACCINE_IN_OUT_INFO_URLS.deleteOrder, params).subscribe(result => func(result));
  }

  /**
   * 出入库信息查询详情
   * @author ZQZ
   * @params:
   */
  queryVacInOutInfoDetail(params: any, func: Function) {
    this.api.post(VACCINE_IN_OUT_INFO_URLS.queryVacInOutInfoDetail, params).subscribe(result => func(result));
  }

  /**
   * 出入库信息查询详情价格金额
   * @author ZQZ
   * @params:
   */
  querySumPrice(params: any, func: Function) {
    this.api.post(VACCINE_IN_OUT_INFO_URLS.querySumPrice, params).subscribe(result => func(result));
  }

  /**
   * 出库确认（确认/失败）
   * @author ZQZ
   * @params:
   */
  outOfStock(params: any, func: Function) {
    this.api.post(VACCINE_IN_OUT_INFO_URLS.outOfStock, params).subscribe(result => func(result));
  }

  /**
   * 入库确认（确认/失败/退回）
   * @author ZQZ
   * @params:
   */
  warehousing(params: any, func: Function) {
    this.api.post(VACCINE_IN_OUT_INFO_URLS.warehousing, params).subscribe(result => func(result));
  }

  /**
   * 确认付款
   * @author ZQZ
   * @params:
   */
  isPay(params: any, func: Function) {
    this.api.post(VACCINE_IN_OUT_INFO_URLS.isPay, params).subscribe(result => func(result));
  }


}

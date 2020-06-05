import {Injectable} from '@angular/core';
import {forkJoin, zip} from 'rxjs';
import {VACCINE_IN_OUT_URLS} from '../api.url.params';
import {ApiService} from '../../api/api.service';

// 查询统计接口
@Injectable({
  providedIn: 'root'
})
export class QueryStatisticsService {

  constructor(
    private api: ApiService,
  ) {
  }

  /**
   * 分疫苗出入库明细统计
   * @author AXF
   * @params:
   * @date 2019/12/16 0016
   */
  queryVacInOutDetail(params: any, func: Function) {
    this.api.post(VACCINE_IN_OUT_URLS.queryVacInOutDetail, params).subscribe(result => func(result));
  }

  /**
   * 合二为一接口
   * @author AXF
   * @params:
   * @date 2019/12/16 0016
   */
  queryVacInOutDetailAndCount(params: any, func: Function) {
    zip(
      this.api.post(VACCINE_IN_OUT_URLS.queryVacInOutDetail, params),
      this.api.post(VACCINE_IN_OUT_URLS.queryVacInOutDetailCount, params),
    ).subscribe(result => func(result));
  }

  /**
   * 分地区出入库明细查询和Count(疫苗出入库流向查询可用)(分地区查询订单的总金额和数量)
   * @author AXF
   * @params:
   * @date 2019/12/16 0016
   */
  queryAreaInOutDetailAndCount(params: any, func: Function) {
    forkJoin(
      [this.api.post(VACCINE_IN_OUT_URLS.queryAreaInOutDetail, params),
      this.api.post(VACCINE_IN_OUT_URLS.queryAreaVacInOutDetailCount, params),
      this.api.post(VACCINE_IN_OUT_URLS.queryAreaVacPriceSum, params)]
    ).subscribe(result => func(result));
  }

  /**
   * 近效期疫苗情况查询（分地区疫苗库存量统计可用）
   * @author AXF
   * @params:
   * @date 2019/12/16 0016
   */
  queryNearlyEffectiveAndCount(params: any, func: Function) {
    zip(
      this.api.post(VACCINE_IN_OUT_URLS.queryNearlyEffective, params),
      this.api.post(VACCINE_IN_OUT_URLS.queryNearlyEffectiveCount, params),
    ).subscribe(result => func(result));
  }


}

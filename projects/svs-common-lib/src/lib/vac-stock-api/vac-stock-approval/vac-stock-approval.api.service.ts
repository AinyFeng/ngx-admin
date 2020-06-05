import {Injectable} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {VacStockApprovalUrl} from '../api.url.params';
import {zip} from 'rxjs';

@Injectable()
/**
 * 出入库审批
 */
export class VacStockApprovalApiService {

  constructor(private api: ApiService) {
  }

  /**
   * 出库审批 (订单信息列表)
   * @param params
   * @param func
   */
  queryVacStockApproval(params: any, func: Function) {
    this.api.post(VacStockApprovalUrl.queryVacStockApproval, params).subscribe(res => func(res));
  }

  /**
   * 出库审批 (订单信息列表) 和Count
   * @param params
   * @param func
   */
  queryVacStockApprovalAndCount(params: any, func: Function) {
    zip(
      this.api.post(VacStockApprovalUrl.queryVacStockApproval, params),
      this.api.post(VacStockApprovalUrl.queryVacStockApprovalCount, params)
    ).subscribe(result => func(result));
  }

  /**
   * 出入库操作共用查询详情
   * @param params
   * @param func
   */
  queryStockApprovalDetail(params: any, func: Function) {
    this.api.post(VacStockApprovalUrl.queryStockApprovalDetail, params).subscribe(result => func(result));
  }

  /**
   * 出入库操作共用查询详情和查询金额Sum
   * @param params
   * @param func
   */
  queryStockApprovalDetailAndAmount(params: any, func: Function) {
    zip(
      this.api.post(VacStockApprovalUrl.queryStockApprovalDetail, params),
      this.api.post(VacStockApprovalUrl.queryStockApprovalAmount, params)
    ).subscribe(result => func(result));
  }


  /**
   * 审批（修改订单状态通过/不通过）
   * @param params
   * @param func
   */
  queryApproval(params: any, func: Function) {
    this.api.post(VacStockApprovalUrl.approval, params).subscribe(res => func(res));
  }

  /**
   * 出库确认（确认/失败）
   * @param params
   * @param func
   */
  sureOutOfStock(params: any, func: Function) {
    this.api.post(VacStockApprovalUrl.sureOutOfStock, params).subscribe(result => func(result));
  }

  /**
   * 入库确认（确认/失败）
   * @param params
   * @param func
   */
  sureInOfStock(params: any, func: Function) {
    this.api.post(VacStockApprovalUrl.sureInOfStock, params).subscribe(result => func(result));
  }

  /**
   * 删除订单
   * @param params
   * @param func
   */
  delOrder(params: any, func: Function) {
    this.api.post(VacStockApprovalUrl.delOrder, params).subscribe(result => func(result));
  }

  /**
   * 修改订单
   * @param params
   * @param func
   */
  updateOrder(params: any, func: Function) {
    this.api.post(VacStockApprovalUrl.updateOrder, params).subscribe(result => func(result));
  }


}

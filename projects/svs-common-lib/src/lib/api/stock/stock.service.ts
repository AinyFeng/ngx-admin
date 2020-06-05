import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { IOT_URLS, MASTER_URLS, REPORT_URLS_ADMIN, STOCK_URLS, SYSTEM_URLS } from '../url-params.const';
import { QueryEntity } from '../entity/profile.entity';
import { forkJoin, Observable } from 'rxjs';

@Injectable()
export class StockService {
  constructor(private api: ApiService) {
  }

  /**
   * 门诊内调拨
   */
  allotInPov(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.allotInPov, params)
      .subscribe(result => func(result));
  }

  /**
   * 合议
   */
  discussModify(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.discussModify, params)
      .subscribe(result => func(result));
  }

  /**
   * 报损
   */
  breakage(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.breakage, params)
      .subscribe(result => func(result));
  }

  /**
   * 接种
   */
  vaccinate(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.vaccinate, params)
      .subscribe(result => func(result));
  }

  /**
   * 自采入库
   */
  selfStorageIn(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.selfStorageIn, params)
      .subscribe(result => func(result));
  }

  /**
   * 其他出入库操作调用
   */
  otherStock(params: any, func: Function) {
    this.api.post(STOCK_URLS.other, params).subscribe(result => func(result));
  }

  /**
   * 批量接种出库
   */
  massOut(params: any, func: Function) {
    this.api.post(STOCK_URLS.massOut, params).subscribe(result => func(result));
  }

  /**
   * 批量接种入库
   */
  massReturn(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.massReturn, params)
      .subscribe(result => func(result));
  }

  // ==============库存管理模块=================

  /**
   * 查询平级调拨入库记录
   */
  stockAllot(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.stockAllot, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询平台内调拨的出入库记录
   */
  sendBack(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.sendBack, params)
      .subscribe(result => func(result));
  }

  /**
   * 市平台入库回退
   */
  stockedBack(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.stockedBack, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询平台内调拨需要入库的数据
   */
  queryNeedInstock(params: any, func: Function) {
    const url = STOCK_URLS.queryNeedIn;
    const countUrl = STOCK_URLS.queryNeedInCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('search queryNeedInstock complete')
    });
  }

  /**
   * 平台内调拨 疫苗确认入库操作
   */
  confirmVaccineStorage(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.confirmVaccineStorage, params)
      .subscribe(result => func(result));
  }

  /**
   * 平台内调拨 疫苗入库拒收
   */
  refused(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.refused, params)
      .subscribe(result => func(result));
  }

  /**
   * 市平台入库 -- 查看订单的疫苗详情
   * @param params
   * @param func
   */
  cityInDetails(params: any, func: Function) {
    const url = STOCK_URLS.cityInDetails;
    const countUrl = STOCK_URLS.cityInDetailsCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('cityInvaccDetail complete')
    });
  }

  /**
   * 刷新市平台入库订单
   * @param povCode
   * @param func
   */
  refreshCityPlatformOrder(povCode: string, func: Function) {
    this.api.get(STOCK_URLS.refreshCityPlatformOrder + '/' + povCode).subscribe(result => func(result));
  }

  /**
   * 批量接种出入库记录
   */
  stockMass(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.stockMass, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询报损库存
   */
  stockBreakage(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.stockBreakage, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询合议修订记录  (合议出入库)
   */
  stockDam(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.stockDam, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询其它出入库记录
   */
  stockOther(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.stockOther, params)
      .subscribe(result => func(result));
  }

  /**
   * 根据疫苗产品编码和批号查询库存信息 （库存余量查询）
   * @param params
   * @param func
   */
  queryStock(params: any, func: Function) {
    const url = STOCK_URLS.inventory;
    const countUrl = STOCK_URLS.inventoryCount;

    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('search Stock For pov-vacc-adjust complete')
    });
  }

  /**
   * 获取库存日报
   * @param params
   * @param func
   */
  queryStockDaily(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.daily, params)
      .subscribe(result => func(result));
    /*  const url = STOCK_URLS.daily;
      const countUrl = STOCK_URLS.dailyCount;

      // forkJoin组装query查询和count查询
      forkJoin([
        this.api.post(url, params),
        this.api.post(countUrl, params)
      ]).subscribe({
        next: data => func(data),
        complete: () => console.log('searchBatchInfo complete')
      });*/
  }

  /**
   * 获取库存盘点记录
   * @param params
   * @param func
   */
  queryStockInventoryRecord(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.inventoryRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改盘点记录
   * @param params
   * @param func
   */
  updateStockInventoryRecord(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.updateInventoryRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 预售查询
   * @param params
   * @param func
   */
  queryPresell(params: any, func: Function) {
    const url = STOCK_URLS.queryPresell;
    const countUrl = STOCK_URLS.queryPresellCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('queryPresell complete')
    });
  }

  /**
   * 批号查询
   * @param params
   * @param func
   */
  queryBatch(params: any, func: Function) {
    const url = STOCK_URLS.queryBatch;
    const countUrl = STOCK_URLS.queryBatchInfoCount;

    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('searchBatchInfo complete')
    });
  }

  /**
   * 批号查询options
   * @param params
   * @param func
   */
  queryBatchOptions(params: any, func: Function) {
    const url = STOCK_URLS.queryBatch;
    this.api
      .post(url, params)
      .subscribe(result => func(result));
  }

  /**
   *  查询电子监管码记录
   * @param params
   * @param func
   */
  queryEleSupervisionInfo(params: any, func: Function) {
    /* this.api.post(STOCK_URLS.queryEleSupervisionInfo, params).subscribe(result => func(result));*/
    const url = STOCK_URLS.queryEleSupervisionInfo;
    const countUrl = STOCK_URLS.queryEleSupervisionInfoCount;

    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('searchEleSupervisionInf complete')
    });
  }

  /**
   * 库存管理--疫苗使用详情
   * @param params
   * @param func
   */
  vaccinateUseDetail(params: any, func: Function) {
    const url = STOCK_URLS.queryVaccUseDetail;
    const countUrl = STOCK_URLS.queryVaccUseDetailCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('vaccinateUseDetail complete')
    });
  }

  /**
   * 库存管理--疫苗使用详情 -- 进一步的具体详情
   * @param params
   * @param func
   */
  vacUsedDetails(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.vacUsedDetails, params)
      .subscribe(result => func(result));
    /* const url = STOCK_URLS.queryVaccUseDetail;
     const countUrl = STOCK_URLS.queryVaccUseDetailCount;
     // forkJoin组装query查询和count查询
     forkJoin([
       this.api.post(url, params),
       this.api.post(countUrl, params)
     ]).subscribe({
       next: data => func(data),
       complete: () => console.log('vaccinateUseDetail complete')
     });*/
  }

  /**
   *  查询出入库明细记录
   * @param params
   * @param func
   */
  queryInAndOutDetail(params: any, func: Function) {
    const url = STOCK_URLS.queryInAndOutDetail;
    const countUrl = STOCK_URLS.queryInAndOutDetailCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('queryInAndOutDetail complete')
    });
  }

  /**
   *  查询出入库明细汇总记录
   * @param params
   * @param func
   */
  queryInAndOutCollect(params: any, func: Function) {
    const url = STOCK_URLS.queryInAndOutCollect;
    const countUrl = STOCK_URLS.queryInAndOutCollectCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('queryInAndOutDetail complete')
    });
  }

  /**
   *  查询冷链设备信息
   * @param params
   * @param func
   */
  queryColdChain(params: any, func: Function) {
    const url = STOCK_URLS.queryColdChain;
    const countUrl = STOCK_URLS.queryColdChainCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('queryColdFacility complete')
    });
  }

  /**
   * 编辑冷链设备
   */
  modifyFacility(params: any, func: Function) {
    this.api
      .put(STOCK_URLS.modifyFacility, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询平台已入库可回退的数据
   */
  queryBack(params: any, func: Function) {
    const url = STOCK_URLS.queryBack;
    const countUrl = STOCK_URLS.queryBackCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('search queryNeedInstock complete')
    });
  }

  /**
   * 查询疫苗库存数据
   * @param params
   * @param func
   */
  queryVaccineInventory(params: any, func: Function) {
    this.api
      .post(STOCK_URLS.queryVaccineInventory, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询七种类型 memo
   * @param params
   * @param func
   */
  queryMemo(params: any): Observable<any> {
    return this.api.post(STOCK_URLS.queryMemo, params);
  }

  /**
   * 根据固定资产编码删除冷链设备与科室的关联关系
   * @param params
   * @param func
   */
  deleteColdChainRelationWithDepartment(params: any, func: Function) {
    this.api.del(MASTER_URLS.deleteColdChainRelationWithDepartment + '/' + params).subscribe(res => func(res));
  }


}

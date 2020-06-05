import { Injectable } from '@angular/core';
import { ADMINISTRATION_URLS_ADMIN, STOCK_URLS } from '../url-params.const';
import { ApiService } from '../api.service';
import { forkJoin, Observable, zip } from 'rxjs';

@Injectable()
export class ApiAdminDailyManagementService {
  constructor(private api: ApiService) {
  }

  /**
   * 档案查询
   * @param profile
   * @param func
   * @arther ainy
   * @date  2019/7/15
   */
  archivesQuery(profile: any, func: Function) {
    zip(
      this.api.post(ADMINISTRATION_URLS_ADMIN.archivesQuery, profile),
      this.api.post(ADMINISTRATION_URLS_ADMIN.countProfile, profile)
    ).subscribe(([queryData, countData]) => func(queryData, countData));
  }

  /**
   * 在册变更查询
   * @param 查询参数
   * @param func
   */

  /**
   * 日常管理中接种记录查询和Count
   * @param params
   * @param func
   * @arther ainy
   * @date  2019/8/29
   */
  vaccinateRecord(params: any, func: Function) {
    zip(
      this.api.post(
        ADMINISTRATION_URLS_ADMIN.queryAdminVaccinateRecord,
        params
      ),
      this.api.post(
        ADMINISTRATION_URLS_ADMIN.queryAdminVaccinateRecordCount,
        params
      )
    ).subscribe(([queryData, countData]) => func(queryData, countData));
  }

  /**
   * 接种记录查询
   * @param params
   * @param func
   */
  queryVacRecord(params: any, func: Function) {
    this.api.post(
      ADMINISTRATION_URLS_ADMIN.queryAdminVaccinateRecord,
      params
    ).subscribe(result => func(result));
  }

  /**
   *生物制品中疫苗库存查询
   * @param 查询参数
   * @param func
   * */
  vacStockQuery(params: any, func: Function) {
    const url = ADMINISTRATION_URLS_ADMIN.queryVaccineStock;
    const countUrl = ADMINISTRATION_URLS_ADMIN.queryVaccineStockCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('vacStockQuery complete')
    });
  }

  /**
   * 日常管理中上传失败记录查询
   * @param params
   * @param func
   * @arther ainy
   * @date  2019/8/29
   */
  profileUploadFailedRecord(params: any, func: Function) {
    const url = ADMINISTRATION_URLS_ADMIN.queryProfileUploadFailedRecord;
    const countUrl =
      ADMINISTRATION_URLS_ADMIN.queryProfileUploadFailedRecordCount;

    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, params),
      this.api.post(countUrl, params)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('searchrofileUploadFailedRecord complete')
    });
  }

  /**
   * 日常管理 重卡查询
   * @param params
   * @param func
   * @arther ainy
   * @date  2019/8/29
   */
  profileDuplicatedRecord(params: any, func: Function) {
    const url = ADMINISTRATION_URLS_ADMIN.profileDuplicatedRecord;
    const countUrl = ADMINISTRATION_URLS_ADMIN.profileDuplicatedRecordCount;
    // forkJoin组装query查询和count查询
    forkJoin([this.api.post(url, params), this.api.post(countUrl, params)]).subscribe({
      next: (data) => func(data),
      complete: () => console.log('profileDuplicatedRecord complete')
    });
  }

  /**
   * 门诊自定义调价查询
   * @author ainy
   * @params:
   * @date 2019/11/7 0007
   */
  queryPovPriceManageInfo(params: any, func: Function) {
    this.api.post(ADMINISTRATION_URLS_ADMIN.queryPovPriceManage, params).subscribe(result => func(result));
  }

  /**
   * 门诊调价和count
   * @author ainy
   * @params:
   * @date 2019/12/2 0002
   */
  queryPovPriceManageInfoAndCount(params: any, func: Function) {
    zip(
      this.api.post(ADMINISTRATION_URLS_ADMIN.queryPovPriceManage, params),
      this.api.post(ADMINISTRATION_URLS_ADMIN.queryPovPriceManageCount, params),
    ).subscribe(result => func(result));
  }

  /**
   * 门诊调价删除
   * @author  ainy
   * @params:
   * @date 2019/11/7 0007
   */
  deletePovPrice(params: any, func: Function) {
    this.api.del(ADMINISTRATION_URLS_ADMIN.deletePovPriceManage, params).subscribe(result => func(result));
  }

  /**
   * 更新门诊调价
   * @author ainy
   * @params:
   * @date 2019/11/7 0007
   */
  updatePovPrice(params: any, func: Function) {
    this.api.post(ADMINISTRATION_URLS_ADMIN.updatePovPriceManage, params).subscribe(result => func(result));
  }

  /**
   * 逾期为种统计
   * @author ainy
   * @params:
   * @date 2019/11/22 0022
   */
  queryVacOverdue(params: any, func: Function) {
    this.api.post(ADMINISTRATION_URLS_ADMIN.queryOverDue, params).subscribe(result => func(result));
  }

  /**
   * 逾期未种统计和count
   * @author ainy
   * @params:
   * @date 2019/12/3 0003
   */
  queryVacOverdueAndCount(params: any, func: Function) {
    zip(
      this.api.post(ADMINISTRATION_URLS_ADMIN.queryOverDue, params),
      this.api.post(ADMINISTRATION_URLS_ADMIN.queryOverDueCount, params)
    ).subscribe(result => func(result));
  }

  /**
   * 应种统计查询和count条数
   * @author ainy
   * @params:
   * @date 2019/11/29 0029
   */
  queryVaccineShouldInjectAndCount(params: any, func: Function) {
    zip(
      this.api.post(
        ADMINISTRATION_URLS_ADMIN.queryVaccShouldInject,
        params
      ),
      this.api.post(
        ADMINISTRATION_URLS_ADMIN.queryVaccShouldCount,
        params
      )
    ).subscribe(result => func(result));
  }

  /**
   * 查询接种率考核
   * @param params
   * @param func
   */
  queryVaccInoculationInfo(params: any, func: Function) {
    this.api.post(ADMINISTRATION_URLS_ADMIN.queryVaccInoculation, params).subscribe(result => func(result));
  }

  /**
   * 查询接种率考核和count
   * @param params
   * @param func
   */
  queryVaccInoculationInfoAndCount(params: any, func: Function) {
    zip(
      this.api.post(ADMINISTRATION_URLS_ADMIN.queryVaccInoculation, params),
      this.api.post(ADMINISTRATION_URLS_ADMIN.queryVaccInoculationCount, params)
    ).subscribe(result => func(result));
  }

  /**
   * 应种统计发送短信
   * @param params
   * @param func
   */
  sendVaccShoudSms(params: any, func: Function) {
    zip(
      this.api.post(ADMINISTRATION_URLS_ADMIN.sendVaccShoudSms, params),
    ).subscribe(result => func(result));
  }

  /**
   * 逾期统计发送短信
   * @param params
   * @param func
   */
  sendOverDueSms(params: any, func: Function) {
    zip(
      this.api.post(ADMINISTRATION_URLS_ADMIN.sendOverDueSms, params),
    ).subscribe(result => func(result));
  }

}

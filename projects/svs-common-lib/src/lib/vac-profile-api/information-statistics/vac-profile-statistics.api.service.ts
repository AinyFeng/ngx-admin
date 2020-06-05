import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { CaseInformationStatisticsUrl } from '../profile.api.url.params';
import { zip } from 'rxjs';
import { ADMINISTRATION_URLS_ADMIN, PROFILE_URLS } from '../../api/url-params.const';

@Injectable()
/**
 * 儿童档案管理 - 个案信息统计
 */
export class VacProfileStatisticsApi {

  constructor(private api: ApiService) {
  }

  /**
   * 个案信息统计和总条数
   * @param params
   * @param func
   */
  archivesList(params: any, func: Function) {
    zip(
    this.api.post(CaseInformationStatisticsUrl.archivesList, params),
    this.api.post(CaseInformationStatisticsUrl.archivesListCount, params)
    ).subscribe(([queryData, countData]) => func(queryData, countData));
  }

  archivesQuery(profile: any, func: Function) {
    zip(
      this.api.post(ADMINISTRATION_URLS_ADMIN.archivesQuery, profile),
      this.api.post(ADMINISTRATION_URLS_ADMIN.countProfile, profile)
    ).subscribe(([queryData, countData]) => func(queryData, countData));
  }

  /**
   * 重复个案统计
   * @param params
   * @param func
   */
  duplicateArchivesList(params: any, func: Function) {
    this.api.post(CaseInformationStatisticsUrl.duplicateArchivesList, params).subscribe(res => func(res));
  }

  /**
   * 市县数据
   * @param params
   * @param func
   */
  urbanCountyList(params: any, func: Function) {
    this.api.post(CaseInformationStatisticsUrl.urbanCountyList, params).subscribe(res => func(res));
  }


  /**
   * 日期出生年月日统计和总数
   * @param params
   * @param func
   */
  queryBirthDateList(params: any, func: Function) {
    zip(
      this.api.post(CaseInformationStatisticsUrl.queryBirthDateList, params),
      this.api.post(CaseInformationStatisticsUrl.queryBirthDateCount, params)
    ).subscribe(([queryData, countData]) => func(queryData, countData));
  }


  /**
   * 根据档案编码删除档案
   * @param vacCode
   * @param func
   */
  deleteProfile(profileCode: string, func: Function) {
    this.api
      .del(CaseInformationStatisticsUrl.deleteProfile + '/' + profileCode)
      .subscribe(result => func(result));
  }

}

import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { VACCINATE_URLS } from '../url-params.const';
import { Observable, zip } from 'rxjs';

@Injectable()
export class VaccinateLogApiService {
  constructor(private api: ApiService) {}

  /**
   * 查询疫苗消耗
   * @param params
   * @param func
   */
  getVaccineConsumes(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.vaccinateLogConsumes, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询接种日志 - 疫苗接种剂次
   * @param params
   * @param func
   */
  getVaccineDosage(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.vaccinateLogDosage, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询疫苗接种明细接口
   * @param params
   * @param func
   */
  getVaccinatedDetails(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.vaccinateLogDetails, params)
      .subscribe(result => func(result));
  }

  /**
   * 接种日志查询3合一接口
   * @param params
   * @param func
   */
  getVaccinateLogAllData(params: any, func: Function) {
    zip(
      this.api.post(VACCINATE_URLS.vaccinateLogConsumes, params),
      this.api.post(VACCINATE_URLS.vaccinateLogDosage, params),
      this.api.post(VACCINATE_URLS.vaccinateLogDetails, params),
      this.api.post(VACCINATE_URLS.vaccinateLogDetailsCount, params)
    ).subscribe(([consumeData, dosageData, detailData, detailDataCount]) =>
      func([consumeData, dosageData, detailData, detailDataCount])
    );
  }

  /**
   * 查询接种日志的统计人数
   * @param params
   * @param func
   */
  getVaccinateLogCount(params: any, func: Function) {
    this.api
      .post(VACCINATE_URLS.vaccinateLogCount, params)
      .subscribe(result => func(result));
  }
}

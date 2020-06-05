/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';

@Injectable()
export class VaccineAgreementModelService {
  constructor(private api: ApiService) {}

  /**
   * 查询告知书模板信息表数据
   * @param params
   * @param func
   */
  queryVaccineAgreementModel(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryVaccineAgreementModel, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询告知书模板信息表数据Count
   * @param params
   * @param func
   */
  queryVaccineAgreementModelCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryVaccineAgreementModelCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 登记台查询告知书模板信息表数据
   * @param params ['A0101','B0202']
   * @param func
   */
  queryVaccineAgreementModelByRegister(
    subclassCodes: string[],
    func: Function
  ) {
    let path = MASTER_URLS.queryVaccineAgreementModelByRegister + '?';
    subclassCodes.forEach(subclassCode => {
      path += 'subclassCodes=' + subclassCode;
    });
    this.api.get(path).subscribe(result => func(result));
  }

  /**
   * 查询告知书模板信息表数据
   * @param params
   * @param func
   */
  queryVaccineAgreementModelByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryBatchByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加告知书模板信息表数据
   * @param params
   * @param func
   */
  addVaccineAgreementModel(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addVaccineAgreementModel, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改告知书模板信息表数据
   * @param params
   * @param func
   */
  updateVaccineAgreementModel(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateVaccineAgreementModel, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除告知书模板信息表数据
   * @param params
   * @param func
   */
  deleteVaccineAgreementModel(params: any, func: Function) {
    this.api
      .del(MASTER_URLS.deleteVaccineAgreementModel, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除告知书模板PDF文件数据
   * @param params
   * @param func
   */
  deleteVaccineAgreementPdf(subclassCode: string, func: Function) {
    this.api
      .del(MASTER_URLS.deleteVaccineAgreementPdf + '/' + subclassCode)
      .subscribe(result => func(result));
  }

}

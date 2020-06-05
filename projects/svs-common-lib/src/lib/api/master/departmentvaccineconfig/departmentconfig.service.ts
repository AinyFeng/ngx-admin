/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { DEPARTMENT_CONFIG, MASTER_URLS } from '../../url-params.const';

@Injectable()
export class DepartmentConfigService {
  constructor(private api: ApiService) { }

  /**
   * 获取部门可接种疫苗列表
   * @param params
   * @param func
   */
  getVaccineListByDept(params: any, func: Function) {
    this.api
      .post(DEPARTMENT_CONFIG.getVaccineListByDept, params)
      .subscribe(result => func(result));
  }

  /**
   * 批量插入部门疫苗配置信息
   * @author ainy
   * @params:
   * @date 2019/11/11 0011
   */
  insertDepartVacConfig(params: any, func: Function) {
    this.api.post(DEPARTMENT_CONFIG.insertBatchDepartVacConfig, params).subscribe(result => func(result));
  }

  /**
   * 删除某个部门下配置的全部疫苗
   * @author AXF
   * @param params
   * @param func
   */
  deleteDepartVacConfig(params: any, func: Function) {
    this.api.post(DEPARTMENT_CONFIG.deleteBatchDepartVacConfig, params).subscribe(result => func(result));
  }
}

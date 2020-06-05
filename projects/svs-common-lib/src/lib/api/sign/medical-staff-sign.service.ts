import { Injectable } from '@angular/core';
import { MASTER_URLS } from '../url-params.const';
import { ApiService } from '../api.service';

@Injectable()
export class MedicalStaffSignService {

  constructor(private api: ApiService) {
  }

  /**
   * 查询医护人员签字信息
   * @author ainy
   * @params:
   * @date 2019/11/8 0008
   */
  queryStaffSignInfo(params: any, func: Function) {
    this.api.post(MASTER_URLS.queryPovStaffSign, params).subscribe(result => func(result));
  }

  /**
   * 插入医护人员签字信息
   * @author ainy
   * @params:
   * @date 2019/11/8 0008
   */
  insertPovStaffSignInfo(params: any, func: Function) {
    this.api.post(MASTER_URLS.insertPovStaffSign, params).subscribe(result => func(result));
  }

  /**
   * 修改医护人员签字信息
   * @author ainy
   * @params:
   * @date 2019/11/8 0008
   */
  updatePovStaffSignInfo(params: any, func: Function) {
    this.api.put(MASTER_URLS.updatePovStaffSign, params).subscribe(result => func(result));
  }
}

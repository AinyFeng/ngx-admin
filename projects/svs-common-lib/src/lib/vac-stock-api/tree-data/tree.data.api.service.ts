import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { DEVICE_URLS } from '../../coldchain-service/coldchain-url-params.const';

@Injectable()
/**
 * 组织树结构相关接口
 */
export class TreeDataApi {

  constructor(private api: ApiService) {
  }

  /**
   * 根据输入地点查询树形结构数据
   * @param areaCode
   * @param func
   */
  queryTreeDataByCityCode(areaCode: string, func: Function) {
    this.api.get(DEVICE_URLS.queryStockTreeDataByCityCode + '/' + areaCode).subscribe(result => func(result));
  }
}

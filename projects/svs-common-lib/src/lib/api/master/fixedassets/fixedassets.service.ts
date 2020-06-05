import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import {
  DEPARTMENT_CONFIG,
  DEVICE_TYPE_URLS,
  FIXED_ASSETS_URLS,
  MASTER_URLS,
  STOCK_URLS
} from '../../url-params.const';
import { forkJoin } from 'rxjs';

@Injectable()
export class FixedassetsService {
  constructor(private api: ApiService) {
  }

  /**
   * 获取固定资产
   * @param workingDayJson
   * @param param2
   */
  getFixedAssets(param, func: Function) {
    const url = FIXED_ASSETS_URLS.queryFixedAssets;
    const countUrl = FIXED_ASSETS_URLS.queryFixedAssetsCount;
    // forkJoin组装query查询和count查询
    forkJoin([
      this.api.post(url, param),
      this.api.post(countUrl, param)
    ]).subscribe({
      next: data => func(data),
      complete: () => console.log('search DeviceType complete')
    });
  }

  /**
   * 插入固定资产
   * @param workingDayJson
   * @param param2
   */
  insert(param, func: Function) {
    this.api
      .post(FIXED_ASSETS_URLS.insert, param)
      .subscribe(resp => {
        func(resp);
      });
  }

  /**
   * 删除
   * @param workingDayJson
   * @param param2
   */
  delete(params, func: Function) {
    this.api
      .post(FIXED_ASSETS_URLS.delete, params)
      .subscribe(resp => {
        func(resp);
      });
  }

  /**
   * 编辑固定资产
   * @param workingDayJson
   * @param param2
   */
  update(param, func: Function) {
    this.api
      .put(FIXED_ASSETS_URLS.edit, param)
      .subscribe(resp => {
        func(resp);
      });
  }

  /**
   * 查询固定资产名称
   * @param params
   */
  queryFixedAssetsNameByCode(params: any) {
    return this.api.post(FIXED_ASSETS_URLS.queryFixedAssets, params);
  }
}

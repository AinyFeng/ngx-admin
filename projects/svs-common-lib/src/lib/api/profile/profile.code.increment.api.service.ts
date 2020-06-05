import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { PROFILE_URLS } from '../url-params.const';

@Injectable()
export class ProfileCodeIncrementApiService {
  constructor(private api: ApiService) { }

  /**
   * 获取儿童档案编码
   * @param povCode
   * @param func
   */
  getChildProfileCode(povCode: string, func: Function) {
    this.api
      .get(PROFILE_URLS.getChildProfileCode + '/' + povCode)
      .subscribe(result => func(result));
  }
}

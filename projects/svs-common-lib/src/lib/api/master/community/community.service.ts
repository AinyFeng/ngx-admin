import { Injectable } from '@angular/core';
import { MASTER_URLS } from '../../url-params.const';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable()
export class CommunityBaseInfoService {
  constructor(private api: ApiService) { }

  /*
   * 查询社区的数据
   * */
  queryCommunityBaseInfo(param: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryCommunityBaseInfo, param)
      .subscribe(resp => func(resp));
  }

  /**
   * 查询社区数据和count二合一接口
   * @params 参数
   * */
  queryCommunityBaseInfoAndCount(params: any, func: Function) {
    zip(
      this.api.post(MASTER_URLS.queryCommunityBaseInfo, params),
      this.api.post(MASTER_URLS.queryCommunityBaseInfoCount, params)
    ).subscribe(resp => func(resp));
  }

  /*
   * 更新社区的数据
   * */
  updateCommunityBaseInfo(param: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateCommunityBaseInfo, param)
      .subscribe(resp => func(resp));
  }

  /*
   * 删除社区的数据
   * */
  deleteCommunityBaseInfo(id: number, func: Function) {
    this.api
      .del(MASTER_URLS.deleteCommunityBaseInfo + '/' + id)
      .subscribe(result => func(result));
  }

  queryCommunityBaseInfoForPipe(params: any): Observable<any> {
    return this.api.post(MASTER_URLS.queryCommunityBaseInfo, params);
  }
}

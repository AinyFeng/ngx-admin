import { Injectable } from '@angular/core';
import { SYSTEM_URLS } from '../url-params.const';
import { zip } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({ providedIn: 'root' })
export class SystemAnnouncementService {

  constructor(private api: ApiService) {
  }

  /**
   * 系统公告
   * @author AXF
   * @params:
   * @date 2019/10/30
   */
  querySysAnnouncementInfo(params: any, func: Function) {
    this.api.post(SYSTEM_URLS.querySysAnnouncement, params).subscribe(result => func(result));
  }

  // 查询系统公告信息和总条数二合一
  querySysAnnouncementInfoAndCount(params: any, func: Function) {
    zip(
      this.api.post(SYSTEM_URLS.querySysAnnouncement, params),
      this.api.post(SYSTEM_URLS.querySysAnnouncementCount, params)
    ).subscribe(result => func(result));

  }
}

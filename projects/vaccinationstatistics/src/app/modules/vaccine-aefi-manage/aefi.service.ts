import {Injectable} from '@angular/core';
import {ApiService, VACCINE_AEFI_MANAGE_URLS} from '@tod/svs-common-lib';

export class AppTitle {
  mainTitle: string;
  subTitle: string;
}

@Injectable({providedIn: 'root'})
/**
 * 用于控制布局中的头部header 或者 底部 footer 的显示或隐藏
 */
export class AEFIService {
  constructor(private api: ApiService) {
  }

  queryAEFIReportList(params: any, func: Function) {
    this.api
      .post(VACCINE_AEFI_MANAGE_URLS.queryAEFIReportList, params)
      .subscribe(result => func(result));
  }

  saveAEFIReport(params: any, func: Function) {
    this.api
      .post(VACCINE_AEFI_MANAGE_URLS.insert, params)
      .subscribe(result => func(result));
  }
}

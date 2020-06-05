import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SysConfInitService } from './sys-conf.init.service';
import { SysConfKey } from './sys-conf.key';

@Injectable()
export class IdCardScanService {
  // https 协议
  private url2 = 'scanIdCard/api/ReadMsg';

  private url2Https = 'https://127.0.0.1:19443/scanIdCard/api/ReadMsg';

  private url2Http = 'http://127.0.0.1:19444/scanIdCard/api/ReadMsg';

  private readonly errorCode = '0x1';

  private accessWayHttp: string = '0';

  constructor(private api: ApiService, private msg: NzMessageService) {
  }

  /**
   * 获取身份证信息
   */
  getIdCardInfo(func: Function) {
    this.api.get(this.url2Https).subscribe(resp => {
      if (resp['retcode'] === this.errorCode || resp['code'] === -1) {
        this.msg.error('未能连接身份证阅读器，请检查是否连接');
        func(null);
        return;
      }
      func(resp);
    });
  }

  /**
   * 根据不同url地址获取
   * @param option
   * @param func
   */
  getIdCardInfoByUrl(option = '0', func: Function) {
    const url = option === this.accessWayHttp ? this.url2Http : this.url2Https;
    this.api.get(url).subscribe(resp => {
      if (resp['retcode'] === this.errorCode || resp['code'] === -1) {
        this.msg.error('未能连接身份证阅读器，请检查是否连接');
        func(null);
        return;
      }
      func(resp);
    });
  }
}

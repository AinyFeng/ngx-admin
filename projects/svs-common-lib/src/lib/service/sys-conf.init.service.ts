import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
export class SysConfInitService {
  private _sysConfData: any[];
  constructor(private localSt: LocalStorageService) {
    const data = localSt.retrieve(LOCAL_STORAGE.SYS_CONF);
    if (data) {
      this._sysConfData = data;
    }
  }

  getSysConfData() {
    return this._sysConfData;
  }

  setSysConfData(value) {
    value.forEach(dict => {
      if (dict.hasOwnProperty('confValue')) {
        dict.defaultValue = dict.confValue;
      }
    });
    this.localSt.store(LOCAL_STORAGE.SYS_CONF, value);
    this._sysConfData = value;
  }

  /**
   * 根据配置项的key 获取参数值
   * @param confName 比如：pulsarUrl
   */
  getConfValue(confName: string) {
    let temp = this._sysConfData.find(conf => conf.confName === confName);
    if (temp === undefined) {
      return undefined;
    } else {
      return temp.defaultValue;
    }
  }
}

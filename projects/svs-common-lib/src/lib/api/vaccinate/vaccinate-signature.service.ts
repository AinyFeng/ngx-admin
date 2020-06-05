import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GOOAGOO_URLS, VACCINATE_URLS} from '../url-params.const';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class VaccinateSignatureService {

  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient) { }

  /**
   * 数据推送至查验设备
   * @param param 参数
   * @param func 回调
   */
  pushToDevice(url, param?: any, func?: Function) {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    let json = 'json=' + JSON.stringify(param);
    this.httpClient.post('/gooagoo/' + url, json, option).subscribe(resp => {
      if (func) {
        func(resp);
      }
    });
  }

  /**
   * 获取签字数据
   * @param param 参数
   * @param func 回调
   */
  getSignature(url, param?: any, func?: Function) {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    let json = 'json=' + JSON.stringify(param);
    this.httpClient.post('/gooagoo/' + url, json, option).subscribe(resp => {
      if (func) {
        func(resp);
      }
    });
  }

  /**
   * 保存签字基本数据
   * @param param 参数
   * @param func 回调
   */
  saveSignature(param?: any, func?: Function) {
    this.apiService.post(VACCINATE_URLS.vaccinateSignatureSave, param).subscribe(resp => {
      if (func) {
        func(resp);
      }
    });
  }

}

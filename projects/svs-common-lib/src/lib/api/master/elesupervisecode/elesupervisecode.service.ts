/**
 * Created by Administrator on 2019/7/17.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MASTER_URLS } from '../../url-params.const';

@Injectable()

/**
 * 查询疫苗电子监管码的信息
 */
export class EleSuperviseCodeService {
  constructor(private api: ApiService) {}

  /**
   * 查询电子监管码表数据
   * @param params
   * @param func
   */
  queryEleSuperviseCode(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryEleSupervisionInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询电子监管码表数据Count
   * @param params
   * @param func
   */
  queryEleSuperviseCodeCount(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.queryEleSupervisionInfoCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询电子监管码表数据
   * @param params
   * @param func
   */
  queryEleSuperviseCodeByGet(params: any, func: Function) {
    this.api
      .get(MASTER_URLS.queryEleSupervisionByGet, params)
      .subscribe(result => func(result));
  }

  /**
   * 添加电子监管码表数据
   * @param params
   * @param func
   */
  addEleSuperviseCode(params: any, func: Function) {
    this.api
      .post(MASTER_URLS.addEleSupervisionInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 修改电子监管码表数据
   * @param params
   * @param func
   */
  updateEleSuperviseCode(params: any, func: Function) {
    this.api
      .put(MASTER_URLS.updateEleSupervisionInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除电子监管码表数据
   * @param params
   * @param func
   */
  deleteEleSuperviseCode(params: any, func: Function) {
    this.api
      .del(MASTER_URLS.deleteEleSupervisionInfo, params)
      .subscribe(result => func(result));
  }

  /**
   * 通过药品电子监管码核验药品
   * @param params
   * @param func
   */
  checkCode(eleCode: string, func: Function) {
    this.api
      .get(MASTER_URLS.checkEleCode + '/' + eleCode)
      .subscribe(result => func(result));
  }
}

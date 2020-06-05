import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { REG_QUEUE } from '../url-params.const';
import { Observable, zip } from 'rxjs';

@Injectable()
export class RegQueueService {
  constructor(private api: ApiService) { }

  /**
   * 自助机取号
   * @ApiImplicitParam(name = "povCode",value = "门诊编码",dataType="String",required = true),
   * @ApiImplicitParam(name = "regCode",value = "登记编号，儿童编码/免疫卡号/身份证号等",dataType="String",required = true),
   * @ApiImplicitParam(name = "businessType",value = "业务类型",dataType="String")
   */
  retrieve(params: any, func: Function) {
    this.api.post(REG_QUEUE.retrieve, params).subscribe(result => func(result));
  }

  /**
   * 在叫号的同时获取排队等候的人数，
   * 先查询人数，再请求叫号，这样就能查到之前的排队人数
   * @param retrieveParams
   * @param waitCountParams
   * @param func
   */
  retrieveAndGetWaitCount(
    retrieveParams: any,
    waitCountParams: any,
    func: Function
  ) {
    zip(
      this.api.post(REG_QUEUE.waitCount, waitCountParams),
      this.api.post(REG_QUEUE.retrieve, retrieveParams)
    ).subscribe(([countData, retrieveData]) => func(countData, retrieveData));
  }

  /**
   * 当前排队的人数
   * @ApiImplicitParam(name = "povCode",value = "门诊编码",dataType="String",required = true),
   * @ApiImplicitParam(name = "curStatus",value = "当前状态",dataType="String",required = true),
   */
  waitCount(params: any, func: Function) {
    this.api
      .post(REG_QUEUE.waitCount, params)
      .subscribe(result => func(result));
  }

  /**
   * 叫号
   * @ApiImplicitParam(name = "globalRecordNumber",value = "排号全局流水号",dataType="String"),
   * @ApiImplicitParam(name = "povCode",value = "门诊编码",dataType="String",required = true),
   * @ApiImplicitParam(name = "curRoom",value = "当前科室编码",dataType="String",required = true),
   * @ApiImplicitParam(name = "curDoc",value = "当前医生编码",dataType="String",required = true),
   * @ApiImplicitParam(name = "curAction",value = "当前行为，会与当前状态做逻辑校验",dataType="String",required = true)
   */
  regCall(params: any, func: Function) {
    this.api.post(REG_QUEUE.regCall, params).subscribe(result => func(result));
  }

  /**
   * 叫号
   * @ApiImplicitParam(name = "globalRecordNumber",value = "排号全局流水号",dataType="String",required = true),
   * @ApiImplicitParam(name = "povCode",value = "门诊编码",dataType="String",required = true),
   * @ApiImplicitParam(name = "curRoom",value = "当前科室编码",dataType="String",required = true),
   * @ApiImplicitParam(name = "curDoc",value = "当前医生编码",dataType="String",required = true),
   * @ApiImplicitParam(name = "curAction",value = "当前行为，会与当前状态做逻辑校验",dataType="String",required = true)
   */
  regCallAgain(params: any, func: Function) {
    this.api
      .post(REG_QUEUE.regCallAgain, params)
      .subscribe(result => func(result));
  }

  /**
   * 过号操作
   * @ApiImplicitParam(name = "globalRecordNumber",value = "排号全局流水号",dataType="String",required = true),
   * @ApiImplicitParam(name = "curRoom",value = "当前科室编码",dataType="String",required = true),
   * @ApiImplicitParam(name = "curDoc",value = "当前医生编码",dataType="String",required = true),
   * @ApiImplicitParam(name = "curAction",value = "当前状态，会与当前状态做逻辑校验",dataType="String",required = true),
   * @ApiImplicitParam(name = "passStatus",value = "变更后过号状态",dataType="String",required = true)   *
   */
  passRegQueue(params: any, func: Function) {
    this.api
      .post(REG_QUEUE.passRegQueue, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询排号队列
   * @ApiImplicitParam(name = "condition.key=povCode",value = "当前门诊编码", dataType="String", required = true),
   * @ApiImplicitParam(name = "condition.key=curStatus",value = "叫号队列当前状态", dataType="String", required = true),
   * @ApiImplicitParam(name = "condition.key=passStatus",value = "叫号队列是否过号" ,dataType="String" ),
   * @ApiImplicitParam(name = "sortBy",value = "排序方式" ,dataType="String"),
   */
  queryQueue(params: any, func: Function) {
    this.api.post(REG_QUEUE.query, params).subscribe(result => func(result));
  }

  /**
   * 查询排号变更记录
   * @ApiImplicitParam(name = "condition.key=povCode",value = "当前门诊编码", dataType="String", required = true),
   * @ApiImplicitParam(name = "condition.key=curAction",value = "操作类型", dataType="String"),
   * @ApiImplicitParam(name = "condition.key=curDoc",value = "医生编码", dataType="String"),
   * @ApiImplicitParam(name = "condition.key=curRoom",value = "部门编码", dataType="String"),
   * @ApiImplicitParam(name = "sortBy",value = "排序方式" ,dataType="String"),
   */
  regQueueStatusChangeRecord(params: any, func: Function) {
    this.api
      .post(REG_QUEUE.regQueueStatusChangeRecord, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询排号变更记录
   * @ApiImplicitParam(name = "globalRecordNumber",value = "排号全局流水号",dataType="String",required = true),
   * @ApiImplicitParam(name = "curRoom",value = "当前科室编码",dataType="String",required = true),
   * @ApiImplicitParam(name = "curDoc",value = "当前医生编码",dataType="String",required = true),
   * @ApiImplicitParam(name = "curStatus",value = "排号当前状态",dataType="String",required = true),
   * @ApiImplicitParam(name = "curAction",value = "当前行为，会与当前状态做逻辑校验",dataType="String",required = true)
   */
  changeStatus(params: any, func: Function) {
    this.api
      .post(REG_QUEUE.changeStatus, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除登记台队列中的排号数据
   * @param params
   * @param func
   */
  removeRegisterQueueData(params: any, func: Function) {
    this.api
      .post(REG_QUEUE.removeRegisterQueueData, params)
      .subscribe(result => func(result));
  }

  /**
   * 删除登记台已叫号队列的排队数据，并向接种台待叫号队列中添加数据
   * @param params
   * @param func
   * @ApiImplicitParam(name = "curDoc", value = "当前登录医生编码", dataType = "String", required = true),
   * @ApiImplicitParam(name = "passTopic", value = "登记台已过号队列主题", dataType = "String"),
   * @ApiImplicitParam(name = "povCode", value = "登录pov编码", dataType = "String"),
   * @ApiImplicitParam(name = "messageId", value = "消息id", dataType = "String"),
   * @ApiImplicitParam(name = "globalRecordNumber", value = "全局流水号", dataType = "String"),
   * @ApiImplicitParam(name = "curRoom", value = "当前科室", dataType = "String"),
   * @ApiImplicitParam(name = "queueCode", value = "排队编号", dataType = "String"),
   * @ApiImplicitParam(name = "vaccinateWaitTopic", value = "接种台待叫号队列主题", dataType = "String"),
   * @ApiImplicitParam(name = "nameSpace", value = "命名空间", dataType = "String")
   */
  removePassedQueueDataAndAddToVaccinateQueue(params: any, func: Function) {
    this.api
      .post(REG_QUEUE.removeRegisterQueueData, params)
      .subscribe(result => func(result));
  }

  /**
   * 将已叫号队列的数据重新放入待叫号队列中
   * @param params
   * @param func
   */
  resetPassedQueueData(params: any, func: Function) {
    this.api
      .post(REG_QUEUE.resetPassedQueueData, params)
      .subscribe(result => func(result));
  }

  /**
   * 查询接种台队列
   * @param params
   * @param func
   * @ApiImplicitParam(name = "povCode", value = "pov编码", dataType = "String", required = true),
   * @ApiImplicitParam(name = "passStatus", value = "过号状态", dataType = "String  0 未过号；1 过号", required = true),
   * @ApiImplicitParam(name = "vaccineList", value = "可接种疫苗产品列表", dataType = "String[]  example:["0101"]", required = true),
   */
  vaccinateQueue(params: any, func: Function) {
    this.api
      .post(REG_QUEUE.vaccinateQueue, params)
      .subscribe(result => func(result));
  }

  /**
   * 接种台获取下一号
   * @param params
   * @param func
   * @ApiImplicitParam(name = "curDoc", value = "接种医生编码", dataType = "String", required = true),
   * @ApiImplicitParam(name = "curRoom", value = "接种部门编码", dataType = "String", required = true),
   * @ApiImplicitParam(name = "povCode", value = "pov编码", dataType = "String", required = true),
   * @ApiImplicitParam(name = "passStatus", value = "过号状态", dataType = "String", required = true),
   * @ApiImplicitParam(name = "vaccineList", value = "疫苗列表", dataType = "["0101"]", required = true),
   */
  vaccinateCall(params: any, func: Function) {
    this.api
      .post(REG_QUEUE.vaccinateCall, params)
      .subscribe(result => func(result));
  }
}

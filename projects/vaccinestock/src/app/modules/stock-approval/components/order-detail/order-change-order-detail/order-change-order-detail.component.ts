import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {DicDataService, VacStockApprovalApiService, DateUtils} from '@tod/svs-common-lib';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'uea-order-change-order-detail',
  templateUrl: './order-change-order-detail.component.html',
  styleUrls: ['./order-change-order-detail.component.scss']
})
export class OrderChangeOrderDetailComponent implements OnInit {

  orderForm: FormGroup;

  private subscription: Subscription[] = [];

  batchNoData = [];
  priceSum: any;

  // 冷藏方式
  refrigerateTypeOptions: any;
  // 运输工具
  transportationOptions: any;

  // 传来的数据
  orderData: any;
  today = new Date();

  constructor(
    private location: Location,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private dicSvc: DicDataService,
    private modalService: NzModalService,
    private api: VacStockApprovalApiService
  ) {
    const sub = this.route.queryParams.subscribe(resp => {
      console.log('传来的数据', resp);
      if (resp) {
        this.orderData = resp;
      }
    });
    this.subscription.push(sub);

    // 获取运输类型
    this.transportationOptions = dicSvc.getDicDataByKey('transportationType');
    // 获取冷藏方式
    this.refrigerateTypeOptions = dicSvc.getDicDataByKey('refrigerateType');
  }

  ngOnInit() {
    this.orderForm = this.fb.group({
      orderNo: [this.orderData ? this.orderData.orderNo : null], // 订单号
      orderStatus: [this.orderData ? this.orderData.orderStatus : null], // 订单状态
      orderDate: [this.orderData ? new Date(parseInt(this.orderData.orderDate, 10)) : null], // 出入库时间
      orderType: [this.orderData ? this.orderData.orderType : null], // 类型
      supplyorgName: [this.orderData ? this.orderData.supplyorgName : null], // 供货单位
      consignorName: [this.orderData ? this.orderData.consignorName : null], // 供货单位经手人
      receiveorgName: [this.orderData ? this.orderData.receiveorgName : null], // 收货单位
      consigneeName: [this.orderData ? this.orderData.consigneeName : null], // 收货单位经手人
      transportation: [this.orderData ? this.orderData.transportation : null], // 疫苗运输工具
      otherTransportation: [this.orderData ? this.orderData.otherTransportation : null], // 疫苗运输工具其他
      refrigerateType: [this.orderData ? this.orderData.refrigerateType : null], // 疫苗冷藏方式
      otherRefrigerateType: [this.orderData ? this.orderData.otherRefrigerateType : null], // 疫苗冷藏方式 其他
      vaccineType: [this.orderData ? this.orderData.vaccineType : null], // 疫苗类型
      memo: [this.orderData ? this.orderData.memo : null], // 备注信息
      entrystaffName: [this.orderData ? this.orderData.entrystaffName : null], // 填报人
      createorgName: [this.orderData ? this.orderData.createorgName : null], // 使用单位
    });
    this.queryDetail();
  }

  // 查看详情
  queryDetail() {
    const params = {
      serialCode: this.orderData.serialCode,
    };
    this.batchNoData = [];
    this.api.queryStockApprovalDetailAndAmount(params, resp => {
      console.log('结果', resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) {
        return;
      }
      this.batchNoData = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data')) {
        return;
      }
      this.priceSum = resp[1].data[0];
    });
  }

  // 返回
  goBack() {
    this.location.back();
  }


}

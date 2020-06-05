import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DicDataService, OrderService } from '@tod/svs-common-lib';
import { NzModalRef } from 'ng-zorro-antd';


@Component({
  selector: 'uea-vaccine-order-information',
  templateUrl: './vaccine-order-information.component.html',
  styleUrls: ['./vaccine-order-information.component.scss']
})
export class VaccineOrderInformationComponent implements OnInit {


  @Input()
  querydetailParam: any;

  orderForm: FormGroup;

  vaccData = [];

  // 冷藏方式
  refrigerateTypeOptions: any;
  // 运输工具
  transportationOptions: any;

  today = new Date();
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dicSvc: DicDataService,
    private orderSvr: OrderService,
    private modalRef: NzModalRef<VaccineOrderInformationComponent>
  ) {
    // 获取运输类型
    this.transportationOptions = dicSvc.getDicDataByKey('transportationType');
    // 获取冷藏方式
    this.refrigerateTypeOptions = dicSvc.getDicDataByKey('refrigerateType');
  }

  ngOnInit() {
    this.orderForm = this.fb.group({
      orderNo: this.querydetailParam ? this.querydetailParam.orderNo : null, // 订单号
      orderStatus: this.querydetailParam ? this.querydetailParam.orderStatus : null, // 订单状态
      orderDate: this.querydetailParam ? this.querydetailParam.orderDate : null, // 出入库时间
      orderType: this.querydetailParam ? this.querydetailParam.orderType : null, // 类型
      supplyorgName: this.querydetailParam ? this.querydetailParam.supplyorgName : null, // 供货单位
      consignorName: this.querydetailParam ? this.querydetailParam.consignorName : null, // 供货单位经手人
      receiveorgName: this.querydetailParam ? this.querydetailParam.receiveorgName : null, // 收货单位
      consigneeName: this.querydetailParam ? this.querydetailParam.consigneeName : null, // 收货单位经手人
      transportation: this.querydetailParam ? this.querydetailParam.transportation : null, // 疫苗运输工具
      otherTransportation: this.querydetailParam ? this.querydetailParam.otherTransportation : null, // 疫苗运输工具其他
      refrigerateType: this.querydetailParam ? this.querydetailParam.refrigerateType : null, // 疫苗冷藏方式
      otherRefrigerateType: this.querydetailParam ? this.querydetailParam.otherRefrigerateType : null, // 疫苗冷藏方式 其他
      vaccineType: this.querydetailParam ? this.querydetailParam.vaccineType : null, // 疫苗类型
      memo: this.querydetailParam ? this.querydetailParam.memo : null, // 备注信息
      entrystaffName: this.querydetailParam ? this.querydetailParam.entrystaffName : null, // 填报人
      createorgName: this.querydetailParam ? this.querydetailParam.createorgName : null, // 使用单位
    });
    this.queryDetail();
  }

  // 查看详情
  queryDetail() {
    const params = {
      orderNo: this.querydetailParam.orderNo,
    };
    this.orderSvr.queryVacInOutInfoDetail(params, resp => {
      if (!resp || resp.code !== 0 || !resp.hasOwnProperty('data')) {
        return;
      }
      this.vaccData = resp.data;
    });
  }

  close() {
    this.modalRef.close();
  }
}

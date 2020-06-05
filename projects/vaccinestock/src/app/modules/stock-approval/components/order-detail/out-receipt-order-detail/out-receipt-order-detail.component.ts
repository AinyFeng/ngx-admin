import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {DicDataService, VacStockApprovalApiService, DateUtils} from '@tod/svs-common-lib';
import {NzModalService} from 'ng-zorro-antd';
import {NotifierService} from 'angular-notifier';
import {OutInDateComponent} from '../../../../stock-shared/components/out-in-date/out-in-date.component';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-out-receipt-order-detail',
  templateUrl: './out-receipt-order-detail.component.html',
  styleUrls: ['./out-receipt-order-detail.component.scss']
})
export class OutReceiptOrderDetailComponent implements OnInit {

  orderForm: FormGroup;

  private subscription: Subscription[] = [];

  batchNoData = [];
  priceSum: any;

  // 冷藏方式
  refrigerateTypeOptions: any;
  // 运输工具
  transportationOptions: any;
  userInfo: any;

  // 传来的数据
  orderData: any;

  constructor(
    private location: Location,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private dicSvc: DicDataService,
    private modalService: NzModalService,
    private api: VacStockApprovalApiService,
    private notifierService: NotifierService,
    private userSvc: UserService
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
    // 获取登录人信息
    userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
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

  // 开票确认 和失败
  sureInvoice(flag: boolean) {
    if (!flag) {
      this.modalService.confirm({
        nzTitle: '提示',
        nzContent: `<p>是否确认开票失败?</p>`,
        nzMaskClosable: true,
        nzOkText: '确定',
        nzCancelText: '取消',
        nzOnOk: () => {
          this.invoice(flag);
        }
      });
    } else {
      /*const modal = this.modalService.create({
        nzTitle: '信息',
        nzContent: OutInDateComponent,
        nzComponentParams: {
          title: '出库时间'
        },
        nzFooter: [
          {
            label: '出库确定',
            type: 'primary',
            onClick: comp => {
              modal.close(comp.outDate);
            }
          },
          {
            label: '取消',
            type: 'default',
            onClick: () => modal.close()
          }
        ]
      });
      // 订阅关闭时获取的数值
      modal.afterClose.subscribe(res => {
        console.log('结果', res);
        if (res) {
          this.outDate = res;
          this.invoice(flag);
        }
      });*/
    }
  }

  // 开票成功和开票失败的调用
  invoice(flag: boolean) {
    let params = JSON.parse(JSON.stringify(this.orderForm.value));
    params['orderDate'] = DateUtils.getTimestamp(this.orderForm.get('orderDate').value);
    params['orderStatus'] = [];
    params['serialCode'] = this.orderData.serialCode;
    if (flag) {
      // 开票成功 - 0
      params['statusNum'] = '0';
    } else {
      // 开票失败 - 1
      params['statusNum'] = '1';
    }
    console.log('参数', params);
    this.api.queryApproval(params, resp => {
      if (resp.code === 0) {
        if (flag) {
          this.notifierService.notify('success', '开票成功');
        }
      }
    });
  }

}

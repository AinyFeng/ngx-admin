import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DateUtils, OrderService,
  VacStockCheckPlanApiService
} from '@tod/svs-common-lib';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { VaccineOrderInformationComponent } from '../vaccine-order-information/vaccine-order-information.component';


@Component({
  selector: 'in-out-report-detail',
  templateUrl: './in-out-report-detail.component.html',
  styleUrls: ['./in-out-report-detail.component.scss']
})

export class InOutReportDetailComponent implements OnInit {

  reportDetailForm: FormGroup;

  /**
   * 查询参数
   */
  @Input()
  queryParams: any;
  @Input()
  userInfo: any;

  subclassCodeOptions = [];

  manufactureOptions = [];

  reportDetailData = [];

  orderDetailParam: any;

  total = 0;
  pageIndex = 1;
  loading = false;

  constructor(private fb: FormBuilder,
              private vacApiSvc: VacStockCheckPlanApiService,
              private modalSvc: NzModalService,
              private orderSvr: OrderService,
              private modalRef: NzModalRef<InOutReportDetailComponent>
  ) {
  }

  ngOnInit(): void {
    this.reportDetailForm = this.fb.group({
      vaccineType: this.queryParams ? (this.queryParams.vaccineType === '1' ? '二类' : '一类') : null, // 疫苗类型
      vaccineSubclassCode: this.queryParams ? this.queryParams.vaccineSubclassCode : null, // 疫苗小类
      vaccineSubclassName: this.queryParams ? this.queryParams.vaccineSubclassName : null, // 疫苗小类名称
      manufactureCode: this.queryParams ? this.queryParams.manufactureCode : null, // 生产企业编码
      manufactureName: this.queryParams ? this.queryParams.manufactureName : null, // 生产企业名称
      outboundDate: this.queryParams ? this.queryParams.outboundDate : null, // 起始日期
      outboundDateBreak: this.queryParams ? this.queryParams.outboundDateBreak : null, // 截止日期
      batchno: this.queryParams ? this.queryParams.batchno : null, // 疫苗批号
      inventorySerialCode: this.queryParams ? this.queryParams.inventorySerialCode : null, // 库存编号
      sellPrice: this.queryParams ? this.queryParams.sellPrice : null, // 疫苗售价
    });
    this.queryReportDetail();
  }

  queryReportDetail() {
    const query = {
      outboundDate: DateUtils.getFormatDateTime(this.queryParams['outboundDate']),
      outboundDateBreak: DateUtils.getFormatDateTime(this.queryParams['outboundDateBreak']),
      inventorySerialCode: this.queryParams['inventorySerialCode'],
      sellPrice: this.queryParams['sellPrice'],
      storeCode: this.userInfo.pov
    };
    this.loading = true;
    this.vacApiSvc.queryInAndOutReportDetailAndCount(query, ([queryData, countData]) => {
      this.loading = false;
      if (queryData.code === 0) {
        this.reportDetailData = queryData.data;
      }
      if (countData.code === 0) {
        this.total = countData.data[0].count;
      }
    });
  }

  /**
   * 按订单号查询
   * @param data
   */
  queryOrderInfo(data: any) {
    const params = {
      orderNo:  data['orderNo'],
    };
    params['outboundDate'] = DateUtils.getFormatDateTime(this.queryParams['outboundDate']);
    params['outboundDateBreak'] = DateUtils.getFormatDateTime(this.queryParams['outboundDateBreak']);
    this.loading = true;
    this.orderSvr.queryVacInOutInfo(params, resp => {
      this.loading = false;
      if (!resp[0] || resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) {
        return;
      }
      this.orderDetailParam = resp[0].data[0];
      this.detail();
    });

  }

  detail() {
    this.modalSvc.create({
      nzTitle: '疫苗订单信息',
      nzContent: VaccineOrderInformationComponent,
      nzWidth: '1300px',
      nzComponentParams: {
        querydetailParam:  this.orderDetailParam,
      },
      nzFooter: [
        {
          label: '关闭',
          type: 'primary',
          onClick: (comp) => {
            comp.close();
          }
        }
      ]
    });
  }

  close() {
    this.modalRef.close();
  }
}

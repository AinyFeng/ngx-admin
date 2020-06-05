import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LodopPrintService, VaccStockApiService } from '@tod/svs-common-lib';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'uea-check-plan-detail',
  templateUrl: './check-plan-detail.component.html',
  styleUrls: ['./check-plan-detail.component.scss']
})
export class CheckPlanDetailComponent implements OnInit {

  /**
   * 已选计划信息
   */
  @Input()
  selectedData: any;

  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  listOfData = [];
  // 打印机加载错误
  error: boolean;
  showError: boolean;
  // 打印盘点计划信息
  @ViewChild('printCheckPlan', {static: false}) printCheckPlan: any;
  // 盘点计划打印
  printCheckPlanInfo = {
    id: 'stock_check_plan', // 盘点计划信息单id
    orderInfo: {}, // 订单信息
    vaccineInfo: [], // 疫苗信息
  };

  constructor(
    private modalRef: NzModalRef<CheckPlanDetailComponent>,
    private lodopPrintSvc: LodopPrintService,
    private vacStocApiSvc: VaccStockApiService
  ) {
    // 初始化打印机
    this.lodopPrintSvc.getLodopStatus().subscribe(status => {
      this.showError = status ? status : !status;
      this.error = status;
    });
  }

  ngOnInit(): void {
    this.printCheckPlanInfo.orderInfo = this.selectedData;
    this.queryData();
  }


  // 查询计划明细
  queryData(page = 1) {
    this.pageIndex = page;
    this.listOfData = [];
    // 查询条件
    const params = {
      serialCode: this.selectedData.serialCode,
      planSerialCode: this.selectedData.planSerialCode,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    console.log('参数', params);
    this.listOfData = [];
    this.vacStocApiSvc.queryPlanDetailAndCount(params, ([queryData, countData]) => {
      console.log('盘点计划明细结果', queryData, countData);
      this.loading = false;
      if (queryData.code === 0) {
        this.listOfData = queryData.data;
      }
      if (countData.code === 0) {
        this.total = countData.data[0]['count'];
        const vaccineDetail = [];
        for (let i = 0; i < queryData.data.length; i++) {
          vaccineDetail.push(queryData.data[i]);
        }
        if (queryData.data.length > 0 && queryData.data.length < 10) {
          for (let i = queryData.data.length; i < 12; i++) {
            vaccineDetail.push('');
          }
        }
        this.printCheckPlanInfo.vaccineInfo = vaccineDetail;
      }
    });
  }

  // 打印盘点计划
  printCheckPlanDetail(preview: boolean) {
    if (this.error) {
      return;
    }
    this.printCheckPlan.print(preview);
  }

  close() {
    this.modalRef.close();
  }
}

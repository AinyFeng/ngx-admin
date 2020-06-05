import { Component, OnInit } from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {StockService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-city-in-detail',
  templateUrl: './city-in-detail.component.html',
  styleUrls: ['../../stock.common.scss']
})
export class CityInDetailComponent implements OnInit {

  // 市平台订单信息
  instockInfo: any;
  listOfData = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  constructor(
    private ref: NbDialogRef<CityInDetailComponent>,
    private stockService: StockService,
  ) { }

  ngOnInit() {
    this.searchDetail();
  }
  // 根据疫苗的名称、批号、等查询具体已使用的详情
  searchDetail(page = 1) {
    const params = {
      acceptanceSerial: this.instockInfo.acceptanceSerial,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('param', params);
    this.loading = true;
    this.pageIndex = page;
    this.stockService.cityInDetails(params, resp => {
      console.log('市平台疫苗详情 ===', resp);
      this.loading = false;
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      }
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
      } else {
        this.total = 0;
      }
    });
  }
  // 关闭弹窗
  onClose() {
    this.ref.close();
  }
}

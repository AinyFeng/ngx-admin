import { Component, OnInit } from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {UserService} from '@tod/uea-auth-lib';
import {StockService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-vacc-used-detail',
  templateUrl: './vacc-used-detail.component.html',
  styleUrls: ['../../admin.common.scss']
})
export class VaccUsedDetailComponent implements OnInit {

  // 从疫苗使用详情页面中带入)
  vaccinetInfo: any;
  listOfData = [];
  userInfo: any;
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  constructor(
    private ref: NbDialogRef<VaccUsedDetailComponent>,
    private user: UserService,
    private stockService: StockService,
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    this.searchDetail();
  }
  // 根据疫苗的名称、批号、等查询具体已使用的详情
  searchDetail() {
    const params = {
      povCode: this.userInfo.pov,
      prodBatchCode: this.vaccinetInfo.prodBatchCode,
      vaccProductCode: this.vaccinetInfo.vaccProductCode,
      manufacturerCode: this.vaccinetInfo.manufacturerCode,
    };
    console.log('param', params);
    this.loading = true;
    this.stockService.vacUsedDetails(params, resp => {
      console.log('疫苗使用详情--进一步查询详情 ===', resp);
      this.loading = false;
      // 解析表格数据
      if (resp && resp.code === 0) {
        this.listOfData = resp.data;
      }
    });
  }
  // 关闭弹窗
  onClose() {
    this.ref.close();
  }
}

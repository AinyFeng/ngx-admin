import { Component, OnInit } from '@angular/core';
// import { LocalDataSource } from 'ng2-smart-table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
// import { UserService } from '@tod/uea-auth-lib';
import { UserService } from '@tod/uea-auth-lib';
import { StockService, VaccineSubclassInitService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-batch-search',
  templateUrl: './batch-search.component.html',
  styleUrls: ['../admin.common.scss']
})
export class BatchSearchComponent implements OnInit {
  batchFrom: FormGroup;
  userInfo: any;
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  listOfData: any[] = [];
  // 疫苗小类名称
  vacSubClassData = [];
  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private stockService: StockService,
    private dialogService: NbDialogService,
    private vacSubClassSvc: VaccineSubclassInitService,
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }
  ngOnInit() {
    // 获取疫苗小类
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    this.batchFrom = this.fb.group({
      batchNo: [null],
      vaccineProductCode: [null],
      issuedBatchNo: [null]
    });
    this.searchData();
  }
  //  查询
  searchData(page = 1) {
    this.pageIndex = page;
    let batchFrom = JSON.parse(JSON.stringify(this.batchFrom.value));
    const params = {
      batchNo: batchFrom.batchNo,
      vaccineProductCode: batchFrom.vaccineProductCode,
      issuedBatchNo: batchFrom.issuedBatchNo,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.stockService.queryBatch(params, resp => {
      console.log('resp===', resp);
      this.loading = false;
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      } else {
        this.listOfData = [];
      }
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
      } else {
        this.total = 0;
      }
    });
  }
  // 重置
  reset() {
    this.loading = false;
    this.batchFrom.reset();
  }
}

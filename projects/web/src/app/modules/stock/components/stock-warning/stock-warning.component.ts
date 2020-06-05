import { Component, OnInit } from '@angular/core';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import {StockService, VaccineSubclassInitService} from '@tod/svs-common-lib';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'uea-stock-warning',
  templateUrl: './stock-warning.component.html',
  styleUrls: ['../stock.common.scss']
})
export class StockWarningComponent implements OnInit {
  listOfData = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  userInfo: any;
  form: FormGroup;
  // 小类下拉options
  vacSubClassData = [];
  constructor(
    private stockService: StockService,
    private user: UserService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private vacSubClassSvc: VaccineSubclassInitService
  ) {
    // 拉取疫苗小类的数据
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }
  ngOnInit() {
    this.form = this.fb.group({
      vaccineSubclassCode: [[]],
      prodBatchCode: [null],
    });
    this.toSearch();
  }
  // 查询
  toSearch(page = 1) {
    if (this.loading) return;
    const params = {
      vaccineSubclassCode: this.form.value.vaccineSubclassCode,
      prodBatchCode: this.form.value.prodBatchCode,
      povCode: this.userInfo.pov,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('params', params);
    this.loading = true;
    this.stockService.queryPresell(params, resp => {
      console.log('预售===', resp);
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
    this.form = this.fb.group({
      vaccineSubclassCode: [[]],
      prodBatchCode: [null],
    });
  }

}

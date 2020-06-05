import { Component, OnInit } from '@angular/core';
// import { LocalDataSource } from 'ng2-smart-table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { StockService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-electron-code-manage',
  templateUrl: './electron-code-manage.component.html',
  styleUrls: ['../admin.common.scss']
})
export class ElectronCodeManageComponent implements OnInit {
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  eleCodeFrom: FormGroup;
  listOfData: any[] = [];
  constructor(
    private stockServce: StockService,
    private msg: NzMessageService,
    private fb: FormBuilder
  ) { }
  ngOnInit() {
    this.eleCodeFrom = this.fb.group({
      eleCode: [null] // 电子码
    });
    this.searchData();
  }
  // 根据电子码查询
  searchData(reset?: Boolean) {
    //  如果在查询的时候,则停止查询并禁止按钮不能点击
    if (this.loading) return;
    let eleCodeFrom = JSON.parse(JSON.stringify(this.eleCodeFrom.value));
    // 组装查询条件
    const params = {
      eleCode: eleCodeFrom.eleCode,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.stockServce.queryEleSupervisionInfo(params, resp => {
      this.loading = false;
      console.log('resp', resp);
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        /*console.log('电子监管码码信息===', searchDataList);*/
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
  // 重置
  reset() {
    this.eleCodeFrom.reset();
    this.loading = false;
    this.listOfData = [];
  }
}

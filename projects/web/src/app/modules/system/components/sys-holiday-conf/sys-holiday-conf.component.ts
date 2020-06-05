import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { DicDataService, ApiSystemHolidayDayService } from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { SysHolidayAddComponent } from '../sys-holiday-add/sys-holiday-add.component';


@Component({
  selector: 'uea-sys-holiday-conf',
  templateUrl: './sys-holiday-conf.component.html',
  styleUrls: ['../system.common.scss'],
  providers: [
    ApiSystemHolidayDayService
  ],

})
export class SysHolidayConfComponent implements OnInit {

  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  listOfData: any[] = [];

  holidayForm: FormGroup;

  userInfo: any;

  constructor(
    private thisApiService: ApiSystemHolidayDayService,
    private dialogService: NbDialogService,
    private dicSvc: DicDataService,
    private fb: FormBuilder,
    private userSvc: UserService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.reset();
    this.searchData();
  }

  /*查询数据*/
  searchData(page = 1) {
    this.pageIndex = page;
    // 查询条件组装
    let param = {
      povCode: this.userInfo.pov,
      holidayType: this.holidayForm.get('holidayType').value,
      useAble: this.holidayForm.get('useAble').value,
      holidayName: this.holidayForm.get('holidayName').value,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize,
      }
    };
    console.log('参数====', param);
    this.loading = true;
    // 调用apiService查询数据
    this.thisApiService.searchDateAndCount(param, resp => {
      this.loading = false;
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析表格数据
      console.log('节假日信息====', resp);
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      } else {
        this.listOfData = [];
      }
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
        console.log('total====', this.total);
      } else {
        this.total = 0;
      }
    });
  }

  // 设置可用
  setUseAble(holidayCode, useAble) {
    let param = {
      useAble: useAble,
      holidayCode: holidayCode,
      createBy: this.userInfo.name
    };
    this.thisApiService.setUseAble(param, data => {
      if (data && data.code === 0) {
        this.searchData(this.pageIndex);
      }
    });
  }

  // 新增节假日
  addForm() {
    this.dialogService
      .open(SysHolidayAddComponent, {
        context: {},
        hasBackdrop: true
      })
      .onClose.subscribe(result => {
        if (result) {
          console.log('添加节假日成功！');
          this.searchData(this.pageIndex);
        }
      });
  }

  reset() {
    this.holidayForm = this.fb.group({
      useAble: [null], // 是否可用 0-否 1-是
      holidayType: [null], // 节假日类型 1-公历节假日 2-农历节假日 9-节后补班
      holidayName: [null],
    });
    this.listOfData = [];
  }
}

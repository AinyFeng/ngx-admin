import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { SysWorkingDayAddComponent } from '../sys-working-day-add/sys-working-day-add.component';
import { DicDataService, ApiSystemWorkingDayService } from '@tod/svs-common-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-sys-working-day',
  templateUrl: './sys-working-day.component.html',
  styleUrls: ['../system.common.scss']
})
export class SysWorkingDayComponent implements OnInit {
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  listOfData: any[] = [];
  workingRoundOptions = [];
  workingForm: FormGroup;

  userInfo: any;

  constructor(
    private thisApiService: ApiSystemWorkingDayService,
    private dialogService: NbDialogService,
    private dicSvc: DicDataService,
    private fb: FormBuilder,
    private userSvc: UserService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.workingRoundOptions = this.dicSvc.getDicDataByKey('workingRound');
    this.reset();
    this.searchData();
  }

  /*查询数据*/
  searchData(page = 1) {
    this.pageIndex = page;
    // 查询条件组装
    let param = {
      povCode: this.userInfo.pov,
      useAble: this.workingForm.get('useAble').value,
      workingRound: this.workingForm.get('workingRound').value,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize,
      }
    };
    this.loading = true;
    // 调用apiService查询数据
    this.thisApiService.searchDateAndCount(param, resp => {
      this.loading = false;
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      console.log('工作日信息====', resp);
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

  setUseAble(workingDaySerial, useAble) {
    let param = {
      useAble: useAble,
      workingDaySerial: workingDaySerial,
      createBy: this.userInfo.name
    };
    this.thisApiService.setUseAble(param, data => {
      if (data && data.code === 0) {
        this.searchData(this.pageIndex);
      }
    });
  }

  // 新增
  addForm() {
    this.dialogService
      .open(SysWorkingDayAddComponent, {
        context: {},
        hasBackdrop: true
      })
      .onClose.subscribe(result => {
      if (result) {
        this.searchData(this.pageIndex);
      }
    });
  }

  reset() {
    this.workingForm = this.fb.group({
      workingRound: [null], // 周期 0-单周 1-双周 2-月
      useAble: [null], // 是否可用 0-否 1-是
    });
    this.listOfData = [];
  }
}

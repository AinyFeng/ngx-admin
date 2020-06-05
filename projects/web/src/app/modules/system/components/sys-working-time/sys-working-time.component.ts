import { Component, OnInit } from '@angular/core';
import { UserService } from '@tod/uea-auth-lib';
import { NbDialogService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { SysWorkingTimeAddComponent } from '../sys-working-time-add/sys-working-time-add.component';
import { ApiSystemWorkingTimeService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-sys-working-time',
  templateUrl: './sys-working-time.component.html',
  styleUrls: ['../system.common.scss']
})
export class SysWorkingTimeComponent implements OnInit {
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  listOfData: any[] = [];
  // 用户信息
  userInfo: any;
  // 是否可用
  useAble: string;
  constructor(
    private sysWorkingTimeApiSvc: ApiSystemWorkingTimeService,
    private userSvc: UserService,
    private dialogSvc: NbDialogService,
    private msg: NzMessageService
  ) {
    this.userSvc.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    this.searchData();
  }


  /*查询数据*/
  searchData(page = 1) {
    this.pageIndex = page;
    // 查询条件组装
    let param = {
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      },
      povCode: this.userInfo.pov,
      useAble: this.useAble === '' ? null : this.useAble
    };
    this.loading = true;
    console.log('查询参数====', param);
    // 调用apiService查询数据
    this.sysWorkingTimeApiSvc.searchDateAndCount(param, resp => {
      this.loading = false;
      console.info(resp);
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

  reset() {
    this.listOfData = [];
  }

  /**
   * 添加一个工作日
   */
  addWorkingDay() {
    this.dialogSvc.open(SysWorkingTimeAddComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    })
      .onClose
      .subscribe(resp => {
        if (resp) {
          this.searchData(this.pageIndex);
        }
      });
  }
}

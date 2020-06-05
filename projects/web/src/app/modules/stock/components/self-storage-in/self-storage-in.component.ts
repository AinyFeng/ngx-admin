import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '@tod/uea-auth-lib';
import {NzMessageService} from 'ng-zorro-antd';
import {NbDateService, NbDialogService} from '@nebular/theme';
import {SelfStorageAddComponent} from '../dialog/self-storage-add/self-storage-add.component';
import {
  StockService
} from '@tod/svs-common-lib';
import * as moment from 'moment';
import {Moment} from 'moment';


@Component({
  selector: 'uea-self-storage-in',
  templateUrl: './self-storage-in.component.html',
  styleUrls: ['../stock.common.scss']
})
export class SelfStorageInComponent implements OnInit {
  searchFrom: FormGroup;
  userInfo: any;
  listOfData: any[] = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  /**
   * 当前日期
   */
  currentDate = moment();
  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private stockService: StockService,
    private dialogService: NbDialogService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    // 查询from
    this.searchFrom = this.fb.group({
      DateStart: [moment(new Date())], // 出入库时间
      DateEnd: [moment(new Date())], // 出入库时间
    });
    this.searchData(1);
  }

  // 重置
  reset() {
    this.searchFrom = this.fb.group({
      DateStart: [moment(new Date())], // 出入库时间
      DateEnd: [moment(new Date())], // 出入库时间
    });
  }
  //  查询
  searchData(page = 1) {
    const params = {
      povCode: this.userInfo.pov,
      startTime: this.searchFrom.get('DateStart').value.format('YYYY-MM-DD') + ' 00:00:00', // 获取当天的时间
      endTime: this.searchFrom.get('DateEnd').value.format('YYYY-MM-DD') + ' 23:59:59',
      stockChangeEvent: '7', // 业务类型: 其他出入库
      isStockIn: '1', // 入库
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.pageIndex = page;
    this.loading = true;
    this.stockService.queryInAndOutDetail(params, resp => {
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
  // 弹出新增窗口 新增自采入库
  addSelfStorage() {
    this.dialogService.open(SelfStorageAddComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        this.searchData(this.pageIndex);
      }
    });
  }

  /**
   * 过滤修改日期 - 起
   * @param d
   */
  filterStartDate = (d: Moment) => {
    const endDate = this.searchFrom.get('DateEnd').value;
    if (endDate) {
      return d <= endDate;
    }
    return d <= this.currentDate;
  }
  /**
   * 过滤修改日期 - 止
   * @param d
   */
  filterEndDate = (d: Moment) => {
    const startDate = this.searchFrom.get('DateStart').value;
    if (startDate) {
      return d >= startDate && d <= this.currentDate;
    }
    return d <= this.currentDate;
  }
}

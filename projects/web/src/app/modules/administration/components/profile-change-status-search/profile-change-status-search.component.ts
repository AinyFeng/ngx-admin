import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DateUtils,
  FILE_TYPE,
  FILE_TYPE_SUFFIX,
  FileDownloadUtils,
  ProfileStatusChangeService, StockExportService
} from '@tod/svs-common-lib';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { DicDataService } from '@tod/svs-common-lib';
import * as moment from 'moment';
import { Moment } from 'moment';
import { NbMomentDateService } from '@nebular/moment';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-profile-change-status-search',
  templateUrl: './profile-change-status-search.component.html',
  styleUrls: ['../admin.common.scss'],
  providers: [
    NbMomentDateService
  ]
})
export class ProfileChangeStatusSearchComponent implements OnInit {
  listOfData: any[] = [];
  residentSearch: FormGroup;
  userInfo: any;
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  currentNow = moment();

  // 在册状态
  profileStatusChange = [];
  // 变更原因
  profileStatusChangeReason = [];

  constructor(
    private fb: FormBuilder,
    private thisApiService: ProfileStatusChangeService,
    private msg: NzMessageService,
    private dicSvc: DicDataService,
    private exportSvc: StockExportService,
    private userSvc: UserService,
    private modalSvc: NzModalService,
    private dialogService: NbDialogService,
    private momentSvc: NbMomentDateService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => (this.userInfo = user));
    this.profileStatusChange = this.dicSvc.getDicDataByKey(
      'profileStatusChange'
    );
    this.profileStatusChangeReason = this.dicSvc.getDicDataByKey(
      'profileStatusChangeReason'
    );
    // 在册变更查询条件
    this.residentSearch = this.fb.group({
      name: [null], // 姓名
      profileCode: [null],
      birthStart: [null],
      birthEnd: [null],
      changeStartDate: [null],
      changeEndDate: [null],
      preProfileStatus: [null],
      curProfileStatus: [null],
      changeReason: [null],
      memo: [null]
    });
  }

  ngOnInit(): void {
    this.searchData();
  }

  /**
   * 过滤出生日期 - 起
   * @param d
   */
  filterBirthStartDate = (d: Moment) => {
    const endDate = this.residentSearch.get('birthEnd').value;
    if (endDate) {
      return d <= endDate;
    }
    return d <= this.currentNow;
  }

  /**
   * 过滤出生日期 - 止
   * @param d
   */
  filterBirthEndDate = (d: Moment) => {
    const startDate = this.residentSearch.get('birthStart').value;
    if (startDate) {
      return d >= startDate && d <= this.currentNow;
    }
    return d <= this.currentNow;
  }

  /**
   * 过滤修改日期 - 起
   * @param d
   */
  filterChangeStartDate = (d: Moment) => {
    const endDate = this.residentSearch.get('changeEndDate').value;
    if (endDate) {
      return d <= endDate;
    }
    return d <= this.currentNow;
  }

  /**
   * 过滤修改日期 - 止
   * @param d
   */
  filterChangeEndDate = (d: Moment) => {
    const startDate = this.residentSearch.get('changeStartDate').value;
    if (startDate) {
      return d >= startDate && d <= this.currentNow;
    }
    return d <= this.currentNow;
  }

  /**
   * 在册变更查询
   * */
  searchData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    if (this.residentSearch.get('birthStart').value && this.residentSearch.get('birthEnd').value) {
      let start = this.residentSearch.get('birthStart').value.format('YYYY-MM-DD');
      let end = this.residentSearch.get('birthEnd').value.format('YYYY-MM-DD');
      if (moment(end).isBefore(start)) {
        this.msg.warning('你输入的出生日期起时间晚于止时间');
        return;
      }
    }
    if (this.residentSearch.get('changeStartDate').value && this.residentSearch.get('changeEndDate').value) {
      let start = this.residentSearch.get('changeStartDate').value.format('YYYY-MM-DD');
      let end = this.residentSearch.get('changeEndDate').value.format('YYYY-MM-DD');
      if (moment(end).isBefore(start)) {
        this.msg.warning('你输入的变更日期起时间晚于止时间');
        return;
      }
    }
    const params = {
      changeReason: this.residentSearch.get('changeReason').value === '' || !this.residentSearch.get('changeReason').value ? null : this.residentSearch.get('changeReason').value,
      preProfileStatus: this.residentSearch.get('preProfileStatus').value,
      curProfileStatus: this.residentSearch.get('curProfileStatus').value,
      name: this.residentSearch.get('name').value === '' || !this.residentSearch.get('name').value ? null : this.residentSearch.get('name').value,
      profileCode: this.residentSearch.get('profileCode').value === '' || !this.residentSearch.get('profileCode').value ? null : this.residentSearch.get('profileCode').value,
      curPov: this.userInfo.pov,
      birthDate: {
        start: this.residentSearch.get('birthStart').value ? this.residentSearch.get('birthStart').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
        end: this.residentSearch.get('birthEnd').value ? this.residentSearch.get('birthEnd').value.format('YYYY-MM-DD') + ' 23:59:59' : null
      },
      changeDate: {
        start: this.residentSearch.get('changeStartDate').value ? this.residentSearch.get('changeStartDate').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
        end: this.residentSearch.get('changeEndDate').value ? this.residentSearch.get('changeEndDate').value.format('YYYY-MM-DD') + ' 23:59:59' : null
      },
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize,
        sortBy: ['changeDate, desc']
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.thisApiService.queryRecordAndCountRecord(params, ([resp, resp1]) => {
      this.loading = false;
      console.log('数据', resp);
      console.log('数据1', resp1);
      // 解析数据
      if (
        resp &&
        resp.code === 0 &&
        resp.hasOwnProperty('data') &&
        resp.data.length !== 0
      ) {
        this.listOfData = resp.data;
      } else {
        this.listOfData = [];
        this.msg.warning('未查询到数据');
      }
      // 解析count
      if (
        resp1 &&
        resp1.code === 0 &&
        resp1.hasOwnProperty('data') &&
        resp1.data.length !== 0
      ) {
        this.total = resp1.data[0].count;
      } else {
        this.total = 0;
      }
    });
  }

  // 导出 StockExportService
  export() {
    if (this.listOfData.length === 0) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: '没有数据，请先执行查询操作',
        nzMaskClosable: true
      });
      return;
    }
    this.dialogService.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认导出',
        content: '是否确认导出此报表?'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        const params = {
          changeReason: this.residentSearch.get('changeReason').value === '' || !this.residentSearch.get('changeReason').value ? null : this.residentSearch.get('changeReason').value,
          preProfileStatus: this.residentSearch.get('preProfileStatus').value,
          curProfileStatus: this.residentSearch.get('curProfileStatus').value,
          name: this.residentSearch.get('name').value === '' || !this.residentSearch.get('name').value ? null : this.residentSearch.get('name').value,
          profileCode: this.residentSearch.get('profileCode').value === '' || !this.residentSearch.get('profileCode').value ? null : this.residentSearch.get('profileCode').value,
          curPov: this.userInfo.pov,
          birthDate: {
            start: this.residentSearch.get('birthStart').value ? this.residentSearch.get('birthStart').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
            end: this.residentSearch.get('birthEnd').value ? this.residentSearch.get('birthEnd').value.format('YYYY-MM-DD') + ' 23:59:59' : null
          },
          changeDate: {
            start: this.residentSearch.get('changeStartDate').value ? this.residentSearch.get('changeStartDate').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
            end: this.residentSearch.get('changeEndDate').value ? this.residentSearch.get('changeEndDate').value.format('YYYY-MM-DD') + ' 23:59:59' : null
          },
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize,
            sortBy: ['changeDate, desc']
          }
          };
        // console.log('params2',params);
        this.loading = true;
        this.exportSvc.excelProfilestatuschange(params, resp => {
          this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '在册变更报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

  // 重置
  replacement() {
    this.residentSearch.reset({
      preProfileStatus: [],
      curProfileStatus: [],
      changeReason: []
    });
    this.loading = false;
  }
}

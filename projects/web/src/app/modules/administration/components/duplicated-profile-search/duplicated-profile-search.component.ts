import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DicDataService,
  ApiAdminDailyManagementService,
  FileDownloadUtils,
  FILE_TYPE,
  DateUtils, FILE_TYPE_SUFFIX, StockExportService
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'uea-duplicated-profile-search',
  templateUrl: './duplicated-profile-search.component.html',
  styleUrls: ['../admin.common.scss']
})
export class DuplicatedProfileSearchComponent implements OnInit {
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  listOfData: any[] = [];
  queryForm: FormGroup;
  loading = false;
  // 在册状态
  profileStatusData = [ {value: '1,2,3', label: '在册'},
    {value: '4,5', label: '离册'},
    {value: '6', label: '死亡'},
    {value: '7,8,9', label: '空挂户'},
    {value: '10', label: '省平台删除'}];
  // 用户信息
  userInfo: any;
  // 现管单位
  loginUser: any;

  constructor(
    private fb: FormBuilder,
    private thisApiService: ApiAdminDailyManagementService,
    private msg: NzMessageService,
    private dicSvc: DicDataService,
    private dialogService: NbDialogService,
    private exportSvc: StockExportService,
    private user: UserService,
    private modalSvc: NzModalService
  ) {
    // 获取用户数据
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      // console.log('用户信息==', resp);
      this.loginUser = this.userInfo.pov;
    });
  }

  ngOnInit() {
    // 获取在册状态 profileStatusData
    // this.profileStatusData = this.dicSvc.getDicDataByKey('profileStatus');
    // 处理重复的label
    /*  这个方法会影响数据字典取到得值 */
   /* let temp = [];
    let values = '1';
    for (let i = 0; i < this.profileStatusData.length - 1; i++) {
      if (this.profileStatusData[i].label.trim() === this.profileStatusData[i + 1].label.trim()) {
        values += ',' + this.profileStatusData[i + 1].value;
      } else {
      // 这句话影响数据字典取到得值
        this.profileStatusData[i].value = values;
        values = (i + 2).toString();
        temp.push(this.profileStatusData[i]);
      }
    }
    this.profileStatusData = temp;*/
    // console.log('下拉选的值===', this.profileStatusData);
    this.queryForm = this.fb.group({
      profileStatusCode: [null], // 受种者的在册状态
      birthDate: [null],
      gender: [null],
      fatherName: [null],
      motherName: [null],
      contactPhone: [null],
      idCardDetail: [null],
      name: [{ value: true, disabled: true }]
    });
    this.searchData();
  }

  /**
   * 重卡查询
   */
  searchData(page = 1) {
    this.pageIndex = page;
    console.log(this.queryForm);
    const searchParam = JSON.parse(JSON.stringify(this.queryForm.value));
    searchParam['pageEntity'] = {
      page: this.pageIndex,
      pageSize: this.pageSize
    };
    searchParam['povCode'] = this.userInfo.pov;
    searchParam['name'] = 'true';
    // console.log('参数==', searchParam);
    this.loading = true;
    this.thisApiService.profileDuplicatedRecord(searchParam, resp => {
      this.loading = false;
      console.log('resp==', resp);
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        if (searchDataList.hasOwnProperty('data')) {
          this.listOfData = [];
          this.listOfData = searchDataList.data;
        } else {
          this.loading = false;
          this.listOfData = [];
        }
      } else {
        this.msg.warning(`${searchDataList.msg}`);
      }
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
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
        nzContent: '没有数据，请先查询数据',
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
        this.loading = true;
        const searchParam = JSON.parse(JSON.stringify(this.queryForm.value));
        searchParam['pageEntity'] = {
          page: this.pageIndex,
          pageSize: this.pageSize
        };
        searchParam['povCode'] = this.userInfo.pov;
        searchParam['name'] = 'true';
        // console.log('params1',params);
        this.exportSvc.excelDuplicatedProfile(searchParam, resp => {
          // console.log(resp);
          this.loading = false;
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '重卡查询报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

  // 重置
  replacement() {
    this.queryForm.reset();
    this.queryForm.get('name').patchValue({ value: true, disabled: true });
    this.loading = false;
  }
}

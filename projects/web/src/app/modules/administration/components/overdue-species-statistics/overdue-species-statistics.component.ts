import { Component, OnInit } from '@angular/core';
import {
  DicDataService,
  VaccineSubclassInitService,
  ApiAdminDailyManagementService,
  CommunityDataService, MONTHS, FileDownloadUtils, FILE_TYPE, DateUtils, FILE_TYPE_SUFFIX, StockExportService
} from '@tod/svs-common-lib';

import * as moment from 'moment';
import { Moment } from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'uea-overdue-species-statistics',
  templateUrl: './overdue-species-statistics.component.html',
  styleUrls: ['../admin.common.scss']
})
export class OverdueSpeciesStatisticsComponent implements OnInit {
  form: FormGroup;
  listOfData: any[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  // 在册状态
  profileStatusData = [];
  profileStatus = [];
  // 区域划分
  communityOptions = [];
  // 居住类别
  residentialTypeData = [];
  // 疫苗小类
  vacSubClassData = [];
  category: any;

  currentNow = moment();

  userInfo: any;

  month = MONTHS;
  overdueData: any[] = [];

  constructor(
    private vacSubClassSvc: VaccineSubclassInitService,
    private dicSvc: DicDataService,
    private adminSvc: ApiAdminDailyManagementService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private exportSvc: StockExportService,
    private modalSvc: NzModalService,
    private dialogService: NbDialogService,
    private userSvc: UserService,
    private communitySvc: CommunityDataService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    // 获取疫苗小类
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取在册状态
    this.profileStatus = this.dicSvc.getDicDataByKey('profileStatus');
    this.profileStatusData = this.deduplication(this.profileStatus);
    // 获取所属区块
    this.communityOptions = this.communitySvc.getCommunityData();
    // 获取居住类别
    this.residentialTypeData = this.dicSvc.getDicDataByKey('residentialType');

    this.form = this.fb.group({
      month: ['3', null],
      until: [null],
      birthStart: [null],
      birthEnd: [null],
      residentialTypeCode: [null], // 居住类别
      profileStatusCode: [null], // 在册类别
      community: [null], // 区域划分
      vaccineProductCode: [null], // 疫苗类别
    });
  }

  // 对象数组去重
  deduplication(arr: any[]) {
    let result = [];
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
      if (!obj[arr[i].label]) {
        result.push(arr[i]);
        obj[arr[i].label] = true;
      }
    }
    return result;
  }

  // 过滤出生日期 - 起
  filterBirthStart = (d: Moment) => {
    const endDate = this.form.get('birthEnd').value;
    if (endDate) {
      return d <= endDate;
    }
    return d <= this.currentNow;
  }

  // 过滤出生日期 - 止
  filterBirthEnd = (d: Moment) => {
    const startDate = this.form.get('birthStart').value;
    if (startDate) {
      return d >= startDate && d <= this.currentNow;
    }
    return d <= this.currentNow;
  }

  // 查询
  queryData(page = 1) {
    this.pageIndex = page;
    if (this.loading) return;
    if (this.form.get('birthStart').value && this.form.get('birthEnd').value) {
      const start = this.form.get('birthStart').value.format('YYYY-MM-DD HH:mm:ss');
      const end = this.form.get('birthEnd').value.format('YYYY-MM-DD HH:mm:ss');
      if (moment(end).isBefore(start)) {
        this.msg.warning('你输入的出生日期起时间晚于止时间');
        return;
      }
    } else {
      if (this.form.get('birthStart').value) {
        this.msg.warning('请输入截止的生日日期');
        return;
      }
      if (this.form.get('birthEnd').value) {
        this.msg.warning('请输入开始的生日日期');
        return;
      }
    }
    // 筛选在册类别
    let registeredCategory = [];
    if (this.form.get('profileStatusCode').value) {
      const profileStatusCode = this.form.get('profileStatusCode').value;
      const profileStatusData = this.profileStatusData;
      for (let i = 0; i < profileStatusCode.length; i++) {
        const singleData = profileStatusCode[i];
        for (let j = 0; j < profileStatusData.length; j++) {
          const singleStatus = profileStatusData[j];
          if (singleData === singleStatus.value) {
            registeredCategory.push(...this.profileStatus.filter(item => item.label === singleStatus.label));
          }
        }
      }
    }
    this.category = [];
    if (registeredCategory.length) {
      registeredCategory.forEach(item => this.category.push(item.value));
    }
    let params = {
      monthLimit: this.form.get('month').value ? this.form.get('month').value : '3',
      povCode: this.userInfo.pov,
      startBirth: this.form.get('birthStart').value ? this.form.get('birthStart').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
      endBirth: this.form.get('birthEnd').value ? this.form.get('birthEnd').value.format('YYYY-MM-DD') + ' 23:59:59' : null,
      reside: this.form.get('residentialTypeCode').value,
      status: this.category,
      belongDistrict: this.form.get('community').value,
      vaccName: this.form.get('vaccineProductCode').value,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    console.log('参数', params);
    this.adminSvc.queryVacOverdueAndCount(params, resp => {
      this.loading = false;
      console.log(resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        this.listOfData = [];
        this.msg.warning('未查询到相关数据');
        return;
      }
      this.listOfData = [];
      this.listOfData = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data') || resp[1].data.length === 0) {
        return;
      }
      this.total = resp[1].data[0].count;
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
          monthLimit: this.form.get('month').value ? this.form.get('month').value : '3',
          povCode: this.userInfo.pov,
          startBirth: this.form.get('birthStart').value ? this.form.get('birthStart').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
          endBirth: this.form.get('birthEnd').value ? this.form.get('birthEnd').value.format('YYYY-MM-DD') + +' 23:59:59' : null,
          reside: this.form.get('residentialTypeCode').value,
          status: this.category,
          belongDistrict: this.form.get('community').value,
          vaccName: this.form.get('vaccineProductCode').value,
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        };
        // console.log('params2',params);
        this.loading = true;
        this.exportSvc.queryOverDueExcel(params, resp => {
          this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '逾期未种统计报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

  // 重置
  replace() {
    this.form.reset({
      residentialTypeCode: [], // 居住类别
      profileStatusCode: [], // 在册类别
      community: [], // 区域划分
      vaccineProductCode: [],
    });
    this.form.get('month').setValue('3');
    this.loading = false;
  }

  // 发送短信
  sendSms() {
    this.overdueData = [];
    if (this.listOfData.length === 0) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: '没有数据，请先执行查询操作',
        nzMaskClosable: true
      });
      return;
    }
    console.log('listOfData发送短信', this.listOfData);
    for (let j = 0; j < this.listOfData.length; j++) {
      this.overdueData.push(this.listOfData[j].monPhone + '-' + this.listOfData[j].childName + '-' + this.listOfData[j].vaccName);
    }

    // data.forEach(item => this.shouldData.push(item.monPhone));
    console.log('overdueData===', this.overdueData);

    let params = {
      dataArr: this.overdueData,
      povCode: this.userInfo.pov
    };
    console.log('参数', params);
    this.loading = true;
    this.listOfData = [];
    this.adminSvc.sendOverDueSms(params, resp => {
      this.loading = false;

      console.log('查询结果发送短信====', resp);
      if (resp[0].code = 0 || resp[0].hasOwnProperty('data')) {
        // this.msg.success('发送成功！');
        this.msg.success(resp[0].data);
        return;
      } else {
        this.msg.info('发送失败！');
        return;
      }
    });

  }


}

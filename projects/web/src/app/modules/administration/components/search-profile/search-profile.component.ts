import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { drawerAnimation } from '../../../../@uea/animations/drawer.animation';
import {
  DicDataService,
  ApiAdminDailyManagementService,
  CommunityDataService,
  FileDownloadUtils, FILE_TYPE, DateUtils, FILE_TYPE_SUFFIX, StockExportService
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';

import * as moment from 'moment';
import { Moment } from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'uea-report-child-management',
  templateUrl: './search-profile.component.html',
  styleUrls: ['../admin.common.scss'],

  animations: [drawerAnimation]
})
export class SearchProfileComponent implements OnInit, OnDestroy {
  hideQueryCondition = false;
  loading = false;
  searchCondition: FormGroup;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  genderOptions = [];
  // 在册状态
  residentStatusOpt = [];
  profileStatus = [];
  // 居住类型
  residentialTypeData = [];
  // 所属区块
  belongDistrictData = [];
  // 户口类别
  idTypeData = [];
  // table中的数据
  listOfData: any[] = [];
  // 此刻的时间
  currentNow = moment();
  // 登录用户信息
  userInfo: any;
  category: any;

  constructor(
    private thisApiService: ApiAdminDailyManagementService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private dicSvc: DicDataService,
    private exportSvc: StockExportService,
    private modalSvc: NzModalService,
    private dialogService: NbDialogService,
    private communitySvc: CommunityDataService,
    private userSvc: UserService
  ) {
  }

  ngOnInit() {
    // 获取在册状态
    // this.residentStatusOpt = this.dicSvc.getDicDataByKey('profileStatus');
    this.profileStatus = this.dicSvc.getDicDataByKey('profileStatus');
    this.residentStatusOpt = this.deduplication(this.profileStatus);
    // 获取居住类型
    this.residentialTypeData = this.dicSvc.getDicDataByKey('residentialType');
    // 获取所属区块
    this.belongDistrictData = this.communitySvc.getCommunityData();
    // 获取户口类别
    this.idTypeData = this.dicSvc.getDicDataByKey('idType');
    // 性别
    this.genderOptions = this.dicSvc.getDicDataByKey('genderCode');

    // 档案查询条件
    this.searchCondition = this.fb.group({
      profileCode: [null], // 档案编号
      name: [null], // 姓名
      birthCardNo: [null], // 条码
      idCardNo: [null], // 证件号码
      birthStart: [null], // 出生日期起
      birthEnd: [null], // 出生日期止
      gender: [null], // 性别
      motherName: [null], // 母亲姓名
      motherContactPhone: [null], // 母亲手机号
      fatherName: [null], // 父亲姓名
      fatherContactPhone: [null], // 父亲手机号
      createStart: [null], // 创建时间起
      createEnd: [null], // 创建时间止
      residentialTypeCode: [null], // 居住类别
      community: [null], // 所属区块
      idTypeCode: [null], // 户口类别
      profileStatusCode: [null], // 在册状态
      lastModifyStartDate: [null], // 修改时间起
      lastModifyEndDate: [null] // 修改时间止
    });
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      this.profileSearch();
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

  ngOnDestroy(): void {
  }

  // 过滤出生日期 - 起
  filterBirthStartDate = (d: Moment) => {
    const endDate = this.searchCondition.get('birthEnd').value;
    if (endDate) {
      return d <= endDate;
    }
    return d <= this.currentNow;
  }

  // 过滤出生日期 - 止
  filterBirthEndDate = (d: Moment) => {
    const startDate = this.searchCondition.get('birthStart').value;
    if (startDate) {
      return d >= startDate && d <= this.currentNow;
    }
    return d <= this.currentNow;
  }
  // 过滤建档日期-起
  filterCreateStartDate = (d: Moment) => {
    const endDate = this.searchCondition.get('createEnd').value;
    if (endDate) {
      return d <= endDate;
    }
    return d <= this.currentNow;

  }
  // 过滤建档日期-止
  filterCreateEndDate = (d: Moment) => {
    const startDate = this.searchCondition.get('createStart').value;
    if (startDate) {
      return d >= startDate && d <= this.currentNow;
    }
    return d <= this.currentNow;
  }

  /*
   * 档案查询
   */
  profileSearch(page = 1) {
    this.pageIndex = page;
    // 如果再查询的时候,则停止查询并禁止按钮不能点击
    if (this.loading) return;
    this.listOfData = [];
    if (this.searchCondition.get('birthStart').value && this.searchCondition.get('birthEnd').value) {
      const start = this.searchCondition.get('birthStart').value.format('YYYY-MM-DD HH:mm:ss');
      const end = this.searchCondition.get('birthEnd').value.format('YYYY-MM-DD HH:mm:ss');
      console.log(start);
      console.log(end);
      if (moment(end).isBefore(start)) {
        this.msg.warning('你输入的出生日期起时间晚于止时间');
        return;
      }
    }
    if (this.searchCondition.get('createStart').value && this.searchCondition.get('createEnd').value) {
      const start = this.searchCondition.get('createStart').value.format('YYYY-MM-DD HH:mm:ss');
      const end = this.searchCondition.get('createEnd').value.format('YYYY-MM-DD HH:mm:ss');
      if (moment(end).isBefore(start)) {
        this.msg.warning('你输入的创建起时间晚于止时间');
        return;
      }
    }
    // 添加条件
    let conditionValue = JSON.parse(JSON.stringify(this.searchCondition.value));
    // 筛选在册类别
    let registeredCategory = [];
    if (this.searchCondition.get('profileStatusCode').value) {
      const profileStatusCode = this.searchCondition.get('profileStatusCode').value;
      const profileStatusData = this.residentStatusOpt;
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
    const params = {
      vaccinationPovCode: this.userInfo.pov,
      profileCode: conditionValue.profileCode === '' || !conditionValue.profileCode ? null : conditionValue.profileCode.trim(),
      name: conditionValue.name === '' || !conditionValue.name ? null : conditionValue.name.trim(),
      birthCardNo: conditionValue.birthCardNo === '' || !conditionValue.birthCardNo ? null : conditionValue.birthCardNo.trim(),
      motherName: conditionValue.motherName === '' || !conditionValue.motherName ? null : conditionValue.motherName.trim(),
      motherContactPhone: conditionValue.motherContactPhone === '' || !conditionValue.motherContactPhone ? null : conditionValue.motherContactPhone.trim(),
      fatherName: conditionValue.fatherName === '' || !conditionValue.fatherName ? null : conditionValue.fatherName.trim(),
      fatherContactPhone: conditionValue.fatherContactPhone === '' || !conditionValue.fatherContactPhone ? null : conditionValue.fatherContactPhone.trim(),
      idCardNo: conditionValue.idCardNo === '' || !conditionValue.idCardNo ? null : conditionValue.idCardNo.trim(),
      gender: conditionValue.gender === '' ? null : conditionValue.gender,
      residentialTypeCode: conditionValue.residentialTypeCode,
      community: conditionValue.community,
      idTypeCode: conditionValue.idTypeCode,
      profileStatusCode: this.category,
      birthDate: {
        start: this.searchCondition.get('birthStart').value ? this.searchCondition.get('birthStart').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
        end: this.searchCondition.get('birthEnd').value ? this.searchCondition.get('birthEnd').value.format('YYYY-MM-DD') + ' 23:59:59' : null
      },
      createDate: {
        start: this.searchCondition.get('createStart').value ? this.searchCondition.get('createStart').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
        end: this.searchCondition.get('createEnd').value ? this.searchCondition.get('createEnd').value.format('YYYY-MM-DD') + ' 23:59:59' : null
      },
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    console.log('参数', params);
    this.listOfData = [];
    this.thisApiService.archivesQuery(params, (resp, resp1) => {
      this.loading = false;
      console.log('data', resp, resp1);
      // 解析count数据
      if (resp1 && resp1.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        this.total = resp1.data[0].count;
      }
      // 解析表格数据
      if (resp && resp.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        this.listOfData = resp.data;
      } else {
        this.listOfData = [];
        this.msg.warning('未查询到数据');
        return;
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
        let conditionValue = JSON.parse(JSON.stringify(this.searchCondition.value));
        const params = {
          vaccinationPovCode: this.userInfo.pov,
          profileCode: conditionValue.profileCode === '' || !conditionValue.profileCode ? null : conditionValue.profileCode.trim(),
          name: conditionValue.name === '' || !conditionValue.name ? null : conditionValue.name.trim(),
          birthCardNo: conditionValue.birthCardNo === '' || !conditionValue.birthCardNo ? null : conditionValue.birthCardNo.trim(),
          motherName: conditionValue.motherName === '' || !conditionValue.motherName ? null : conditionValue.motherName.trim(),
          motherContactPhone: conditionValue.motherContactPhone === '' || !conditionValue.motherContactPhone ? null : conditionValue.motherContactPhone.trim(),
          fatherName: conditionValue.fatherName === '' || !conditionValue.fatherName ? null : conditionValue.fatherName.trim(),
          fatherContactPhone: conditionValue.fatherContactPhone === '' || !conditionValue.fatherContactPhone ? null : conditionValue.fatherContactPhone.trim(),
          idCardNo: conditionValue.idCardNo === '' || !conditionValue.idCardNo ? null : conditionValue.idCardNo.trim(),
          gender: conditionValue.gender === '' ? null : conditionValue.gender,
          residentialTypeCode: conditionValue.residentialTypeCode,
          community: conditionValue.community,
          idTypeCode: conditionValue.idTypeCode,
          profileStatusCode: this.category,
          birthDate: {
            start: this.searchCondition.get('birthStart').value ? this.searchCondition.get('birthStart').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
            end: this.searchCondition.get('birthEnd').value ? this.searchCondition.get('birthEnd').value.format('YYYY-MM-DD') + ' 23:59:59' : null
          },
          createDate: {
            start: this.searchCondition.get('createStart').value ? this.searchCondition.get('createStart').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
            end: this.searchCondition.get('createEnd').value ? this.searchCondition.get('createEnd').value.format('YYYY-MM-DD') + ' 23:59:59' : null
          },
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        };
        // console.log('params2',params);
        this.loading = true;
        this.exportSvc.profileExcel(params, resp => {
          this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '档案查询报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

  // 重置
  reset() {
    this.searchCondition.reset({
      residentialTypeCode: [],
      community: [],
      idTypeCode: [],
      profileStatusCode: [],
      isIdCardNum: [],
      birthStart: null,
      birthEnd: null,
    });
    this.loading = false;
  }
}

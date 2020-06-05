import {Component, OnInit} from '@angular/core';
import {
  DicDataService,
  VaccineSubclassInitService,
  CommunityDataService,
  VaccBroadHeadingDataService,
  ApiAdminDailyManagementService,
  DiseaseCategoryInitService,
  FileDownloadUtils,
  FILE_TYPE,
  DateUtils,
  FILE_TYPE_SUFFIX,
  StockExportService
} from '@tod/svs-common-lib';
import {FormBuilder, FormGroup} from '@angular/forms';

import * as moment from 'moment';
import {Moment} from 'moment';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';
import {ConfirmDialogComponent} from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import {NbDialogService} from '@nebular/theme';

@Component({
  selector: 'uea-should-inform-export',
  templateUrl: './should-inform-export.component.html',
  styleUrls: ['../admin.common.scss']
})
export class ShouldInformExportComponent implements OnInit {
  form: FormGroup;

  listOfData: any[] = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  // 在册状态
  profileStatusData = [];
  profileStatus = [];
  // 区域划分
  belongDistrictData = [];
  // 居住类别
  residentialTypeData = [];
  // 疫苗大类
  vacBroadHeadingData = [];
  // 疾病大类
  diseaseData = [];
  category: any;

  // 此刻的时间
  currentNow = moment();

  userInfo: any;

  shouldData: any[] = [];

  constructor(
    private vacSubClassSvc: VaccineSubclassInitService,
    private dicSvc: DicDataService,
    private communitySvc: CommunityDataService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private fb: FormBuilder,
    private adminSvc: ApiAdminDailyManagementService,
    private msg: NzMessageService,
    private exportSvc: StockExportService,
    private modalSvc: NzModalService,
    private dialogService: NbDialogService,
    private userSvc: UserService,
    private categorySvc: DiseaseCategoryInitService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);

  }

  ngOnInit() {
    // 获取疫苗大类
    // this.vacBroadHeadingData = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    // 获取疾病大类
    this.diseaseData = this.categorySvc.getDiseaseCategoryData();
    // 获取在册状态
    this.profileStatus = this.dicSvc.getDicDataByKey('profileStatus');
    // 合并相同的label
    let obj = {};
    let temp = [];
    for (let i = 0; i < this.profileStatus.length; i++) {
      let ai = this.profileStatus[i];
      if (!obj[ai.label]) {
        temp.push({value: ai.value, label: ai.label});
        obj[ai.label] = ai;
      } else {
        for (let j = 0; j < temp.length; j++) {
          let single = temp[j];
          if (single.label === ai.label) {
            single.value += ',' + ai.value;
            break;
          }
        }
      }
    }
    this.profileStatusData = temp;
    // 获取所属区块
    this.belongDistrictData = this.communitySvc.getCommunityData();
    // 获取居住类别
    this.residentialTypeData = this.dicSvc.getDicDataByKey('residentialType');

    this.form = this.fb.group({
      birthStart: [null],
      birthEnd: [null],
      residentialTypeCode: [null], // 居住类别
      profileStatusCode: [null], // 在册类别
      community: [null], // 区域划分
      vaccineProductCode: [null] // 疾病大类
    });

  }

  // 过滤出生日期 - 起
  filterBirthStartDate = (d: Moment) => {
    const endDate = this.form.get('birthEnd').value;
    if (endDate) {
      return d <= endDate;
    }
    return d <= this.currentNow;
  }

  // 过滤出生日期 - 止
  filterBirthEndDate = (d: Moment) => {
    const startDate = this.form.get('birthStart').value;
    if (startDate) {
      return d >= startDate && d <= this.currentNow;
    }
    return d <= this.currentNow;
  }

  // 查询
  searchData(page = 1) {
    this.listOfData = [];
    if (this.loading) return;
    this.pageIndex = page;
    if (this.form.get('birthStart').value && this.form.get('birthEnd').value) {
      const start = this.form.get('birthStart').value.format('YYYY-MM-DD HH:mm:ss');
      const end = this.form.get('birthEnd').value.format('YYYY-MM-DD HH:mm:ss');
      if (moment(end).isBefore(start)) {
        this.msg.warning('你输入的出生日期起时间晚于止时间');
        return;
      }
    }
    let params = {
      startBirth: this.form.get('birthStart').value ? this.form.get('birthStart').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
      endBirth: this.form.get('birthEnd').value ? this.form.get('birthEnd').value.format('YYYY-MM-DD') + ' 23:59:59' : null,
      povCode: this.userInfo.pov,
      reside: this.form.get('residentialTypeCode').value,
      status: this.form.get('profileStatusCode').value ? this.form.get('profileStatusCode').value.length !== 0 ? this.form.get('profileStatusCode').value.join().split(',') : null : null,
      belongDistrict: this.form.get('community').value,
      vaccName: this.form.get('vaccineProductCode').value,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.listOfData = [];
    this.adminSvc.queryVaccineShouldInjectAndCount(params, resp => {
      this.loading = false;
      console.log('查询结果', resp);
      if (resp && resp[0].code === 0 && resp[0].hasOwnProperty('data') && resp[0].data.length !== 0) {
        this.listOfData = resp[0].data;
      }
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data')) {
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
          startBirth: this.form.get('birthStart').value ? this.form.get('birthStart').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
          endBirth: this.form.get('birthEnd').value ? this.form.get('birthEnd').value.format('YYYY-MM-DD') + ' 23:59:59' : null,
          povCode: this.userInfo.pov,
          reside: this.form.get('residentialTypeCode').value,
          status: this.form.get('profileStatusCode').value ? this.form.get('profileStatusCode').value.length !== 0 ? this.form.get('profileStatusCode').value.join().split(',') : null : null,
          belongDistrict: this.form.get('community').value,
          vaccName: this.form.get('vaccineProductCode').value,
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        };
        console.log('params2', params);
        this.loading = true;
        this.exportSvc.queryVaccExcel(params, resp => {
          this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '应种统计报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

  reset() {
    this.form.reset({
      residentialTypeCode: [], // 居住类别
      profileStatusCode: [], // 在册类别
      community: [], // 区域划分
      vaccineProductCode: [] // 疫苗名称
    });
    // this.listOfData = [];
    this.loading = false;
    this.pageIndex = 1;
    this.shouldData = [];
  }

  // 发送短信
  sendSms() {
    this.shouldData = [];
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
      this.shouldData.push(this.listOfData[j].monPhone);
    }

    // data.forEach(item => this.shouldData.push(item.monPhone));
    console.log('shouldData===', this.shouldData);

    let params = {
      mobileArr: this.shouldData,
      povCode: this.userInfo.pov
    };
    console.log('参数', params);
    this.loading = true;
    this.listOfData = [];
    this.adminSvc.sendVaccShoudSms(params, resp => {
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DicDataService,
  VaccineSubclassInitService,
  CommunityDataService,
  VaccBroadHeadingDataService,
  ApiAdminDailyManagementService,
  DateUtils, FileDownloadUtils, FILE_TYPE, FILE_TYPE_SUFFIX, StockExportService,
} from '@tod/svs-common-lib';
import { NbMomentDateService } from '@nebular/moment';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';
import {InoculationRateDetailComponent} from '../inoculation-rate-detail/inoculation-rate-detail.component';

@Component({
  selector: 'uea-inoculation-yield',
  templateUrl: './inoculation-yield.component.html',
  styleUrls: ['../admin.common.scss'],
  providers: [
    NbMomentDateService
  ]
})
export class InoculationYieldComponent implements OnInit {
  listOfData: any[] = [];
  pageListData: any[] = [];
  loading = false;
  // 在册状态
  profileStatusData = [];
  profileStatus = [];
  // 区域划分
  belongDistrictData = [];
  // 居住类别
  residentialTypeData = [];
  // 疫苗大类
  vacBroadHeadingData = [];
  // 儿童性别
  genderOptions = [];
  category: any;

  form: FormGroup;
  total = 0;
  pageIndex = 1;
  pageSize = 10;

  // 登录用户信息
  userInfo: any;
  // 每个月的1号
  newDay: any;

  currentDate = new Date();

  constructor(
    private vacSubClassSvc: VaccineSubclassInitService,
    private dicSvc: DicDataService,
    private communitySvc: CommunityDataService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private fb: FormBuilder,
    private modalSvc: NzModalService,
    private adminSvc: ApiAdminDailyManagementService,
    private momentSvc: NbMomentDateService,
    private exportSvc: StockExportService,
    private dialogService: NbDialogService,
    private msg: NzMessageService,
    private userSvc: UserService,
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    // 获取疫苗大类
    this.vacBroadHeadingData = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    // 获取在册状态
    // this.profileStatusData = this.dicSvc.getDicDataByKey('profileStatus');
    // 存储在册状态,在后面选择的时候需要判断
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
    /* // 过滤掉相同的
     this.profileStatusData = this.deduplication(this.profileStatus);*/
    // 获取所属区块
    this.belongDistrictData = this.communitySvc.getCommunityData();
    // 获取居住类别
    this.residentialTypeData = this.dicSvc.getDicDataByKey('residentialType');
    // 性别
    this.genderOptions = this.dicSvc.getDicDataByKey('genderCode');

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.newDay = new Date(year, month, 1, 0, 0, 0);

    this.form = this.fb.group({
      profileCode: [null],
      name: [null],
      gender: [null],
      birthStart: [new Date(DateUtils.formatStartDate(this.newDay)), null],
      birthEnd: [new Date(DateUtils.formatEndDate(this.currentDate)), null],
      currentManagementUnit: [null],
      residentialTypeCode: [null],
      profileStatusCode: [null], // 在册类别
      community: [null], // 区域划分
      vaccineProductCode: [null] // 疫苗code
    });
    // 初始化加载数据
    this.searchData();
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

  // 查询
  searchData(page = 1) {
    // console.log('当前登记的人员信息', this.userInfo);
    if (!this.userInfo) return;
    if (this.loading) return;
    this.pageIndex = page;
    // 限制开始日期不能晚于结束时间
   /* if (this.form.get('birthStart').value && this.form.get('birthEnd').value) {
      const start = this.momentSvc.parse(DateUtils.getFormatDateTime(this.form.get('birthStart').value), 'YYYY/MM/DD');
      const end = this.momentSvc.parse(DateUtils.getFormatDateTime(this.form.get('birthEnd').value), 'YYYY/MM/DD');
      if (this.momentSvc.compareDates(start, end) > 0) {
        this.msg.warning('你输入的出生日期起时间晚于止时间');
        return;
      }
    }
    if (!this.form.get('birthStart').value) {
      this.msg.warning('请输入起始的出生日期');
      return;
    }
    if (!this.form.get('birthEnd').value) {
      this.msg.warning('请输入截止的出生日期');
      return;
    }*/
    // 筛选在册类别
    /*let registeredCategory = [];
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
    }*/
    const params = {
      profileCode: this.form.get('profileCode').value === '' || !this.form.get('profileCode').value ? null : this.form.get('profileCode').value,
      childName: this.form.get('name').value === '' || !this.form.get('name').value ? null : this.form.get('name').value,
      birthStart: this.form.get('birthStart').value ? DateUtils.formatStartDate(this.form.get('birthStart').value) : null,
      birthEnd: this.form.get('birthEnd').value ? DateUtils.formatEndDate(this.form.get('birthEnd').value) : null,
      childGender: this.form.get('gender').value,
      povCode: this.userInfo.pov,
      liveCategory: this.form.get('residentialTypeCode').value, // 居住类别
      registerCategory: this.form.get('profileStatusCode').value ? this.form.get('profileStatusCode').value.length !== 0 ? this.form.get('profileStatusCode').value.join().split(',') : null : null, // 在册类别
      region: this.form.get('community').value, // 区域划分
      vaccName: this.form.get('vaccineProductCode').value ? this.form.get('vaccineProductCode').value.length === 0 ? null : this.form.get('vaccineProductCode').value : !this.form.get('vaccineProductCode').value ? null : this.form.get('vaccineProductCode').value,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.listOfData = [];
    this.pageListData = [];
    this.loading = true;
    console.log('参数', params);
    this.adminSvc.queryVaccInoculationInfoAndCount(params, resp => {
      this.loading = false;
      console.log('结果', resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        this.msg.warning(`${ resp[0].msg }`);
        return;
      }
      this.listOfData = resp[0].data;
      this.pageIndex = page;
      // 前台分页
      if (this.listOfData.length) {
        this.pageListData = this.listOfData.slice((this.pageIndex - 1) * this.pageSize, ((this.pageIndex) * this.pageSize));
      }
      console.log('listOfData', this.listOfData);
      console.log('pageListData', this.pageListData);
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data') || resp[1].data.length === 0) {
        return;
      }
      this.total = resp[1].data.count;
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
          profileCode: this.form.get('profileCode').value === '' || !this.form.get('profileCode').value ? null : this.form.get('profileCode').value,
          childName: this.form.get('name').value === '' || !this.form.get('name').value ? null : this.form.get('name').value,
          birthStart: this.form.get('birthStart').value ? DateUtils.formatStartDate(this.form.get('birthStart').value) : null,
          birthEnd: this.form.get('birthEnd').value ? DateUtils.formatEndDate(this.form.get('birthEnd').value) : null,
          childGender: this.form.get('gender').value,
          povCode: this.userInfo.pov,
          liveCategory: this.form.get('residentialTypeCode').value, // 居住类别
          registerCategory: this.category, // 在册类别
          region: this.form.get('community').value, // 区域划分
          vaccName: this.form.get('vaccineProductCode').value ? this.form.get('vaccineProductCode').value.length === 0 ? null : this.form.get('vaccineProductCode').value : !this.form.get('vaccineProductCode').value ? null : this.form.get('vaccineProductCode').value,

        };
        // console.log('params1',params);
        this.loading = true;
        this.exportSvc.vaccineRateExcel(params, resp => {
        this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '接种合格率报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

  // 重置
  reset() {
    this.form.reset({
      residentialTypeCode: [],
      profileStatusCode: [],
      community: [],
      vaccineProductCode: []
    });
    this.form.get('birthStart').setValue(new Date(DateUtils.formatStartDate(this.newDay)));
    this.form.get('birthEnd').setValue(new Date(DateUtils.formatEndDate(this.currentDate)));
    this.loading = false;
  }

  // 出生日期-起
  disabledStart = (d: Date) => {
    const endDate = this.form.get('birthEnd').value;
    if (endDate) {
      return d > new Date() || d > endDate;
    }
    return d > new Date();
  }
  // 出生日期-止
  disabledEnd = (d: Date) => {
    const sendStart = this.form.get('birthStart').value;
    if (sendStart) {
      return d < sendStart || d > new Date();
    } else {
      return d > new Date();
    }
  }

  // 导出儿童
  exportChild() {
    this.modalSvc.confirm({
      nzTitle: '提示',
      nzContent: '<p>确认要导出数据吗?</p>',
      nzOnOk: () => {
        // 导出儿童的接口调用
        console.log('确认按钮');

      },
      nzOnCancel: () => console.log('Cancel')
    });
  }

  /**
   * 查看个案详情
   * @param data 此条数据
   * @param type 类型
   */
  checkDetail(data: any, type: string) {
    if (type === '0') {
      return;
    } else {
      console.log('点击了详情', data);
      this.dialogService.open(InoculationRateDetailComponent, {
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          data: data,
          type: type
        }
      });
    }

  }

}

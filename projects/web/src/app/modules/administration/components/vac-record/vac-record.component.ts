import { Component, OnInit } from '@angular/core';
import { drawerAnimation } from '../../../../@uea/animations/drawer.animation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  DicDataService,
  ApiAdminDailyManagementService,
  VaccineSubclassInitService,
  DateUtils, FileDownloadUtils, FILE_TYPE, FILE_TYPE_SUFFIX, StockExportService
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { NbMomentDateService } from '@nebular/moment';
import { Moment } from 'moment';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'uea-vac-record',
  templateUrl: './vac-record.component.html',
  styleUrls: ['../admin.common.scss'],
  providers: [
    NbMomentDateService
  ],
  animations: [
    drawerAnimation
  ]
})
export class VacRecordComponent implements OnInit {
  // 基本信息
  userInfo: any;

  listOfData: any[] = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  searchCondition: FormGroup;

  hideQueryCondition = false;
  // 户口类型选择
  idType = [];
  // 是否免费
  vaccineTypeData = [];
  // 疫苗小类名称
  vacSubClassData = [];

  currentDate = new Date();

  // 每个月的1号
  newDay: any;

  currentNow: any;

  constructor(
    private vacRecordService: ApiAdminDailyManagementService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private dicSvc: DicDataService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private userSvc: UserService,
    private exportSvc: StockExportService,
    private dialogService: NbDialogService,
    private momentSvc: NbMomentDateService,
    private modalSvc: NzModalService
  ) {
    this.userSvc.getUserInfoByType().subscribe(resp => {
      if (resp) {
        this.userInfo = resp;
      }
    });
    this.currentNow = this.momentSvc.today();
  }

  ngOnInit(): void {
    // 获取疫苗小类
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取户口类型
    this.idType = this.dicSvc.getDicDataByKey('idType');
    // 获取是否免费
    this.vaccineTypeData = this.dicSvc.getDicDataByKey('vaccineType');

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.newDay = new Date(year, month, 1, 0, 0, 0);

    // 接种记录表单初始化
    this.searchCondition = this.fb.group({
      profileCode: [null, [Validators.required]], // 档案编号
      realName: [null], // 接种人姓名
      idCardNo: [null], // 证件号码
      startVaccinateTime: [new Date(DateUtils.formatStartDate(this.newDay)), null], // 接种日期
      endVaccinateTime: [new Date(DateUtils.formatEndDate(this.currentDate)), null], // 接种日期
      startBirthDate: [null], // 出生日期
      endBirthDate: [null], // 出生日期
      vaccineProductCode: [null], // 疫苗名称, 疫苗产品编码
      idTypeCode: [null], // 户口类别
      immunityVacCard: [null], // 免疫卡号
      vaccineBatchNo: [null], // 疫苗批号
      vaccineSpecification: [null, [Validators.min(1)]], // 剂次
      vaccineType: [null], // 是否免费
      vaccinatedDoctor: [null], // 登记医生
      injectDoctor: [null], // 接种医生
      sortOrder: [null] // 排序方式 默认按照接种时间排序
    });
    this.searchVacRecord();
  }

  /*  filterStartDate = (d: Date) => {
      const endTime = this.searchCondition.get('createEndTime').value;
      if (endTime) {
        return d > endTime || d > this.currentNow;
      }
      return d > this.currentNow;
    }

    filterEndDate = (d: Date) => {
      const startTime = this.searchCondition.get('createStartTime').value;
      if (startTime) {
        return d > this.currentDate || d < startTime;
      }
      return d > this.currentDate;
    }*/

  /*  // 接种日期(起)
    filterStartVacTimeDate = (d: Moment) => {
      const endDate = this.searchCondition.get('endVaccinateTime').value;
      if (endDate) {
        return d <= endDate;
      }
      return d <= this.currentNow;
    }

    // 接种日期(止)
    filterEndVacTimeDate = (d: Moment) => {
      const startDate = this.searchCondition.get('startVaccinateTime').value;
      if (startDate) {
        return d >= startDate && d <= this.currentNow;
      }
      return d <= this.currentNow;
    }*/
  /**
   * 过滤出生日期 - 起
   * @param d
   */
  filterBirthStartDate = (d: Moment) => {
    const endDate = this.searchCondition.get('endBirthDate').value;
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
    const startDate = this.searchCondition.get('startBirthDate').value;
    if (startDate) {
      return d >= startDate && d <= this.currentNow;
    }
    return d <= this.currentNow;
  }

  // 查询接种记录
  searchVacRecord(page = 1) {
    // 如果再查询的时候,则停止查询并禁止按钮不能点击
    if (this.loading) return;
    // 增加条件查询
    if (this.searchCondition.get('startBirthDate').value && this.searchCondition.get('endBirthDate').value) {
      const start = this.momentSvc.parse(DateUtils.getFormatDateTime(this.searchCondition.get('startBirthDate').value), 'YYYY/MM/DD');
      const end = this.momentSvc.parse(DateUtils.getFormatDateTime(this.searchCondition.get('endBirthDate').value), 'YYYY/MM/DD');
      if (this.momentSvc.compareDates(start, end) > 0) {
        this.msg.warning('你输入的出生日期起时间晚于止时间');
        return;
      }
    }
    /*if (this.searchCondition.get('startVaccinateTime').value && this.searchCondition.get('endVaccinateTime').value) {
      const start = this.momentSvc.parse(DateUtils.getFormatDateTime(this.searchCondition.get('startVaccinateTime').value), 'YYYY/MM/DD');
      const end = this.momentSvc.parse(DateUtils.getFormatDateTime(this.searchCondition.get('endVaccinateTime').value), 'YYYY/MM/DD');
      if (this.momentSvc.compareDates(start, end) > 0) {
        this.msg.warning('你输入的接种日期起时间晚于止时间');
        return;
      }
    }*/

    if (this.searchCondition.get('startVaccinateTime').value && this.searchCondition.get('endVaccinateTime').value) {
      const start = DateUtils.getFormatDateTime(this.searchCondition.get('startVaccinateTime').value);
      const end = DateUtils.getFormatDateTime(this.searchCondition.get('endVaccinateTime').value);
      if (start > end) {
        this.msg.warning('你选择的起始时间晚于截止时间');
        return;
      } else {
        const startTime = this.searchCondition.get('startVaccinateTime').value.getTime() + 24 * 90 * 60 * 60 * 1000;
        const endTime = this.searchCondition.get('endVaccinateTime').value.getTime();
        if (endTime > startTime) {
          this.msg.warning('选择的时间范围最大为三个月');
          return;
        }
      }

    }
    this.loading = true;
    let conditions = JSON.parse(JSON.stringify(this.searchCondition.value));
    if (conditions.vaccineType) {
      console.log(conditions.vaccineType.length);
      if (conditions.vaccineType.length === 0) {
        conditions.vaccineType = null;
      }
    }
    if (conditions.idTypeCode) {
      console.log(conditions.idTypeCode.length);
      if (conditions.idTypeCode.length === 0) {
        conditions.idTypeCode = null;
      }
    }
    if (conditions.vaccineProductCode) {
      console.log(conditions.vaccineProductCode.length);
      if (conditions.vaccineProductCode.length === 0) {
        conditions.vaccineProductCode = null;
      }
    }
    const query = {
      managePovCode: this.userInfo.pov,
      profileName: this.searchCondition.get('realName').value === '' || !this.searchCondition.get('realName').value ? null : this.searchCondition.get('realName').value,
      profileCode: this.searchCondition.get('profileCode').value === '' || !this.searchCondition.get('profileCode').value ? null : this.searchCondition.get('profileCode').value,
      idCardNo: this.searchCondition.get('idCardNo').value === '' || !this.searchCondition.get('idCardNo').value ? null : this.searchCondition.get('idCardNo').value,
      immunityVacCard: this.searchCondition.get('immunityVacCard').value === '' || !this.searchCondition.get('immunityVacCard').value ? null : this.searchCondition.get('immunityVacCard').value,
      idTypeCode: !conditions.idTypeCode ? null : this.searchCondition.get('idTypeCode').value,
      vaccineProductCode: !conditions.vaccineProductCode ? null : this.searchCondition.get('vaccineProductCode').value,
      vaccineBatchNo: this.searchCondition.get('vaccineBatchNo').value === '' || !this.searchCondition.get('vaccineBatchNo').value ? null : this.searchCondition.get('vaccineBatchNo').value,
      vaccinateInjectNumber: this.searchCondition.get('vaccineSpecification').value === '' || !this.searchCondition.get('vaccineSpecification').value ? null : this.searchCondition.get('vaccineSpecification').value,
      vaccineType: !conditions.vaccineType ? null : this.searchCondition.get('vaccineType').value,
      startVaccinateTime: this.searchCondition.get('startVaccinateTime').value ? DateUtils.formatStartDate(this.searchCondition.get('startVaccinateTime').value) : null,
      endVaccinateTime: this.searchCondition.get('endVaccinateTime').value ? DateUtils.formatEndDate(this.searchCondition.get('endVaccinateTime').value) : null,
      startBirthday: this.searchCondition.get('startBirthDate').value ? this.searchCondition.get('startBirthDate').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
      endBirthday: this.searchCondition.get('endBirthDate').value ? this.searchCondition.get('endBirthDate').value.format('YYYY-MM-DD') + ' 23:59:59' : null,
      pageEntity: {
        page: page,
        pageSize: this.pageSize,
        sortBy: [this.searchCondition.get('sortOrder').value ? (this.searchCondition.get('sortOrder').value + ',asc') : 'vaccinateTime' + ',asc']
      }
    };
    console.log('参数', query);
    this.pageIndex = page;
    this.vacRecordService.vaccinateRecord(query, (queryData, countData) => {
      this.loading = false;
      console.log('返回来的数据', queryData, countData);
      if (
        queryData && queryData.code === 0 && queryData.hasOwnProperty('data')) {
        this.listOfData = queryData.data;
      } else {
        this.listOfData = [];
        this.msg.warning('未查询到数据');
      }
      if (
        countData &&
        countData.code === 0 &&
        countData.hasOwnProperty('data')
      ) {
        this.total = countData.data[0]['count'];
      }
    });
  }

  // 导出 StockExportService
  export(page = 1) {
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
        let conditions = JSON.parse(JSON.stringify(this.searchCondition.value));
        const params = {
          managePovCode: this.userInfo.pov,
          profileName: this.searchCondition.get('realName').value === '' || !this.searchCondition.get('realName').value ? null : this.searchCondition.get('realName').value,
          profileCode: this.searchCondition.get('profileCode').value === '' || !this.searchCondition.get('profileCode').value ? null : this.searchCondition.get('profileCode').value,
          idCardNo: this.searchCondition.get('idCardNo').value === '' || !this.searchCondition.get('idCardNo').value ? null : this.searchCondition.get('idCardNo').value,
          immunityVacCard: this.searchCondition.get('immunityVacCard').value === '' || !this.searchCondition.get('immunityVacCard').value ? null : this.searchCondition.get('immunityVacCard').value,
          idTypeCode: !conditions.idTypeCode ? null : this.searchCondition.get('idTypeCode').value,
          vaccineProductCode: !conditions.vaccineProductCode ? null : this.searchCondition.get('vaccineProductCode').value,
          vaccineBatchNo: this.searchCondition.get('vaccineBatchNo').value === '' || !this.searchCondition.get('vaccineBatchNo').value ? null : this.searchCondition.get('vaccineBatchNo').value,
          vaccinateInjectNumber: this.searchCondition.get('vaccineSpecification').value === '' || !this.searchCondition.get('vaccineSpecification').value ? null : this.searchCondition.get('vaccineSpecification').value,
          vaccineType: !conditions.vaccineType ? null : this.searchCondition.get('vaccineType').value,
          startVaccinateTime: this.searchCondition.get('startVaccinateTime').value ? DateUtils.formatStartDate(this.searchCondition.get('startVaccinateTime').value) : null,
          endVaccinateTime: this.searchCondition.get('endVaccinateTime').value ? DateUtils.formatEndDate(this.searchCondition.get('endVaccinateTime').value) : null,
          startBirthday: this.searchCondition.get('startBirthDate').value ? this.searchCondition.get('startBirthDate').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
          endBirthday: this.searchCondition.get('endBirthDate').value ? this.searchCondition.get('endBirthDate').value.format('YYYY-MM-DD') + ' 23:59:59' : null,
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize,
            sortBy: [this.searchCondition.get('sortOrder').value ? (this.searchCondition.get('sortOrder').value + ',asc') : 'vaccinateTime' + ',asc']
          }
        };
        console.log('params2', params);
        this.loading = true;
        this.exportSvc.vaccinateRecordExcel(params, resp => {
          // console.log(resp);
          this.loading = false;
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '接种记录报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

  // 重置
  replacements() {
    this.searchCondition.reset({
      idTypeCode: [],
      vaccineProductCode: [],
      vaccineType: []
    });
    this.searchCondition.get('startVaccinateTime').patchValue(new Date(DateUtils.formatStartDate(this.newDay)));
    this.searchCondition.get('endVaccinateTime').patchValue(new Date(DateUtils.formatEndDate(this.currentDate)));
    this.loading = false;
  }
}

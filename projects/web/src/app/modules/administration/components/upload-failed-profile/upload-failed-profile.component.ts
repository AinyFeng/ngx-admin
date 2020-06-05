import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import {
  ApiAdminDailyManagementService,
  DateUtils,
  FILE_TYPE,
  FILE_TYPE_SUFFIX,
  FileDownloadUtils, StockExportService
} from '@tod/svs-common-lib';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'uea-upload-failed-profile',
  templateUrl: './upload-failed-profile.component.html',
  styleUrls: ['../admin.common.scss']
})
export class UploadFailedProfileComponent implements OnInit {
  listOfData: any[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  uploadProfileFrom: FormGroup;
  userInfo: any;

  currentNow = moment();

  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private exportSvc: StockExportService,
    private dialogService: NbDialogService,
    private thisApiService: ApiAdminDailyManagementService,
    private msg: NzMessageService,
    private modalSvc: NzModalService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    this.uploadProfileFrom = this.fb.group({
      name: [null],
      birthStartDate: [null], // 生日起
      birthEndDate: [null] // 生日止
    });
    this.searchData();
  }

  /**
   * 过滤出生日期 - 起
   * @param d
   */
  filterBirthStartDate = (d: Moment) => {
    const endDate = this.uploadProfileFrom.get('birthEndDate').value;
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
    const startDate = this.uploadProfileFrom.get('birthStartDate').value;
    if (startDate) {
      return d >= startDate && d <= this.currentNow;
    }
    return d <= this.currentNow;
  }

  /**
   *
   * 查询数据
   */
  searchData(page = 1) {
    this.pageIndex = page;
    if (this.loading) return;
    if (
      this.uploadProfileFrom.get('birthStartDate').value ||
      this.uploadProfileFrom.get('birthEndDate').value
    ) {
      if (
        !this.uploadProfileFrom.get('birthStartDate').value ||
        !this.uploadProfileFrom.get('birthEndDate').value
      ) {
        this.msg.warning('请正确填写出生日期日期范围');
        return;
      } else {
        let start = this.uploadProfileFrom
          .get('birthStartDate')
          .value.format('YYYY-MM-DD');
        let end = this.uploadProfileFrom
          .get('birthEndDate')
          .value.format('YYYY-MM-DD');
        if (moment(end).isBefore(start)) {
          this.msg.warning('你输入的出生日期起时间晚于止时间');
          return;
        }
      }
    }
    let uploadProfileJSON = JSON.parse(JSON.stringify(this.uploadProfileFrom.value));
    // 构建查询 出生日期范围参数
    if (
      this.uploadProfileFrom.get('birthStartDate').value ||
      this.uploadProfileFrom.get('birthEndDate').value
    ) {
      uploadProfileJSON['birthDate'] = {
        start: this.uploadProfileFrom
          .get('birthStartDate')
          .value.format('YYYY-MM-DD HH:mm:ss'),
        end: this.uploadProfileFrom
          .get('birthEndDate')
          .value.format('YYYY-MM-DD HH:mm:ss')
      };
    }
    const params = {
      createPov: this.userInfo.pov,
      name: uploadProfileJSON.name,
      birthDate: uploadProfileJSON.birthDate,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.thisApiService.profileUploadFailedRecord(params, resp => {
      console.log('resp===', resp);
      this.loading = false;
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      } else {
        this.listOfData = [];
        this.msg.warning(`${resp.msg}`);
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
        if (this.loading) return;
        if (
          this.uploadProfileFrom.get('birthStartDate').value ||
          this.uploadProfileFrom.get('birthEndDate').value
        ) {
          if (
            !this.uploadProfileFrom.get('birthStartDate').value ||
            !this.uploadProfileFrom.get('birthEndDate').value
          ) {
            this.msg.warning('请正确填写出生日期日期范围');
            return;
          } else {
            let start = this.uploadProfileFrom
              .get('birthStartDate')
              .value.format('YYYY-MM-DD');
            let end = this.uploadProfileFrom
              .get('birthEndDate')
              .value.format('YYYY-MM-DD');
            if (moment(end).isBefore(start)) {
              this.msg.warning('你输入的出生日期起时间晚于止时间');
              return;
            }
          }
        }
        let uploadProfileJSON = JSON.parse(JSON.stringify(this.uploadProfileFrom.value));
        // 构建查询 出生日期范围参数
        if (
          this.uploadProfileFrom.get('birthStartDate').value ||
          this.uploadProfileFrom.get('birthEndDate').value
        ) {
          uploadProfileJSON['birthDate'] = {
            start: this.uploadProfileFrom
              .get('birthStartDate')
              .value.format('YYYY-MM-DD HH:mm:ss'),
            end: this.uploadProfileFrom
              .get('birthEndDate')
              .value.format('YYYY-MM-DD HH:mm:ss')
          };
        }
        const params = {
          createPov: this.userInfo.pov,
          name: uploadProfileJSON.name,
          birthDate: uploadProfileJSON.birthDate,
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        };
        this.loading = true;
        console.log('params2', params);
        this.exportSvc.excelProfileUploadFailed(params, resp => {
          // console.log(resp);
          this.loading = false;
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '上传失败档案报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }


  // 重置
  replacement() {
    this.uploadProfileFrom.reset();
    this.loading = false;
  }
}

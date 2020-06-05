import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  ApiSystemMessageInfoService,
  DateUtils,
  FILE_TYPE,
  FILE_TYPE_SUFFIX,
  FileDownloadUtils, StockExportService
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'uea-msg-record',
  templateUrl: './msg-record.component.html',
  styleUrls: ['../admin.common.scss']
})
export class MsgRecordComponent implements OnInit {
  listOfData: any[] = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  form: FormGroup;
  userInfo: any;

  constructor(
    private messageSvc: ApiSystemMessageInfoService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private exportSvc: StockExportService,
    private modalSvc: NzModalService,
    private dialogSvc: NbDialogService,
    private userSvc: UserService,
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.form = this.fb.group({
      profileCode: [null],
      name: [null],
      telephone: [null]
    });
    // 由于必填参数为三个,所以开始的时候不能查询
    // this.searchData();
  }

  // 重置
  reset() {
    this.form.reset();
    this.listOfData = [];
  }

  // 查询
  searchData(page = 1) {
    this.pageIndex = page;
    if (this.loading) return;
    if (!this.form.get('profileCode').value) {
      this.msg.warning('请填写受种者编码');
      return;
    }
    if (!this.form.get('name').value) {
      this.msg.warning('请填写受种者姓名');
      return;
    }
    if (!this.form.get('telephone').value) {
      this.msg.warning('请输入手机号码');
      return;
    }
    let query = {
      profile: this.form.get('profileCode').value,
      name: this.form.get('name').value,
      phoneNumber: this.form.get('telephone').value,
      povCode: this.userInfo.pov,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log(query);
    this.loading = true;
    this.listOfData = [];
    this.messageSvc.querySmsRecordAndCount(query, resp => {
      this.loading = false;
      console.log(resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        this.msg.warning('未查询到相关数据');
        return;
      }
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
    this.dialogSvc.open(ConfirmDialogComponent, {
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
          profile: this.form.get('profileCode').value,
          name: this.form.get('name').value,
          phoneNumber: this.form.get('telephone').value,
          povCode: this.userInfo.pov,
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        };
        // console.log('params1',params);
        this.loading = true;
        this.exportSvc.excelSmsRecord(params, resp => {
          this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '短信记录报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }
}

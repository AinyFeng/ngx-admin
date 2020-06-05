import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FixedAssetAddComponent} from '../dialog/fixed-asset-add/fixed-asset-add.component';
import {UserService} from '@tod/uea-auth-lib';
import {
  DateUtils,
  FILE_TYPE,
  FILE_TYPE_SUFFIX,
  FileDownloadUtils,
  FixedassetsService,
  StockExportService
} from '@tod/svs-common-lib';
import {NbDialogService} from '@nebular/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'uea-other-manage',
  templateUrl: './other-manage.component.html',
  styleUrls: ['../admin.common.scss'],
  providers: [FixedassetsService]
})
export class OtherManageComponent implements OnInit {
  listOfData: any[] = [];
  searchAssetsForm: FormGroup;
  // 需要删除的数据
  fixedAssetsInfo: any;
  loading = false;
  userInfo: any;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private fixedAssetsService: FixedassetsService,
    private dialogService: NbDialogService,
    private modalSvc: NzModalService,
    private exportSvc: StockExportService,
    private msg: NzMessageService
  ) {}

  ngOnInit() {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
    this.searchAssetsForm = this.fb.group({
      fixedAssetsNumber: [null],
      manufactureCode: [null]
    });
    this.searchData();
  }
  // 查询
  searchData(page = 1) {
    this.pageIndex = page;
    this.loading = true;
    const params = {
      povCode: this.userInfo.pov,
      fixedAssetsNumber: this.searchAssetsForm.value.fixedAssetsNumber,
      manufactureCode: this.searchAssetsForm.value.manufactureCode,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.fixedAssetsService.getFixedAssets(params, resp => {
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
  // 编辑 or 新增固定资产
  editFixedAsset(data: any) {
    this.dialogService.open(FixedAssetAddComponent, {
      context: {
        fixedAssetsInfo: data
      },
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        this.searchData(this.pageIndex);
      }
    });
  }
  // 弹出确认框
  openDeleteDialog(template, data) {
    this.fixedAssetsInfo = data;
    console.log('需要删除的数据====',  this.fixedAssetsInfo);
    this.dialogService.open(template, {
      closeOnBackdropClick: false,
      closeOnEsc: false
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
          povCode: this.userInfo.pov,
          fixedAssetsNumber: this.searchAssetsForm.value.fixedAssetsNumber,
          manufactureCode: this.searchAssetsForm.value.manufactureCode,
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        };
        // console.log('params1', params);
        this.loading = true;
        this.exportSvc.excelFixedAssets(params, resp => {
          this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '固定资产报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }
  // 删除
  delete(ref) {
    const params = {
      fixedAssetsCode: this.fixedAssetsInfo.fixedAssetsCode,
      fixedAssetsType: this.fixedAssetsInfo.fixedAssetsType
    };
    this.fixedAssetsService.delete(params, resp => {
      console.log('删除params====', params, resp);
      if (resp && resp.code === 0) {
        this.msg.success('删除成功！', { nzDuration: 3000 });
        this.searchData(this.pageIndex);
      } else {
        this.msg.error(resp.msg, { nzDuration: 3000 });
      }
    });
    ref.close();
  }
}

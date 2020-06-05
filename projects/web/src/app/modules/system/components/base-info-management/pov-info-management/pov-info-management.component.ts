import { ConfirmDialogComponent } from './../../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { PovDialogComponent } from '../../dialog/pov-dialog/pov-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { PovInfoService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-pov-info-management',
  templateUrl: './pov-info-management.component.html',
  styleUrls: ['../../system.common.scss']
})
export class PovInfoManagementComponent implements OnInit {
  povData: any[] = [];
  form: FormGroup;
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  constructor(
    private dialog: NbDialogService,
    private povService: PovInfoService,
    private fb: FormBuilder,
    private msg: NzMessageService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      povCode: [null, [Validators.required]], // povCode
      name: [null, [Validators.required]] // 简称
    });
  }

  // 查询
  search(page = 1) {
    this.pageIndex = page;
    if (this.loading) return;
    let povInfo = JSON.parse(JSON.stringify(this.form.value));
    let params = {
      povCode: povInfo.povCode,
      name: povInfo.name,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    this.povData = [];
    this.povService.queryPovAndCount(params, resp => {
      this.loading = false;
      if (resp && resp[0].code === 0 && resp[0].hasOwnProperty('data') && resp[0].data.length !== 0) {
        this.povData = resp[0].data;
      }
      if (
        resp &&
        resp[1].code === 0 &&
        resp[1].hasOwnProperty('data') &&
        resp[1].data.length !== 0
      ) {
        this.total = resp[1].data[0].count;
      } else {
        this.total = 0;
      }
    });
  }

  // 添加
  addPov() {
    this.dialog.open(PovDialogComponent, {
      closeOnEsc: false
    });
  }

  // 重置
  reset() {
    this.form.reset();
    this.loading = false;
    this.povData = [];
  }

  // 修改povInfo
  changeInfo(pov: any) {
    this.dialog
      .open(PovDialogComponent, {
        closeOnEsc: false,
        context: {
          updateData: pov
        }
      })
      .onClose.subscribe(resp => this.search());
  }

  // 删除povInfo
  deleteInfo(pov: any) {
    this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认删除',
        content: '是否确认删除此条门诊数据?'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        this.povService.deletePovInfo(pov.id, resp => {
          if (resp && resp.code === 0) {
            this.search();
          }
        });
      }
    });
  }
}

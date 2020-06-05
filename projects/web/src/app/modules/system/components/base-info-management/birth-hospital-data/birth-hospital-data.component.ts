import { ConfirmDialogComponent } from './../../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddHospitalComponent } from '../../dialog/add-hospital/add-hospital.component';
import { HospitalBaseInfoService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-birth-hospital-data',
  templateUrl: './birth-hospital-data.component.html',
  styleUrls: ['../../system.common.scss']
})
export class BirthHospitalDataComponent implements OnInit {
  hospitalData: any[] = [];
  hospitalForm: FormGroup;
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  constructor(
    private dialog: NbDialogService,
    private hospitalSvc: HospitalBaseInfoService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.hospitalForm = this.fb.group({
      hospitalCode: [null],
      hospitalName: [null]
    });
    this.search();
  }

  // 查询数据
  search(page = 1) {
    this.pageIndex = page;
    if (this.loading) return;
    let hospitalInfo = JSON.parse(JSON.stringify(this.hospitalForm.value));
    let params = {
      hospitalCode: hospitalInfo.hospitalCode,
      hospitalName: hospitalInfo.hospitalName,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    this.hospitalData = [];
    this.hospitalSvc.queryHospitalAndCount(params, resp => {
      this.loading = false;
      if (resp && resp[0].code === 0 && resp[0].hasOwnProperty('data') && resp[0].data.length !== 0) {
        this.hospitalData = resp[0].data;
      }
      if (
        resp &&
        resp[1].code === 0 &&
        resp[1].hasOwnProperty('data') &&
        resp[1].data.length !== 0
      ) {
        this.total = resp[1].data[0].length;
      } else {
        this.total = 0;
      }
    });
  }

  // 修改医院信息
  updateHospital(data: any) {
    this.dialog.open(AddHospitalComponent, {
      closeOnEsc: false,
      context: {
        updateData: data
      }
    }).onClose.subscribe(resp => this.search());
  }

  // 删除医院信息
  deleteHospital(data: any) {
    this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认删除',
        content: '是否确认删除此条医院数据?'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        this.hospitalSvc.deleteHospitalBaseInfo(data.id, resp => {
          console.log('delete', resp);
          if (resp && resp.code === 0 && resp.hasOwnProperty('data')) {
            this.search();
          }
        });
      }
    });
  }

  // 重置
  reset() {
    this.hospitalForm.reset();
    this.loading = false;
    this.hospitalData = [];
  }
}

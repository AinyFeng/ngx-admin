import { ConfirmDialogComponent } from './../../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { ChangeKindergartenComponent } from '../../dialog/change-kindergarten/change-kindergarten.component';
import { UserService } from '@tod/uea-auth-lib';
import { SchoolBaseInfoService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-kindergarten-data',
  templateUrl: './kindergarten-data.component.html',
  styleUrls: ['../../system.common.scss']
})
export class KindergartenDataComponent implements OnInit {
  kindergartenData: any[] = [];
  kindergartenForm: FormGroup;
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;
  userInfo: any;

  constructor(
    private dialog: NbDialogService,
    private fb: FormBuilder,
    private schoolSvc: SchoolBaseInfoService,
    private userSvc: UserService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.kindergartenForm = this.fb.group({
      schoolCode: [null],
      unitFullName: [null],
      // unitName: [null],
      address: [null],
      contact: [null],
      contactNumber: [null],
      telphone: [null]
    });
  }

  // 查询
  search(page = 1) {
    this.pageIndex = page;
    if (this.loading) return;
    let kindergartenForm = JSON.parse(JSON.stringify(this.kindergartenForm.value));
    let params = {
      schoolCode: kindergartenForm.schoolCode,
      principal: kindergartenForm.contact,
      principalPhone: kindergartenForm.contactNumber,
      address: kindergartenForm.address,
      name: kindergartenForm.unitFullName,
      belongPovCode: this.userInfo.pov,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    this.kindergartenData = [];
    this.schoolSvc.querySchoolBaseInfoAndCount(params, resp => {
      this.loading = false;
      if (resp && resp[0].code === 0 && resp[0].hasOwnProperty('data')) {
        this.kindergartenData = resp[0].data;
      }
      if (resp && resp[1].code === 0 && resp[1].hasOwnProperty('data')) {
        this.total = resp[1].data[0].count;
      } else {
        this.total = 0;
      }
    });
  }

  /*
   * 修改学校信息
   * */
  updateSchool(data: any) {
    this.dialog.open(ChangeKindergartenComponent, {
      closeOnEsc: false,
      context: {
        updateData: data,
        userInfo: this.userInfo
      }
    }).onClose.subscribe(resp => this.search());
  }

  /*
   * 删除学校信息
   * */
  deleteSchool(data: any) {
    this.dialog
      .open(ConfirmDialogComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          title: '确认删除',
          content: '是否确认删除此条学校数据?'
        }
      })
      .onClose.subscribe(confirm => {
        if (confirm) {
          this.schoolSvc.deleteSchoolBaseInfo(data.id, resp => {
            if (resp && resp.code === 0 && resp.hasOwnProperty('data')) {
              this.search();
            }
          });
        }
      });
  }

  // 重置
  reset() {
    this.kindergartenForm.reset();
    this.loading = false;
    this.kindergartenData = [];
  }
}

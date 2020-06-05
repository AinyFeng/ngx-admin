import {ConfirmDialogComponent} from './../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import {Component, OnInit} from '@angular/core';
import {UserService} from '@tod/uea-auth-lib';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NbDialogService} from '@nebular/theme';
import {UpdatePriceManageComponent} from '../dialog/update-price-manage/update-price-manage.component';
import {VaccineSubclassInitService, ApiAdminDailyManagementService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-pov-price-management',
  templateUrl: './pov-price-management.component.html',
  styleUrls: ['../admin.common.scss']
})
export class PovPriceManagementComponent implements OnInit {
  loading = false;
  userInfo: any;
  form: FormGroup;
  listData: any = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;

  // 疫苗小类名称
  vacSubClassData = [];

  constructor(
    private userSvc: UserService,
    private fb: FormBuilder,
    private vacSubClassSvc: VaccineSubclassInitService,
    private adminSvc: ApiAdminDailyManagementService,
    private dialogSvc: NbDialogService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    // 获取疫苗小类编码
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    this.form = this.fb.group({
      vacProductCode: [null],
      batchNo: [null]
    });
    this.search();
  }

  reset() {
    this.form.reset({
      vacProductCode: []
    });
    this.listData = [];
    this.loading = false;
  }

  // 查询
  search(page = 1) {
    this.pageIndex = page;
    if (this.loading) return;
    let query = {
      povCode: this.userInfo.pov,
      vaccineSubclassCode: this.form.get('vacProductCode').value,
      prodBatchNumber: this.form.get('batchNo').value === '' || !this.form.get('batchNo').value ? null : this.form.get('batchNo').value,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    console.log(query);
    this.adminSvc.queryPovPriceManageInfoAndCount(query, resp => {
      console.log('查询', resp);
      this.loading = false;
      if (!resp || !resp[0].hasOwnProperty('data') || resp[0].code !== 0) {
        this.listData = [];
        return;
      }
      this.listData = resp[0].data;
      if (!resp || !resp[1].hasOwnProperty('data') || resp[1].code !== 0) {
        return;
      }
      this.total = resp[1].data[0].count;
    });
  }

  // 修改
  changeInfo(data) {
    this.dialogSvc.open(UpdatePriceManageComponent, {
      context: {
        userInfo: this.userInfo,
        data: data,
        vacSubClassData: this.vacSubClassData
      }
    }).onClose.subscribe(resp => this.search());
  }

  // 删除
  deleteInfo(data) {
    this.dialogSvc.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认删除',
        content: '是否确认删除此条门诊调价数据?'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        this.adminSvc.deletePovPrice(data, resp => {
          if (resp && resp.code === 0) {
            this.search();
          }
        });
      }
    });

  }

}

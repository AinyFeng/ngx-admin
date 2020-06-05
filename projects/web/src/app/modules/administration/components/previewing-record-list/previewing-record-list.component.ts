import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '@tod/uea-auth-lib';

import {
  SystemPreliminaryClinicalService
} from '@tod/svs-common-lib';
import {DateUtils} from '../../../../../../../svs-common-lib/src/lib/utils/date.utils';
import {NbDialogService} from '@nebular/theme';
import {PreRegRecordDetailComponent} from '../dialog/pre-reg-record-detail/pre-reg-record-detail.component';

@Component({
  selector: 'uea-previewing-record-list',
  templateUrl: './previewing-record-list.component.html',
  styleUrls: ['./previewing-record-list.component.scss']
})
export class PreviewingRecordListComponent implements OnInit {

  /**
   * 如果查询了档案信息就查询此档案人的接种记录,如果没有查询档案则查询的是整个pov的预诊记录
   */
  profile: any;
  queryForm: FormGroup;
// table中的数据
  listOfData: any[] = [];
  // 此刻的时间
  currentNow = new Date();
  // 登录用户信息
  userInfo: any;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    private sysPreSvc: SystemPreliminaryClinicalService,
    private dialogSvc: NbDialogService
  ) {
  }

  ngOnInit() {
    const year = this.currentNow.getFullYear();
    const month = this.currentNow.getMonth();
    const day = this.currentNow.getDate();
    this.queryForm = this.fb.group({
      profileCode: [null], // 档案编号
      name: [null], // 姓名
      idCardNo: [null], // 证件号码
      birthStart: [new Date(year, month, day)], // 出生日期起
      birthEnd: [null], // 出生日期止
      motherName: [null], // 母亲姓名
      motherContactPhone: [null], // 母亲手机号
      fatherName: [null], // 父亲姓名
      fatherContactPhone: [null], // 父亲手机号
    });
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      this.queryData();
    });
  }

  // 查询
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    let conditions = JSON.parse(JSON.stringify(this.queryForm.value));
    let params = {
      povCode: this.userInfo.pov,
      profileCode: conditions.profileCode === '' || !conditions.profileCode ? null : conditions.profileCode,
      name: conditions.name === '' || !conditions.name ? null : conditions.name,
      /*birthDate: conditions.birthStart ? DateUtils.getTimestamp(conditions.birthStart) : null,
      birthDateBreak: conditions.birthEnd ? DateUtils.getTimestamp(conditions.birthEnd) : null,*/
      creatDate: conditions.birthStart ? DateUtils.formatToDate(conditions.birthStart) : null,
      idCardNo: conditions.idCardNo === '' || !conditions.idCardNo ? null : conditions.idCardNo,
      motherName: conditions.motherName === '' || !conditions.motherName ? null : conditions.motherName,
      motherPhone: conditions.motherContactPhone === '' || !conditions.motherContactPhone ? null : conditions.motherContactPhone,
      fatherName: conditions.fatherName === '' || !conditions.fatherName ? null : conditions.fatherName,
      fatherPhone: conditions.fatherContactPhone === '' || !conditions.fatherContactPhone ? null : conditions.fatherContactPhone,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.listOfData = [];
    this.loading = true;
    this.sysPreSvc.queryPreRegRecordInfoAndCount(params, resp => {
      this.loading = false;
      console.log(resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        return;
      }
      this.listOfData = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data') || resp[1].data.length === 0) {
        return;
      }
      this.total = resp[1].data[0].count;
    });


  }

  resetForm() {
    this.queryForm.reset();
    this.queryForm.get('birthStart').patchValue(new Date(this.currentNow.getFullYear(), this.currentNow.getMonth(), this.currentNow.getDate()));
    this.loading = false;
  }

  // 创建日期
  disabledStart = (d: Date) => {
    return d > new Date();
  }

  // 查看
  checkDetail(data) {
    console.log('data', data);
    this.dialogSvc.open(PreRegRecordDetailComponent, {
      context: {
        preData: data,
      }
    });
  }

}

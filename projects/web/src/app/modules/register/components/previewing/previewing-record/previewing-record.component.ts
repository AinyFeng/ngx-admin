import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {
  DicDataService,
  ProfileDataService,
  ProfileService,
  ProfileStatusChangeService, SystemPreliminaryClinicalService
} from '@tod/svs-common-lib';
import {NzMessageService} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';
import {PreRegRecordDetailComponent} from '../../../../administration/components/dialog/pre-reg-record-detail/pre-reg-record-detail.component';


@Component({
  selector: 'uea-previewing-record',
  templateUrl: './previewing-record.component.html',
  styleUrls: ['./previewing-record.component.scss']
})
export class PreviewingRecordComponent implements OnInit {

  form: FormGroup;
  loading = false;
  listOfData: any[] = [];
  profile: any;
  // 用户信息
  userInfo: any;
  total = 0;
  pageIndex = 1;
  pageSize = 10;

  constructor(
    private ref: NbDialogRef<PreviewingRecordComponent>,
    private profileDataSvc: ProfileDataService,
    private fb: FormBuilder,
    private profileSvc: ProfileService,
    private dicDataSvc: DicDataService,
    private changeSvc: ProfileStatusChangeService,
    private msg: NzMessageService,
    private userSvc: UserService,
    private sysPreSvc: SystemPreliminaryClinicalService,
    private dialogSvc: NbDialogService
  ) { }

  ngOnInit() {
    this.profileDataSvc.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
        console.log('当前的查询的profile===', resp);
      }
    });
    this.userSvc.getUserInfoByType().subscribe(user => (this.userInfo = user));
    // 默认查询
    this.queryData();
  }

  onClose() {
    this.ref.close();
  }

  // 查询
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    let params = {
      povCode: this.userInfo.pov,
      profileCode: this.profile.profileCode,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    /*  params['profileCode'] = this.profile.profileCode;*/
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

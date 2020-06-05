import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { AefiFeedbackComponent } from '../aefi-feedback/aefi-feedback.component';
import { ProfileDataService, AefiService, ProfileChangeService, PROFILE_CHANGE_KEY } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-f-aefi-list',
  templateUrl: './aefi-list.component.html',
  styleUrls: ['./aefi-list.component.scss']
})
export class AefiListComponent implements OnInit, OnDestroy {
  loading = false;
  profile: any;

  data = [];
  contentData: any;

  constructor(
    private ref: NbDialogRef<AefiListComponent>,
    private profileSvc: ProfileDataService,
    private aefiSvc: AefiService,
    private msg: NzMessageService,
    private dialog: NbDialogService,
    private profileChangeSvc: ProfileChangeService
  ) {
    this.profileSvc.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
      }
    });
  }

  ngOnInit() {
    this.queryAefiRecord();
  }

  ngOnDestroy(): void {
    this.profileChangeSvc.setProfileChange(PROFILE_CHANGE_KEY.AEFI);
  }

  onClose() {
    this.ref.close();
  }

  queryAefiRecord() {
    if (!this.profile) return;
    this.loading = true;
    const profileCode = this.profile['profileCode'];
    this.aefiSvc.queryAefiRecordByProfileCode(profileCode, resp => {
      this.loading = false;
      console.log(resp);
      this.resetData();
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp['data'].length === 0
      ) {
        return;
      }
      this.data = resp.data;
      console.log(this.data);
    });
  }

  select(d) {
    this.contentData = d;
  }

  update = data => {
    this.dialog
      .open(AefiFeedbackComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          updateData: data
        }
      })
      .onClose.subscribe(_ => this.queryAefiRecord());
  }

  delete(data) {
    const aefiCode = data['aefiCode'];
    this.aefiSvc.deleteAefiRecordByAefiCode(aefiCode, resp => {
      // console.log('删除数据', resp);
      if (resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data !== 1) {
        this.msg.error('操作失败，请重试');
        return;
      }
      this.queryAefiRecord();
    });
  }

  addRecord() {
    this.dialog
      .open(AefiFeedbackComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
      .onClose.subscribe(_ => this.queryAefiRecord());
  }

  resetData() {
    this.data = [];
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TabAddChildFileComponent } from '../tab-add-child-file/tab-add-child-file.component';
import { TabAddAdultFileComponent } from '../tab-add-adult-file/tab-add-adult-file.component';
import { IdCardScanService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-f-add-new-file',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss']
})
export class AddProfileComponent implements OnInit {
  profileType = 'child';
  loading = false;

  // 身份证扫描信息
  scanIdCardInfo: any;

  @ViewChild('addChild', { static: false })
  childComponent: TabAddChildFileComponent;
  @ViewChild('addAdult', { static: false })
  adultComponent: TabAddAdultFileComponent;

  constructor(
    protected ref: NbDialogRef<AddProfileComponent>,
    private scanIdCardSvc: IdCardScanService
  ) {
  }

  ngOnInit() {
  }

  saveProfile() {
    if (this.profileType === 'child') {
      this.childComponent.onSubmit();
    } else {
      this.adultComponent.onSubmit();
    }
  }

  onLoading(ev: Event) {
    this.loading = !!ev;
    console.log(this.loading);
  }

  onClose() {
    this.ref.close();
  }

  profileTypeChange(e) {
    this.profileType = e;
  }

  // 切换tab的时候修改内容
  chooseFileType(ev) {
    // console.log(ev);
    if (ev.tabTitle === '儿童档案') {
      this.profileType = 'child';
    } else {
      this.profileType = 'adult';
    }
  }

  readIdCardInfo() {
    this.scanIdCardSvc.getIdCardInfo(idCardInfo => {
      this.scanIdCardInfo = idCardInfo;
    });
  }
}

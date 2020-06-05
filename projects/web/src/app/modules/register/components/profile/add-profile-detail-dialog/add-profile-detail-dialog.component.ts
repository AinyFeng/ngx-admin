import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { SingleDosageRecordComponent } from '../../vaccinated-record/single-dosage-record/single-dosage-record.component';
// import { AefiFeedbackComponent } from '../../aefi/aefi-feedback/aefi-feedback.component';
// import { RabiesBittenRecordComponent } from '../../rabies-record/rabies-bitten-record/rabies-bitten-record.component';
// import { AddIllnessComponent } from '../../medical-history/add-illness/add-illness.component';
// import { AddGuardianComponent } from '../../guardian/add-guardian/add-guardian.component';
import { AefiListComponent } from '../../aefi/aefi-list/aefi-list.component';
import { IllnessListComponent } from '../../medical-history/illness-list/illness-list.component';
import { RabiesBittenListComponent } from '../../rabies-record/rabies-bitten-list/rabies-bitten-list.component';
import { ProfileDataService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-add-profile-detail-dialog',
  templateUrl: './add-profile-detail-dialog.component.html',
  styleUrls: ['./add-profile-detail-dialog.component.scss']
})
export class AddProfileDetailDialogComponent implements OnInit {
  profile: any;
  btnOptions = [
    { label: '添加接种记录', value: 'vaccRecord' },
    { label: '添加犬伤咬伤记录', value: 'bitten' },
    { label: '添加禁忌、过敏、病史信息', value: 'contra' }
  ];

  constructor(
    private ref: NbDialogRef<AddProfileDetailDialogComponent>,
    private dialogService: NbDialogService,
    private profileDataService: ProfileDataService
  ) {
    this.profileDataService
      .getProfileData()
      .subscribe(resp => (this.profile = resp));
  }

  ngOnInit() { }

  onClose() {
    this.ref.close();
  }

  openDialog(route) {
    switch (route) {
      case 'vaccRecord':
        this.dialogService.open(SingleDosageRecordComponent, {
          closeOnBackdropClick: false,
          closeOnEsc: false,
          hasBackdrop: true,
          context: {}
        });
        break;
      case 'aefi':
        this.dialogService.open(AefiListComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: {}
        });
        break;
      case 'bitten':
        this.dialogService.open(RabiesBittenListComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: {}
        });
        break;
      case 'contra':
        this.dialogService.open(IllnessListComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: {}
        });
        break;
    }
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { AddIllnessComponent } from '../add-illness/add-illness.component';
import { NzMessageService } from 'ng-zorro-antd';
import { MedicalHistoryService, ProfileDataService, ProfileChangeService, PROFILE_CHANGE_KEY } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-f-add-illness',
  templateUrl: './illness-list.component.html',
  styleUrls: ['./illness-list.component.scss']
})
export class IllnessListComponent implements OnInit, OnDestroy {
  public readonly CONTRA = '1';

  public readonly ALLERGY = '2';

  public readonly MEDICAL = '3';

  contentData: any;

  loading = false;
  isError = false;
  data = [];

  contraData = [];

  allergyData = [];

  medicalData = [];

  profile: any;

  constructor(
    private ref: NbDialogRef<IllnessListComponent>,
    private dialog: NbDialogService,
    private medicalSvc: MedicalHistoryService,
    private profileDataService: ProfileDataService,
    private msg: NzMessageService,
    // private mockSvc: MockDataService,
    private profileChangeSvc: ProfileChangeService
  ) {
    this.profileDataService.getProfileData().subscribe(resp => {
      this.profile = resp;
      this.queryMedicalRecord();
    });
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.profileChangeSvc.setProfileChange(PROFILE_CHANGE_KEY.ILLNESS);
  }

  onClose() {
    this.ref.close();
  }

  addRecord(arg) {
    this.dialog
      .open(AddIllnessComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          type: arg
        }
      })
      .onClose.subscribe(resp => {
        if (resp) {
          this.queryMedicalRecord();
        }
      });
  }

  queryMedicalRecord() {
    if (!this.profile) return;
    this.loading = true;
    this.isError = false;
    let query = {
      profileCode: this.profile['profileCode']
    };
    this.medicalSvc.queryMedicalRecord(query, resp => {
      console.log(resp);
      this.loading = false;
      if (resp.code !== 0) {
        this.isError = true;
      }
      if (resp.hasOwnProperty('data') && resp.data.length !== 0) {
        this.data = resp['data'];
        this.resetData();
        this.data.forEach(item => {
          if (item.type === this.CONTRA) {
            this.contraData.push(item);
          }
          if (item.type === this.ALLERGY) {
            this.allergyData.push(item);
          }
          if (item.type === this.MEDICAL) {
            this.medicalData.push(item);
          }
        });
      }
    });
  }

  resetData() {
    this.contraData = [];
    this.allergyData = [];
    this.medicalData = [];
  }

  // 删除数据
  deleteData(data: any, arg: string) {
    console.log(data);
    const medicalHistoryCode = data['medicalHistoryCode'];
    this.medicalSvc.deleteMedicalRecord(medicalHistoryCode, resp => {
      console.log(resp);
      if (resp.code !== 0) {
        this.msg.error('操作失败');
      } else {
        this.msg.success('操作成功');
        this.resetData();
        this.queryMedicalRecord();
      }
    });
  }

  // 修改禁忌症
  modifyContra(data: any, arg: string) {
    console.log(data);
    this.dialog
      .open(AddIllnessComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          data: data
        }
      })
      .onClose.subscribe(resp => {
        this.queryMedicalRecord();
      });
  }

  select(d) {
    this.contentData = d;
  }
}

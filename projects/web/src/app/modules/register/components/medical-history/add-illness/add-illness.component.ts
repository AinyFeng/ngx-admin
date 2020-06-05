import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';
import { ProfileDataService, MedicalHistoryService, DicDataService, VaccineSubclassInitService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-f-add-contra',
  templateUrl: './add-illness.component.html',
  styleUrls: ['./add-illness.component.scss']
})
/**
 * 添加禁忌 组件
 */
export class AddIllnessComponent implements OnInit {
  type: string;

  data: any;

  allergyDesc: any;

  medicalDesc: any;

  selectContra: any;

  profile: any;

  memo: string;

  contraOpt = [];

  selectAvoid: any;
  avoidOpt = [];

  // 用户信息
  userInfo: any;

  constructor(
    private ref: NbDialogRef<AddIllnessComponent>,
    private profileDataService: ProfileDataService,
    private medicalSvc: MedicalHistoryService,
    private msg: NzMessageService,
    // private mockSvc: MockDataService,
    private dicSvc: DicDataService,
    private userSvc: UserService,
    private vaccineSubClassSvc: VaccineSubclassInitService
  ) {
    this.profileDataService.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
      }
    });
    this.userSvc.getUserInfoByType().subscribe(user => (this.userInfo = user));
  }

  ngOnInit() {
    if (this.data) {
      this.type = this.data.type;
      this.memo = this.data.memo;
      if (this.type === '1') {
        this.selectContra = this.data.description;
      }
      if (this.type === '2') {
        this.allergyDesc = this.data.description;
      }
      if (this.type === '3') {
        this.medicalDesc = this.data.description;
      }
      this.selectAvoid = JSON.parse(this.data.avoidVacCode);
    }
    this.contraOpt = this.dicSvc.getDicDataByKey('tabooType');
    this.avoidOpt = this.vaccineSubClassSvc.getVaccineSubClassData();
  }

  onSubmit() {
    if (!this.profile) return;
    if (!this.selectAvoid) return;
    if (!this.selectContra && !this.allergyDesc && !this.medicalDesc) return;
    let data;
    if (this.data) {
      data = JSON.parse(JSON.stringify(this.data));
      console.log(data, this.data);
      delete data.createDate;
      delete data.modifyDate;
      if (this.type === '1') {
        data.description = this.selectContra;
      }
      if (this.type === '2') {
        data.description = this.allergyDesc;
      }
      if (this.type === '3') {
        data.description = this.medicalDesc;
      }
      data.avoidVacCode = JSON.stringify(this.selectAvoid);
      data.memo = this.memo;
      data.modifyBy = this.userInfo.userCode;
      data.modifyPovCode = this.userInfo.pov;
      // console.log(data);
      this.medicalSvc.updateMedicalRecord(data, resp => {
        // console.log(resp);
        if (
          resp.code !== 0 ||
          (resp.hasOwnProperty('data') && resp.data !== 1)
        ) {
          this.msg.error('操作失败，请重试');
          return;
        }
        this.ref.close(true);
      });
    } else {
      if (this.type === '1') {
        data = {
          description: this.selectContra
        };
      }
      if (this.type === '2') {
        data = {
          description: this.allergyDesc
        };
      }
      if (this.type === '3') {
        data = {
          description: this.medicalDesc
        };
      }
      data.patientName = this.profile['name'];
      data.profileCode = this.profile['profileCode'];
      data.patientIdCardNo = this.profile['idCardNo'];

      data.type = this.type;
      data.createPovCode = this.userInfo.pov;
      data.createBy = this.userInfo.userCode;
      data.memo = this.memo;
      data.avoidVacCode = JSON.stringify(this.selectAvoid);
      // console.log(data);
      this.medicalSvc.saveMedicalRecord(data, resp => {
        // console.log(resp);
        if (
          resp.code !== 0 ||
          (resp.hasOwnProperty('data') && resp.data !== 1)
        ) {
          this.msg.error('操作失败，请重试');
          return;
        }
        this.ref.close(true);
      });
    }
  }

  onClose() {
    this.ref.close();
  }
}

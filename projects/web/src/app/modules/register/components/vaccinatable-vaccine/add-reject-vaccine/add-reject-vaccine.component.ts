import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { VaccinateStrategyApiService, VaccineSubclassInitService, CommonUtils } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-add-reject-vaccine',
  templateUrl: './add-reject-vaccine.component.html',
  styleUrls: ['./add-reject-vaccine.component.scss'],
  providers: [VaccinateStrategyApiService]
})
export class AddRejectVaccineComponent implements OnInit {

  // 当前登录的userInfo
  userInfo: any;
  // 查询当前档案信息
  profile: any;

  // 避免接种的
  avoidOpt = [];
  selectAvoid: any;

  // 症状描述
  symptomDescriptions: any;
  memo: string;


  constructor(
    private ref: NbDialogRef<AddRejectVaccineComponent>,
    private vaccineSubClassSvc: VaccineSubclassInitService,
    private vaccineStrategySvc: VaccinateStrategyApiService,
    private msg: NzMessageService
  ) {
  }

  onClose() {
    this.ref.close();
  }

  ngOnInit() {
    // 获取避免接种的
    this.avoidOpt = this.vaccineSubClassSvc.getVaccineSubClassData();
  }

  // 保存
  onSubmit() {
    if (!this.profile) return;
    if (!this.selectAvoid) return;
    if (!this.symptomDescriptions) return;
    let disableVaccineData;
    disableVaccineData = {
      description: this.symptomDescriptions
    };
    disableVaccineData.avoidVacCode = JSON.stringify(this.selectAvoid);
    disableVaccineData.type = '4';
    disableVaccineData.profileCode = this.profile.profileCode;
    disableVaccineData.medicalHistoryCode = CommonUtils.uuid(32, '');
    disableVaccineData.memo = this.memo;
    disableVaccineData.createPovCode = this.userInfo.pov;
    disableVaccineData.createBy = this.userInfo.userCode;
    this.vaccineStrategySvc.insertPersonalizeConf(disableVaccineData, resp => {
      if (!resp || !resp.hasOwnProperty('data') || resp.data.length === 0) {
        return;
      }
      this.msg.warning('成功添加不接种疫苗');
      this.ref.close();
    });

  }

}

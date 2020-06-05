import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { VaccinateStrategyApiService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-reject-vaccine',
  templateUrl: './reject-vaccine.component.html',
  styleUrls: ['./reject-vaccine.component.scss'],
  providers: [VaccinateStrategyApiService]
})

export class RejectVaccineComponent implements OnInit {

  profile: any;
  loading = false;
  rejectVaccineData: any[] = [];

  constructor(
    private ref: NbDialogRef<RejectVaccineComponent>,
    private vaccineStrategySvc: VaccinateStrategyApiService,
  ) {
  }

  ngOnInit() {
    this.queryRejectVaccine();
  }

  onClose() {
    this.ref.close();
  }

  // 查询
  queryRejectVaccine() {
    if (!this.profile) return;
    this.loading = true;
    const profileCode = this.profile['profileCode'];
    this.vaccineStrategySvc.queryPersonalizeConf(profileCode, resp => {
      this.loading = false;
      console.log(resp);
      if (!resp || resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data.length === 0) {
        return;
      }
      this.rejectVaccineData = resp.data;
      console.log(this.rejectVaccineData);
    });

  }

  // 添加
  addRejectVaccine() {

  }


}

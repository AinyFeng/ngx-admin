import {Component, OnInit} from '@angular/core';
import {UserService} from '@tod/uea-auth-lib';
import {VaccinateStrategyApiService, VaccBroadHeadingDataService} from '@tod/svs-common-lib';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'uea-pov-vaccine-configuration',
  templateUrl: './pov-vaccine-configuration.component.html',
  styleUrls: ['../system.common.scss'],
  providers: [VaccinateStrategyApiService]
})
export class PovVaccineConfigurationComponent implements OnInit {
  loading = false;
  vaccineData: any[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  userInfo: any;
  form: FormGroup;
  // 疫苗大类
  vacBroadHeadingData: any = [];

  constructor(
    private vaccStrategySvc: VaccinateStrategyApiService,
    private userSvc: UserService,
    private fb: FormBuilder,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    // 获取疫苗大类
    this.vacBroadHeadingData = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    this.form = this.fb.group({
      batchNo: [null],
      broadHeadingCode: [null],
      status: [null]
    });
    this.search();
  }

  // 查询pov门诊疫苗配置
  search(page = 1) {
    this.pageIndex = page;
    if (this.loading) return;
    let params = {
      povCode: this.userInfo.pov,
      batchNo: this.form.get('batchNo').value === '' || !this.form.get('batchNo').value ? null : this.form.get('batchNo').value,
      broadHeadingCode: this.form.get('broadHeadingCode').value ? this.form.get('broadHeadingCode').value : null,
      status: this.form.get('status').value ? this.form.get('status').value : null,
      pageEntity: {
        page: page,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    this.vaccineData = [];
    console.log('参数', params);
    this.vaccStrategySvc.queryPovBatchInfoAndCount(params, resp => {
      this.loading = false;
      console.log('结果', resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        return;
      }
      this.vaccineData = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data') || resp[1].data.length === 0) {
        return;
      }
      this.total = resp[1].data;
    });
  }

  reset() {
    this.form.reset();
    this.loading = false;
  }

  // 更新
  setUseAble(data, userAble) {
    if (this.loading) return;
    this.loading = true;
    data.status = userAble;
    this.vaccStrategySvc.updatePovBatchInfo(data, resp => {
      this.loading = false;
      if (resp && resp.code === 0) {
        this.search(this.pageIndex);
      }
    });

  }


}

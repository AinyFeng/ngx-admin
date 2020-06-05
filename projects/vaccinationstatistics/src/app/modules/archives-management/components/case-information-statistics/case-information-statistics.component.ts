import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VacProfileStatisticsApi } from '../../../../../../../svs-common-lib/src/lib/vac-profile-api/information-statistics/vac-profile-statistics.api.service';
import { AdministrativeService } from '@tod/svs-common-lib';
import { DateUtils } from '../../../../../../../svs-common-lib/src/lib/utils/date.utils';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-case-information-statistics',
  templateUrl: './case-information-statistics.component.html',
  styleUrls: ['./case-information-statistics.component.scss']
})
export class CaseInformationStatisticsComponent implements OnInit {

  queryForm: FormGroup;
  userInfo: any;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  // table中的数据
  listOfData: any[] = [];
  addressData: any[];
  areaCode: any;
  level: any;
  // 查新范围
  checkOptionsOne = [
    {label: '在册', value: '1'},
    {label: '离册', value: '2'},
    {label: '删除', value: '3'},
    {label: '死亡', value: '4'}
  ];


  constructor(private fb: FormBuilder,
              private adminSvc: AdministrativeService,
              private vacProfile: VacProfileStatisticsApi,
              private user: UserService,
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      this.areaCode = this.userInfo.pov.slice(0, 4);
      console.log('用户所在的市code====', this.areaCode);
    });
  }

  ngOnInit(): void {
    this.queryForm = this.fb.group({
      address: [this.userInfo.pov.slice(0, 4) + '002'], // 地区名称
      birthDayStart: [null], // 出生日期开始
      birthDayEnd: [null], // 出生日期结束
      queryScope: [null], // 查询范围
      barcode: [null], // 条码
      createDateStart: [null], // 建档日期开始
      createDateEnd: [null], // 建档日期结束
    });
    this.queryAddressData();
    this.query();
  }

  query(page = 1): void {
    console.log('query====');
    this.pageIndex = page;
    if (this.loading) return;
    this.listOfData = [];
    if (this.queryForm.get('address').value) {
      this.areaCode = this.queryForm.get('address').value.slice(0, 6);
      this.level = this.queryForm.get('address').value.slice(6, 7);
    } else {
      this.areaCode = this.userInfo.pov.slice(0, 4) + '00';
      this.level = 2;
    }

    const params = {
      areaCode: this.areaCode ? this.areaCode : null,
      leval: this.level ? this.level : null,
      birthDateStart: this.queryForm.get('birthDayStart').value ? DateUtils.formatStartDate(this.queryForm.get('birthDayStart').value) : null,
      birthDateEnd: this.queryForm.get('birthDayEnd').value ? DateUtils.formatEndDate(this.queryForm.get('birthDayEnd').value) : null,
      buildArchivesDateStart: this.queryForm.get('createDateStart').value ? DateUtils.formatStartDate(this.queryForm.get('createDateStart').value) : null,
      buildArchivesDateEnd: this.queryForm.get('createDateEnd').value ? DateUtils.formatEndDate(this.queryForm.get('createDateEnd').value) : null,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    const profileStatus = this.queryForm.get('queryScope').value;
    let range = [];
    if (profileStatus !== null) {
      profileStatus.filter(item => item.checked === true).forEach(item => range.push(item.value));
    }
    params['profileStatus'] = range;
    this.loading = true;
    console.log('参数', params);
    this.listOfData = [];
    this.vacProfile.archivesList(params, (resp, resp1) => {
      this.loading = false;
      console.log('data', resp, resp1);
      // 解析count数据
      if (resp1 && resp1.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        this.total = resp1.data;
        console.log('total', this.total);
      }
      // 解析表格数据
      if (resp && resp.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        this.listOfData = resp.data;
      } else {
        this.listOfData = [];
        // this.msg.warning('未查询到数据');
        return;
      }

    });
  }


  // 过滤开始日期
  disabledbirthStart = (d: Date) => {
    if (this.queryForm.value.birthDayEnd) {
      return d > this.queryForm.value.birthDayEnd;
    } else {
      return false;
    }
  }

  // 过滤结束日期
  disabledbirthEnd = (d: Date) => {
    if (this.queryForm.value.birthDayStart) {
      return d < this.queryForm.value.birthDayStart;
    } else {
      return false;
    }
  }

  // 过滤建档开始日期
  disableCreateDateStart = (d: Date) => {
    if (this.queryForm.value.createDateEnd) {
      return d > this.queryForm.value.createDateEnd;
    } else {
      return false;
    }
  }

  // 过滤建档结束日期
  disabledCreateDateEnd = (d: Date) => {
    if (this.queryForm.value.createDateStart) {
      return d < this.queryForm.value.createDateStart;
    } else {
      return false;
    }
  }

  // 查询地区信息
  queryAddressData() {
    const params = {
      areaCode: this.areaCode,
    };
    this.vacProfile.urbanCountyList(params, (resp) => {
      console.log('省市结果', resp);
      this.addressData = resp.data;
    });
  }

}

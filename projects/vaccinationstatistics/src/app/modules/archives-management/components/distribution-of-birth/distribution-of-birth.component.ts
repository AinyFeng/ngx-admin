import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateUtils } from '../../../../../../../svs-common-lib/src/lib/utils/date.utils';
import { VacProfileStatisticsApi } from '../../../../../../../svs-common-lib/src/lib/vac-profile-api/information-statistics/vac-profile-statistics.api.service';
import { DicDataService } from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-distribution-of-birth',
  templateUrl: './distribution-of-birth.component.html',
  styleUrls: ['./distribution-of-birth.component.scss']
})
export class DistributionOfBirthComponent implements OnInit {


  queryForm: FormGroup;
  // 居住属性
  residentialTypeData = [];
  listOfData: any[] = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  userInfo: any;
  addressData: any[];
  areaCode: any;
  level: any;

  // 儿童状态
  checkOptionsOne = [
    {label: '在册', value: '1'},
    {label: '离册', value: '2'},
    {label: '删除', value: '3'},
    {label: '死亡', value: '4'}
  ];

  constructor(private fb: FormBuilder,
              private dicSvc: DicDataService,
              private vacProfile: VacProfileStatisticsApi,
              private user: UserService,
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
    });
  }

  ngOnInit(): void {
    // 获取居住类型
    this.residentialTypeData = this.dicSvc.getDicDataByKey('residentialType');
    this.queryForm = this.fb.group({
      address: [this.userInfo.pov.slice(0, 4) + '002'], // 地区名称
      annual: [null], // 年度
      residentialTypeCode: [null], // 居住属性
      creatDateStart: [null], // 建档起始日期
      creatDateEnd: [null], // 建档截止日期
      profileStatusCode: [null], // 儿童状态
    });
    this.queryAddressData();
    this.query();
  }


  // 过滤开始日期
  disableCreateDateStart = (d: Date) => {
    if (this.queryForm.value.creatDateEnd) {
      return d > this.queryForm.value.creatDateEnd;
    } else {
      return false;
    }
  }

  // 过滤结束日期
  disableCreatDateEnd = (d: Date) => {
    if (this.queryForm.value.creatDateStart) {
      return d < this.queryForm.value.creatDateStart;
    } else {
      return false;
    }
  }


  // 查询数据
  query(page = 1): void {
    this.pageIndex = page;
    this.loading = true;
    if (this.queryForm.get('address').value) {
      this.areaCode = this.queryForm.get('address').value.slice(0, 6);
      this.level = this.queryForm.get('address').value.slice(6, 7);
    } else {
      this.areaCode = this.userInfo.pov.slice(0, 4) + '00';
      this.level = 2;
    }
    const params = {
      code: this.areaCode ? this.areaCode : null,
      yearStr: this.queryForm.get('annual').value ? DateUtils.formatStartDate(this.queryForm.get('annual').value).slice(0, 4) : null,
      vaccinationPovCode: null,
      residentialTypeCode: this.queryForm.get('residentialTypeCode').value ? this.queryForm.get('residentialTypeCode').value : null,
      startDate: this.queryForm.get('creatDateStart').value ? DateUtils.formatToDate(this.queryForm.get('creatDateStart').value) : null,
      endDate: this.queryForm.get('creatDateEnd').value ? DateUtils.formatToDate(this.queryForm.get('creatDateEnd').value) : null,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    const condition = this.queryForm.get('profileStatusCode').value;
    let range = [];
    if (condition !== null) {
      condition.filter(item => item.checked === true).forEach(item => range.push(item.value));
    }
    params['profileStatusCode'] = range;
    console.log('参数', params);
    this.vacProfile.queryBirthDateList(params, (resp, resp1) => {
      console.log('resp===', resp, resp1);
      this.loading = false;
      let searchDataList = resp;
      let searchDataCount = resp1.data[0].count;
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      } else {
        this.listOfData = [];
      }
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
      } else {
        this.total = 0;
      }
    });
  }

  // 查询地区信息
  queryAddressData() {
    const params = {
      areaCode: this.userInfo.pov.slice(0, 4),
    };
    this.vacProfile.urbanCountyList(params, (resp) => {
      // console.log('省市结果', resp);
      this.addressData = resp.data;
    });
  }

}

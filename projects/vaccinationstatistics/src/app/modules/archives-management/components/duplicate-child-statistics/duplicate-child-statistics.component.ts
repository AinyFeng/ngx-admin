import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VacProfileStatisticsApi } from '../../../../../../../svs-common-lib/src/lib/vac-profile-api/information-statistics/vac-profile-statistics.api.service';
import { DateUtils } from '../../../../../../../svs-common-lib/src/lib/utils/date.utils';
import { UserService } from '@tod/uea-auth-lib';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'uea-duplicate-child-statistics',
  templateUrl: './duplicate-child-statistics.component.html',
  styleUrls: ['./duplicate-child-statistics.component.scss']
})
export class DuplicateChildStatisticsComponent implements OnInit {

  queryForm: FormGroup;
  listOfData: any[] = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  userInfo: any;
  addressData: any[];
  areaCode: any;
  level: any;

  // 重复条件
  checkOptionsOne = [
    {label: '儿童姓名', value: '1', checked: true},
    {label: '母亲姓名', value: '2'},
    {label: '父亲姓名', value: '3'},
    {label: '母亲姓名或父亲姓名', value: '4'},
    {label: '出生日期', value: '5'},
    {label: '儿童性别', value: '6'}
  ];

  constructor(private fb: FormBuilder,
              private vacProfile: VacProfileStatisticsApi,
              private modalService: NzModalService,
              private user: UserService,
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
    });
  }

  ngOnInit(): void {
    this.queryForm = this.fb.group({
      address: [this.userInfo.pov.slice(0, 4) + '002'], // 地区名称
      exportPageStart: [null], // 导出页码开始
      exportPageEnd: [null], // 导出页码结束
      repeaConditions: [null], // 重复条件
      birthDateStart: [null], // 出生日期开始
      birthDateEnd: [null], // 出生日期结束
    });
    this.queryAddressData();
    this.searchData();
  }

  // 过滤开始日期
  disabledbirthStart = (d: Date) => {
    if (this.queryForm.value.birthDateEnd) {
      return d > this.queryForm.value.birthDateEnd;
    } else {
      return false;
    }
  }

  // 过滤结束日期
  disabledbirthEnd = (d: Date) => {
    if (this.queryForm.value.birthDateStart) {
      return d < this.queryForm.value.birthDateStart;
    } else {
      return false;
    }
  }

  // 查询
  searchData(page = 1) {
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
      areaCode: this.areaCode ? this.areaCode : null,
      leval: this.level ? this.level : null,
      birthDateStart: this.queryForm.get('birthDateStart').value ? DateUtils.formatStartDate(this.queryForm.get('birthDateStart').value) : null,
      birthDateEnd: this.queryForm.get('birthDateEnd').value ? DateUtils.formatStartDate(this.queryForm.get('birthDateEnd').value) : null,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    const condition = this.queryForm.get('repeaConditions').value;
    let range = [];
    if (condition !== null) {
      condition.filter(item => item.checked === true).forEach(item => range.push(item.value));
    } else {
      range = ['1'];
    }
    if (range.length === 0) {
      this.modalService.warning({
        nzTitle: '提示',
        nzContent: `<p>表格填写不完整，请检查</p>`,
        nzMaskClosable: true
      });
      this.loading = false;
      return;
    }
    params['condition'] = range;
    console.log('参数', params);
    this.vacProfile.duplicateArchivesList(params, resp => {
      console.log('resp===', resp);
      this.loading = false;
      let searchDataList = resp;
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      } else {
        this.listOfData = [];
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


  // 重置
  resetForm() {
    const checkOptionsOne = this.checkOptionsOne;
    checkOptionsOne.forEach(item => item.checked = false);
    this.queryForm.reset({
      orderStatus: []
    });
    this.queryForm.get('repeaConditions').setValue(checkOptionsOne);
  }
}

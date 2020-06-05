import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { AdministrativeService, ApiAdminDailyManagementService, TransformUtils } from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { Location } from '@angular/common';
import { VacProfileStatisticsApi } from '../../../../../../../svs-common-lib/src/lib/vac-profile-api/information-statistics/vac-profile-statistics.api.service';
import { DateUtils } from '../../../../../../../svs-common-lib/src/lib/utils/date.utils';

@Component({
  selector: 'uea-case-information-check',
  templateUrl: './case-information-check.component.html',
  styleUrls: ['./case-information-check.component.scss']
})
export class CaseInformationCheckComponent implements OnInit {

  queryForm: FormGroup;
  tabIndex: number = 0;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  // table中的数据
  listOfData: any[] = [];
  // 用户信息
  userInfo: any;
  // 是否显示个案信息修改tab
  isShow: any;
  addressData: any[];
  areaCode: any;
  level: any;
  profiledata: any;


  // 儿童状态
  checkOptionsOne = [
    {label: '在册', value: '1'},
    {label: '离册', value: '2'},
    {label: '删除', value: '3'},
    {label: '死亡', value: '4'}
  ];


  constructor(private fb: FormBuilder,
              private msg: NzMessageService,
              private modalService: NzModalService,
              private router: Router,
              private user: UserService,
              private vacProfile: VacProfileStatisticsApi,
              private thisApiService: ApiAdminDailyManagementService,
              private location: Location,
              private userSvr: UserService,
  ) {
    this.userSvr.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      this.areaCode = this.userInfo.pov;
    });
    this.queryAddressData();
  }

  ngOnInit(): void {
    this.queryForm = this.fb.group({
      address: [this.userInfo.pov.slice(0, 4) + '002'], // 地区名称
      exportPageStart: [null], // 导出页码开始
      exportPageEnd: [null], // 导出页码结束
      name: [null], // 姓名
      birthDayStart: [null], // 出生日期开始
      birthDayEnd: [null], // 出生日期结束
      gender: [null], // 性别
      childCode: [null], // 儿童编码
      motherName: [null], // 母亲姓名
      fatherName: [null], // 父亲姓名
      motherId: [null], // 母亲身份证
      fatherId: [null], // 父亲身份证
      immunityVacCard: [null], // 免疫卡号
      ticketNo: [null], // 票据编号
      childStatus: [null], // 儿童状态
      changeDatetart: [null], // 变更时间开始
      changeDateEnd: [null], // 变更时间结束
      otherAttributes: [null], // 其他属性
      randomCheckCount: [null], // 随机抽查数
    });
    this.query();
  }

  /*
 * 档案查询
 */
  query(page = 1) {
    this.pageIndex = page;
    // 如果再查询的时候,则停止查询并禁止按钮不能点击
    if (this.loading) return;
    this.listOfData = [];
    // 添加条件
    // let conditionValue = JSON.parse(JSON.stringify(this.queryForm.value));
    // console.log('填写的表单', conditionValue);
    if (this.queryForm.get('address').value) {
      this.areaCode = this.queryForm.get('address').value.slice(0, 6);
      this.level = this.queryForm.get('address').value.slice(6, 7);
    } else {
      this.areaCode = this.userInfo.pov.slice(0, 4) + '00';
      this.level = 2;
    }
    const params = {
      // districtCode: this.areaCode ? this.areaCode : null,
      // name: this.queryForm.get('name').value ? this.queryForm.get('name').value: null,
      // gender: this.queryForm.get('gender').value ? this.queryForm.get('gender').value: null,
      // profileCode: this.queryForm.get('profileCode').value ? this.queryForm.get('profileCode').value: null,
      // motherName: this.queryForm.get('motherName').value ? this.queryForm.get('motherName').value: null,
      // fatherName: this.queryForm.get('fatherName').value ? this.queryForm.get('fatherName').value: null,
      // motherIdCardNo: this.queryForm.get('motherIdCardNo').value ? this.queryForm.get('motherIdCardNo').value: null,
      // fatherIdCardNo: this.queryForm.get('fatherIdCardNo').value ? this.queryForm.get('fatherIdCardNo').value: null,
      // immunityVacCard: this.queryForm.get('immunityVacCard').value ? this.queryForm.get('immunityVacCard').value: null,
      // ticketNo: this.queryForm.get('ticketNo').value ? this.queryForm.get('ticketNo').value: null,
      // changeDatetart: this.queryForm.get('changeDatetart').value ? DateUtils.formatStartDate(this.queryForm.get('changeDatetart').value): null,
      // changeDateEnd: this.queryForm.get('changeDateEnd').value ? DateUtils.formatEndDate(this.queryForm.get('changeDateEnd').value): null,
      // otherAttributes: this.queryForm.get('otherAttributes').value ? this.queryForm.get('otherAttributes').value: null,
      // randomCheckCount: this.queryForm.get('gender').value ? this.queryForm.get('gender').value: null,
      vaccinationPovCode: this.userInfo.pov,
      birthDate: {
        start: this.queryForm.get('birthDayStart').value ? DateUtils.formatStartDate(this.queryForm.get('birthDayStart').value) : null,
        end: this.queryForm.get('birthDayEnd').value ? DateUtils.formatEndDate(this.queryForm.get('birthDayEnd').value) : null,
      },
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    const condition = this.queryForm.get('childStatus').value;
    let range = [];
    if (condition !== null) {
      condition.filter(item => item.checked === true).forEach(item => range.push(item.value));
    }
    params['profileStatusCode'] = range;
    console.log('参数', params);
    this.listOfData = [];
    this.thisApiService.archivesQuery(params, (resp, resp1) => {
      this.loading = false;
      console.log('data', resp, resp1);
      // 解析count数据
      if (resp1 && resp1.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        this.total = resp1.data[0].count;
        console.log('total', this.total);
      }
      // 解析表格数据
      if (resp && resp.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        this.listOfData = resp.data;
      } else {
        this.listOfData = [];
        this.msg.warning('未查询到数据');
        return;
      }

    });
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

  tabIndexChange(event) {
    if (event === 0) {
      this.query();
      this.isShow = false;
    }
  }

  // 信息修改
  update(data) {
    // 判断是否为儿童
    let transFormAge = TransformUtils.getAgeFromBirthDate(data.birthDate);
    console.log('transFormAge', transFormAge);
    if (!!transFormAge && transFormAge.age >= 16) {
      data['isChild'] = false;
    } else {
      data['isChild'] = true;
    }
    this.profiledata = data;
    this.isShow = true;
    this.tabIndex = 1;
  }

}

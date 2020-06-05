import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  ApiAdminDailyManagementService,
  DicDataService,
  SelectDistrictComponent,
  TreeDataApi
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { Router } from '@angular/router';
import { DateUtils } from '@tod/svs-common-lib';
import { take } from 'rxjs/operators';

@Component({
  selector: 'uea-case-information-query',
  templateUrl: './case-information-query.component.html',
  styleUrls: ['./case-information-query.component.scss']
})
export class CaseInformationQueryComponent implements OnInit {

  searchCondition: FormGroup;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

// 在册情况
  residentStatusOpt = [];
  profileStatus = [];
// 居住类型
  residentialTypeData = [];
  genderOptions = [];
  // table中的数据
  listOfData: any[] = [];
  addressCode: any;
  // 登录用户信息
  userInfo: any;
  areaCode: any;
  TreeData: any;
  districtCode: any;
  selectFlag = true;
  // 选中的节点
  selectedNode: any;

  constructor(private fb: FormBuilder,
              private thisApiService: ApiAdminDailyManagementService,
              private modalSvc: NzModalService,
              private dicSvc: DicDataService,
              private msg: NzMessageService,
              private router: Router,
              private user: UserService,
              private userSvr: UserService,
              private treeDataApi: TreeDataApi,
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      this.areaCode = this.userInfo.pov.slice(0, 4);
      this.treeDataApi.queryTreeDataByCityCode(this.areaCode, resp2 => {
        if (resp2['code'] === 0) {
          this.TreeData = resp2['data'];
          console.log('树数据', this.TreeData);
          // 进来默认选中树的根节点
          /*this.initSelect = this.userInfo.pov;*/
        }
      });
      console.log('用户所在的市code====', this.areaCode);
    });
  }

  ngOnInit(): void {
    // 在册情况
    this.profileStatus = this.dicSvc.getDicDataByKey('profileStatus');
    this.residentStatusOpt = this.deduplication(this.profileStatus);
    // 获取居住类型
    this.residentialTypeData = this.dicSvc.getDicDataByKey('residentialType');
    // 性别
    this.genderOptions = this.dicSvc.getDicDataByKey('genderCode');

    // 档案查询条件
    this.searchCondition = this.fb.group({
      address: [null], // 地区名称
      profileStatusCode: [null], // 在册情况
      residentialType: [null], // 居住情况
      number: [null], // 儿童编码
      name: [null], // 姓名
      gender: [null], // 性别
      birthStart: [null], // 出生起始日期
      birthEnd: [null], // 出生截止日期
      fatherName: [null], // 父亲姓名
      motherName: [null], // 母亲姓名
    });
    this.userSvr.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      this.profileSearch();
    });
  }

  // 对象数组去重
  deduplication(arr: any[]) {
    let result = [];
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
      if (!obj[arr[i].label]) {
        result.push(arr[i]);
        obj[arr[i].label] = true;
      }
    }
    return result;
  }

  // 过滤开始日期
  disabledbirthStart = (d: Date) => {
    if (this.searchCondition.value.birthEnd) {
      return d > this.searchCondition.value.birthEnd;
    } else {
      return false;
    }
  }

  // 过滤结束日期
  disabledbirthEnd = (d: Date) => {
    if (this.searchCondition.value.birthStart) {
      return d < this.searchCondition.value.birthStart;
    } else {
      return false;
    }
  }

  /*
 * 档案查询
 */
  profileSearch(page = 1) {
    this.pageIndex = page;
    // 如果再查询的时候,则停止查询并禁止按钮不能点击
    if (this.loading) return;
    this.listOfData = [];
    // 添加条件
    let conditionValue = JSON.parse(JSON.stringify(this.searchCondition.value));
    console.log('conditionValue', conditionValue);
    // 筛选在册类别
    let registeredCategory = [];
    if (this.searchCondition.get('profileStatusCode').value) {
      const profileStatusCode = this.searchCondition.get('profileStatusCode').value;
      const profileStatusData = this.residentStatusOpt;
      for (let i = 0; i < profileStatusCode.length; i++) {
        const singleData = profileStatusCode[i];
        for (let j = 0; j < profileStatusData.length; j++) {
          const singleStatus = profileStatusData[j];
          if (singleData === singleStatus.value) {
            registeredCategory.push(...this.profileStatus.filter(item => item.label === singleStatus.label));
          }
        }
      }
    }
    let category = [];
    if (this.searchCondition.controls.profileStatusCode.value === 10) {
      category = ['10'];
    } else {
      if (registeredCategory.length) {
        registeredCategory.forEach(item => category.push(item.value));
      }
    }
    const params = {
      districtCode: this.selectFlag ? null : this.districtCode,
      profileStatusCode: category,
      residentialTypeCode: conditionValue.residentialType === '' || !conditionValue.residentialType ? null : [conditionValue.residentialType],
      profileCode: conditionValue.number === '' || !conditionValue.number ? null : conditionValue.number.trim(),
      name: conditionValue.name === '' || !conditionValue.name ? null : conditionValue.name.trim(),
      gender: conditionValue.gender === '' ? null : conditionValue.gender,
      fatherName: conditionValue.fatherName === '' || !conditionValue.fatherName ? null : conditionValue.fatherName.trim(),
      motherName: conditionValue.motherName === '' || !conditionValue.motherName ? null : conditionValue.motherName.trim(),
      vaccinationPovCode: this.selectFlag ? this.userInfo.pov : null,
      birthDate: {
        start: conditionValue.birthStart ? DateUtils.formatStartDate(this.searchCondition.get('birthStart').value) : null,
        end: conditionValue.birthEnd ? DateUtils.formatEndDate(this.searchCondition.get('birthEnd').value) : null
      },
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    console.log('参数', params);
    this.listOfData = [];
    this.thisApiService.archivesQuery(params, (resp, resp1) => {
      this.loading = false;
      console.log('data', resp, resp1);
      // 解析count数据
      if (resp1 && resp1.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        this.total = resp1.data[0].count;
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

  // 选择地址
  selectAddress() {
    const modal = this.modalSvc.create({
      nzTitle: '选择机构',
      nzContent: SelectDistrictComponent,
      nzComponentParams: {
        treeData: this.TreeData,
        hideSearchInput: false,
        // unSelectedNodeKey: 'organizationType',
        selectedNode: this.selectedNode
      },
      nzBodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      nzFooter: [
        {
          label: '确定',
          type: 'primary',
          onClick: comp => {
            modal.close(comp.selectedNode);
          }
        },
        {
          label: '取消',
          type: 'default',
          onClick: () => modal.close()
        }
      ]
    });

    // 订阅关闭时获取的数值
    modal.afterClose.pipe(take(1)).subscribe(res => {
      if (res) {
        console.log('res', res);
        this.selectedNode = res;
        /*this.orderForm.get('supplyorgName').patchValue(res.title);
       this.orderForm.get('supplyorgCode').patchValue(res.key);*/
        this.searchCondition.get('address').setValue(res.title);
        this.areaCode = res.key;
        this.selectFlag = false;
        let organizationCode = this.selectedNode.organizationCode;
        let organizationType = this.selectedNode.organizationType;
        let organizationGrade = this.selectedNode.organizationGrade;
        /**
         * 说明是POV及市疾控
         * 直接按照key值作为查询条件
         */
        if (organizationType === '2') {
          this.districtCode = organizationCode;
        }
        /**
         * 说明是行政区划数据
         */
        if (organizationType === '1') {
          // 省
          if (organizationGrade === '10') {
            const provinceCode = this.selectedNode.key.substr(0, 2);
            this.districtCode = provinceCode;
          } else if (organizationGrade === '20') {
            // 市
            const cityCode = this.selectedNode.key.substr(0, 4);
            this.districtCode = cityCode;
          } else {
            // 区县
            const county = this.selectedNode.key.substr(0, 6);
            this.districtCode = county;
          }
        }
      }
    });
  }

  // 重置
  reset() {
    this.searchCondition.reset({});
    this.selectFlag = true;
    this.loading = false;
  }

  // 详情
  detail(data: any) {
    this.router.navigate(['/modules/archivesmanagement/childFileInformation'], {queryParams: data});
  }
}

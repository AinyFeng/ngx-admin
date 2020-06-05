import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  ApiAdminDailyManagementService,
  DicDataService,
  SelectDistrictComponent,
  TreeDataApi
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SelectAddressComponent } from '../../../common/dialog/select-address/select-address.component';
import { DateUtils } from '../../../../../../../svs-common-lib/src/lib/utils/date.utils';
import { take } from 'rxjs/operators';

@Component({
  selector: 'uea-case-information-query-deleted',
  templateUrl: './case-information-query-deleted.component.html',
  styleUrls: ['./case-information-query-deleted.component.scss']
})
export class CaseInformationQueryDeletedComponent implements OnInit {

  searchCondition: FormGroup;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  profileStatus = [];
  residentialTypeData = [];
  genderOptions = [];
  listOfData: any[] = [];
  addressCode: any;
  // 登录用户信息
  userInfo: any;
  areaCode: any;
  TreeData: any;
  districtCode: any;
  selectFlag = true;
  // 已选节点
  selectedNode: any;

  constructor(
    private fb: FormBuilder,
    private thisApiService: ApiAdminDailyManagementService,
    private modalSvc: NzModalService,
    private dicSvc: DicDataService,
    private msg: NzMessageService,
    private router: Router,
    private userSvr: UserService,
    private treeDataApi: TreeDataApi,
  ) {
    this.userSvr.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
    });
    this.userSvr.getUserInfoByType().subscribe(resp => {
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
    this.searchCondition = this.fb.group({
      address: [null], // 地区名称
      birthStart: [null], // 出生日期开始
      birthEnd: [null], // 出生日期结束
    });
    this.profileSearch();
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
    const params = {
      districtCode: this.selectFlag ? null : this.districtCode,
      profileStatusCode: ['10'],
      residentialTypeCode: null,
      profileCode: null,
      name: null,
      gender: null,
      fatherName: null,
      motherName: null,
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

  // 选择地区
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

  // 详情
  detail(data: any) {
    this.router.navigate(['/modules/archivesmanagement/childFileInformation'], {queryParams: data});
  }

  // 重置
  reset() {
    this.searchCondition.reset();
    this.loading = false;
    this.districtCode = null;
    this.selectFlag = true;
  }

}

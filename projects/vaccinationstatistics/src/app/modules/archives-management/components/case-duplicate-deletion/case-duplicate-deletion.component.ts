import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VacProfileStatisticsApi } from '../../../../../../../svs-common-lib/src/lib/vac-profile-api/information-statistics/vac-profile-statistics.api.service';
import { UserService } from '@tod/uea-auth-lib';
import { ApiAdminDailyManagementService, SelectDistrictComponent, TreeDataApi } from '@tod/svs-common-lib';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { DateUtils } from '@tod/svs-common-lib';
import { take } from 'rxjs/operators';

@Component({
  selector: 'uea-case-duplicate-deletion',
  templateUrl: './case-duplicate-deletion.component.html',
  styleUrls: ['./case-duplicate-deletion.component.scss']
})
export class CaseDuplicateDeletionComponent implements OnInit {

  queryForm: FormGroup;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  TreeData: any;
  // table中的数据
  listOfData: any[] = [];
  // 用户信息
  userInfo: any;
  areaCode: any;
  level: any;
  organizationCode: any;
  // 选中的节点
  selectedNode: any;
  // 选中的地区
  districtCode: any;


  constructor(private fb: FormBuilder,
              private vacProfile: VacProfileStatisticsApi,
              private msg: NzMessageService,
              private modalSvc: NzModalService,
              private treeDataApi: TreeDataApi,
              private router: Router,
              private thisApiService: ApiAdminDailyManagementService,
              private user: UserService,
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
    this.queryForm = this.fb.group({
      address: [null], // 地区名称
      exportPageStart: [null], // 导出页码开始
      exportPageEnd: [null], // 导出页码结束
      birthStart: [null], // 出生日期开始
      birthEnd: [null], // 出生日期结束
      name: [{ value: true, disabled: true }], // 儿童姓名
      motherName: [null], // 母亲姓名
      fatherName: [null], // 父亲姓名
      fatherOrMatherName: [null], // 母亲姓名或父亲姓名
      birthDate: [null], // 出生日期
      gender: [null], // 性别
    });
    this.query();
  }


  // 过滤开始日期
  disabledbirthStart = (d: Date) => {
    if (this.queryForm.value.birthEnd) {
      return d > this.queryForm.value.birthEnd;
    } else {
      return false;
    }
  }

  // 过滤结束日期
  disabledbirthEnd = (d: Date) => {
    if (this.queryForm.value.birthStart) {
      return d < this.queryForm.value.birthStart;
    } else {
      return false;
    }
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
    let conditionValue = JSON.parse(JSON.stringify(this.queryForm.value));
    conditionValue['birthStartTime'] = this.queryForm.get('birthStart').value ? DateUtils.formatStartDate(this.queryForm.get('birthStart').value) : null,
      conditionValue['birthEndTime'] = this.queryForm.get('birthEnd').value ? DateUtils.formatStartDate(this.queryForm.get('birthEnd').value) : null,
      conditionValue['povCode'] = this.userInfo.pov;
      conditionValue['name'] = true;
      conditionValue['organizationCode'] = this.districtCode ? this.districtCode : null,
      conditionValue['pageEntity'] = {
        page: this.pageIndex,
        pageSize: this.pageSize
      };
    this.loading = true;
    console.log('参数', conditionValue);
    this.listOfData = [];
    this.thisApiService.profileDuplicatedRecord(conditionValue, (resp) => {
      this.loading = false;
      console.log('data', resp);
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
      }
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
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
        this.queryForm.get('address').setValue(res.title);
        this.areaCode = res.key;
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

  // 详情
  detail(data: any) {
    this.router.navigate(['/modules/archivesmanagement/childFileInformation'], {queryParams: data});
  }

  delete(data: any) {
    const profileCode = data['profileCode'];
    this.vacProfile.deleteProfile(profileCode, resp => {
      console.log('deleteProfile结果', resp);
      this.query();
    });

  }


  // 重置
  reset() {
    this.queryForm.reset({
      name: [{value: true, disabled: true}],
    });
    this.districtCode = null;
    this.loading = false;
  }


}

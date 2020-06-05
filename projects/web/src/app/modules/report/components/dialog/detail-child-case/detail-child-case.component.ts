import {Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

import {ApiReportNationSixOneService, DateUtils} from '@tod/svs-common-lib';
import {NzMessageService} from 'ng-zorro-antd';
import {UserService} from '../../../../../../../../uea-auth-lib/src/core/user.service';

@Component({
  selector: 'uea-detail-child-case',
  templateUrl: './detail-child-case.component.html',
  styleUrls: ['./detail-child-case.component.scss']
})
export class DetailChildCaseComponent implements OnInit {

  // 应种数据
  shouldKindData = [];
  shouldTotal = 0;
  shouldPageIndex = 1;
  shouldPageSize = 10;
  shouldLoading = false;
  // 实种数据
  realKindData = [];
  realTotal = 0;
  realPageIndex = 1;
  realPageSize = 10;
  realLoading = false;
  // 应种未种数据
  shouldNoKindData = [];
  shouldNoKindTotal = 0;
  shouldNoKindPageIndex = 1;
  shouldNoKindPageSize = 10;
  shouldNoKindLoading = false;

  // 接收的数据
  data: any; // 点击查看详情数据
  type: any; // 疫苗名称
  formData: any; // 筛选条件

  conditions: any; // 6-1汇总的筛选条件

  // 登录用户信息
  userInfo: any;

  constructor(
    private ref: NbDialogRef<DetailChildCaseComponent>,
    private apiReportNationSixOneService: ApiReportNationSixOneService,
    private msg: NzMessageService,
    private userSvc: UserService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
  }

  // 切换tab
  changeTab(event) {
    console.log('event', event);
    if (event.tabTitle === '应种') {
      /*if (this.data) {
      }*/
      this.queryShouldData();
    } else if (event.tabTitle === '实种') {
        /*if (this.data) {
          this.queryRealData();
        }*/
      this.queryRealData();
    } else if (event.tabTitle === '应种未种') {
      /*if (this.data) {
        this.queryShouldNoKindData();
      }*/
      this.queryShouldNoKindData();
    }
  }

  // 应种统计查询
  queryShouldData(page = 1) {
    if (this.shouldLoading) return;
    this.shouldPageIndex = page;
    // 国家报表6-1的点击
    let params = {
      Abbreviation: this.type ? this.type : '' ,
      pageEntity: {
        page: this.shouldPageIndex,
        pageSize: this.shouldPageSize
      },
      povCode: this.userInfo.pov
    };
    if (this.formData) {
      params['yearMonths'] = [DateUtils.getFormatDateTime(this.formData.years).slice(0, 7)],
        params['reside'] = this.formData.residentialType;
      if (this.data) {
        if (this.formData.showType === '0') { // 居委名称
          params['community'] = this.data.unitCode;
        } else { // 常规修订
          params['pov_code'] = this.data.unitCode;
        }
      }
    }
    // 国家报表6-1汇总的参数
    if (this.conditions) {
      params['yearMonths'] = [...this.conditions.yearMonthInoculates];
      // 单个的个案详情查询
      if (this.data) {
        if (this.conditions.showType === '0') { // 居委名称
          params['community'] = this.data.unitCode;
        } else { // 居住属性
          if (this.data.unitName === '本地') {
            params['reside'] = '1';
          } else if (this.data.unitName === '外来') {
            params['reside'] = '2';
          } else {
            params['reside'] = '3';
          }
        }
      }
    }
    console.log('应种参数', params);
    this.shouldLoading = true;
    this.shouldKindData = [];
    this.apiReportNationSixOneService.queryShCaseDetailAndCount(params, resp => {
      this.shouldLoading = false;
      console.log('resp', resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        this.msg.warning('暂时未查询到相关数据');
        return;
      }
      this.shouldKindData = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data') || resp[1].data.length === 0) {
        return;
      }
      this.shouldTotal = resp[1].data.count;
    });
  }

  // 实种统计查询
  queryRealData(page = 1) {
    if (this.realLoading) return;
    this.realPageIndex = page;
    // 国家报表6-1的点击
    let params = {
      Abbreviation: this.type ? this.type : '',
      pageEntity: {
        page: this.realPageIndex,
        pageSize: this.realPageSize
      },
      povCode: this.userInfo.pov
    };
    if (this.formData) {
      params['yearMonths'] = [DateUtils.getFormatDateTime(this.formData.years).slice(0, 7)],
        params['reside'] = this.formData.residentialType;
      if (this.data) {
        if (this.formData.showType === '0') { // 居委名称
          params['community'] = this.data.unitCode;
        } else { // 常规修订
          params['pov_code'] = this.data.unitCode;
        }
      }
    }
    // 国家报表6-1汇总的参数
    if (this.conditions) {
      params['yearMonths'] = [...this.conditions.yearMonthInoculates];
      if (this.data) {
        if (this.conditions.showType === '0') { // 居委名称
          params['community'] = this.data.unitCode;
        } else { // 居住属性
          if (this.data.unitName === '本地') {
            params['reside'] = '1';
          } else if (this.data.unitName === '外来') {
            params['reside'] = '2';
          } else {
            params['reside'] = '3';
          }
        }
      }
    }
    console.log('实种参数', params);
    this.realLoading = true;
    this.realKindData = [];
    this.apiReportNationSixOneService.queryReCaseDetailAndCount(params, resp => {
      this.realLoading = false;
      console.log('实种', resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        this.msg.warning('暂时未查询到相关数据');
        return;
      }
      this.realKindData = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data') || resp[1].data.length === 0) {
        return;
      }
      this.realTotal = resp[1].data.count;
    });
  }

  // 应种未种统计查询
  queryShouldNoKindData(page = 1) {
    if (this.shouldNoKindLoading) return;
    this.shouldNoKindPageIndex = page;
    // 国家报表6-1的点击
    let params = {
      Abbreviation: this.type ? this.type : '',
      pageEntity: {
        page: this.shouldNoKindPageIndex,
        pageSize: this.shouldNoKindPageSize
      },
      povCode: this.userInfo.pov
    };
    if (this.formData) {
      params['yearMonths'] = [DateUtils.getFormatDateTime(this.formData.years).slice(0, 7)],
        params['reside'] = this.formData.residentialType;
      if (this.data) {
        if (this.formData.showType === '0') { // 居委名称
          params['community'] = this.data.unitCode;
        } else { // 常规修订
          params['pov_code'] = this.data.unitCode;
        }
      }
    }
    // 国家报表6-1汇总的参数
    if (this.conditions) {
      params['yearMonths'] = [...this.conditions.yearMonthInoculates];
      if (this.data) {
        if (this.conditions.showType === '0') { // 居委名称
          params['community'] = this.data.unitCode;
        } else { // 居住属性
          if (this.data.unitName === '本地') {
            params['reside'] = '1';
          } else if (this.data.unitName === '外来') {
            params['reside'] = '2';
          } else {
            params['reside'] = '3';
          }
        }
      }
    }
    console.log('应种未种参数', params);
    this.shouldNoKindLoading = true;
    this.shouldNoKindData = [];
    this.apiReportNationSixOneService.queryShAndNotCaseDetailAndCount(params, resp => {
      this.shouldNoKindLoading = false;
      console.log('应种未种', resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        this.msg.warning('暂时未查询到相关数据');
        return;
      }
      this.shouldNoKindData = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data') || resp[1].data.length === 0) {
        return;
      }
      this.shouldNoKindTotal = resp[1].data.count;
    });
  }

  // 关闭
  onClose() {
    this.ref.close();
  }

}

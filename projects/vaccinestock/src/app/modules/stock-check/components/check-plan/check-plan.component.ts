import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VaccStockApiService } from '@tod/svs-common-lib';
import { DateUtils } from '@tod/svs-common-lib';
import { NzModalService } from 'ng-zorro-antd';
import { CheckPlanDetailComponent } from '../check-plan-detail/check-plan-detail.component';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-check-plan',
  templateUrl: './check-plan.component.html',
  styleUrls: ['./check-plan.component.scss']
})
export class CheckPlanComponent implements OnInit {

  queryForm: FormGroup;
  listOfData = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  serialCode: any;
  userInfo: any;

  constructor(
    private fb: FormBuilder,
    private vacStocApiSvc: VaccStockApiService,
    private modalSvc: NzModalService,
    private userSvc: UserService
  ) {
  }

  ngOnInit() {
    this.queryForm = this.fb.group({
      checkName: [null], // 盘点名称
      checkUser: [null], // 盘点人员
      planStatus: [null], // 盘点状态
      serialCode: [null], // 盘点编号
      startTime: [null], // 开始时间
      endTime: [null], // 结束时间
    });
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      this.queryData();
    });
  }

  queryData(page = 1) {
    this.pageIndex = page;
    // 如果再查询的时候,则停止查询并禁止按钮不能点击
    if (this.loading) return;
    this.listOfData = [];
    // 查询条件
    let conditionValue = JSON.parse(JSON.stringify(this.queryForm.value));
    conditionValue['startTime'] = this.queryForm.get('startTime').value ? DateUtils.formatStartDate(this.queryForm.get('startTime').value) : null,
      conditionValue['endTime'] = this.queryForm.get('endTime').value ? DateUtils.formatEndDate(this.queryForm.get('endTime').value) : null,
      conditionValue['pageEntity'] = {
        page: page,
        pageSize: this.pageSize
      };
    this.loading = true;
    conditionValue['storeCode'] = this.userInfo.pov;
    console.log('参数', conditionValue);
    this.listOfData = [];
    this.vacStocApiSvc.queryInventoryPlanAndCount(conditionValue, ([queryData, countData]) => {
      console.log('盘点计划查询结果', queryData, countData);
      this.loading = false;
      if (queryData.code === 0) {
        this.listOfData = queryData.data;
      }
      if (countData.code === 0) {
        this.total = countData.data[0]['count'];
      }
    });
  }

  // 过滤开始日期
  disabledStartDate = (d: Date) => {
    if (this.queryForm.value.endTime) {
      return d > this.queryForm.value.endTime;
    } else {
      return false;
    }
  }

  // 过滤结束日期
  disabledEndDate = (d: Date) => {
    if (this.queryForm.value.startTime) {
      return d < this.queryForm.value.startTime;
    } else {
      return false;
    }
  }

  // 删除计划
  delete(data: any) {
    this.modalSvc.confirm({
      nzTitle: '提示',
      nzContent: `<p>是否确删除该计划?</p>`,
      nzMaskClosable: true,
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.loading = true;
        let params = JSON.parse(JSON.stringify(data));
        const param = {
          serialCode: params.serialCode,
        };
        this.vacStocApiSvc.deleteStockPlan(param, (resp) => {
          this.loading = false;
          if (resp.code === 0) {
            this.queryData();
          }
        });
      }
    });
  }

  // 重置
  reset() {
    this.queryForm.reset();
    this.loading = false;
  }

  // 盘点计划详情
  detail(data: any) {
    this.modalSvc.create({
      nzTitle: '盘点计划详细',
      nzContent: CheckPlanDetailComponent,
      nzWidth: '1300px',
      nzComponentParams: {
        selectedData: data
      },
      nzBodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      nzFooter: [
        {
          label: '关闭',
          type: 'default',
          onClick: (comp) => {
            comp.close();
          }
        }
      ]

    });
  }
}

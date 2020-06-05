import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {VacStockApprovalApiService} from '@tod/svs-common-lib';
import {DateUtils} from '../../../../../../../svs-common-lib/src/lib/utils/date.utils';
import {Router} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {NotifierService} from 'angular-notifier';
import {UserService} from '../../../../../../../uea-auth-lib/src/core/user.service';

@Component({
  selector: 'uea-order-change',
  templateUrl: './order-change.component.html',
  styleUrls: ['./order-change.component.scss']
})
export class OrderChangeComponent implements OnInit {
  approvalForm: FormGroup;

  // 最新的日期
  today = new Date();
  batchNoData = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  // 显示全选
  isAllDisplayDataChecked = false;
  // 全选待定
  isIndeterminate = false;

  userInfo: any;

  constructor(
    private fb: FormBuilder,
    private api: VacStockApprovalApiService,
    private router: Router,
    private modalService: NzModalService,
    private notifierService: NotifierService,
    private userSvc: UserService,
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.approvalForm = this.fb.group({
      startDate: [null], // 出入开始日期
      endDate: [null], // 出入截止日期
      batchNo: [null], // 疫苗批号
      oddNumber: [null], // 出入库单号
    });

    this.queryData();
  }

  // 禁止日期
  disabledDate = (d: Date) => {
    return d > this.today;
  }

  // 查询
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    const outboundDate = this.approvalForm.get('startDate').value;
    const outboundDateBreak = this.approvalForm.get('endDate').value;
    if (outboundDate && outboundDateBreak) {
      if (outboundDate > outboundDateBreak) {
        this.modalService.warning({
          nzTitle: '提示',
          nzContent: '选择的开始时间晚于结束时间,请重新选择',
          nzMaskClosable: true
        });
        return;
      }
    } else {
      if (outboundDate) {
        this.modalService.warning({
          nzTitle: '提示',
          nzContent: '请选择结束时间',
          nzMaskClosable: true
        });
        return;
      }
      if (outboundDateBreak) {
        this.modalService.warning({
          nzTitle: '提示',
          nzContent: '请选择开始时间',
          nzMaskClosable: true
        });
        return;
      }
    }
    const params = {
      outboundDate: this.approvalForm.get('startDate').value ? DateUtils.formatStartDate(this.approvalForm.get('startDate').value) : null,
      outboundDateBreak: this.approvalForm.get('endDate').value ? DateUtils.formatEndDate(this.approvalForm.get('endDate').value) : null,
      orderNo: this.approvalForm.get('oddNumber').value === '' || !this.approvalForm.get('oddNumber').value ? null : this.approvalForm.get('oddNumber').value,
      batchno: this.approvalForm.get('batchNo').value === '' || !this.approvalForm.get('batchNo').value ? null : this.approvalForm.get('oddNumber').value,
      orderStatus: ['0', '12'],
      storeCode: this.userInfo.pov,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize,
      }
    };
    console.log('params', params);
    this.batchNoData = [];
    this.loading = true;
    this.api.queryVacStockApprovalAndCount(params, resp => {
      console.log('结果', resp);
      this.loading = false;
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) {
        return;
      }
      this.batchNoData = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data')) {
        return;
      }
      this.total = resp[1].data[0].count;
    });


  }

  // 查看详情
  checkDetail(data: any): void {
    this.router.navigate(['/modules/stockapproval/vacorderdetailorderchange'], {queryParams: data});
  }

  // 修改订单
  updateDetail(data: any) {
    console.log('修改订单', data);
    // 领取/购进 -- 疫苗入库
    if (data.orderType === '8') {
      this.router.navigate(['/modules/stockapplication/in'], {queryParams: data});
    }
    // 报废 -- 疫苗报废
    if (data.orderType === '2') {
      this.router.navigate(['/modules/stockapplication/writeoff'], {queryParams: data});
    }
    // 报损 -- 疫苗报损
    if (data.orderType === '6') {
      this.router.navigate(['/modules/stockapplication/loss'], {queryParams: data});
    }
    // 下发/售出-- 疫苗出库修改
    if (data.orderType === '7') {
      this.router.navigate(['/modules/stockapplication/out'], {
        queryParams: {
          info: JSON.stringify(data),
          title: '疫苗出库修改'
        }
      });
    }
    // 使用 -- 疫苗使用
    if (data.orderType === '0') {
      this.router.navigate(['/modules/stockapplication/use'], {queryParams: data});
    }
    // 退回 -- 疫苗退回
    if (data.orderType === '9') {
      this.router.navigate(['/modules/stockapplication/sendback'], {queryParams: data});
    }
    // 批量下发 -- 批量下发
    if (data.orderType === '5') {
      this.router.navigate(['/modules/stockapplication/distribute'], {queryParams: data});
    }

  }

  // 删除
  delDetail(data: any) {
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: `<p>确定要删除此条订单的数据吗?</p>`,
      nzMaskClosable: true,
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.delOrder(data);
      }
    });
  }

  // 删除订单
  delOrder(data) {
    const params = {
      serialCode: data.serialCode
    };
    this.api.delOrder(params, resp => {
      console.log(resp);
      if (resp && resp.code === 0) {
        this.notifierService.notify('success', '删除成功');
      }
    });
  }
  // 重置
  resetForm() {
    this.approvalForm.reset();
    this.loading = false;
  }

  /**
   * 检查全部选中状态
   * @param value
   */
  checkAll(value: boolean): void {
    this.batchNoData.forEach(item => item.checked = value);
    this.refreshStatus();
  }

  /**
   * 刷新选中状态
   */
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.batchNoData.length === 0 ? false : this.batchNoData.every(item => item.checked);
    this.isIndeterminate = this.batchNoData.some(item => item.checked) && !this.isAllDisplayDataChecked;
  }
}

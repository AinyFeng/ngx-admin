import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {VacStockApprovalApiService} from '@tod/svs-common-lib';
import {DateUtils} from '../../../../../../../svs-common-lib/src/lib/utils/date.utils';
import {Router} from '@angular/router';
import {UserService} from '../../../../../../../uea-auth-lib/src/core/user.service';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'uea-in-confirm',
  templateUrl: './in-confirm.component.html',
  styleUrls: ['./in-confirm.component.scss']
})
export class InConfirmComponent implements OnInit {
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
    private userSvc: UserService,
    private modalService: NzModalService
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
      orderStatus: ['8', '14', '9'], // 待退回入库 9, 待领取 8, 拒收 14
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
    this.router.navigate(['/modules/stockapproval/vacorderdetailinconfirm'], {queryParams: data});
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

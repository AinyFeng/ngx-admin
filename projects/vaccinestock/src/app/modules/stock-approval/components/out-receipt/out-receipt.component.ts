import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {
  VacStockApprovalApiService,
  SelectDistrictComponent,
  DateUtils,
  LOCAL_STORAGE
} from '@tod/svs-common-lib';
import {take} from 'rxjs/operators';
import {NzModalService} from 'ng-zorro-antd';
import {LocalStorageService} from '@tod/ngx-webstorage';
import {UserService} from '../../../../../../../uea-auth-lib/src/core/user.service';

@Component({
  selector: 'uea-out-receipt',
  templateUrl: './out-receipt.component.html',
  styleUrls: ['./out-receipt.component.scss']
})
export class OutReceiptComponent implements OnInit {
  approvalForm: FormGroup;

  // 最新的日期
  today = new Date();
  batchNoData = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  // 查询范围
  checkOptionsOne = [
    {label: '市', value: '20', checked: false},
    {label: '县', value: '30', checked: false},
    {label: '乡', value: '40,50', checked: false}
  ];

  // 显示全选
  isAllDisplayDataChecked = false;
  // 全选待定
  isIndeterminate = false;

  // 组织树
  treeData: any = [];
  // 选择的节点
  selectedNode: any;

  // 登录用户信息
  userInfo: any;


  constructor(
    private fb: FormBuilder,
    private api: VacStockApprovalApiService,
    private router: Router,
    private modalSvc: NzModalService,
    private localSt: LocalStorageService,
    private userSvc: UserService,
    private modalService: NzModalService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    // 获取组织树数据
    this.treeData = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);
    this.approvalForm = this.fb.group({
      address: [null], // 地区名称
      areaCoding: [null], // 地区编码
      orderStatus: ['11'], // 订单状态
      outboundDate: [null], // 出入库时间起
      outboundDateBreak: [null], // 出入库时间止
      grade: [null], // 查询范围
      batchNo: [null], // 疫苗批号
      orderNo: [null], // 订单号
    });
    this.queryData();
  }

  // 查询
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    const outboundDate = this.approvalForm.get('outboundDate').value;
    const outboundDateBreak = this.approvalForm.get('outboundDateBreak').value;
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
      areaCoding: this.approvalForm.get('areaCoding').value ? this.approvalForm.get('areaCoding').value : null,
      outboundDate: this.approvalForm.get('outboundDate').value ? DateUtils.formatStartDate(this.approvalForm.get('outboundDate').value) : null,
      outboundDateBreak: this.approvalForm.get('outboundDateBreak').value ? DateUtils.formatEndDate(this.approvalForm.get('outboundDateBreak').value) : null,
      orderNo: this.approvalForm.get('orderNo').value === '' || !this.approvalForm.get('orderNo').value ? null : this.approvalForm.get('orderNo').value,
      batchno: this.approvalForm.get('batchNo').value === '' || !this.approvalForm.get('batchNo').value ? null : this.approvalForm.get('batchNo').value,
      orderStatus: ['11'],
      storeCode: this.userInfo.pov,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize,
      }
    };
    if (this.approvalForm.get('grade').value) {
      const grade = this.approvalForm.get('grade').value;
      let range = [];
      grade.filter(item => item.checked === true).forEach(item => {
        if (item.value.length > 2) {
          range.push(item.value.substr(0, 2));
          range.push(item.value.substr(3));
        } else {
          range.push(item.value);
        }
      });
      params['grade'] = range;
    }
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

  disabledDate = (d: Date) => {
    return d > new Date();
  }


  // 选择地区
  selectAddress(): void {
    const modal = this.modalSvc.create({
      nzTitle: '选择机构',
      nzContent: SelectDistrictComponent,
      nzComponentParams: {
        treeData: this.treeData,
        hideSearchInput: false,
        unSelectedNodeKey: 'organizationType'
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
        this.selectedNode = res;
        this.approvalForm.get('address').patchValue(res.title);
        this.approvalForm.get('areaCoding').patchValue(res.key);
      }
    });

  }

  // 查看详情
  checkDetail(data: any): void {
    this.router.navigate(['/modules/stockapproval/outreceiptorderdetail'], {queryParams: data});
  }

  // 重置
  resetForm() {
    const checkOptionsOne = this.checkOptionsOne;
    this.approvalForm.reset({
      orderStatus: []
    });
    this.approvalForm.get('grade').setValue(checkOptionsOne);
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

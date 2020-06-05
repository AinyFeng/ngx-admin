import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateUtils, DicDataService, LOCAL_STORAGE, OrderService, SelectDistrictComponent } from '@tod/svs-common-lib';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '@tod/ngx-webstorage';

@Component({
  selector: 'uea-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']

})
export class OrderListComponent implements OnInit {

  queryForm: FormGroup;
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  loading = false;
  // 出入库类型
  inOutType = [];
  // 出入库状态
  listOfOption = [];
  // 今天日期
  currentDate = new Date();
  // 每个月的1号
  newDay: any;
  // 树形结构数据
  treeData = [];
  // 选择的单位
  selectedNode: any;

  // 查询范围
  checkOptionsOne = [
    { label: '市', value: '20', checked: false },
    { label: '县', value: '30', checked: false },
    { label: '乡', value: '40,50', checked: false }
  ];

  dataSet: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private msg: NzMessageService,
    private api: OrderService,
    private dicSvc: DicDataService,
    private localSt: LocalStorageService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    // 获取组织树数据
    this.treeData = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);
    // 出入库类型
    this.inOutType = this.dicSvc.getDicDataByKey('pfOrdertype');
    // 出入库状态
    this.listOfOption = this.dicSvc.getDicDataByKey('pfOrderStatus');
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.newDay = new Date(year, month, 1, 0, 0, 0);
    this.queryForm = this.fb.group({
      inOutType: [null], // 出入库类型
      paymentStatus: [null], // 付款状态
      vaccineType: [null], // 疫苗类型
      vaccineBatchNo: [null], // 疫苗批号
      address: [null], // 地区
      areaCoding: [null], // 地区编码
      inAndOutStart: [new Date(DateUtils.formatStartDate(this.newDay)), [Validators.required]], // 出入库起始时间
      inAndOutEnd: [new Date(DateUtils.formatEndDate(this.currentDate)), [Validators.required]], // 出入库截止时间
      inOutNumber: [null], // 出入库单号
      queryScope: [null], // 查询范围
      inOutStatus: [null], // 出入库状态
    });
    this.queryData();
  }

  // 过滤开始日期
  disableInAndOutStart = (d: Date) => {
    if (this.queryForm.value.inAndOutEnd) {
      return d > this.queryForm.value.inAndOutEnd;
    } else {
      return false;
    }
  }

  // 过滤结束日期
  disableInAndOutEnd = (d: Date) => {
    if (this.queryForm.value.inAndOutStart) {
      return d < this.queryForm.value.inAndOutStart;
    } else {
      return false;
    }
  }

  // 选择地区
  selectAddress(): void {
    const modal = this.modalService.create({
      nzTitle: '选择机构',
      nzContent: SelectDistrictComponent,
      nzComponentParams: {
        treeData: this.treeData,
        hideSearchInput: false,
        // unSelectedNodeKey: 'organizationType'
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
        this.queryForm.get('address').patchValue(res.title);
        /**
         * 说明是POV及市疾控
         * 直接按照key值作为查询条件
         */
        if (res['organizationType'] === '2') {
          this.queryForm.get('areaCoding').patchValue(res.key);
        }
        /**
         * 说明是行政区划数据
         */
        if (res['organizationType'] === '1') {
          // 省
          if (res['organizationGrade'] === '10') {
            const provinceCode = res.key.substr(0, 2);
            this.queryForm.get('areaCoding').patchValue(provinceCode);
          } else if (res['organizationGrade'] === '20') {
            // 市
            const cityCode = res.key.substr(0, 4);
            this.queryForm.get('areaCoding').patchValue(cityCode);
          } else {
            // 区县
            this.queryForm.get('areaCoding').patchValue(res.key);
          }
        }
        /*this.queryForm.get('address').patchValue(res.title);
        this.queryForm.get('areaCoding').patchValue(res.key);*/
      }
    });

  }


  // 查询数据
  queryData(page = 1) {
    // 检查表单必填项填写
    for (const i in this.queryForm.controls) {
      if (this.queryForm.controls[i]) {
        this.queryForm.controls[i].markAsDirty();
        this.queryForm.controls[i].updateValueAndValidity();
      }
    }
    console.log(this.queryForm);
    if (this.queryForm.invalid) {
      this.modalService.warning({
        nzTitle: '提示',
        nzContent: `<p>表格填写不完整，请检查</p>`,
        nzMaskClosable: true
      });
      return;
    }
    if (this.loading) return;
    let conditionValue = JSON.parse(JSON.stringify(this.queryForm.value));
    console.log('参数', conditionValue);
    this.pageIndex = page;
    const params = {
      orderType: this.queryForm.get('inOutType').value ? this.queryForm.get('inOutType').value : null,
      isPay: this.queryForm.get('paymentStatus').value ? this.queryForm.get('paymentStatus').value : null,
      vaccineType: this.queryForm.get('vaccineType').value ? this.queryForm.get('vaccineType').value : null,
      batchno: this.queryForm.get('vaccineBatchNo').value ? this.queryForm.get('vaccineBatchNo').value : null,
      areaCoding: this.queryForm.get('areaCoding').value ? this.queryForm.get('areaCoding').value : null,
      outboundDate: this.queryForm.get('inAndOutStart').value ? DateUtils.formatStartDate(this.queryForm.get('inAndOutStart').value) : null,
      outboundDateBreak: this.queryForm.get('inAndOutEnd').value ? DateUtils.formatEndDate(this.queryForm.get('inAndOutEnd').value) : null,
      orderNo: this.queryForm.get('inOutNumber').value ? this.queryForm.get('inOutNumber').value : null,
      orderStatus: this.queryForm.get('inOutStatus').value ? this.queryForm.get('inOutStatus').value : null,
      pageEntity: {
        page: page,
        pageSize: this.pageSize
      }
    };
    const grade = this.queryForm.get('queryScope').value;
    let range = [];
    if (grade !== null) {
      grade.filter(item => item.checked === true).forEach(item => range.push(item.value));
    }
    params['grade'] = range;
    console.log('参数', params);
    this.loading = true;
    this.api.queryVacInOutInfo(params, resp => {
      this.loading = false;
      console.log('结果', resp);
      if (!resp[0] || resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) {
        return;
      }
      this.dataSet = resp[0].data;
      this.total = resp[1].data[0].count;
      console.log('结果', this.total);
    });
  }

  // 删除
  delete(data) {
    console.log('参数', data);
    let content = '确定删除此条订单数据吗？';
    const param = {
      serialCode: data.serialCode
    };
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '<b style="color: red;">' + content + '</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () =>
        this.api.deleteOrder(param, resp => {
          console.log('结果', resp);
          this.queryData();
        }),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  // 查看
  detail(data: any): void {
    this.router.navigate(['/modules/stockorder/orderlistdetail'], { queryParams: data });
  }

  // 重置
  resetForm() {
    const checkOptionsOne = this.checkOptionsOne;
    this.queryForm.reset();
    this.queryForm.get('queryScope').setValue(checkOptionsOne);
  }

}

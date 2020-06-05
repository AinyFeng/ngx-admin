import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {
  VaccineSubclassInitService,
  VaccManufactureDataService,
  DateUtils,
  SelectDistrictComponent,
  LOCAL_STORAGE,
  DicDataService,
  QueryStatisticsService
} from '@tod/svs-common-lib';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {LocalStorageService} from '@tod/ngx-webstorage';

@Component({
  selector: 'uea-vacc-inbound-outbound-details',
  templateUrl: './vacc-inbound-outbound-details.component.html',
  styleUrls: ['./vacc-inbound-outbound-details.component.scss'],
})
export class VaccInboundOutboundDetailsComponent implements OnInit {

  queryForm: FormGroup;
  listOfData: any = [];
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  loading = false;

  // 查询范围
  checkOptionsOne = [
    {label: '市', value: '20', checked: false},
    {label: '县', value: '30', checked: false},
    {label: '乡', value: '40,50', checked: false}
  ];
  // 疫苗小类
  vacSubClassData = [];
  // 生产企业
  manufactureData = [];
  // 出入库状态
  orderStatus = [];
  // 出入库类型
  orderTypes = [];

  // 今天日期
  currentDate = new Date();
  // 每个月的1号
  newDay: any;
  // 树形结构数据
  treeData = [];
  // 选择的单位
  selectedNode: any;

  constructor(
    private fb: FormBuilder,
    private vacSubClassSvc: VaccineSubclassInitService,
    private manufaSvc: VaccManufactureDataService,
    private modalSvc: NzModalService,
    private msg: NzMessageService,
    private router: Router,
    private api: QueryStatisticsService,
    private localSt: LocalStorageService,
    private dicSvc: DicDataService,
  ) {

  }

  ngOnInit() {
    // 获取组织树数据
    this.treeData = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);
    // 获取小类编码
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取生产企业
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();
    // 获取出入库订单状态
    this.orderStatus = this.dicSvc.getDicDataByKey('pfOrderStatus');
    // 获取出入库类型
    this.orderTypes = this.dicSvc.getDicDataByKey('pfOrdertype');

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.newDay = new Date(year, month, 1, 0, 0, 0);
    this.queryForm = this.fb.group({
      areaCoding: [null], // 地区编码
      address: [null, [Validators.required]], // 地区名称
      grade: [null], // 查询范围
      batchNo: [null], // 疫苗批号
      vaccineType: [null], // 疫苗属性
      vaccineSubclassCode: [null], // 疫苗名称
      manufactureCode: [null], // 生产企业
      outboundDate: [new Date(DateUtils.formatStartDate(this.newDay)), null], // 出入库起始时间
      outboundDateBreak: [new Date(DateUtils.formatEndDate(this.currentDate)), null], // 出入库截止时间
      orderNo: [null], // 出入库单号
      orderType: [null], // 出入库类型
      orderStatus: [null], // 出入库状态
    });
    // 查询统计(由于查询条件中有必填项,在开始的时候不能查询)
    // this.queryData();
  }

  // 时间限制
  disabledStart = (d: Date) => {
    return d > new Date();
  }
  disabledEnd = (d: Date) => {
    return d > new Date();
  }

  // 查询数据
  queryData(page = 1) {
    for (const i in this.queryForm.controls) {
      if (this.queryForm.controls[i]) {
        this.queryForm.controls[i].markAsDirty();
        this.queryForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.queryForm.invalid) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: '请将查询条件填写完整',
        nzMaskClosable: true
      });
      return;
    }
    if (this.loading) return;
    this.pageIndex = page;
    if (!this.queryForm.get('outboundDate').value && !this.queryForm.get('outboundDateBreak').value) {
      this.queryForm.get('outboundDate').patchValue(new Date(this.newDay));
      this.queryForm.get('outboundDateBreak').patchValue(new Date(this.currentDate));
    }
    const outboundDate = this.queryForm.get('outboundDate').value;
    const outboundDateBreak = this.queryForm.get('outboundDateBreak').value;
    if (outboundDate && outboundDateBreak) {
      if (outboundDate > outboundDateBreak) {
        this.modalSvc.warning({
          nzTitle: '提示',
          nzContent: '选择的开始时间晚于结束时间,请重新选择',
          nzMaskClosable: true
        });
        return;
      }
    } else {
      if (outboundDate) {
        this.modalSvc.warning({
          nzTitle: '提示',
          nzContent: '请选择结束时间',
          nzMaskClosable: true
        });
        return;
      }
      if (outboundDateBreak) {
        this.modalSvc.warning({
          nzTitle: '提示',
          nzContent: '请选择开始时间',
          nzMaskClosable: true
        });
        return;
      }
    }
    const params = {
      grade: null,
      areaCoding: this.queryForm.get('areaCoding').value ? this.queryForm.get('areaCoding').value : null,
      vaccineSubclassCode: this.queryForm.get('vaccineSubclassCode').value ? this.queryForm.get('vaccineSubclassCode').value : null,
      manufactureCode: this.queryForm.get('manufactureCode').value ? this.queryForm.get('manufactureCode').value : null,
      vaccineType: this.queryForm.get('vaccineType').value ? this.queryForm.get('vaccineType').value : null,
      batchno: this.queryForm.get('batchNo').value ? this.queryForm.get('batchNo').value : null,
      orderType: this.queryForm.get('orderType').value ? this.queryForm.get('orderType').value : null,
      outboundDate: this.queryForm.get('outboundDate').value ? DateUtils.formatStartDate(this.queryForm.get('outboundDate').value) : null,
      outboundDateBreak: this.queryForm.get('outboundDateBreak').value ? DateUtils.formatEndDate(this.queryForm.get('outboundDateBreak').value) : null,
      orderNo: this.queryForm.get('orderNo').value ? this.queryForm.get('orderNo').value : null,
      orderStatus: this.queryForm.get('orderStatus').value ? this.queryForm.get('orderStatus').value : [],
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    if (this.queryForm.get('grade').value) {
      const grade = this.queryForm.get('grade').value;
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
    console.log('参数', params);
    this.loading = true;
    this.listOfData = [];
    this.api.queryVacInOutDetailAndCount(params, resp => {
      console.log('结果', resp);
      this.loading = false;
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) {
        return;
      }
      this.listOfData = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data')) {
        return;
      }
      this.total = resp[1].data[0].count;
    });
  }

  // 重置
  resetForm() {
    const checkOptionsOne = this.checkOptionsOne;
    this.queryForm.reset({
      orderStatus: []
    });
    this.queryForm.get('grade').setValue(checkOptionsOne);
  }

  // 选择地区
  selectAddress(): void {
    const modal = this.modalSvc.create({
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

  // 查看
  lookOver(data: any): void {
    const formData = JSON.parse(JSON.stringify(this.queryForm.value));
    let updateData = data;
    updateData['orderStatus'] = [data.orderStatus];
    formData['outboundDate'] = DateUtils.getFormatDateTime(this.queryForm.get('outboundDate').value);
    formData['outboundDateBreak'] = DateUtils.getFormatDateTime(this.queryForm.get('outboundDateBreak').value);
    this.router.navigate(['/modules/stockquerystatistics/detail'], {
      queryParams: {
        updateData: JSON.stringify(updateData),
        formData: JSON.stringify(formData)
      }
    });
  }
}

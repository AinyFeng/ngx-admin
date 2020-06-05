import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {
  VaccineSubclassInitService,
  VaccManufactureDataService,
  SelectDistrictComponent,
  LOCAL_STORAGE,
  DateUtils,
  DicDataService,
  QueryStatisticsService
} from '@tod/svs-common-lib';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';
import {LocalStorageService} from '@tod/ngx-webstorage';
import {take} from 'rxjs/operators';
import {UserService} from '../../../../../../../uea-auth-lib/src/core/user.service';

@Component({
  selector: 'uea-area-in-out-detail',
  templateUrl: './area-in-out-detail.component.html',
  styleUrls: ['./area-in-out-detail.component.scss']
})
export class AreaInOutDetailComponent implements OnInit, OnDestroy {

  queryForm: FormGroup;
  listOfData: any = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  private subscription: Subscription[] = [];

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
  pfOrderStatus = [];
  // 出入库类型
  orderTypes = [];

  // 接收跳转的参数
  updateData: any;
  // 表单的参数
  formData: any;
  // 树的组织结构
  treeData = [];
  // 选择的地区
  selectedNode: any;
  // 今天日期
  currentDate = new Date();
  // 每个月的1号
  newDay: any;

  // 疫苗价格和总的数量
  priceSum: any;

  userInfo: any;

  constructor(
    private fb: FormBuilder,
    private vacSubClassSvc: VaccineSubclassInitService,
    private manufaSvc: VaccManufactureDataService,
    private modalSvc: NzModalService,
    private msg: NzMessageService,
    public route: ActivatedRoute,
    private location: Location,
    private api: QueryStatisticsService,
    private localSt: LocalStorageService,
    private dicSvc: DicDataService,
    private userSvc: UserService
  ) {
    const sub = this.route.queryParams.subscribe(resp => {
      console.log('接收的数据', resp);
      if (resp.hasOwnProperty('formData')) {
        this.updateData = JSON.parse(resp.updateData);
        this.formData = JSON.parse(resp.formData);
      }
    });
    this.subscription.push(sub);
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    // 获取组织树数据
    this.treeData = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);
    // 获取小类编码
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取生产企业
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();
    // 获取出入库订单状态
    this.pfOrderStatus = this.dicSvc.getDicDataByKey('pfOrderStatus');
    // 获取出入库类型
    this.orderTypes = this.dicSvc.getDicDataByKey('pfOrdertype');

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.newDay = new Date(year, month, 1, 0, 0, 0);
    this.queryForm = this.fb.group({
      areaCoding: [this.formData ? this.formData.areaCoding : null], // 地区编码
      address: [this.formData ? this.formData.address : null, [Validators.required]], // 地区名称
      grade: [null], // 查询范围
      batchNo: [this.updateData ? this.updateData.batchNo : null], // 疫苗批号
      vaccineType: [this.updateData ? this.updateData.vaccineType : null], // 疫苗属性
      vaccineSubclassCode: [this.updateData ? this.updateData.vaccineSubclassCode : null], // 疫苗名称
      manufactureCode: [this.updateData ? this.updateData.manufactureCode : null], // 生产企业
      outboundDate: [this.formData ? this.formData.outboundDate : new Date(DateUtils.formatStartDate(this.newDay))], // 出入库起始时间
      outboundDateBreak: [this.formData ? this.formData.outboundDateBreak : new Date(DateUtils.formatEndDate(this.currentDate))], // 出入库截止时间
      orderNo: [this.updateData ? this.updateData.orderNo : null], // 出入库单号
      orderType: [this.updateData ? this.updateData.orderType : null], // 出入库类型
      orderStatus: [this.updateData ? this.updateData.orderStatus : null], // 出入库状态
    });
    if (this.formData) {
      this.checkOptionsOne = [];
      this.checkOptionsOne = [...this.formData.grade];
    }
    // 查询统计
    // this.queryData();

  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  // 日期限制
  disabledStart = (d: Date) => {
    return d > new Date();
  }

  // 查询
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
    if (!this.formData) {
      if (!this.queryForm.get('outboundDate').value && !this.queryForm.get('outboundDateBreak').value) {
        this.queryForm.get('outboundDate').patchValue(new Date(this.newDay));
        this.queryForm.get('outboundDateBreak').patchValue(new Date(this.currentDate));
      }
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
      vaccineSubclassCode: this.queryForm.get('vaccineSubclassCode').value ? this.queryForm.get('vaccineSubclassCode').value : null,
      areaCoding: this.queryForm.get('areaCoding').value ? this.queryForm.get('areaCoding').value : null,
      manufactureCode: this.queryForm.get('manufactureCode').value ? this.queryForm.get('manufactureCode').value : null,
      vaccineType: this.queryForm.get('vaccineType').value ? this.queryForm.get('vaccineType').value : null,
      batchno: this.queryForm.get('batchNo').value ? this.queryForm.get('batchNo').value : null,
      orderType: this.queryForm.get('orderType').value ? this.queryForm.get('orderType').value : null,
      outboundDate: this.queryForm.get('outboundDate').value ? this.queryForm.get('outboundDate').value : null,
      outboundDateBreak: this.queryForm.get('outboundDateBreak').value ? this.queryForm.get('outboundDateBreak').value : null,
      orderNo: this.queryForm.get('orderNo').value ? this.queryForm.get('orderNo').value : null,
      orderStatus: this.queryForm.get('orderStatus').value ? this.queryForm.get('orderStatus').value : [],
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      },
      storeCode: this.userInfo.pov
    };
    if (!this.formData) {
      params['outboundDate'] = DateUtils.formatStartDate(this.queryForm.get('outboundDate').value);
      params['outboundDateBreak'] = DateUtils.formatEndDate(this.queryForm.get('outboundDateBreak').value);
    }
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
    this.api.queryAreaInOutDetailAndCount(params, resp => {
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
      if (!resp || resp[2].code !== 0 || !resp[2].hasOwnProperty('data')) {
        return;
      }
      this.priceSum = resp[2].data[0];
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
      }
    });

  }

  // 返回
  goBack() {
    this.location.back();
  }

}

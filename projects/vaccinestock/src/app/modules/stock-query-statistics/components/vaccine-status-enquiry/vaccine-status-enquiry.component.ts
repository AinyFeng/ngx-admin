import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd';

import {
  VaccineSubclassInitService,
  VaccManufactureDataService,
  SelectDistrictComponent,
  LOCAL_STORAGE,
  QueryStatisticsService
} from '@tod/svs-common-lib';
import {take} from 'rxjs/operators';
import {LocalStorageService} from '@tod/ngx-webstorage';


@Component({
  selector: 'uea-vaccine-status-enquiry',
  templateUrl: './vaccine-status-enquiry.component.html',
  styleUrls: ['./vaccine-status-enquiry.component.scss']
})
export class VaccineStatusEnquiryComponent implements OnInit {
  queryForm: FormGroup;
  listOfData: any = [];
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
  // 疫苗小类
  vacSubClassData = [];
  // 生产企业
  manufactureData = [];
  // 树组织
  treeData: any = [];
  selectedNode: any;

  constructor(
    private fb: FormBuilder,
    private vacSubClassSvc: VaccineSubclassInitService,
    private manufaSvc: VaccManufactureDataService,
    private modalSvc: NzModalService,
    private api: QueryStatisticsService,
    private localSt: LocalStorageService,
  ) {
  }

  ngOnInit() {
    // 获取组织树数据
    this.treeData = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);
    // 获取小类编码
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取生产企业
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();

    this.queryForm = this.fb.group({
      address: [null, [Validators.required]], // 地区编码
      areaCoding: [null], // 地区编码
      grade: [null], // 查询范围
      batchNo: [null], // 疫苗批号
      containerType: [null], // 疫苗or 注射器
      vaccineSubclassCode: [null], // 疫苗名称
      manufactureCode: [null], // 生产企业
      vaccineType: [null], // 疫苗类型 0 一类 1 二类
      daysRemaining: [120, null], // 有效期
      overTime: [null], // 超期
    });
    // this.queryData();
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
    const params = {
      grade: null,
      areaCoding: this.queryForm.get('areaCoding').value ? this.queryForm.get('areaCoding').value : null,
      vaccineSubclassCode: this.queryForm.get('vaccineSubclassCode').value ? this.queryForm.get('vaccineSubclassCode').value : null,
      manufactureCode: this.queryForm.get('manufactureCode').value ? this.queryForm.get('manufactureCode').value : null,
      vaccineType: this.queryForm.get('vaccineType').value ? this.queryForm.get('vaccineType').value : null,
      batchno: this.queryForm.get('batchNo').value ? this.queryForm.get('batchNo').value : null,
      containerType: this.queryForm.get('containerType').value ? this.queryForm.get('containerType').value : null,
      daysRemaining: this.queryForm.get('daysRemaining').value || this.queryForm.get('daysRemaining').value === 0 ? this.queryForm.get('daysRemaining').value : null,
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
    this.api.queryNearlyEffectiveAndCount(params, resp => {
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
    this.queryForm.reset({
      range: []
    });
  }

  // 超过一天
  changeCheck(event) {
    if (event === true) {
      this.queryForm.get('daysRemaining').setValue(0);
    } else {
      this.queryForm.get('daysRemaining').setValue(120);
    }
  }

  // 选择地区
  selectAddress(): void {
    const modal = this.modalSvc.create({
      nzTitle: '选择机构',
      nzContent: SelectDistrictComponent,
      nzComponentParams: {
        treeData: this.treeData,
        hideSearchInput: false,
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

}

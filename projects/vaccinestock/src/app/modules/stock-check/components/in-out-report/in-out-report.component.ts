import { Component, OnInit } from '@angular/core';
import {
  DateUtils, LOCAL_STORAGE, SelectDistrictComponent,
  VaccineSubclassInitService,
  VaccManufactureDataService,
  VacStockCheckPlanApiService
} from '@tod/svs-common-lib';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { InOutReportDetailComponent } from '../in-out-report-detail/in-out-report-detail.component';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-in-out-report',
  templateUrl: './in-out-report.component.html',
  styleUrls: ['./in-out-report.component.scss']
})
export class InOutReportComponent implements OnInit {

  loading = false;

  reportForm: FormGroup;
  /**
   * 疫苗名称 - 小类编码
   */
  subclassCodeOptions = [];

  vaccineTypeOptions = [
    { label: '一类', value: '0' },
    { label: '二类', value: '1' }
  ];

  total = 0;
  pageIndex = 1;

  reportData = [];

  manufactureOptions = [];

  today = new Date();

  /**
   * 属性结构数据
   */
  treeData = [];

  /**
   * 已选中的节点
   */
  selectedNode: any;

  userInfo: any;

  constructor(
    private subclassDataSvc: VaccineSubclassInitService,
    private manufactureInitSvc: VaccManufactureDataService,
    private fb: FormBuilder,
    private vacApiSvc: VacStockCheckPlanApiService,
    private modalSvc: NzModalService,
    private localSt: LocalStorageService,
    private userSvc: UserService
  ) {
    this.subclassCodeOptions = this.subclassDataSvc.getVaccineSubClassData();
    this.manufactureOptions = this.manufactureInitSvc.getVaccProductManufactureData();
    this.reportForm = fb.group({
      vaccineType: [], // 疫苗类型
      vaccineSubclassCode: [], // 疫苗小类
      manufactureCode: [], // 生产企业编码
      outboundDate: [null, [Validators.required]], // 起始日期
      outboundDateBreak: [null, [Validators.required]], // 截止日期
      batchno: [], // 疫苗批号
      storeCode: [null, [Validators.required]], // 地区
      storeName: [null, [Validators.required]], // 所选地区名称
    });
    // 获取树形结构数据
    this.treeData = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);
  }

  ngOnInit() {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  filterDate = (d: Date) => {
    return d > this.today;
  }

  query(page = 1) {
    // if (!this.userInfo) return;
    // this.reportForm.get('storeCode').setValue(this.userInfo.pov);
    for (const i in this.reportForm.controls) {
      if (this.reportForm.controls[i]) {
        this.reportForm.controls[i].markAsDirty();
        this.reportForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.reportForm.invalid) {
      this.modalSvc.info({
        nzTitle: '提示',
        nzContent: '请将查询条件填写完整',
        nzMaskClosable: true
      });
      return;
    }
    this.pageIndex = page;
    const query = this.reportForm.value;
    const outboundDate = this.reportForm.get('outboundDate').value;
    const outboundDateBreak = this.reportForm.get('outboundDateBreak').value;
    if (outboundDate > outboundDateBreak) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: '起始时间不得大于结束时间，请重新选择',
        nzMaskClosable: true
      });
      return;
    }
    query['outboundDate'] = DateUtils.formatStartDate(query['outboundDate']);
    query['outboundDateBreak'] = DateUtils.formatEndDate(query['outboundDateBreak']);
    this.reportData = [];
    this.total = 0;
    this.loading = true;
    query['storeName'] = null;
    console.log(query);
    this.vacApiSvc.queryInAndOutReportAndCount(query, ([queryData, countData]) => {
      console.log(queryData, countData);
      this.loading = false;
      if (queryData.code === 0) {
        this.reportData = queryData.data;
      }
      if (countData.code === 0) {
        this.total = countData.data[0].count;
      }
    });
  }

  reset() {
    this.reportForm.reset();
  }

  /**
   * 选择收货单位
   */
  selectDistrict() {
    const modal = this.modalSvc.create({
      nzTitle: '选择单位',
      nzContent: SelectDistrictComponent,
      nzComponentParams: {
        treeData: this.treeData,
        hideSearchInput: false
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
    /**
     * organizationType: "2"
     areaCode: "340600"
     code: "1df72b5390f9467f9709d919f4163b7c"
     organizationCode: "3406000000"
     children: []
     organizationGrade: "20"
     upCode: "12"
     title: "淮北市疾病预防控制中心"
     key: "3406000000"
     expanded: false
     selected: true
     */
    modal.afterClose.pipe(take(1)).subscribe(res => {
      console.log(res);
      if (res) {
        this.reportForm.get('storeName').patchValue(res.title);
        /**
         * 说明是POV及市疾控
         * 直接按照key值作为查询条件
         */
        if (res['organizationType'] === '2') {
          this.reportForm.get('storeCode').patchValue(res.key);
        }
        /**
         * 说明是行政区划数据
         */
        if (res['organizationType'] === '1') {
          // 省
          if (res['organizationGrade'] === '10') {
            const provinceCode = res.key.substr(0, 2);
            this.reportForm.get('storeCode').patchValue(provinceCode);
          } else if (res['organizationGrade'] === '20') {
            // 市
            const cityCode = res.key.substr(0, 4);
            this.reportForm.get('storeCode').patchValue(cityCode);
          } else {
            // 区县
            this.reportForm.get('storeCode').patchValue(res.key);
          }
        }

      }
    });
  }

  /**
   * 疫苗出入库报表明细查询
   * @param data
   */
  queryReportDetail(data: any) {
    if (!this.userInfo) return;
    const query = {
      batchno: data['batchNo'],
      vaccineType: data['vaccineType'],
      vaccineSubclassCode: data['vaccineId'],
      vaccineSubclassName: this.subclassDataSvc.getSubclassNameByCode(data['vaccineId']).label,
      manufactureCode: data['manufactureCode'],
      manufactureName: data['manufactureName'],
      outboundDate: this.reportForm.get('outboundDate').value,
      outboundDateBreak: this.reportForm.get('outboundDateBreak').value,
      inventorySerialCode: data['inventorySerialCode'],
      sellPrice: data['sellprice']
    };
    this.modalSvc.create({
      nzTitle: '疫苗进销存明细列表',
      nzContent: InOutReportDetailComponent,
      nzWidth: '1300px',
      nzComponentParams: {
        queryParams: query,
        userInfo: this.userInfo
      },
      nzFooter: [
        {
          label: '关闭',
          type: 'primary',
          onClick: (comp) => {
            comp.close();
          }
        }
      ]
    });
  }

}

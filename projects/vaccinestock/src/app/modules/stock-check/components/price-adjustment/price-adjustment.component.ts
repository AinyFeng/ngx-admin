import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  VaccineSubclassInitService,
  VaccManufactureDataService,
  VaccStockApiService,
  VacStockApprovalApiService
} from '@tod/svs-common-lib';
import { Router } from '@angular/router';
import { UserService } from '@tod/uea-auth-lib';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'uea-price-adjustment',
  templateUrl: './price-adjustment.component.html',
  styleUrls: ['./price-adjustment.component.scss']
})
export class PriceAdjustmentComponent implements OnInit {

  queryForm: FormGroup;

  // 疫苗小类
  vacSubClassData = [];
  // 生产企业
  manufactureOptions = [];

  stockData = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  // 当前编辑项
  editId: string;
  // 初始价格
  initialPrice: any;
  /**
   * 用户信息
   */
  userInfo: any;

  constructor(
    private fb: FormBuilder,
    private api: VacStockApprovalApiService,
    private vacStocApiSvc: VaccStockApiService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private router: Router,
    private modalSvc: NzModalService,
    private manufactureInitSvc: VaccManufactureDataService,
    private userSvc: UserService
  ) {
    // 获取生产企业
    this.manufactureOptions = this.manufactureInitSvc.getVaccProductManufactureData();
    // 获取小类编码
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.queryForm = this.fb.group({
      vaccineSubclassCode: [null], // 疫苗名称
      manufactureCode: [null], // 生产企业
      batchNo: [null], // 疫苗批号
    });
    this.queryData();
  }

  // 查询
  queryData(page = 1) {
    if (this.loading || !this.userInfo) return;
    this.pageIndex = page;
    const params = {
      vaccineSubclassCode: this.queryForm.value.vaccineSubclassCode,
      manufactureCode: this.queryForm.value.manufactureCode,
      batchno: this.queryForm.value.batchNo,
      vaccineType: '1',
      storeCode: this.userInfo.pov,
      pageEntity: {
        page: page,
        pageSize: this.pageSize,
      }
    };
    console.log('params', params);
    this.loading = true;
    this.vacStocApiSvc.queryCheckStockAndCount(params, ([queryData, countData]) => {
      console.log('疫苗库存量结果', queryData, countData);
      this.loading = false;
      if (queryData.code === 0) {
        this.stockData = queryData.data;
      }
      if (countData.code === 0) {
        this.total = countData.data[0]['count'];
      }
    });
  }


  startEdit(id: string, initialPrice: number, temp2: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!temp2) {
      temp2 = 0;
    }
    this.initialPrice = initialPrice - temp2;
    this.editId = id;
  }

  stopEdit(data?: any) {
    this.editId = null;
    if (data['sellPrice'] === null) {
      data['sellPrice'] = this.initialPrice;
    }
    if (data) {
      const sellPrice = data['sellPrice'];
      data['temp2'] = Number((sellPrice - this.initialPrice).toFixed(2));
    }
  }

  // 设置选中状态
  setFocus(temp: any) {
    temp.focus();
  }

  // 修改价格
  updatePrice() {
    const modifyPriceParams = [];
    this.stockData.forEach(md => {
      if (!md['temp2'] || md['temp2'] === 0) {
        md['temp2'] = 0;
      } else {
        modifyPriceParams.push({
          inventorySerialCode: md['inventorySerialCode'],
          modifyPrice: md['sellPrice'],
          sellPrice: md['sellPrice'] - md['temp2'],
        });
      }
    });
    if (modifyPriceParams.length === 0) {
      this.modalSvc.info({
        nzTitle: '提示',
        nzContent: '价格没有变动！',
        nzMaskClosable: true
      });
      return;
    }
    console.log('modifyPriceParams', modifyPriceParams);
    this.loading = true;
    this.vacStocApiSvc.stockUpdatePrice(modifyPriceParams, res => {
      console.log('修改结果', res);
      this.loading = false;
      if (res.code === 0) {
        this.queryData();
      }
    });
  }

  reset() {
    this.queryForm.reset();
  }
}

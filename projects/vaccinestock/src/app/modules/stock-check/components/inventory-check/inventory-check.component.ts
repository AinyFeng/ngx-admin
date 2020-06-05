import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DicDataService,
  VaccineSubclassInitService,
  VaccManufactureDataService,
  VaccStockApiService
} from '@tod/svs-common-lib';
import { NzModalService } from 'ng-zorro-antd';
import { AddStockCheckPlanComponent } from '../add-stock-check-plan/add-stock-check-plan.component';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-daily-check',
  templateUrl: './inventory-check.component.html',
  styleUrls: ['./inventory-check.component.scss']
})
export class InventoryCheckComponent implements OnInit {

  stockSearchForm: FormGroup;
  /**
   * 用户信息
   */
  userInfo: any;


  /**
   * 进度条
   */
  loading = false;

  total = 0;

  /**
   * 生产企业
   */
  manufactureOptions = [];
  /**
   * 疫苗名称 - 小类编码
   */
  subclassCodeOptions = [];
  /**
   * 疫苗容器
   */
  containerTypeOptions = [];

  /**
   * 库存数据
   */
  stockData = [];
  /**
   * 是否全选
   */
  isAllDisplayDataChecked = false;

  /**
   * 是否半选
   */
  isIndeterminate = false;
  /**
   * 用于新增盘点计划的数据
   */
  addPlanData = [];

  pageIndex = 1;
  pageSize = 10;

  constructor(private dicDataSvc: DicDataService,
              private vacStocApiSvc: VaccStockApiService,
              private fb: FormBuilder,
              private modalSvc: NzModalService,
              private subclassDataSvc: VaccineSubclassInitService,
              private manufactureInitSvc: VaccManufactureDataService,
              private userSvc: UserService) {
    this.containerTypeOptions = dicDataSvc.getDicDataByKey('batchType');
    userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
    this.manufactureOptions = this.manufactureInitSvc.getVaccProductManufactureData();
    this.subclassCodeOptions = this.subclassDataSvc.getVaccineSubClassData();
  }

  ngOnInit() {
    this.stockSearchForm = this.fb.group({
      vaccineSubclassCode: [null], // 疫苗小类编码，疫苗名称
      manufactureCode: [], // 生产厂家编码
      batchno: [], // 疫苗批号
      vaccineType: [], // 疫苗类型，一类 - 0, 二类 - 1
      containerType: [], // 容器类型
      maintainNum: ['1']
    });
  }

  queryStock(page = 1) {
    if (!this.userInfo) return;
    const query = JSON.parse(JSON.stringify(this.stockSearchForm.value));
    query['storeCode'] = this.userInfo.pov;
    query['pageEntity'] = {
      page: page,
      pageSize: this.pageSize
    };
    this.pageIndex = page;
    console.log('查询条件', query);
    this.loading = true;
    this.stockData = [];
    this.vacStocApiSvc.queryCheckStockAndCount(query, ([queryData, countData]) => {
      console.log('疫苗库存量结果', queryData, countData);
      this.loading = false;
      if (queryData.code === 0) {
        const stockData = queryData.data;
        stockData.forEach(sd => {
          sd['modifyStoreNum'] = sd['storeNum'];
          sd['storenumF'] = Number(sd['storenumF']);
        });
        this.stockData = stockData;
        this.refreshStatus();
      }
      if (countData.code === 0) {
        this.total = countData.data[0]['count'];
      }
    });
  }

  addStockCheckPlan() {
    if (this.addPlanData.length === 0) {
      this.modalSvc.info({
        nzTitle: '提示',
        nzContent: '请选择新增盘点计划需要的疫苗数据',
        nzMaskClosable: true
      });
      return;
    }
    this.modalSvc.create({
      nzTitle: '新增盘点计划',
      nzContent: AddStockCheckPlanComponent,
      nzWidth: '1300px',
      nzComponentParams: {
        selectedData: this.addPlanData
      },
      nzBodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      nzFooter: [
        {
          label: '保存',
          type: 'primary',
          onClick: (comp) => {
            comp.submit();
          }
        },
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

  /**
   * 检查全选状态
   * @param ev
   */
  checkAll(ev) {
    console.log(ev);
    if (ev) {
      this.stockData.forEach(sd => sd.checked = true);
    } else {
      this.stockData.forEach(sd => sd.checked = false);
    }
    this.refreshStatus();
  }

  /**
   * 刷新选中状态
   */
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.stockData.every(item => {
      const d = this.addPlanData.find(apd => apd['inventorySerialCode'] === item['inventorySerialCode']);
      if (d) {
        item.checked = true;
        return true;
      } else {
        return false;
      }
    });
    this.isIndeterminate =
      this.stockData.some(item => {
        const d = this.addPlanData.find(apd => apd['inventorySerialCode'] === item['inventorySerialCode']);
        return !!d ? d['checked'] : false;
      }) && !this.isAllDisplayDataChecked;

  }

  /**
   * 修改库存
   */
  modifyStock() {
    if (!this.userInfo) {
      return;
    }
    for (let i = 0; i < this.stockData.length; i++) {
      const stock = this.stockData[i];
      const storenumF = stock['storenumF'];
      const modifyStoreNum = stock['modifyStoreNum'];
      const storeNum = stock['storeNum'];
      if (storenumF + (modifyStoreNum - storeNum) < 0) {
        this.modalSvc.warning({
          nzTitle: '提示',
          nzContent: '【' + stock['vaccName'] + '】当前可用库存不足,请重新输入'
        });
        return;
      }
    }
    const modifyData = this.stockData.filter(sd => sd.modifyStoreNum !== sd.storeNum);
    if (modifyData.length === 0) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: '没有已修改的库存',
        nzMaskClosable: true
      });
      return;
    }
    console.log(modifyData);
    const modifyParams = [];
    modifyData.forEach(md => {
      modifyParams.push({
        inventorySerialCode: md['inventorySerialCode'],
        modifySum: md['modifyStoreNum'],
        stockSum: md['storeNum'],
        memo: md['memo'],
        localCode: this.userInfo.pov,
        operator: this.userInfo.userCode
      });
    });
    console.log(modifyParams);
    this.loading = true;
    this.vacStocApiSvc.modifyStockAmount(modifyParams, res => {
      console.log(res);
      this.loading = false;
      if (res.code === 0) {
        this.queryStock();
      }
    });
  }

  /**
   * 添加新增盘点计划需要的数据
   */
  addInventoryPlanData(ev, data) {
    if (ev) {
      const d = this.addPlanData.find(apd => apd['inventorySerialCode'] === data['inventorySerialCode']);
      if (!d) {
        this.addPlanData.push(data);
      }
    } else {
      this.addPlanData = this.addPlanData.filter(apd => apd['inventorySerialCode'] !== data['inventorySerialCode']);
    }
    console.log(this.addPlanData);
    this.refreshStatus();
  }

}

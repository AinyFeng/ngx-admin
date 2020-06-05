import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { NbDateService, NbDialogRef } from '@nebular/theme';
import {
  DateUtils,
  DepartmentInitService, PovStaffInitService,
  StockCommonService,
  StockService,
  VaccBroadHeadingDataService, VaccineSubclassInitService,
  VaccManufactureDataService
} from '@tod/svs-common-lib';
import * as moment from 'moment';


@Component({
  selector: 'uea-self-storage-add',
  templateUrl: './self-storage-add.component.html',
  styleUrls: ['../../stock.common.scss'],
  providers: [StockCommonService]
})
export class SelfStorageAddComponent implements OnInit {
  // 需要新增的from表单
  infoForm: FormGroup;
  loading = false;
  isSubmit = false;
  userInfo: any;
  // 部门(科室)
  departmentOptions = [];
  departmentSelect = [];
  // 疫苗厂商
  manufactureData = [];
  // 疫苗产品下拉选
  vaccProductOptions = [];
  // 疫苗批次options
  prodBatchOptions: any;
  // 疫苗大类
  vacBroadHeadingOptions = [];
  // 疫苗小类名称
  vacSubClassData = [];
  vacSubClassOptions = [];
  // 冰箱设备
  facilityOptions = [];
  // 操作人
  staffOption = [];
  staffOptionSelected = [];
  max = moment(new Date());

  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private stockService: StockService,
    private manufaSvc: VaccManufactureDataService,
    private departmentSvc: DepartmentInitService,
    private stockCommon: StockCommonService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private ref: NbDialogRef<SelfStorageAddComponent>,
    private vacSubClassSvc: VaccineSubclassInitService,
    private povStaffDataInit: PovStaffInitService
  ) {
    // 拉取疫苗大类的数据
    this.vacBroadHeadingOptions = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
   /* console.log('疫苗大类===', this.vacBroadHeadingOptions);*/
    // 拉取疫苗小类的数据
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    console.log('疫苗小类===', this.vacSubClassData);
    // 获取疫苗厂商
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();
    // 获取科室
    this.departmentOptions = this.departmentSvc.getDepartmentData();
    // 过滤科室信息
    this.departmentOptions.forEach(d => {
      if ( d.type === '4') {
        this.departmentSelect.push(d);
      }
    });
    // 获取操作人信息
    this.staffOption = this.povStaffDataInit.getPovStaffData();
    console.log('staffOption==', this.staffOption);
    this.staffOption.forEach(d => {
      if (d.number && d.number !== '') {
        this.staffOptionSelected.push(d);
      }
    });
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    this.infoForm = this.fb.group({
      vacBroadHeadingCode: [null, [Validators.required]], // 疫苗大类用于过滤产品
      vacSubClassCode: [null, [Validators.required]], // 疫苗小类
      acceptanceSerial: [null, [Validators.required]], // 入库单号
      vaccProductCode: [null, [Validators.required]],
      prodBatchCode: [null, [Validators.required]],
      supplierName: [null], // 用于展示
      supplierCode: [null, [Validators.required]],  // 生产企业
      delivererCode: [null, [Validators.required]],  // 配送企业
      purchasePrise: [null, [Validators.required]], // 进价单价
      srPrice: [null, [Validators.required]], // 零售单价
      count: [null, [Validators.required]], // 数量
      departmentCode: [null, [Validators.required]], // 部门编码
      facilityCode: [null, [Validators.required]], // 设备
      acceptanceDate: [null, [Validators.required]], // 收货日期
      stockBy: [null, [Validators.required]],
      memo: [null]
      /* numberComparision: [null],
    temperatureRecord: [null],
    auditor: [null],
    receiver: [null]*/
    });
  }

  // 提交
  submit() {
    // ref.close();
    const formGroupVal = this.infoForm.controls;
    for (const controlKey in formGroupVal) {
      if (formGroupVal[controlKey]) {
        const formVal: any = formGroupVal[controlKey];
        if (formVal.invalid) {
          this.infoForm.get(controlKey).markAsDirty();
          this.infoForm.get(controlKey).markAsTouched();
        }
      }
    }
    if (this.infoForm.invalid) {
      this.msg.warning('请正确填入库信息！');
      return;
    }
    let instockFrom = JSON.parse(JSON.stringify(this.infoForm.value));
    const params = {
      povCode: this.userInfo.pov,
      acceptanceSerial: instockFrom.acceptanceSerial, // 入库单号
      vaccProductCode: instockFrom.vaccProductCode,
      prodBatchCode: instockFrom.prodBatchCode,
      supplierCode: instockFrom.supplierCode,  // 生产企业
      delivererCode: instockFrom.delivererCode,  // 配送企业
      purchasePrise: instockFrom.purchasePrise, // 进价单价
      srPrice: instockFrom.srPrice, // 零售单价
      count: instockFrom.count, // 数量
      departmentCode: instockFrom.departmentCode, // 部门编码
      facilityCode: instockFrom.facilityCode, // 设备
      stockBy: instockFrom.stockBy,
      acceptanceDate: DateUtils.getTimestamp(this.infoForm.value.acceptanceDate), // 收货日期
     /* memo: instockFrom.memo*/
    };
    console.log('自采入库==', params);
    this.loading = true;
    this.stockService.selfStorageIn(params, res => {
      this.loading = false;
      if (res && res.code === 0) {
        console.log('自采入库resp====', res);
        // 成功后返回刷新
        this.ref.close(true);
        this.msg.info(res.msg);
      } else {
        this.msg.warning(`${res.msg}`);
      }
    });
  }
  /**
   * 根据疫苗大类选择疫苗小类
   * @param ev
   */
  vaccineBroadHeadingChange(ev) {
    if (!ev) {
      return;
    }
    this.vacSubClassOptions = [];
    this.vacSubClassData.forEach(vac => {
      if (vac.value.substring(0, 2) === ev) {
        this.vacSubClassOptions.push(vac);
      }
    });
    this.infoForm.get('vacSubClassCode').setValue(this.vacSubClassOptions[0].value);
  }
  /**
   * 根据疫苗大类选择小类 、选择疫苗产品
   * @param ev
   */
  vaccineSubClassChange(ev) {
    if (!ev) {
      return;
    }
    this.vaccProductOptions = [];
    const params = {
      vaccineSubclassCode: ev
    };
    this.stockCommon.getVaccProduct(params, res => {
      this.loading = false;
      if (res && res.code === 0 && res.data.length > 0) {
        this.vaccProductOptions = res.data;
        this.infoForm.get('vaccProductCode').setValue(this.vaccProductOptions[0].value);
        /*console.log('产品信息====', this.vaccProductOPtions[0]);*/
      } else {
        this.infoForm.get('prodBatchCode').setValue(null);
      }
    });
  }

  /**
   * 根据疫苗产品获取可选批号/生产企业/
   * @param ev
   */
  vaccProductChange(ev) {
    if (!ev) {
      return;
    }
    // 生产企业
    this.vaccProductOptions.forEach(vac => {
      if (vac.value === ev) {
        this.infoForm.get('supplierName').setValue(vac.manufacturer);
        this.infoForm.get('supplierCode').setValue(vac.manufacturerCode);
      }
    });
    this.prodBatchOptions = [];
    const params = {
      vaccineProductCode: ev,
      status: '2',
      isEfficacy: '0'
    };
    /*console.log('批号====', params, this.prodBatchOptions);*/
    this.stockService.queryBatchOptions(params, res => {
      this.loading = false;
      /* console.log('批号返回数据====', res.data);*/
      if (res && res.code === 0 && res.data.length > 0) {
        this.prodBatchOptions = res.data;
        this.infoForm.get('prodBatchCode').setValue(this.prodBatchOptions[0].batchNo);
      } else {
        this.infoForm.get('prodBatchCode').setValue(null);
      }
    });
  }

  /**
   *  获取部门下的设备
   * @param ev
   */
  departmentChange(ev) {
    console.log('部门====', ev);
    if (!ev) {
      return;
    }
    this.facilityOptions = [];
    const params = {
      belongPovCode: this.userInfo.pov,
      belongDepartmentCode: ev
    };
    this.stockCommon.getFacilityOptions(params, res => {
      this.loading = false;
      if (res && res.code === 0 && res.data.length > 0) {
        this.facilityOptions = res.data;
        this.infoForm.get('facilityCode').setValue(this.facilityOptions[0].value);
        /*console.log('设备====', params, this.facilityOptions);*/
      } else {
        this.infoForm.get('facilityCode').setValue(null);
      }
    });
  }

  /**
   * 过滤有效期  验证有效期
   */
  filterLossDate(ev) {
    console.log('批次信息', this.prodBatchOptions);
    console.log('ev', ev);
    if (!ev) {
      return;
    }
    this.prodBatchOptions.forEach(batch => {
      if (batch.batchNo === ev) {
        if (!batch.loseEfficacyDate || new Date(batch.loseEfficacyDate) < new Date()) {
          console.log('ev', ev);
          /*  this.msg.info('该批次疫苗已失效,请重新选择批次！');*/
          this.isSubmit = true;
        } else {
          this.isSubmit = false;
        }
      }
    });
  }

  // 关闭弹窗
  onClose() {
    this.ref.close();
  }
}

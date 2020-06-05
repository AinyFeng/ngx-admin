import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NbDateService, NbDialogRef} from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import {
  BatchInjectService, DateUtils, DepartmentInitService,
  DicDataService, PovStaffInitService, StockCommonService,
  VaccBroadHeadingDataService,
  VaccineSubclassInitService,
  VaccManufactureDataService
} from '@tod/svs-common-lib';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-batch-inject-add',
  templateUrl: './batch-inject-add.component.html',
  styleUrls: ['../../stock.common.scss'],
  providers: [
    BatchInjectService, StockCommonService
  ],
})
export class BatchInjectAddComponent implements OnInit {
  batchInjectFrom: FormGroup;
  loading = false;
  // 疫苗类型
  vaccineTypeData = [];
  // 疫苗大类
  vacBroadHeadingData = [];
  // 疫苗小类名称
  vacSubClassData = [];
  vacSubClassOptions = []; // 根据大类选择的小类
  // 疫苗产品下拉选
  vaccProductOptions = [];
  // 疫苗批次options
  prodBatchOptions: any;
  // 部门(科室)
  departmentOptions = [];
  departmentSelect = [];
  // 冰箱设备
  facilityOptions = [];
  // 受种单位
  beVaccinateUnitsOptions: any;
  // 疫苗厂商
  manufactureData = [];
  // 操作人
  staffOption = [];
  staffOptionSelected = [];
  userInfo: any;
  maxDate: Date;
  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<BatchInjectAddComponent>,
    private msg: NzMessageService,
    private batchInjectService: BatchInjectService,
    private dicSvc: DicDataService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private manufaSvc: VaccManufactureDataService,
    private user: UserService,
    private stockCommon: StockCommonService,
    protected dateService: NbDateService<Date>,
    private departmentSvc: DepartmentInitService,
    private povStaffDataInit: PovStaffInitService
  ) {
    this.maxDate = this.dateService.today();
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
    });
  }

  ngOnInit() {
    // 获取科室
    this.departmentOptions = this.departmentSvc.getDepartmentData();
    // 过滤科室信息
    this.departmentOptions.forEach( d => {
      if ( d.type === '1' || d.type === '4') {
        this.departmentSelect.push(d);
      }
    });
    // 获取操作人信息
    this.staffOption = this.povStaffDataInit.getPovStaffData();
    /* console.log('staffOption==', this.staffOption);*/
    // 过滤number是null的数据
    this.staffOption.forEach( d => {
      if ( d.number && d.number !== '') {
        this.staffOptionSelected.push(d);
      }
    });
    // 拉取疫苗大类的数据
    this.vacBroadHeadingData = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    // 获取疫苗小类
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取疫苗厂商
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();
    // 获取疫苗类型
    this.vaccineTypeData = this.dicSvc.getDicDataByKey('vaccineType');
    // 获取受种单位 学校或者事业单位
    this.beVaccinateUnitsOptions = this.dicSvc.getDicDataByKey('vaccinateUnitType');
    this.batchInjectFrom = this.fb.group({
      vaccinateUnitType: ['0', [Validators.required]], // 被接种单位类型
      beVaccinateUnits: [null, [Validators.required]], // 被接种单位
      beVaccinateObjectName: [null, [Validators.required]], // 被接种对象名称
      departmentCode: [null, [Validators.required]], // 接种部门编码
      facilityCode: [null, [Validators.required]],
      vaccinateCount: [null, [Validators.required]], // 接种支数
      vaccineManufactureName: [null], // 用于显示
      vaccineManufactureCode: [null, [Validators.required]], // 疫苗生产厂商
      vaccinateDoctorCode: [null, [Validators.required]], // 接种医生编码
      vaccinateTime: [null, [Validators.required]], // 接种时间
      prodBatchCode: [null, [Validators.required]], // 疫苗批次
      vaccineBroadHeadingCode: [null, [Validators.required]],
      vaccineSubclassCode: [null, [Validators.required]], // 疫苗小类（接口中没有此参数）
      vaccineProductCode: [null, [Validators.required]],
      price: [null, [Validators.required]], // 价格
      stockOutBy: [null, [Validators.required]],
      memo: [null], // 备注
    });
  }
  // 关闭弹窗
  onClose() {
    this.ref.close();
  }

  onSubmit() {
    const formGroupVal = this.batchInjectFrom.controls;
    for (const controlKey in formGroupVal) {
      if (formGroupVal[controlKey]) {
        const formVal: any = formGroupVal[controlKey];
        if (formVal.invalid) {
          this.batchInjectFrom.get(controlKey).markAsDirty();
          this.batchInjectFrom.get(controlKey).markAsTouched();
        }
      }
    }
    if (this.batchInjectFrom.untouched || this.batchInjectFrom.pristine) return;
    if (this.batchInjectFrom.invalid) {
      this.msg.warning('表单内容填写有误或未选择，请检查');
      return;
    }
    let BatchInjectJson = JSON.parse(JSON.stringify(this.batchInjectFrom.value));
  /*  let vaccinateTimeStr = this.batchInjectFrom.get('vaccinateTime').value.format('YYYY-MM-DD HH:mm:ss');*/
    const params = {
      vaccinatePovCode: this.userInfo.pov,  // 接种Pov编码
      vaccinateDepartmentCode: BatchInjectJson.departmentCode, // 接种部门编码
      outFacilityCode: BatchInjectJson.facilityCode,
      beVaccinateUnits: BatchInjectJson.beVaccinateUnits, // 被接种单位名称
      beVaccinateObjectName: BatchInjectJson.beVaccinateObjectName, // 被接种对象名称
      vaccinateUnitType: BatchInjectJson.vaccinateUnitType, // 接种单位类型
      vaccineBroadHeadingCode: BatchInjectJson.vaccineBroadHeadingCode, // 疫苗大类编码
      vaccineSubclassCode: BatchInjectJson.vaccineSubclassCode, // 疫苗小类编码
      vaccineProductCode: BatchInjectJson.vaccineProductCode, // 疫苗产品编码  目前没有输入产品编码
      vaccinateCount: BatchInjectJson.vaccinateCount, // 接种疫苗支数
      vaccinateTime:  DateUtils.getTimestamp(this.batchInjectFrom.value.vaccinateTime), // 接种时间
      vaccineManufactureCode: BatchInjectJson.vaccineManufactureCode, // 疫苗厂商code
      vaccinateDoctorCode: BatchInjectJson.vaccinateDoctorCode, // 接种医生编码
      vaccineBatchNo: BatchInjectJson.prodBatchCode, // 疫苗批号信息
      vaccineType: this.batchInjectFrom.value.price > 0 ? '1' : '0', // 疫苗类型 0--一类  1--二类
      price: BatchInjectJson.price, // 疫苗单价
      stockOutBy: BatchInjectJson.stockOutBy,
      memo: BatchInjectJson.memo, // 备注
    };
    console.log('参数批量注册添加==', params);
    this.batchInjectService.insertBatchInject(params, (data) => {
      console.log('添加的结果', data);
      if (data && data.code === 0) {
        this.msg.info(data.msg);
        this.ref.close(true);
      } else {
        this.msg.warning(data.msg);
      }
    });
  }
  /**
   *  获取部门下的设备
   * @param ev
   */
  departmentChange(ev) {
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
      if (res && res.code === 0 && res.data.length >  0) {
        this.facilityOptions = res.data;
        console.log('设备====', params, this.facilityOptions);
        setTimeout(() => {
          this.batchInjectFrom.get('facilityCode').setValue(this.facilityOptions[0].value);
        }, 20);
        /*console.log('设备====', params, this.facilityOptions);*/
      } else {
        this.facilityOptions = [];
        this.batchInjectFrom.get('facilityCode').setValue(null);
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
    if (this.vacSubClassOptions.length >  0) {
      setTimeout(() => {
        this.batchInjectFrom.get('vaccineSubclassCode').setValue(this.vacSubClassOptions[0].value);
      }, 20);
      /*console.log('设备====', params, this.facilityOptions);*/
    } else {
      this.batchInjectFrom.get('vaccineSubclassCode').setValue(null);
    }
  }
  /**
   * 根据疫苗小类选择疫苗产品
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
        /*console.log('====', this.vaccProductOPtions);*/
        setTimeout(() => {
          this.batchInjectFrom.get('vaccineProductCode').setValue(this.vaccProductOptions[0].value);
        }, 20);
      } else {
        this.batchInjectFrom.get('vaccineProductCode').setValue(null);
      }
    });
  }
  /**
   * 根据疫苗产品获取可选批号
   * @param ev
   */
  vaccProductChange(ev) {
    if (!ev) {
      return;
    }
    // 生产企业
    this.vaccProductOptions.forEach(vac => {
      if (vac.value === ev) {
        this.batchInjectFrom.get('vaccineManufactureName').setValue(vac.manufacturer);
        this.batchInjectFrom.get('vaccineManufactureCode').setValue(vac.manufacturerCode);
      }
    });
    this.prodBatchOptions = [];
    const params = {
      vaccineProductCode: ev
    };
    this.stockCommon.getProdBatchOptions(params, res => {
      this.loading = false;
      if (res && res.code === 0) {
        this.prodBatchOptions = res.data;
        setTimeout(() => {
          this.batchInjectFrom.get('prodBatchCode').setValue(this.prodBatchOptions[0].value);
        }, 20);
      } else {
        this.batchInjectFrom.get('prodBatchCode').setValue(this.prodBatchOptions[0].value);
      }
    });
  }

}

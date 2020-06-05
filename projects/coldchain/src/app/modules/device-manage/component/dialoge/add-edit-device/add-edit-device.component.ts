import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';
import {ColdchainDeviceService, DateUtils, DicDataService} from '@tod/svs-common-lib';


@Component({
  selector: 'uea-add-edit-device',
  templateUrl: './add-edit-device.component.html',
  styleUrls: ['../../../device-manage.component.scss']
})
export class AddEditDeviceComponent implements OnInit {
  loading = false;
  isModify = false;
  modifyOrAddFrom: FormGroup;
  // 经费来源
  sourceCodeOptions: any;
  // 设备状态options
  facilityStatusOptions: any;
  // 如果是编辑需要传入数据
  deviceInfo: any;
  // 新增时组织机构（从上个页面传入）
  organization: any;
  // 单位options
  unitOptions = [{'value': '1', 'label': '升(L)'}, {'value': '2', 'label': '立方米'}];
  userInfo: any;
  /**
   * 当前日期
   */
  currentDate = new Date();
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private user: UserService,
    private dicSvc: DicDataService,
    private ref: NzModalRef,
    private  deviceService: ColdchainDeviceService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    // 获取经费来源
    this.sourceCodeOptions = this.dicSvc.getDicDataByKey('fixedAssetsSource');
   /* console.log('this.sourceCodeOptions===', this.sourceCodeOptions);*/
    // 获取设备状态
    this.facilityStatusOptions = this.dicSvc.getDicDataByKey('facilityStatus');
   /* console.log('this.facilityStatusOptions===', this.facilityStatusOptions);*/
    if (this.deviceInfo || this.deviceInfo != null) {
      // 编辑
      // 出厂日期报废日期非必须填
      let productionDate = null, scrapDate = null;
      if ( this.deviceInfo.productionDate) {
        productionDate =  DateUtils.getFormatDateTime(this.deviceInfo.productionDate);
      }
      if ( this.deviceInfo.scrapDate) {
        scrapDate =  DateUtils.getFormatTime(this.deviceInfo.scrapDate);
      }
     /* console.log('待编辑的数据===', productionDate);*/
      this.isModify = true;
      this.modifyOrAddFrom = this.fb.group({
        facilityCode: [this.deviceInfo.facilityCode, [Validators.required]], // 设备编码
        facilityName: [this.deviceInfo.facilityName, [Validators.required]], // 设备名称
        brand: [this.deviceInfo.brand, [Validators.required]], // 品牌
        model: [this.deviceInfo.modelNumber, [Validators.required]], // 型号
        source: [this.deviceInfo.source, [Validators.required]],
        manufacturer: [this.deviceInfo.manufacturer, [Validators.required]],
        factoryNum: [this.deviceInfo.factoryNum, [Validators.required]], // 出厂编号
        storageCapacityPackage: [this.deviceInfo.coolbagNum, [Validators.required]], // 型号
        storageCapacity: [this.deviceInfo.refrigerationVolume, [Validators.required]],
        storageCapacityUnit: [this.deviceInfo.refrigerationUnit], // 冷藏容积单位
        freezeCapacity: [this.deviceInfo.freezeVolume, [Validators.required]], // 冷冻容积
        freezeCapacityUnit: [this.deviceInfo.freezeUnit, [Validators.required]], // 冷冻容积单位
        productionDate: [productionDate], // 出厂日期
        startuseDate: [DateUtils.getFormatDateTime(this.deviceInfo.startuseDate), [Validators.required]], // 启用日期
        arrivalDate: [DateUtils.getFormatDateTime(this.deviceInfo.arrivalDate), [Validators.required]], // 到货日期
        scrapDate: [scrapDate],  // 报废日期
        status: [this.deviceInfo.status, [Validators.required]], // 状态
      });
    } else {
      // 新增
      console.log('新增>>>>>>>>>>>>>>');
      this.isModify = false;
      this.modifyOrAddFrom = this.fb.group({
        facilityCode: [null, [Validators.required]], // 设备编码
        facilityName: [null, [Validators.required]], // 设备名称
        brand: [null, [Validators.required]], // 品牌
        model: [null, [Validators.required]], // 型号
        source: [null, [Validators.required]],
        manufacturer: [null, [Validators.required]],
        factoryNum: [null, [Validators.required]],
        storageCapacityPackage: [null, [Validators.required]],
        storageCapacity: [null, [Validators.required]],
        storageCapacityUnit: ['1', [Validators.required]], // 冷藏容积单位
        freezeCapacity: [null, [Validators.required]], // 冷冻容积
        freezeCapacityUnit: ['1', [Validators.required]], // 冷冻容积单位
        productionDate: [null], // 出厂日期
        arrivalDate: [null, [Validators.required]], // 到货日期
        startuseDate: [null, [Validators.required]],
        scrapDate: [null],
        status: ['0', [Validators.required]], // 状态
      });
    }
  }
  // 修改 or 新增
  saveOrEdit() {
    const formGroupVal = this.modifyOrAddFrom.controls;
    for (const controlKey in formGroupVal) {
      if (formGroupVal[controlKey]) {
        const formVal: any = formGroupVal[controlKey];
        if (formVal.invalid) {
          this.modifyOrAddFrom.get(controlKey).markAsDirty();
          this.modifyOrAddFrom.get(controlKey).markAsTouched();
        }
      }
    }
    if (this.modifyOrAddFrom.invalid) {
      this.msg.warning('表单填写不完整或有误，请检查');
      return;
    }
    // 出厂日期报废日期非必须填
    let productionDate = null, scrapDate = null;
    if ( this.modifyOrAddFrom.get('productionDate').value) {
      productionDate =  DateUtils.getFormatDateTime(this.modifyOrAddFrom.get('productionDate').value);
    }
    if ( this.modifyOrAddFrom.get('scrapDate').value) {
      scrapDate =  DateUtils.getFormatDateTime(this.modifyOrAddFrom.get('scrapDate').value);
    }
    this.loading = true;
    if (this.isModify) {
      const updateParams = {
        id: this.deviceInfo.id,
        organizationCode: this.deviceInfo.organization,
        facilityCode: this.modifyOrAddFrom.value.facilityCode, // 设备编码
        facilityName: this.modifyOrAddFrom.value.facilityName, // 设备名称
        manufacturer: this.modifyOrAddFrom.value.manufacturer, // 生产厂商
        factoryNum: this.modifyOrAddFrom.value.factoryNum, // 出厂编号
        brand: this.modifyOrAddFrom.value.brand, // 品牌
        modelNumber: this.modifyOrAddFrom.value.model, // 型号
        coolbagNum: this.modifyOrAddFrom.value.storageCapacityPackage, // 冷藏包数量
        refrigerationVolume: this.modifyOrAddFrom.value.storageCapacity,
        refrigerationUnit: this.modifyOrAddFrom.value.storageCapacityUnit, // 冷藏容积单位
        freezeVolume: this.modifyOrAddFrom.value.freezeCapacity, // 冷冻容积
        freezeUnit: this.modifyOrAddFrom.value.freezeCapacityUnit, // 冷冻容积单位
        productionDate: productionDate, // 出厂日期
        arrivalDate: DateUtils.getFormatDateTime(this.modifyOrAddFrom.get('arrivalDate').value), // 到货日期
        startuseDate: DateUtils.getFormatDateTime(this.modifyOrAddFrom.get('startuseDate').value),
        scrapDate: scrapDate,
        updateBy: this.userInfo.name,
        status: this.modifyOrAddFrom.value.status, // 状态

      };
      this.deviceService.updateColdChainDevice(updateParams, res => {
        this.loading = false;
        console.log('修改====', updateParams);
        if (res && res.code === 0) {
          this.ref.close(true);
          this.msg.info(res.msg);
        } else {
          this.msg.warning(`${res.msg}`);
        }
      });
    } else {
      const params = {
        organizationCode: this.organization,
        facilityCode: this.modifyOrAddFrom.value.facilityCode, // 设备编码
        facilityName: this.modifyOrAddFrom.value.facilityName, // 设备名称
        manufacturer: this.modifyOrAddFrom.value.manufacturer, // 生产厂商
        factoryNum: this.modifyOrAddFrom.value.factoryNum, // 出厂编号
        brand: this.modifyOrAddFrom.value.brand, // 品牌
        modelNumber: this.modifyOrAddFrom.value.model, // 型号
        coolbagNum: this.modifyOrAddFrom.value.storageCapacityPackage, // 冷藏包数量
        refrigerationVolume: this.modifyOrAddFrom.value.storageCapacity,
        refrigerationUnit: this.modifyOrAddFrom.value.storageCapacityUnit, // 冷藏容积单位
        freezeVolume: this.modifyOrAddFrom.value.freezeCapacity, // 冷冻容积
        freezeUnit: this.modifyOrAddFrom.value.freezeCapacityUnit, // 冷冻容积单位
        productionDate: productionDate, // 出厂日期
        arrivalDate: DateUtils.getFormatDateTime(this.modifyOrAddFrom.get('arrivalDate').value), // 到货日期
        startuseDate: DateUtils.getFormatDateTime(this.modifyOrAddFrom.get('startuseDate').value),
        scrapDate: scrapDate,
        createBy: this.userInfo.name,
        status: this.modifyOrAddFrom.value.status, // 状态
      };
      this.deviceService.insertColdChainDevice(params, res => {
        this.loading = false;
        console.log('新增====', params);
        if (res && res.code === 0) {
          this.ref.close(true);
          this.msg.info(res.msg);
        } else {
          this.msg.warning(`${res.msg}`);
        }
      });
    }
  }
  /**
   * 过滤处理日期
   * @param d
   */
  filterHandleDate = (d: Date) => {
      return d > this.currentDate;
    }

  onClose() {
    this.ref.close();
  }
}

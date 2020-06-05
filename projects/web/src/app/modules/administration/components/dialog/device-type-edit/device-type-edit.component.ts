import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NbDialogRef} from '@nebular/theme';
import {NzMessageService} from 'ng-zorro-antd';
import {DevicetypeService, DicDataService} from '@tod/svs-common-lib';
import {UserService} from '@tod/uea-auth-lib';


@Component({
  selector: 'uea-device-type-edit',
  templateUrl: './device-type-edit.component.html',
  styleUrls: ['../../admin.common.scss'],
  providers: [DevicetypeService]
})
export class DeviceTypeEditComponent implements OnInit {
  loading = false;
  isModify = false;
  modifyOrAddFrom: FormGroup;
  // 如果是编辑需要传入数据
  deviceTypeInfo: any;
  // 单位options
  unitOptions = [{'value': 'L', 'label': '升(L)'}, {'value': 'ml', 'label': '毫升(ml)'}];
  userInfo: any;
  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<DeviceTypeEditComponent>,
    private msg: NzMessageService,
    private deviceService: DevicetypeService,
    private user: UserService,
    private dicSvc: DicDataService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    // 获取单位
    /* this.unitOptions = this.dicSvc.getDicDataByKey('fixedAssetsSource');*/
    console.log('需要编辑的数据==', this.unitOptions);
    if (this.deviceTypeInfo || this.deviceTypeInfo != null) {
      // 编辑
      console.log('需要编辑的数据==', this.deviceTypeInfo);
      this.isModify = true;
      this.modifyOrAddFrom = this.fb.group({
        /*belongDepartmentCode: [this.deviceTypeInfo., [Validators.required]], // 所属部门*/
        typeNumber: [this.deviceTypeInfo.typeNumber, [Validators.required]], // 设备编码
        name: [this.deviceTypeInfo.typeName, [Validators.required]], // 设备名称
        manufacturer: [this.deviceTypeInfo.manufacturer, [Validators.required]],
        brand: [this.deviceTypeInfo.brand, [Validators.required]], // 品牌
        model: [this.deviceTypeInfo.model, [Validators.required]], // 型号
        storageCapacityPackage: [this.deviceTypeInfo.storageCapacityPackage, [Validators.required]], // 型号
        storageCapacity: [this.deviceTypeInfo.storageCapacity, [Validators.required]],
        storageCapacityUnit: [this.deviceTypeInfo.storageCapacityUnit], // 冷藏容积单位
        freezeCapacity: [this.deviceTypeInfo.freezeCapacity], // 冷冻容积
        freezeCapacityUnit: [this.deviceTypeInfo.freezeCubageUnit], // 冷冻容积单位
        length: [this.deviceTypeInfo.length],
        width: [this.deviceTypeInfo.width],
        height: [this.deviceTypeInfo.height],
        weight: [this.deviceTypeInfo.weight],
        memo: [this.deviceTypeInfo.memo], // 备注
      });
    } else {
      // 新增
      console.log('新增>>>>>>>>>>>>>>');
      this.isModify = false;
      this.modifyOrAddFrom = this.fb.group({
        /*  belongDepartmentCode: [null, [Validators.required]], // 所属部门*/
        typeNumber: [null, [Validators.required]], // 设备编码
        name: [null, [Validators.required]], // 设备名称
        manufacturer: [null, [Validators.required]],
        brand: [null, [Validators.required]], // 品牌
        model: [null, [Validators.required]], // 型号
        storageCapacityPackage: [null, [Validators.required]],
        storageCapacity: [null, [Validators.required]],
        storageCapacityUnit: ['L', [Validators.required]], // 冷藏容积单位
        freezeCapacity: [null, [Validators.required]], // 冷冻容积
        freezeCapacityUnit: ['L', [Validators.required]], // 冷冻容积单位
        length: [null],
        width: [null],
        height: [null],
        weight: [null],
        memo: [null], // 备注
      });
    }
  }
  // 关闭弹窗
  onClose() {
    this.ref.close();
  }
  // 修改 or 新增
  save() {
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
    this.loading = true;
    if (this.isModify) {
      const updateParams = {
        id: this.deviceTypeInfo.id,
        typeNumber: this.modifyOrAddFrom.value.typeNumber, // 设备编码
        typeName: this.modifyOrAddFrom.value.name, // 设备名称
        manufacturer: this.modifyOrAddFrom.value.manufacturer,
        brand: this.modifyOrAddFrom.value.brand, // 品牌
        model: this.modifyOrAddFrom.value.model, // 型号
        storageCapacityPackage: this.modifyOrAddFrom.value.storageCapacityPackage,
        storageCapacity: this.modifyOrAddFrom.value.storageCapacity,
        storageCapacityUnit: this.modifyOrAddFrom.value.storageCapacityUnit, // 冷藏容积单位
        freezeCapacity: this.modifyOrAddFrom.value.freezeCapacity, // 冷冻容积
        freezeCubageUnit: this.modifyOrAddFrom.value.freezeCapacityUnit, // 冷冻容积单位
        length: this.modifyOrAddFrom.value.length,
        width: this.modifyOrAddFrom.value.width,
        height: this.modifyOrAddFrom.value.height,
        weight: this.modifyOrAddFrom.value.weight,
        memo: this.modifyOrAddFrom.value.memo, // 备注
      };
      this.deviceService.update(updateParams, res => {
        this.loading = false;
        console.log('修改====', res);
        if (res && res.code === 0) {
          this.msg.info(res.msg);
          this.ref.close(true);
        } else {
          this.msg.warning(`${res.msg}`);
        }
      });
    } else {
      const params = {
        typeNumber: this.modifyOrAddFrom.value.typeNumber, // 设备编码
        typeName: this.modifyOrAddFrom.value.name, // 设备名称
        manufacturer: this.modifyOrAddFrom.value.manufacturer,
        brand: this.modifyOrAddFrom.value.brand, // 品牌
        model: this.modifyOrAddFrom.value.model, // 型号
        storageCapacityPackage: this.modifyOrAddFrom.value.storageCapacityPackage,
        storageCapacity: this.modifyOrAddFrom.value.storageCapacity,
        storageCapacityUnit: this.modifyOrAddFrom.value.storageCapacityUnit, // 冷藏容积单位
        freezeCapacity: this.modifyOrAddFrom.value.freezeCapacity, // 冷冻容积
        freezeCubageUnit: this.modifyOrAddFrom.value.freezeCapacityUnit, // 冷冻容积单位
        length: this.modifyOrAddFrom.value.length,
        width: this.modifyOrAddFrom.value.width,
        height: this.modifyOrAddFrom.value.height,
        weight: this.modifyOrAddFrom.value.weight,
        memo: this.modifyOrAddFrom.value.memo, // 备注
      };
      this.deviceService.insert(params, res => {
        this.loading = false;
        console.log('新增====', res);
        if (res && res.code === 0) {
          this.msg.info(res.msg);
          this.ref.close(true);
        } else {
          this.msg.warning(`${res.msg}`);
        }
      });
    }
  }
}

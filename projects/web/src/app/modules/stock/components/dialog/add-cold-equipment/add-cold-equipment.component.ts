import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { DateUtils, DepartmentInitService, DicDataService, StockService } from '@tod/svs-common-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';
import * as moment from 'moment';

@Component({
  selector: 'uea-add-cold-equipment',
  templateUrl: './add-cold-equipment.component.html',
  styleUrls: ['../../stock.common.scss'],
})
export class AddColdEquipmentComponent implements OnInit {
  loading = false;
  modifyOrAddFrom: FormGroup;
  // 编辑需要传入数据
  deviceInfo: any;
  // 经费来源options
  sourceCodeOptions: any;
  // 设备状态options
  facilityStatusOptions: any;
  // 科室信息
  departmentOptions = [];
  userInfo: any;

  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<AddColdEquipmentComponent>,
    private msg: NzMessageService,
    private stockService: StockService,
    private user: UserService,
    private departmentSvc: DepartmentInitService,
    private dicSvc: DicDataService,
  ) {
  }

  ngOnInit() {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
    // 获取科室
    this.departmentOptions = this.departmentSvc.getDepartmentData();
    // 获取经费来源
    this.sourceCodeOptions = this.dicSvc.getDicDataByKey('fixedAssetsSource');
    // 获取设备状态
    this.facilityStatusOptions = this.dicSvc.getDicDataByKey('facilityStatus');

    console.log('需要编辑的数据==', this.deviceInfo);
    if (this.deviceInfo || this.deviceInfo != null) {
      // 编辑
      this.modifyOrAddFrom = this.fb.group({
        belongDepartmentCode: [this.deviceInfo.belongDepartmentCode, [Validators.required]], // 所属部门
        facilityNumber: [this.deviceInfo.facilityNumber, [Validators.required]], // 设备编码
        name: [this.deviceInfo.name, [Validators.required]], // 设备名称
        sourceCode: [{ value: this.deviceInfo.sourceCode, disabled: true }, Validators.required], // 经费来源
        deviceTypeName: [this.deviceInfo.typeName, [Validators.required]], // 设备类型
        brand: [this.deviceInfo.brand, [Validators.required]], // 品牌
        model: [this.deviceInfo.model, [Validators.required]], // 型号
        manufactureDate: [DateUtils.getFormatTime(this.deviceInfo.manufactureDate, 'YYYY-MM-DD'), [Validators.required]], // 生产日期
        useStartDate: [DateUtils.getFormatTime(this.deviceInfo.useStartDate, 'YYYY-MM-DD'), [Validators.required]], // 启用日期
        storageCapacity: [this.deviceInfo.storageCapacity], // 冷藏容积
        freezeCapacity: [this.deviceInfo.freezeCapacity], // 冷冻容积
        facilityStatus: [this.deviceInfo.facilityStatus, [Validators.required]], // 设备状态
      });
    } else {
      // 数据有误
      this.msg.warning('数据有误，请检查');
    }
  }

  // 关闭弹窗
  onClose() {
    this.ref.close();
  }

  // 编辑修改保存
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
    const updateParams = {
      belongPovCode: this.userInfo.pov, // 归属pov
      id: this.deviceInfo.id,
      belongDepartmentCode: this.modifyOrAddFrom.value.belongDepartmentCode, // 归属部门
      facilityStatus: this.modifyOrAddFrom.value.facilityStatus, // 状态
      name: this.modifyOrAddFrom.value.name // 设备名称
    };
    this.stockService.modifyFacility(updateParams, res => {
      this.loading = false;
      console.log('修改====', res);
      if (res && res.code === 0) {
        this.msg.info(res.msg);
        this.ref.close(true);
      } else {
        this.msg.warning(`${res.msg}`);
      }
    });
  }
}

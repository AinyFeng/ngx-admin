import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {DateUtils, DevicetypeService, DicDataService, MonitorDeviceService} from '@tod/svs-common-lib';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-add-edit-monitor',
  templateUrl: './add-edit-monitor.component.html',
  styleUrls: ['../../../device-manage.component.scss'],
  providers: [ DevicetypeService, DicDataService]
})
export class AddEditMonitorComponent implements OnInit {

  loading = false;
  isModify = false;
  modifyOrAddFrom: FormGroup;
  // 设备状态options
  statusOptions = [ {value: 0, label: '正常'},
    {value: 1, label: '停用'},
    {value: 2, label: '无电源'},
    {value: 3, label: '无网络'},
    {value: 4, label: '网络不稳定'}];
  // 如果是编辑需要传入数据
  deviceInfo: any;
  userInfo: any;
  // 组织机构（有上个页面传入）
  organization: any;
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
    private deviceSvc: MonitorDeviceService,
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    // 获取设备状态
  /*  this.statusOptions = this.dicSvc.getDicDataByKey('');*/
    if (this.deviceInfo || this.deviceInfo != null) {
      // 编辑
      // 启用日期/校准日期非必须填
      let startuseDate = null, calibrationDates = null;
      if ( this.deviceInfo.startuse_date) {
        startuseDate =  DateUtils.getFormatDateTime(this.deviceInfo.startuse_date);
      }
      if ( this.deviceInfo.calibration_dates) {
        calibrationDates =  DateUtils.getFormatTime(this.deviceInfo.calibration_dates);
      }
      this.isModify = true;
      this.modifyOrAddFrom = this.fb.group({
        gwMac: [this.deviceInfo.gw_mac, [Validators.required]],
        name: [this.deviceInfo.name, [Validators.required]], // 设备名称
        severIp: [this.deviceInfo.sever_ip, [Validators.required]],
        iupr: [this.deviceInfo.iupr, [Validators.required]],
        warrantyPeriod: [this.deviceInfo.warranty_period],
        startuseDate: [startuseDate], // 启用日期
        calibrationDates: [calibrationDates], // 校准日期
        server: [this.deviceInfo.server], // 服务器
        purpose: [this.deviceInfo.purpose],
        status: [this.deviceInfo.status],
        batoff: [this.deviceInfo.batoff === '1' ? true : false], // 是否断点报警
        lowvoltageAlarm: [this.deviceInfo.lowvoltage_alarm === '1' ? true : false],
        localStorage: [this.deviceInfo.local_storage === '1' ? true : false]
      });
    } else {
      // 新增
      console.log('新增>>>>>>>>>>>>>>');
      this.isModify = false;
      this.modifyOrAddFrom = this.fb.group({
        gwMac: [null, [Validators.required]],
        name: [null, [Validators.required]], // 设备名称
        severIp: [null, [Validators.required]],
        iupr: [5, [Validators.required]],
        warrantyPeriod: [null],
        startuseDate: [null], // 启用日期
        calibrationDates: [null], // 校准日期
        server: [null], // 服务器
        purpose: [null],
        batoff: [true], // 是否断点报警
        lowvoltageAlarm: [true],
        localStorage: [null],
        status: [0]
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
    let startuseDate = null, calibrationDates = null;
    if ( this.modifyOrAddFrom.get('startuseDate').value) {
      startuseDate =  DateUtils.getFormatDateTime(this.modifyOrAddFrom.get('startuseDate').value);
    }
    if ( this.modifyOrAddFrom.get('calibrationDates').value) {
      calibrationDates =  DateUtils.getFormatDateTime(this.modifyOrAddFrom.get('calibrationDates').value);
    }
    this.loading = true;
    if (this.isModify) {
      const updateParams = {
        id: this.deviceInfo.id,
        organizationCode: this.deviceInfo.organization_code,
        gwMac: this.modifyOrAddFrom.value.gwMac,
        name: this.modifyOrAddFrom.value.name, // 设备名称
        severIp: this.modifyOrAddFrom.value.severIp,
        iupr: this.modifyOrAddFrom.value.iupr,
        warrantyPeriod: this.modifyOrAddFrom.value.warrantyPeriod,
        startuseDate: startuseDate, // 启用日期
        calibrationDates: calibrationDates, // 校准日期
        server: this.modifyOrAddFrom.value.server, // 服务器
        purpose: this.modifyOrAddFrom.value.purpose,
        batoff: this.modifyOrAddFrom.value.batoff === true ? 1 : 0, // 是否断点报警
        lowvoltageAlarm:  this.modifyOrAddFrom.value.lowvoltageAlarm === true ? 1 : 0,
        localStorage:  this.modifyOrAddFrom.value.localStorage === true ? 1 : 0,
        updateBy: this.userInfo.name,
        status: this.modifyOrAddFrom.value.status,
      };
      // 接口访问
      this.deviceSvc.updateMonitoDevice(updateParams, res => {
        this.loading = false;
        console.log('修改====', updateParams);
        if (res && res.code === 0) {
          this.msg.info(res.msg);
          this.ref.close(true);
        } else {
          this.msg.warning(`${res.msg}`);
        }
      });
    } else {
      const params = {
        organizationCode: this.organization,
        gwMac: this.modifyOrAddFrom.value.gwMac,
        name: this.modifyOrAddFrom.value.name, // 设备名称
        severIp: this.modifyOrAddFrom.value.severIp,
        iupr: this.modifyOrAddFrom.value.iupr,
        warrantyPeriod: this.modifyOrAddFrom.value.warrantyPeriod,
        startuseDate: startuseDate, // 启用日期
        calibrationDates: calibrationDates, // 校准日期
        server: this.modifyOrAddFrom.value.server, // 服务器
        purpose: this.modifyOrAddFrom.value.purpose,
        batoff: this.modifyOrAddFrom.value.batoff === true ? 1 : 0, // 是否断点报警
        lowvoltageAlarm:  this.modifyOrAddFrom.value.lowvoltageAlarm === true ? 1 : 0,
        localStorage:  this.modifyOrAddFrom.value.localStorage === true ? 1 : 0,
        status: this.modifyOrAddFrom.value.status,
        createBy: this.userInfo.name,
      };
      this.deviceSvc.insertMonitoDevice(params, res => {
        this.loading = false;
        console.log('新增====', params);
        if (res && res.code === 0) {
          this.msg.info(res.msg);
          this.ref.close(true);
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

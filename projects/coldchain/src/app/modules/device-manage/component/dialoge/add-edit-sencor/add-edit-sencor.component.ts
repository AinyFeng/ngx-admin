import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';
import {
  DepartmentInitService,
  DicDataService,
  SensorDeviceService
} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-add-edit-sencor',
  templateUrl: './add-edit-sencor.component.html',
  styleUrls: ['../../../device-manage.component.scss'],
})
export class AddEditSencorComponent implements OnInit {

  loading = false;
  isModify = false;
  modifyOrAddFrom: FormGroup;
  // 如果是编辑需要传入数据
  deviceInfo: any;
  // 新增时组织机构（从上个页面传入）
  organization: any;
  // 所属设备（冷链设备名称 + 出厂编号 需要接口获取 ）
  deviceOptions = [];
  // 所属设备MAC地址（监测设备的mac地址 需要接口获取）
  gwMacOptions = [];
  // 传感器类别 （01-单温探头、02-单温标签、03-温湿度探头、04-温湿度标签）'
  sensorTypeOptions = [{'value': '01', 'label': '单温探头'},
    {'value': '02', 'label': '单温标签'},
    {'value': '03', 'label': '温湿度探头'},
    {'value': '04', 'label': '温湿度标签'}
  ];
  // 型号（无线、型号1、型号2、便携式）
  modelNumberOptions =  [{'value': '01', 'label': '无线'},
    {'value': '02', 'label': '型号1'},
    {'value': '03', 'label': '型号2'},
    {'value': '04', 'label': '便携式'}
  ];
  // 多级报警类型（本级报警、多级报警、上级报警
  multiAlarmTypeOptions =  [{'value': '01', 'label': '本级报警'},
    {'value': '02', 'label': '上级报警'},
    {'value': '03', 'label': '多级报警'}
  ];
  // 忽略报警:报警、不报警、报警不发送
  ignoreAlarmOptions =  [{'value': '01', 'label': '报警'},
    {'value': '02', 'label': '不报警'},
    {'value': '03', 'label': '报警不发送'}
  ];
  // 部门(科室)
  departmentOptions = [];
  departmentSelect = [];
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
    private departmentSvc: DepartmentInitService,
    private deviceService: SensorDeviceService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
    // 获取科室
    this.departmentOptions = this.departmentSvc.getDepartmentData();
    // 过滤科室信息
    this.departmentOptions.forEach( d => {
      if ( d.type === '1' || d.type === '4') {
        this.departmentSelect.push(d);
      }
    });
    // 获取所属设备（冷链设备名称 + 出厂编号）
    const param = {};
    this.deviceService.queryFacilityOptions( param, resp => {
      if (resp && resp.code === 0) {
        this.deviceOptions = resp.data;
        console.log('queryFacilityOptions', this.deviceOptions);
      } else {
        this.deviceOptions = [];
      }
    });
    // 获取所属设备（冷链设备名称 + 出厂编号）
    this.deviceService.queryMonitorOptions( param, resp => {
      if (resp && resp.code === 0) {
        this.gwMacOptions = resp.data;
        console.log('querySensorDeviceInfo', this.gwMacOptions);
      } else {
        this.gwMacOptions = [];
      }
    });
  }

  ngOnInit() {
    // 获取经费来源
   /* this.sourceCodeOptions = this.dicSvc.getDicDataByKey('fixedAssetsSource');*/

    if (this.deviceInfo || this.deviceInfo != null) {
      // 编辑
       console.log('待编辑的数据===', this.deviceInfo);
      this.isModify = true;
      this.modifyOrAddFrom = this.fb.group({
        facilityCode: [this.deviceInfo.facilityCode], // 所属冷藏设备编码
        device: [this.deviceInfo.device, [Validators.required]], // 冷链设备名称 + 出厂编号
        gwMac: [this.deviceInfo.gwMac, [Validators.required]], // 所属检测仪
        sensorType: [this.deviceInfo.sensorType, [Validators.required]], // 传感器类型
        modelNumber: [this.deviceInfo.modelNumber, [Validators.required]], // 型号
        sensorName: [this.deviceInfo.sensorName, [Validators.required]], // 传感器名称
        sensorMac: [this.deviceInfo.sensorMac, [Validators.required]], // 传感器编号
        upperTemp: [this.deviceInfo.upperTemp, [Validators.required]],
        lowerTemp: [this.deviceInfo.lowerTemp, [Validators.required]],
        upperHumidity: [this.deviceInfo.upperTemp, [Validators.required]],
        lowerHumidity: [this.deviceInfo.lowerTemp, [Validators.required]],
        measureInterval: [this.deviceInfo.measureInterval, [Validators.required]],
       /* factoryNum: [this.deviceInfo.factoryNum, [Validators.required]],*/ // 通道号
        temperatureAlarmInterval: [this.deviceInfo.temperatureAlarmInterval, [Validators.required]],
        humidityAlarmInterval: [this.deviceInfo.humidityAlarmInterval],
        powerOffAlarmInterval: [this.deviceInfo.powerOffAlarmInterval, [Validators.required]],
        delayAlarmCount: [this.deviceInfo.delayAlarmCount],
        multiAlarmCount: [this.deviceInfo.multiAlarmCount, [Validators.required]],
        temperatureCheckValue: [this.deviceInfo.temperatureCheckValue, [Validators.required]],
        multiAlarmType: [this.deviceInfo.multiAlarmType, [Validators.required]],
        ignoreAlarm: [this.deviceInfo.ignoreAlarm], // 状态
        departmentCode: [this.deviceInfo.departmentCode], // 接种科室
        lowVoltageAlarm: [this.deviceInfo.lowVoltageAlarm === '1' ? true : false],
        lowVoltageValue: [this.deviceInfo.multiAlarmType], // 低电量报警值
        status: [this.deviceInfo.status === '1' ? true : false], // 启用
        voiceAlarm: [this.deviceInfo.voiceAlarm === '1' ? true : false], // 是否启用语音报警
        interruptAlarm: [this.deviceInfo.interruptAlarm === '1' ? true : false ], // 是否中断报警中断报警
        interruptInterval: [this.deviceInfo.interruptInterval], // 中断报警时间最大值
      });
    } else {
      // 新增
      console.log('新增>>>>>>>>>>>>>>');
      this.isModify = false;
      this.modifyOrAddFrom = this.fb.group({
        facilityCode: [null], // 所属冷藏设备编码
        device: ['普通冷库20180608', [Validators.required]], // 冷链设备名称 + 出厂编号
        gwMac: ['100CC1002', [Validators.required]], // 所属检测仪
        sensorType: ['01', [Validators.required]], // 传感器类型
        modelNumber: ['01', [Validators.required]], // 型号
        sensorName: [null, [Validators.required]], // 传感器名称
        sensorMac: [null, [Validators.required]], // 传感器编号
        upperTemp: [2, [Validators.required]],
        lowerTemp: [8, [Validators.required]],
        upperHumidity: [0, [Validators.required]],
        lowerHumidity: [100, [Validators.required]],
        measureInterval: [25, [Validators.required]],
        /* factoryNum: [this.deviceInfo.factoryNum, [Validators.required]],*/ // 通道号
        temperatureAlarmInterval: [120, [Validators.required]],
        humidityAlarmInterval: [120],
        powerOffAlarmInterval: [120, [Validators.required]],
        delayAlarmCount: [3],
        multiAlarmCount: [0, [Validators.required]],
        temperatureCheckValue: [0, [Validators.required]],
        multiAlarmType: ['01', [Validators.required]],
        ignoreAlarm: ['01'],
        departmentCode: [null], // 接种科室
        lowVoltageAlarm: [null],
        lowVoltageValue: [null], // 低电量报警值
        status: [true], // 启用
        voiceAlarm: [true], // 是否启用语音报警
        interruptAlarm: [null], // 是否中断报警中断报警
        interruptInterval: [null], // 中断报警时间最大值
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
    this.loading = true;
    const params = this.modifyOrAddFrom.value;
    params['lowVoltageAlarm'] = this.modifyOrAddFrom.value.lowVoltageAlarm === true ? 1 : 0;
    params['status'] = this.modifyOrAddFrom.value.status === true ? 1 : 0;
    params['voiceAlarm'] = this.modifyOrAddFrom.value.voiceAlarm === true ? 1 : 0;
    params['interruptAlarm'] = this.modifyOrAddFrom.value.interruptAlarm === true ? 1 : 0;
    if (this.isModify) {
      params['id'] = this.deviceInfo.id;
      params['updateBy'] = this.userInfo.name;
      this.deviceService.updateSensorDevice(params, res => {
        this.loading = false;
        console.log('修改参数====', params);
        if (res && res.code === 0) {
          this.ref.close(true);
          this.msg.info(res.msg);
        } else {
          this.msg.warning(`${res.msg}`);
        }
      });
    } else {
      params['organizationCode'] = this.organization;
      params['createBy'] = this.userInfo.name;
      this.deviceService.insertSensorDevice(params, res => {
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
   * 选择冷藏设备编码
   * @param ev
   */
  selectFacilityCode(ev) {
    if (!ev) {
      return;
    }
    this.deviceOptions.forEach( d => {
      if ((d.facilityName + d.factoryNum) === ev) {
        this.modifyOrAddFrom.get('facilityCode').setValue(d.facilityCode);
      }
    });
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

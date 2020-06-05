import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';
import {DateUtils, DicDataService, RepairScrapService, SensorDeviceService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-add-edit-scrapped',
  templateUrl: './add-edit-scrapped.component.html',
  styleUrls: ['../../../device-manage.component.scss'],
})
export class AddEditScrappedComponent implements OnInit {

  loading = false;
  isModify = false;
  modifyOrAddFrom: FormGroup;
  // 如果是编辑需要传入数据
  deviceInfo: any;
  // 新增时组织机构（从上个页面传入）
  organization: any;
  userInfo: any;
  // 所属设备（冷链设备名称 + 出厂编号 需要接口获取 ）
  deviceOptions = [];
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
    private  repairService: RepairScrapService,
    private deviceService: SensorDeviceService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
    // 获取所属设备（冷链设备名称 + 出厂编号）
    const param =  this.organization;
    this.deviceService.queryFacilityOptions( param, resp => {
      if (resp && resp.code === 0) {
        this.deviceOptions = resp.data;
        console.log('queryFacilityOptions',  this.organization, this.deviceOptions);
      } else {
        this.deviceOptions = [];
      }
    });
  }

  ngOnInit() {
    if (this.deviceInfo || this.deviceInfo != null) {
      // 编辑
      // 损坏日期 修复日期非必须填
      let scrapDate = null;
      if ( this.deviceInfo.scrap_date) {
        scrapDate =  DateUtils.getFormatDateTime(this.deviceInfo.scrap_date);
      }
      console.log('待编辑的数据===', this.deviceInfo);
      this.isModify = true;
      this.modifyOrAddFrom = this.fb.group({
        facilityCode: [this.deviceInfo.facility_code, [Validators.required]], // 设备编码
        facilityName: [this.deviceInfo.facility_name, [Validators.required]], // 设备名称
        cause: [this.deviceInfo.cause],
        scrapDate: [scrapDate], // 报废日期
        ratifyUnit: [this.deviceInfo.ratify_unit]
      });
    } else {
      // 新增
      console.log('新增>>>>>>>>>>>>>>', this.organization);
      this.isModify = false;
      this.modifyOrAddFrom = this.fb.group({
        facilityCode: [null, [Validators.required]], // 设备编码
        facilityName: [null, [Validators.required]], // 设备名称
        cause: [null],
        scrapDate: [null], // 报废日期
        ratifyUnit: [null]
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
    let scrapDate = null;
    if ( this.modifyOrAddFrom.get('scrapDate').value) {
      scrapDate =  DateUtils.getFormatDateTime(this.modifyOrAddFrom.get('scrapDate').value);
    }
    this.loading = true;
    const params = this.modifyOrAddFrom.value;
    params['scrapDate'] = scrapDate;
    if (this.isModify) {
      params['id'] = this.deviceInfo.id;
      params['updateBy'] = this.userInfo.name;
      params['organizationCode'] = this.deviceInfo.organization_code;
      this.repairService.updateScrapData(params, res => {
        this.loading = false;
        console.log('修改====', params);
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
      this.repairService.insertScrapData(params, res => {
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
  onClose() {
    this.ref.close();
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {DepartmentInitService, PovStaffApiService, DicDataService, PovStaffInitService} from '@tod/svs-common-lib';
import {ValidatorsUtils} from '../../../../../@uea/components/form/validators-utils';

import * as moment from 'moment';
import {Moment} from 'moment';
import {DateUtils} from '../../../../../../../../svs-common-lib/src/lib/utils/date.utils';
import {NbMomentDateService} from '@nebular/moment';

@Component({
  selector: 'uea-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['../../system.common.scss'],
  providers: [NbMomentDateService]
})
export class AddStaffComponent implements OnInit {
  staffForm: FormGroup;
  // 归属科室
  departmentOptions = [];
  // 登录用户信息
  userInfo: any;
  loading = false;
  // 修改传来的数据
  updateStaffData: any;
  // 全部的医护人员的信息
  staffInfo: any;
  // 角色
  allRoleTypes: any;
  // 在职状态
  workingStatus: any;

  currentDate = moment();

  constructor(
    private ref: NbDialogRef<AddStaffComponent>,
    private fb: FormBuilder,
    private dialog: NbDialogService,
    private departmentInitSvc: DepartmentInitService,
    private povStaffSvc: PovStaffApiService,
    private msg: NzMessageService,
    private dicSvc: DicDataService,
    private momentSvc: NbMomentDateService,
    private staffInitSvc: PovStaffInitService
  ) {
  }

  ngOnInit() {
    // 获取全部的医护人员的信息
    this.staffInfo = this.staffInitSvc.getPovStaffData();
    // 获取科室(部门)信息
    this.departmentOptions = this.departmentInitSvc.getDepartmentData();
    // 获取角色类型
    this.allRoleTypes = this.dicSvc.getDicDataByKey('staffRole');
    // 获取在职状态
    this.workingStatus = this.dicSvc.getDicDataByKey('staffStatus');
    this.staffForm = this.fb.group({
      departmentCode: [null, [Validators.required]], // 归属科室
      roleType: [null, [Validators.required]], // 角色类型
      staffStatus: [null, [Validators.required]], // 在职状态
      realName: [null, [Validators.required]], // 姓名
      entryTime: [null, [Validators.required]], // 入职时间
      leaveTime: [null], // 离职时间
      birthday: [null], // 生日
      email: [null], // 邮箱
      idCard: [null], // 身份证号码
      telephone: [null, [ValidatorsUtils.validatePhoneNo('telephone')]], // 手机号码
      memo: [null] // 备注
    });

    // 修改
    if (this.updateStaffData) {
      for (const key in this.updateStaffData) {
        if (this.staffForm.get(key)) {
          if (key === 'birthday' || key === 'entryTime' || key === 'leaveTime') {
            const birthdayStr = DateUtils.getFormatDateTime(this.updateStaffData[key]);
            const birthday = this.momentSvc.parse(birthdayStr, 'YYYY/MM/DD');
            this.staffForm.get(key).setValue(birthday);
          } else {
            if (key === 'realName') {
              this.staffForm.get(key).setValue(this.updateStaffData[key].replace(/^\s*|\s*$/g, ''));
            } else {
              this.staffForm.get(key).setValue(this.updateStaffData[key]);
            }
          }
        }
      }
    }
  }

  // 过滤出生日期 - 起
  filterBirthStartDate = (d: Moment) => {
    const endDate = this.staffForm.get('leaveTime').value;
    if (endDate) {
      return d <= endDate;
    }
    return d <= this.currentDate;
  }

  // 过滤出生日期 - 止
  filterBirthEndDate = (d: Moment) => {
    const startDate = this.staffForm.get('entryTime').value;
    if (startDate) {
      return d >= startDate && d <= this.currentDate;
    }
    return d <= this.currentDate;
  }

  // 关闭
  onClose() {
    this.ref.close();
  }

  // 保存信息
  saveStaffInfo() {
    if (this.staffForm.invalid) {
      this.msg.warning('表单填写不完整或有误，请检查');
      return;
    }
    this.loading = true;
    let params = {
      povCode: this.userInfo.pov,
      realName: this.staffForm.get('realName').value,
      telephone: this.staffForm.get('telephone').value ? this.staffForm.get('telephone').value : null,
      departmentCode: this.staffForm.get('departmentCode').value,
      memo: this.staffForm.get('memo').value ? this.staffForm.get('memo').value : null,
      email: this.staffForm.get('email').value ? this.staffForm.get('email').value : null,
      birthday: DateUtils.getFormatDateTime(this.staffForm.get('birthday').value),
      staffStatus: this.staffForm.get('staffStatus').value,
      idCard: this.staffForm.get('idCard').value ? this.staffForm.get('idCard').value : null,
      entryTime: DateUtils.getFormatDateTime(this.staffForm.get('entryTime').value),
      leaveTime: DateUtils.getFormatDateTime(this.staffForm.get('leaveTime').value),
      roleType: this.staffForm.get('roleType').value
    };
    // 新增
    if (!this.updateStaffData) {
      if (this.staffInfo.length) {
        let rightJobNum = [];
        // 去除不规范的工号
        this.staffInfo.forEach(el => {
          if (el.number.substring(0, 10) === this.userInfo.pov) {
            rightJobNum.push(el.number);
          }
        });
        if (rightJobNum.length) {
          params['number'] = Math.max(...rightJobNum) + 1;
        } else {
          params['number'] = this.userInfo.pov + '001';
        }
      }
      console.log('测试参数', params);
      this.povStaffSvc.addPovStaff(params, resp => {
        this.loading = false;
        console.log('添加的结果', resp);
        if (
          resp.code !== 0 ||
          !resp.hasOwnProperty('data') ||
          resp.data.length === 0
        ) {
          return;
        }
        this.msg.info('新增成功');
        this.ref.close(true);
      });
    } else {
      // 更新
      params['number'] = this.updateStaffData['number'];
      params['id'] = this.updateStaffData['id'];
      console.log('修改参数', params);
      this.povStaffSvc.updatePovStaff(params, result => {
        console.log('修改', result);
        if (result.code !== 0 || !result.hasOwnProperty('data') || result.data.length === 0) {
          return;
        }
        this.msg.info('修改成功');
        this.ref.close(true);
      });

    }

  }
}

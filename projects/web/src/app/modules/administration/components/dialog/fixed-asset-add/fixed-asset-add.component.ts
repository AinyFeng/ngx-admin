import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NzMessageService} from 'ng-zorro-antd';
import {
  DicDataService,
  FixedassetsService,
  DevicetypeService,
  DateUtils
} from '@tod/svs-common-lib';
import {UserService} from '@tod/uea-auth-lib';
import * as moment from 'moment';
import {Router} from '@angular/router';
import { Moment } from 'moment';

@Component({
  selector: 'uea-fixed-asset-add',
  templateUrl: './fixed-asset-add.component.html',
  styleUrls: ['../../admin.common.scss'],
  providers: [FixedassetsService, DevicetypeService]
})
export class FixedAssetAddComponent implements OnInit {
  loading = false;
  isModify = false;
  modifyOrAddFrom: FormGroup;
  // 如果是编辑需要传入数据
  fixedAssetsInfo: any;
  // 固定资产类型
  assetsTypeOptions: any;
  // 经费来源
  sourceCodeOptions: any;
  // 冷藏设备类型
  deviceTypeCodeOptions: any;
  // 是否是冷藏设备
  isCold = false;
  // 是否是叫号屏
  isScrip = false;
  userInfo: any;
  // 当前日期
  date = moment(new Date());
  @ViewChild('dialog', {static: true})
  dialog;
  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<FixedAssetAddComponent>,
    private dialogSvc: NbDialogService,
    private msg: NzMessageService,
    private fixesService: FixedassetsService,
    private devicetypeService: DevicetypeService,
    private user: UserService,
    private router: Router,
    private dicSvc: DicDataService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
    // 获取冷藏设备类型
    this.devicetypeService.queryDeviceType({}, resp => {
      console.log('获取冷藏设备类型===', resp);
      this.loading = false;
      if (resp && resp.code === 0) {
        this.deviceTypeCodeOptions = resp.data;
      } else {
       this.deviceTypeCodeOptions = [];
      }
    });
  }

  ngOnInit() {
    // 获取固定资产
     this.assetsTypeOptions = this.dicSvc.getDicDataByKey('assetsType');
    // 获取经费来源
    this.sourceCodeOptions = this.dicSvc.getDicDataByKey('fixedAssetsSource');
    if (this.fixedAssetsInfo || this.fixedAssetsInfo != null) {
      // 编辑
      console.log('需要编辑的数据==', this.fixedAssetsInfo);
      this.isModify = true;
      let useStartDate = null, useEndDate = null;
      if ( this.fixedAssetsInfo.useStartDate) {
        useStartDate =  moment(DateUtils.getFormatTime(this.fixedAssetsInfo.useStartDate, 'YYYY-MM-DD'));
      }
      if ( this.fixedAssetsInfo.useEndDate) {
        useEndDate =  moment(DateUtils.getFormatTime(this.fixedAssetsInfo.useEndDate, 'YYYY-MM-DD'));
      }
      if (this.fixedAssetsInfo.fixedAssetsType === '0') {
        this.isCold = true;
      }
      if (this.fixedAssetsInfo.fixedAssetsType === '2') {
        this.isScrip = true;
      }
      this.modifyOrAddFrom = this.fb.group({
        fixedAssetsNumber: [this.fixedAssetsInfo.fixedAssetsNumber, [Validators.required]], // 固定资产编码
        name: [this.fixedAssetsInfo.fixedAssetsName, [Validators.required]], // 固定资产名称
        fixedAssetsType: [this.fixedAssetsInfo.fixedAssetsType, [Validators.required]], // 固定资产类型
        sourceCode: [this.fixedAssetsInfo.sourceCode, [Validators.required]],
        // 如果是冷藏设备
        deviceTypeCode: [this.fixedAssetsInfo.deviceTypeCode], // 冷藏设备类型
        facilityNumber: [this.fixedAssetsInfo.facilityNumber], // 冷藏设备型号
        // 如果是叫号屏
        facilitySerialCode: [this.fixedAssetsInfo.facilitySerialCode],
        manufactureCode: [this.fixedAssetsInfo.manufactureCode, [Validators.required]], // 生产编号
        manufactureDate: [moment(DateUtils.getFormatTime(this.fixedAssetsInfo.manufactureDate, 'YYYY-MM-DD')), [Validators.required]], // 生产日期
        leaveFactoryDate: [moment(DateUtils.getFormatTime(this.fixedAssetsInfo.leaveFactoryDate, 'YYYY-MM-DD')), [Validators.required]], // 出厂日期
        receiveDate: [moment(DateUtils.getFormatTime(this.fixedAssetsInfo.receiveDate, 'YYYY-MM-DD')), [Validators.required]], // 到货日期
        useStartDate: [useStartDate], // 启用日期
        useEndDate: [useEndDate], // 报废日期
        memo: [this.fixedAssetsInfo.memo], // 备注
      });
    } else {
      // 新增
      console.log('新增>>>>>>>>>>>>>>');
      this.isModify = false;
      this.modifyOrAddFrom = this.fb.group({
        fixedAssetsNumber: [null, [Validators.required]], // 固定资产编码
        name: [null, [Validators.required]], // 固定资产名称
        fixedAssetsType: [null, [Validators.required]], // 固定资产类型
        sourceCode: [null, [Validators.required]],
        // 如果是冷藏设备
        deviceTypeCode: [null], // 冷藏设备类型
        facilityNumber: [null], // 冷藏设备型号
        // 如果是叫号屏
        facilitySerialCode: [null],
        manufactureCode: [null, [Validators.required]], // 生产编号
        manufactureDate: [null, [Validators.required]], // 生产日期
        leaveFactoryDate: [null, [Validators.required]], // 出厂日期
        receiveDate: [null, [Validators.required]], // 到货日期
        useStartDate: [null], // 启用日期
        useEndDate: [null], // 报废日期
        memo: [null] // 备注
      });
    }
  }

  /**
   * 过滤报废日期
   * 报废日期必须要大于等于启用日期
   * @param d
   */
  filterUseEndDate = (d: Moment) => {
    const useStartDate = this.modifyOrAddFrom.get('useStartDate').value;
    if (useStartDate) {
      return d >= useStartDate;
    }
    return d >= this.date;
  }

  /**
   * 过滤启用日期
   * 启用日期必须要小于等于报废日期
   * @param d
   */
  filterUseStartDate = (d: Moment) => {
    const useEndDate = this.modifyOrAddFrom.get('useEndDate').value;
    if (useEndDate) {
      return d <= useEndDate;
    }
    return d <= this.date;
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
    if (this.isCold) {
      if (this.modifyOrAddFrom.get('deviceTypeCode').value === null || this.modifyOrAddFrom.get('facilityNumber').value === null) {
        this.msg.warning('表单填写不完整或有误，请检查');
        return;
      }
    }
    if (this.isScrip) {
      if (this.modifyOrAddFrom.get('facilitySerialCode').value === null) {
        this.msg.warning('表单填写不完整或有误，请检查');
        return;
      }
    }
    this.loading = true;
    let useStartDate = null, useEndDate = null;
    if ( this.modifyOrAddFrom.get('useStartDate').value) {
      useStartDate =  this.modifyOrAddFrom.get('useStartDate').value.format('YYYY-MM-DD');
    }
    if ( this.modifyOrAddFrom.get('useEndDate').value) {
      useEndDate =  this.modifyOrAddFrom.get('useEndDate').value.format('YYYY-MM-DD');
    }
    if (this.isModify) {
      const updateParams = {
        fixedAssetsCode: this.fixedAssetsInfo.fixedAssetsCode, // 根据fixedAssetsCode修改
        povCode: this.fixedAssetsInfo.povCode,
        sourceCode: this.modifyOrAddFrom.value.sourceCode,
        fixedAssetsNumber: this.modifyOrAddFrom.value.fixedAssetsNumber,
        fixedAssetsName: this.modifyOrAddFrom.value.name,
        facilitySerialCode: this.modifyOrAddFrom.value.facilitySerialCode,
        fixedAssetsType: this.modifyOrAddFrom.value.fixedAssetsType,
        deviceTypeCode: this.modifyOrAddFrom.value.deviceTypeCode,
        facilityNumber: this.modifyOrAddFrom.value.facilityNumber,
        manufactureCode: this.modifyOrAddFrom.value.manufactureCode,
        manufactureDate: this.modifyOrAddFrom.get('manufactureDate').value.format('YYYY-MM-DD'),
        leaveFactoryDate: this.modifyOrAddFrom.get('leaveFactoryDate').value.format('YYYY-MM-DD'),
        receiveDate: this.modifyOrAddFrom.get('receiveDate').value.format('YYYY-MM-DD'),
        useStartDate: useStartDate,
        useEndDate: useEndDate,
        memo: this.modifyOrAddFrom.value.memo, // 备注
      };
      this.fixesService.update(updateParams, res => {
        this.loading = false;
       console.log('修改params====', updateParams);
        if (res && res.code === 0) {
          this.msg.info(res.msg);
          this.ref.close(true);
        } else {
          this.msg.warning(`${res.msg}`);
        }
      });
    } else {
      const params = {
        povCode: this.userInfo.pov,
        fixedAssetsNumber: this.modifyOrAddFrom.value.fixedAssetsNumber,
        fixedAssetsName: this.modifyOrAddFrom.value.name,
        facilitySerialCode: this.modifyOrAddFrom.value.facilitySerialCode,
        sourceCode: this.modifyOrAddFrom.value.sourceCode,
        fixedAssetsType: this.modifyOrAddFrom.value.fixedAssetsType,
        deviceTypeCode: this.modifyOrAddFrom.value.deviceTypeCode,
        facilityNumber: this.modifyOrAddFrom.value.facilityNumber,
        manufactureCode: this.modifyOrAddFrom.value.manufactureCode,
        manufactureDate: this.modifyOrAddFrom.get('manufactureDate').value.format('YYYY-MM-DD'),
        leaveFactoryDate: this.modifyOrAddFrom.get('leaveFactoryDate').value.format('YYYY-MM-DD'),
        receiveDate: this.modifyOrAddFrom.get('receiveDate').value.format('YYYY-MM-DD'),
        useStartDate: useStartDate,
        useEndDate: useEndDate,
        memo: this.modifyOrAddFrom.value.memo, // 备注
      };
      this.fixesService.insert(params, res => {
        this.loading = false;
        console.log('新增params====', params);
        //  添加接种台时要提示去配置疫苗,否则无法进行叫号!
        if (this.isCold) {
          this.msg.success('新增成功');
          this.dialogSvc.open(this.dialog, {
            context: '是否现在去配置冷藏设备所属科室?',
            closeOnBackdropClick: false,
            closeOnEsc: false
          });
          // this.msg.info('新增成功,新增接种台之后要去配置可接种疫苗,否则无法进行接种叫号');
        } else {
          this.msg.success('新增成功');
          this.ref.close(true);
        }
      });
    }
  }
  /**
   *  显示冷藏设备
   * @param ev
   */
  assetsTypeChange(ev) {
    if (!ev) {
      return;
    }
    if (ev === '0') {
      this.isCold = true;
      this.isScrip = false;
      return;
    } else if (ev === '2') {
      this.isScrip = true;
      this.isCold = false;
      return;
    }
      this.isScrip = false;
      this.isCold = false;
    /*console.log('显示冷藏设备', ev, this.isCold);*/
  }
  // 关闭弹窗
  onClose() {
    this.ref.close();
  }
  // 关闭二次弹框 - 稍后配置
  close(ref) {
    // 关闭二次弹框
    ref.close();
    // 关闭首次弹框(已经成功的新增了科室)
    this.ref.close(true);
  }

  // 现在去配置冷藏设备科室, 跳转冷藏设备管理界面
  saveManage(ref) {
    this.router.navigateByUrl('modules/stock/coldChainManagement');
    ref.close();
    this.ref.close();
  }
}

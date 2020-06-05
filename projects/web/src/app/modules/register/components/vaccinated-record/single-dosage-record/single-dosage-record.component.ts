import { ConfirmDialogComponent } from './../../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { UserService } from '@tod/uea-auth-lib';
import { SelectHospitalComponent } from '../../common/select-hospital/select-hospital.component';
import {
  DepartmentInfoService,
  PovStaffApiService,
  VaccineProductService,
  VaccinateService,
  BatchInfoService,
  ProfileDataService,
  VaccManufactureDataService,
  DicDataService,
  VaccineSubclassInitService,
  VaccBroadHeadingDataService,
  PovDataInit,
  DateUtils,
  CommonUtils
} from '@tod/svs-common-lib';
import { SaveVaccinateRecordConfirmDialogComponent } from '../save-vaccinate-record-confirm-dialog/save-vaccinate-record-confirm-dialog.component';

@Component({
  selector: 'uea-f-single-dosage-record',
  templateUrl: './single-dosage-record.component.html',
  styleUrls: ['./single-dosage-record.component.scss'],
  providers: [
    DepartmentInfoService,
    PovStaffApiService,
    VaccineProductService,
    VaccinateService,
    VaccineProductService,
    BatchInfoService
  ]
})
export class SingleDosageRecordComponent implements OnInit, OnDestroy {
  title = '添加/修改接种记录';
  // 传入需要更新的接种记录
  @Input() updateData: any;
  // 传入已接种的记录
  @Input() vacRecordData: any;
  profile: any;
  // 删除/保存/选择三个按钮不可以点击
  forbid = false;
  // 单剂补录进入删除不可点击
  isStop: boolean;

  // 疫苗小类名称
  vacSubClassData = [];
  // 疫苗小类下拉选择框
  vacSubClassOptions = [];
  // 疫苗产品下拉框选项
  vacProductOptions = [];

  form: FormGroup;

  // 疫苗大类
  vacBroadHeadingOptions = [];

  // 疫苗厂家
  manufacture = [];

  // 接种部位
  vaccinatePart = [];

  // 接种类型
  vaccinateType = [];

  // 疫苗批号
  vacBatchNo = [];

  // 接种途径，比如口服，皮下注射
  vaccinateWayOptions = [];

  // 接种医生选项列表
  vaccinateDoctorsOptions = [];

  // 所选pov 或 医院的编码
  selectPov: any;

  // 接种科室
  departmentOptions = [];

  // 订阅集合，用于取消订阅
  private subscription: Subscription[] = [];

  // 用户信息
  userInfo: any;

  // 当前日期
  currentDate = new Date(DateUtils.formatEndDate(new Date()));


  constructor(
    private dialogSvc: NbDialogService,
    private ref: NbDialogRef<SingleDosageRecordComponent>,
    private profileDataService: ProfileDataService,
    private batchNoSvc: BatchInfoService,
    private manufaSvc: VaccManufactureDataService,
    private fb: FormBuilder,
    private dicSvc: DicDataService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private povDataSvc: PovDataInit,
    private msg: NzMessageService,
    private departmentSvc: DepartmentInfoService,
    private povStaffSvc: PovStaffApiService,
    private vacProductSvc: VaccineProductService,
    private userSvc: UserService,
    private vacRecordSvc: VaccinateService
  ) {
    const sub1 = this.profileDataService.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
      }
    });
    const sub2 = this.userSvc.getUserInfoByType().subscribe(resp => {
      if (resp) {
        this.userInfo = resp;
      }
    });
    this.subscription.push(sub1);
    this.subscription.push(sub2);
  }

  ngOnInit() {
    // console.log(this.updateData);
    this.manufacture = this.manufaSvc.getVaccProductManufactureData();
    this.vaccinatePart = this.dicSvc.getDicDataByKey('vaccinatePart');
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    this.vaccinateType = this.dicSvc.getDicDataByKey('vaccinateType');
    this.vaccinateWayOptions = this.dicSvc.getDicDataByKey('vaccinateWay');
    this.vacBroadHeadingOptions = this.vacBroadHeadingSvc.getVaccBoradHeadingData();

    this.form = this.fb.group({
      vaccineProductCode: [null], // 疫苗产品编码，疫苗名称
      vaccinateDepartmentCode: [null], // 接种科室编码，比如：科室一001
      vaccineBroadHeadingCode: [null, [Validators.required]], // 疫苗产品大类
      vaccineSubclassCode: [null, [Validators.required]], // 疫苗产品小类
      vaccinateWay: ['0', [Validators.required]], // 接种途径，肌肉注射、皮下注射、口服等
      vaccineBatchNo: [null], // 疫苗产品批次号
      vaccineManufactureCode: [this.manufacture.length > 0 ? this.manufacture[0].code : null], // 疫苗产品厂商表
      vaccinateTime: [null, [Validators.required]], // 接种日期
      vaccinatePart: ['0'], // 接种部位
      vaccinateType: ['0'], // 接种类型，常规接种。。。
      actualVaccinatePovCode: [null, [Validators.required]], // 实际接种pov
      vaccinateDoctorCode: [null], // 接种人员
      electronicSupervisionCode: [null], // 电子监管码
      vaccinateDoseNumber: [1, [Validators.required]], // 默认都是1，如果是多剂次，则输入正确的剂次序号，如果不是多剂次，则为1
      vaccineType: ['0', [Validators.required]], // 疫苗类型，一类 - 0 或者二类 - 1，疫苗产品价格，暂时没有数据，分为收费 - 1、免费 - 0
      vaccinateCount: [1, [Validators.required, Validators.min(1)]], // 接种支数，默认为 1
      memo: [null], // 备注

      vaccinateStatus: ['3'], // 接种状态，因为是补录，所以都是 '接种完成 - 3'
      dataSourceType: ['2'], // 数据来源，2 - 补录，自动补全
      managePovCode: [
        this.userInfo ? this.userInfo.pov : '',
        [Validators.required]
      ], // 管理pov编码,是当前管理接种记录的pov，如果是补录，则应该是当前补录的pov，自动补全
      globalRecordNumber: [null], // 全局流水号，补录时为空 自动补全
      registerRecordNumber: [null], // 接种流水号，补录时为空 自动补全
      profileCode: [
        this.profile ? this.profile['profileCode'] : null,
        [Validators.required]
      ], // 自动补全
      recordStatusCode: ['0'] // 接种记录的状态 0-正常 10-省平台删除  自动补全
    });
    if (this.updateData) {
      // console.log('判断类型',this.updateData.dataSourceType);
      if (
        this.updateData.dataSourceType !== '2' ||
        this.updateData.recordStatusCode === '10'
      ) {
        this.forbid = true;
      }
      // console.log('查看补录的数据',this.updateData);
      for (const key in this.updateData) {
        if (
          this.updateData.hasOwnProperty(key) &&
          this.form.controls.hasOwnProperty(key)
        ) {
          if (key === 'vaccinateTime') {
            this.form.controls[key].setValue(
              DateUtils.getFormatDateTime(this.updateData[key])
            );
          } else if (key === 'vaccineBroadHeadingCode') {
            this.form.controls[key].disable({ onlySelf: true });
            this.form.controls[key].setValue(this.updateData[key]);
            this.vaccineBroadHeadingChange(this.updateData[key]);
          } else if (key === 'vaccineSubclassCode') {
            this.form.controls[key].disable({ onlySelf: true });
            this.form.controls[key].setValue(this.updateData[key]);
            this.onVacSubClassChange(this.updateData[key]);
          } else if (key === 'vaccineProductCode') {
            this.form.controls[key].disable({ onlySelf: true });
            this.form.controls[key].setValue(this.updateData[key]);
            this.onVacProductChange(this.updateData[key]);
          } else if (key === 'actualVaccinatePovCode') {
            this.selectPov = { value: this.updateData[key] };
            this.queryDepartmentByPovCode();
            this.form.controls[key].setValue(this.updateData[key]);
          } else if (key === 'vaccinateDepartmentCode') {
            this.onDepartmentChange(this.updateData[key]);
            this.form.controls[key].setValue(this.updateData[key]);
          } else if (key === 'vaccinateDoseNumber' || key === 'vaccinateCount') {
            this.form.controls[key].disable({ onlySelf: true });
            this.form.controls[key].setValue(this.updateData[key]);
          } else {
            this.form.controls[key].setValue(this.updateData[key]);
          }
        }
      }
    }
    // 监听剂次的值的变化
    /* const sub3 = this.form.get('vaccinateCount').valueChanges.subscribe(value => {
       console.log('监听剂次', value);
       if (value === 0) {
         this.form.get('vaccinateCount').setValue(1);
       }
     });
     this.subscription.push(sub3);*/
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  // changeInput() {
  //   const inputValue = this.form.get('vaccinateCount').value;
  //   if (inputValue === null || Number(inputValue) <= 0) {
  //     this.form.get('vaccinateCount').setValue(1);
  //   }
  // }

  openDialog() {
    this.dialogSvc.open(SelectHospitalComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }

  saveRecord() {
    if (!this.profile) return;
    for (const key in this.form.controls) {
      if (this.form.get(key)) {
        this.form.controls[key].markAsDirty();
        this.form.controls[key].updateValueAndValidity();
      }
    }
    if (this.form.invalid) {
      this.msg.warning('表格填写不完整或有误，请检查');
      return;
    }
    this.forbid = true;
    let record = JSON.parse(JSON.stringify(this.form.value));
    if (!this.updateData) {
      // record['vaccinateDoctorCode'] = this.userInfo.userCode;
      record['vaccinateTime'] = DateUtils.getFormatDateTime(this.form.get('vaccinateTime').value);
      record['actualVaccinatePovCode'] = this.selectPov.value;
      record['registerRecordNumber'] = CommonUtils.uuid(32, '');
      record['globalRecordNumber'] = CommonUtils.uuid(32, '');
      record['vaccinateStatusCode'] = '0';
      // 是否强制补录 - 0 - 否 1 - 是
      record['isForce'] = '0';
      const param = [];
      param.push(record);
      this.vacRecordSvc.addVaccinateRecordBatch(param, resp => {
        console.log('单剂补录返回值', resp);
        this.forbid = false;
        if (resp.code === 0 && resp.data.length === 0) {
          this.onClose(true);
          this.msg.success('补录接种记录成功');
        } else if (resp.code === 0 && resp.data.length > 0) {
          this.msg.warning('补录接种记录出现异常');
          const confirmRecords = resp.data;
          this.dialogSvc.open(SaveVaccinateRecordConfirmDialogComponent, {
            hasBackdrop: true,
            closeOnEsc: false,
            closeOnBackdropClick: false,
            context: {
              records: confirmRecords
            }
          }).onClose.subscribe(confirm => {
            if (confirm) {
              this.vacRecordSvc.addVaccinateRecordBatch(confirmRecords, confirmResp => {
                if (confirmResp.code === 0) {
                  this.msg.success('操作成功');
                  this.onClose(true);
                }
              });
            }
          });
        }
      });
    } else {
      record['id'] = this.updateData['id'];
      record['vaccinateTime'] = DateUtils.getFormatDateTime(
        this.form.get('vaccinateTime').value
      );
      this.vacRecordSvc.updateVaccinateRecord(record, resp => {
        this.forbid = false;
        if (resp.code === 0) {
          this.onClose(true);
        } else {
          this.msg.error('更新记录失败，请重试');
        }
      });
    }
  }

  onClose(flag = false) {
    this.ref.close(flag);
  }

  /**
   * 根据疫苗大类选择疫苗小类
   * @param ev
   */
  vaccineBroadHeadingChange(ev) {
    if (!ev) {
      return;
    }
    // 当大类编码发生变化时，小类，产品，疫苗都要置空
    // 小类编码置空
    this.vacSubClassOptions = [];
    this.form.get('vaccineSubclassCode').setValue(null);
    // 产品编码选项置空
    this.vacProductOptions = [];
    // 批号选项置空
    this.vacBatchNo = [];
    // 生产厂家选项置空
    // this.manufacture = [];
    // 如果不是更新接种记录，则下列内容置空
    if (!this.updateData) {
      this.form.get('vaccineProductCode').setValue(null);
      this.form.get('vaccineBatchNo').setValue(null);
      this.form.get('vaccineManufactureCode').setValue(null);
    }
    this.vacSubClassData.forEach(vac => {
      if (vac.value.substring(0, 2) === ev) {
        this.vacSubClassOptions.push(vac);
      }
    });
  }

  /**
   * 选择pov 和医院，使用弹出层
   */
  selectPovAndHospital(index: boolean) {
    const sub = this.dialogSvc
      .open(SelectHospitalComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          flag: index
        }
      })
      .onClose.subscribe(resp => {
        // console.log('选择医院的返回数据', resp);
        if (resp) {
          // console.log('设置input框内容');
          this.form.get('actualVaccinatePovCode').setValue(resp.label);
          // console.log(this.form);
          this.selectPov = resp;
          this.queryDepartmentByPovCode();
        }
      });
    this.subscription.push(sub);
  }

  /**
   * 根据pov code 查询pov 科室
   */
  queryDepartmentByPovCode() {
    if (!this.selectPov) return;
    let query = {
      belongPovCode: this.selectPov.value
    };
    this.departmentOptions = [];
    if (!this.updateData) {
      this.form.get('vaccinateDepartmentCode').setValue(null);
    }
    this.departmentSvc.queryDepartmentInfo(query, resp => {
      // console.log('根据pov code 查询pov 科室', resp);
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp.data.length === 0
      ) {
        return;
      }
      this.departmentOptions = resp.data;
    });
  }

  /**
   * 根据所选科室和pov 查询 接种人员
   * @param ev
   */
  onDepartmentChange(ev) {
    // console.log(ev);
    if (!ev) {
      return;
    }
    const query = {
      departmentCode: ev,
      povCode: this.selectPov.value
      // condition: [
      //   { key: 'departmentCode', value: ev, logic: '=' },
      //   { key: 'povCode', value: this.selectPov.value, logic: '=' }
      // ]
    };
    this.form.get('vaccinateDoctorCode').setValue(null);
    this.vaccinateDoctorsOptions = [];
    this.povStaffSvc.queryPovStaff(query, resp => {
      // console.log(resp);
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp.data.length === 0
      ) {
        return;
      }
      this.vaccinateDoctorsOptions = resp.data.filter(doctor => doctor.hasOwnProperty('number'));
    });
  }

  /**
   * 小类编码发生变化
   * 将会置空产品列表、批号列表、生产厂家列表
   * 根据疫苗小类查询疫苗产品
   * @param ev 疫苗小类code
   */
  onVacSubClassChange(ev) {
    if (!ev) {
      return;
    }
    const query = {
      vaccineSubclassCode: ev
    };
    // 产品编码选项置空
    this.vacProductOptions = [];
    // 批号选项置空
    this.vacBatchNo = [];
    // 生产厂家选项置空
    // this.manufacture = [];
    // 如果不是更新接种记录，则下列内容置空
    if (!this.updateData) {
      this.form.get('vaccineProductCode').setValue(null);
      this.form.get('vaccineBatchNo').setValue(null);
      this.form.get('vaccineManufactureCode').setValue(null);
    }
    this.vacProductSvc.queryVaccineProduct(query, resp => {
      // console.log('根据疫苗小类查询疫苗产品', resp);
      if (resp.code === 0) {
        this.vacProductOptions = resp.data;
      }
    });
  }

  filterDate = (d: Date) => {
    return d > this.currentDate;
  }

  /**
   * 产品列表发生变化
   * 将会置空生产批号和生产厂家
   * 根据疫苗产品选择疫苗批次号
   * @param ev 疫苗产品code
   */
  onVacProductChange(ev) {
    // console.log('选择了疫苗产品', ev);
    if (!ev) {
      return;
    }
    const manufacture = this.getVaccineManufactureByVaccineProductCode(ev);
    // 根据所选疫苗设置疫苗厂商
    this.form.get('vaccineManufactureCode').setValue(manufacture);
  }

  /**
   * 删除接种记录
   */
  removeRecord() {
    this.dialogSvc
      .open(ConfirmDialogComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          title: '接种记录删除确认',
          content: `确认此条接种记录吗？`
        }
      })
      .onClose.subscribe(resp => {
      if (resp) {
        let record = JSON.parse(JSON.stringify(this.form.value));
        if (!this.updateData) {
          record['vaccinateTime'] = DateUtils.getFormatDateTime(
            this.form.get('vaccinateTime').value
          );
          record['actualVaccinatePovCode'] = this.selectPov.value;
          // console.log('待存储的接种记录为', record);
          this.vacRecordSvc.addVaccinateRecord(record, result => {
            if (
              result.code !== 0 ||
              !result.hasOwnProperty('data') ||
              result.data !== 1
            ) {
              this.msg.error('接种记录存储失败，请重试');
              return;
            }
            this.onClose();
          });
        } else {
          record['id'] = this.updateData['id'];
          record['vaccinateTime'] = DateUtils.getFormatDateTime(
            this.form.get('vaccinateTime').value
          );
          record['vaccinateStatusCode'] = '10';
          // console.log('待更新的接种记录为', record);
          this.vacRecordSvc.updateVaccinateRecord(record, result => {
            // console.log('更新记录返回值', resp);
            if (result.code === 0 && result['data'] === 1) {
              this.msg.success('成功删除接种记录');
              this.onClose(true);
              return;
            }
            this.msg.error('删除接种记录失败，请重试');
          });
        }
      }
    });
  }

  /**
   * 根据疫苗产品编码查询疫苗产品的厂商编码
   * @param code
   */
  getVaccineManufactureByVaccineProductCode(code: string) {
    if (this.vacProductOptions.length > 0) {
      for (let i = 0; i < this.vacProductOptions.length; i++) {
        if (this.vacProductOptions[i]['vaccineProductCode'] === code)
          return this.vacProductOptions[i]['manufacturerCode'];
      }
    }
    if (this.updateData) {
      return this.updateData['vaccineManufactureCode'];
    }
    return '';
  }
}

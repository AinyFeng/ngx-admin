import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {NzMessageService} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription, timer} from 'rxjs';
import {
  ProfileDataService,
  DicDataService,
  BiteService,
  VaccineProductService,
  BatchInfoService,
  VaccBroadHeadingDataService,
  VaccineSubclassInitService,
  SelfProfileService,
  DateUtils
} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-f-rabies-bitten-record',
  templateUrl: './rabies-bitten-record.component.html',
  styleUrls: ['./rabies-bitten-record.component.scss']
})
export class RabiesBittenRecordComponent implements OnInit, OnDestroy {
  // 自助添加code
  checkCode: any;
  // 自助添加数据
  selfRecordData: any;
  // 犬伤大类编码
  STRATEGY_CODE = '28';

  // 将当前查询或者新建的档案信息传递过来
  profile: { [key: string]: any };
  userInfo: any;

  yesOrNoOptions = [
    {label: '是', value: '1', checked: true},
    {label: '否', value: '0', checked: false}
  ];



  loading = false;
  // 动物列表
  animalOptions = [];

  // 受伤部位选项
  injurySiteOptions = [];

  // 受伤方式
  injuryTypeOptions = [];

  // 处理地点
  handlePlaceOptions = [];

  // 免疫方案
  vaccinateStrategy = [];

  // 犬伤免疫前后
  immuneTypeOptions = [];

  // 犬伤暴露级别
  exposureLevelOptions = [];

  // 狂犬疫苗大类
  rabiesVaccineOptions = [];

  // 批号选项集合
  vacBatchNo = [];

  // 疫苗厂商
  manufactureOptions = [];

  form: FormGroup;

  // 疫苗小类集合
  vacSubClassOptions = [];
  vacSubclassData = [];
  // 疫苗产品选项集合
  vacProductOptions = [];

  selectedStrategy: any;

  // 如果是修改，则将需要修改的记录数据传过来
  @Input()
  data: any;

  currentDate = new Date(DateUtils.formatEndDate(new Date()));

  private subscription: Subscription[] = [];

  constructor(
    private ref: NbDialogRef<RabiesBittenRecordComponent>,
    private msg: NzMessageService,
    private userSvc: UserService,
    private profileDataSvc: ProfileDataService,
    private dicSvc: DicDataService,
    private bitSvc: BiteService,
    private vacProductSvc: VaccineProductService,
    private batchNoSvc: BatchInfoService,
    private broadHeadingSvc: VaccBroadHeadingDataService,
    private vacSubclassCodeSvc: VaccineSubclassInitService,
    private fb: FormBuilder,
    private SelfProfileSvc: SelfProfileService
  ) {
    const sub1 = this.userSvc
      .getUserInfoByType()
      .subscribe(resp => (this.userInfo = resp));
    const sub2 = this.profileDataSvc.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
      }
    });
    this.subscription.push(sub1);
    this.subscription.push(sub2);
  }

  ngOnInit() {

    // console.log('修改狂犬记录', this.data);
    this.animalOptions = this.dicSvc.getDicDataByKey('animal');
    this.injurySiteOptions = this.dicSvc.getDicDataByKey('injurySite');
    this.injuryTypeOptions = this.dicSvc.getDicDataByKey('injuryType');
    this.handlePlaceOptions = this.dicSvc.getDicDataByKey('handlePlace');
    // 免疫类型
    this.immuneTypeOptions = this.dicSvc.getDicDataByKey('immuneType');
    this.exposureLevelOptions = this.dicSvc.getDicDataByKey('exposureLevel');
    this.vacSubclassData = this.vacSubclassCodeSvc.getVaccineSubClassData();
    this.rabiesVaccineOptions = this.broadHeadingSvc.getVaccBoradHeadingData().filter(code => code['broadHeadingName'].indexOf('狂犬') !== -1);
    // 加载免疫程序
    this.bitSvc.getStrategy({'diseaseCategoryCode': this.STRATEGY_CODE}, (result) => {
      this.vaccinateStrategy = result.data;
    });
    this.form = this.fb.group({
      injuryDate: [
        this.data ? new Date(this.data.injuryDate) : '',
        [Validators.required]
      ], // 选择咬伤时间
      animal: [
        this.data ? this.data.animal : this.animalOptions[0].value,
        [Validators.required]
      ], // 咬伤动物
      injuryType: [
        this.data ? this.data.injuryType : this.injuryTypeOptions[0].value,
        [Validators.required]
      ], // 受伤方式，抓伤、咬伤
      injurySite: [
        this.data ? this.data.injurySite : this.injurySiteOptions[0].value,
        [Validators.required]
      ], // 受伤部位
      handleDate: [
        this.data ? new Date(this.data.handleDate) : '',
        [Validators.required]
      ], // 处理时间
      handlePlace: [
        this.data ? this.data.handlePlace : this.handlePlaceOptions[0].value,
        [Validators.required]
      ], // 处理地点
      immuneType: [
        '1',
        [Validators.required]
      ], // 免疫前后
      exposureLevel: [
        this.data
          ? this.data.exposureLevel
          : this.exposureLevelOptions[0].value,
        [Validators.required]
      ], // 暴露级别
      over48H: [this.data ? this.data.over48H : '1', [Validators.required]], // 超过48小时
      hriVaccinated: [
        this.data ? this.data.hriVaccinated : '1',
        [Validators.required]
      ], // 是否接种狂犬病人免疫球蛋白
      weight: [this.data ? this.data.weight : 0, [Validators.min(0)]],
      memo: [this.data ? this.data.memo : ''],
      createPov: [this.data ? this.data.createPov : ''], // 创建pov
      programCode: [this.data ? this.data.programCode : '']
    });

  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  onClose() {
    this.ref.close();
  }

  /**
   * 过滤咬伤日期
   * @param d
   */
  filterDate = (d: Date) => {
    return d > this.currentDate;
  }

  /**
   * 过滤处理日期
   * @param d
   */
  filterHandleDate = (d: Date) => {
    const injuryDate = this.form.get('injuryDate').value;
    if (injuryDate) {
      const inj = new Date(injuryDate.getTime() - 24 * 60 * 60 * 1000);
      return d < inj || d > this.currentDate;
    } else {
      return d > this.currentDate;
    }
  }

  onSubmit() {
    // console.log(this.form);
    if (!this.profile) return;
    if (this.form.invalid) {
      this.msg.warning('表格内容填写有误或不完整，请检查');
      return;
    }
    const injuryDate = this.form.get('injuryDate').value;
    const handleDate = this.form.get('handleDate').value;
    if (handleDate < injuryDate) {
      this.msg.warning('处理日期不能早于受伤日期，请检查');
      return;
    }
    this.loading = true;
    if (!this.data) {
      let data = JSON.parse(JSON.stringify(this.form.value));
      // console.log(data);
      // console.log(this.userInfo, this.mockStatus);
      data['updateBy'] = this.userInfo.userCode;
      data['patientIdCardNo'] = this.profile['idCardNo'];
      data['patientName'] = this.profile['name'];
      data['profileCode'] = this.profile['profileCode'];
      data['createPov'] = this.userInfo.pov;
      data['createBy'] = this.userInfo.userCode;
      // data['programCode'] = this.data.vaccinateStrategy;
      data.injuryDate = DateUtils.getFormatDateTime(data.injuryDate);
      data.handleDate = DateUtils.getFormatDateTime(data.handleDate);
      console.log('新增狂犬登记记录参数=>', data);
      this.bitSvc.insertBiteRecord(data, resp => {
        this.loading = false;
        if (resp.code !== 0 || resp.data !== 1) {
          this.msg.error(resp.msg);
          return;
        }
        this.changeSelfRabiesRecord();
        this.msg.success('犬伤咬伤记录添加成功');
        this.ref.close(true);
      });
    } else {
      let data: any = {};
      Object.assign(data, this.data, this.form.value);
      data.createDate = null;
      if (data.hasOwnProperty('updateDate')) {
        data.updateDate = null;
      }
      // console.log(data);
      // console.log(this.userInfo, this.mockStatus);
      data['updateBy'] = this.userInfo.userCode;
      data.injuryDate = DateUtils.getFormatDateTime(data.injuryDate);
      data.handleDate = DateUtils.getFormatDateTime(data.handleDate);
      // console.log(data);
      this.bitSvc.udpateBiteRecord(data, resp => {
        this.loading = false;
        // console.log(resp);
        if (resp.code !== 0 || (resp.hasOwnProperty(data) && resp.data !== 1)) {
          this.msg.error('操作失败，请重试');
          return;
        }
        this.ref.close(true);
      });
    }
  }

  /**
   * 根据疫苗大类选择疫苗小类
   * @param ev
   * @param reset
   */
  // vaccineBroadHeadingChange(ev, reset = true) {
  //   if (!ev) {
  //     return;
  //   }
  //   if (reset) {
  //     this.resetVacBatchNo();
  //     this.resetManufactureCode();
  //     this.resetVacProductCode();
  //     this.resetVacSubclassCode();
  //   }
  //   this.vacSubclassData.forEach(vac => {
  //     if (vac.value.substring(0, 2) === ev) {
  //       this.vacSubClassOptions.push(vac);
  //     }
  //   });
  // }

  /**
   * 根据疫苗小类查询疫苗产品
   * @param ev 疫苗小类code
   * @param reset
   */
  // onVacSubClassChange(ev, reset = true) {
  //   if (!ev) {
  //     return;
  //   }
  //   const query = {
  //     vaccineSubclassCode: ev
  //   };
  //   if (reset) {
  //     this.resetVacProductCode();
  //     this.resetVacBatchNo();
  //     this.resetManufactureCode();
  //   }
  //   this.vacProductSvc.queryVaccineProduct(query, resp => {
  //     // console.log('根据疫苗小类查询疫苗产品', resp);
  //     if (resp.code === 0) {
  //       this.vacProductOptions = resp.data;
  //       if (!reset) {
  //         this.form.controls['vaccineProductCode'].setValue(
  //           this.data['vaccineProductCode']
  //         );
  //       }
  //     }
  //   });
  // }

  /**
   * 根据疫苗产品选择疫苗厂商
   * @param ev 疫苗产品code
   * @param reset
   */
  // onVacProductChange(ev, reset = true) {
  //   if (!ev) {
  //     return;
  //   }
  //   // console.log('疫苗产品', ev);
  //   const query = {
  //     vaccineProductCode: ev
  //   };
  //   if (reset) {
  //     this.resetVacBatchNo();
  //   }
  //   this.findManufactureCodeByVaccineProductCode(ev);
  //   this.batchNoSvc.queryBatchInfo(query, resp => {
  //     // console.log('根据疫苗产品选择疫苗批号', resp);
  //     if (resp.code === 0) {
  //       this.vacBatchNo = resp.data;
  //     }
  //   });
  // }

  /**
   * 根据疫苗产品编码查询疫苗厂商
   * @param vaccineProductCode
   */
  // findManufactureCodeByVaccineProductCode(vaccineProductCode: string) {
  //   if (this.vacProductOptions.length > 0) {
  //     for (let i = 0; i < this.vacProductOptions.length; i++) {
  //       const vac = this.vacProductOptions[i];
  //       if (vaccineProductCode === vac['vaccineProductCode']) {
  //         // console.log(vac['manufacturerCode']);
  //         this.form.controls['manufactureCode'].patchValue(
  //           vac['manufacturerCode']
  //         );
  //         break;
  //       }
  //     }
  //   }
  // }

  /**
   * 重置疫苗产品编码
   */
  // resetVacProductCode() {
  //   this.vacProductOptions = [];
  //   this.form.get('vaccineProductCode').setValue(null);
  // }

  /**
   * 重置疫苗产品批号
   */
  // resetVacBatchNo() {
  //   this.vacBatchNo = [];
  //   this.form.get('batchNo').setValue(null);
  // }

  /**
   * 重置疫苗小类编码
   */
  // resetVacSubclassCode() {
  //   this.vacSubClassOptions = [];
  //   this.form.get('vaccineSubclassCode').setValue(null);
  // }

  // resetManufactureCode() {
  //   this.manufactureOptions = [];
  //   this.form.get('manufactureCode').setValue(null);
  // }

  // 自助添加犬伤记录
  SelfAddDogRecord(code: any) {
    if (this.loading) return;
    console.log(code);
    let params = {
      checkCode: code,
      checkStatus: 0
    };
    // console.log('form', this.form);
    this.SelfProfileSvc.querySelfRabiesRecord(params, resp => {
      if (
        resp &&
        resp.code === 0 &&
        resp.hasOwnProperty('data') &&
        resp.data.length !== 0
      ) {
        this.selfRecordData = resp.data;
        if (this.selfRecordData) {
          this.form
            .get('injuryDate')
            .setValue(
              DateUtils.getFormatDateTime(this.selfRecordData.injuryDate)
            );
          this.form.get('injurySite').setValue(this.selfRecordData.injurySite);
          this.form.get('animal').setValue(this.selfRecordData.animal);
          this.form.get('injuryType').setValue(this.selfRecordData.injuryType);
          this.form
            .get('handlePlace')
            .setValue(this.selfRecordData.handlePlace);
          this.form
            .get('handleDate')
            .setValue(
              DateUtils.getFormatDateTime(this.selfRecordData.handleDate)
            );
        }
      }
    });
  }

  /*
   * 修改犬伤记录
   * */
  changeSelfRabiesRecord() {
    if (!this.selfRecordData) return;
    let params = JSON.parse(JSON.stringify(this.selfRecordData));
    params.checkStatus = 1;
    params['injuryDate'] = DateUtils.getFormatDateTime(
      this.selfRecordData.injuryDate
    );
    params['handleDate'] = DateUtils.getFormatDateTime(
      this.selfRecordData.handleDate
    );
    console.log(params);
    this.SelfProfileSvc.updateSelfRabiesRecord(params, resp => {
      if (resp && resp.code === 0) {
        console.log('犬伤记录核验成功');
      }
    });
  }
}

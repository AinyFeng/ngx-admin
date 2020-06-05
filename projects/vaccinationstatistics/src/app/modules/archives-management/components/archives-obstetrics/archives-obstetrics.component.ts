import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { SelectSeedDialogComponent } from '../dialog/select-seed-dialog/select-seed-dialog.component';

@Component({
  selector: 'uea-archives-obstetrics',
  templateUrl: './archives-obstetrics.component.html',
  styleUrls: ['./archives-obstetrics.component.scss']
})
export class ArchivesObstetricsComponent implements OnInit {

  tabIndex: number = 0;
  saveForm: FormGroup;
  queryForm: FormGroup;
  newQueryForm: FormGroup;

  dataSet = [
    {
      code: '111111',
      name: '111111',
      standard: '111111',
      count: '111111',
      coefficient: '111111',
      type: '111111',
      remark: '111111',
      time: '111111',
    }, {
      code: '111111',
      name: '111111',
      standard: '111111',
      count: '111111',
      coefficient: '111111',
      type: '111111',
      remark: '111111',
      time: '111111',
    }, {
      code: '111111',
      name: '111111',
      standard: '111111',
      count: '111111',
      coefficient: '111111',
      type: '111111',
      remark: '111111',
      time: '111111',
    },
  ];
  newdataSet = [
    {
      code: '111111',
      name: '111111',
      standard: '111111',
      count: '111111',
      coefficient: '111111',
      type: '111111',
      remark: '111111',
      time: '111111',
    }, {
      code: '111111',
      name: '111111',
      standard: '111111',
      count: '111111',
      coefficient: '111111',
      type: '111111',
      remark: '111111',
      time: '111111',
    }, {
      code: '111111',
      name: '111111',
      standard: '111111',
      count: '111111',
      coefficient: '111111',
      type: '111111',
      remark: '111111',
      time: '111111',
    },
  ];

  vaccineDetail = [
    {
      vaccineSubclassName: '',
      vaccineBatchNo: '',
      validity: '',
      manufactureData: '',
      VaccinateDate: '',
      newOrOldVaccine: '',
      vaccinatePart: '',
      actualVaccinatePovCode: '',
      vaccinateDoctorCode: '',
      selectType: '',
    }, {
      vaccineSubclassName: '',
      vaccineBatchNo: '',
      validity: '',
      manufactureData: '',
      VaccinateDate: '',
      newOrOldVaccine: '',
      vaccinatePart: '',
      actualVaccinatePovCode: '',
      vaccinateDoctorCode: '',
      selectType: '',
    }, {
      vaccineSubclassName: '',
      vaccineBatchNo: '',
      validity: '',
      manufactureData: '',
      VaccinateDate: '',
      newOrOldVaccine: '',
      vaccinatePart: '',
      actualVaccinatePovCode: '',
      vaccinateDoctorCode: '',
      selectType: '',
    },
  ];

  nodes = [
    {
      title: '0-0',
      key: '0-0',
      children: [
        {
          title: '0-0-0',
          key: '0-0-0',
          children: [
            {title: '0-0-0-0', key: '0-0-0-0', isLeaf: true},
            {title: '0-0-0-1', key: '0-0-0-1', isLeaf: true},
            {title: '0-0-0-2', key: '0-0-0-2', isLeaf: true}
          ]
        },
        {
          title: '0-0-1',
          key: '0-0-1',
          children: [
            {title: '0-0-1-0', key: '0-0-1-0', isLeaf: true},
            {title: '0-0-1-1', key: '0-0-1-1', isLeaf: true},
            {title: '0-0-1-2', key: '0-0-1-2', isLeaf: true}
          ]
        },
        {
          title: '0-0-2',
          key: '0-0-2',
          isLeaf: true
        }
      ]
    },
    {
      title: '0-1',
      key: '0-1',
      children: [
        {title: '0-1-0-0', key: '0-1-0-0', isLeaf: true},
        {title: '0-1-0-1', key: '0-1-0-1', isLeaf: true},
        {title: '0-1-0-2', key: '0-1-0-2', isLeaf: true}
      ]
    },
    {
      title: '0-2',
      key: '0-2',
      isLeaf: true
    }
  ];

  constructor(private fb: FormBuilder,
              private modalSvc: NzModalService,
  ) {
  }

  ngOnInit(): void {
    this.saveForm = this.fb.group({
      creatNo: [null, [Validators.required]], // 建卡编号
      childName: [null, [Validators.required]], // 儿童姓名
      birthNo: [null, [Validators.required]], // 出生证号
      gender: [null, [Validators.required]], // 性别
      birthDate: [null, [Validators.required]], // 出生日期
      weight: [null, [Validators.required]], // 体重
      birthNum: [null, [Validators.required]], // 胎次
      bornHospital: [null, [Validators.required]], // 出生医院
      national: [null, [Validators.required]], // 民族
      motherName: [null, [Validators.required]], // 母亲姓名
      fatherName: [null, [Validators.required]], // 父亲姓名
      HBsAg_M: [null, [Validators.required]], // HBsAg_M
      HBsAg_F: [null, [Validators.required]], // HBsAg_F
      motherId: [null, [Validators.required]], // 母亲身份证
      fatherId: [null, [Validators.required]], // 父亲身份证
      motherPhone: [null, [Validators.required]], // 母亲电话
      fatherPhone: [null, [Validators.required]], // 父亲电话
      idType: [null, [Validators.required]], // 户口类别
      residentialTypeCode: [null, [Validators.required]], // 居住属性
      householdAddress: [null, [Validators.required]], // 家庭住址
      registrationAddress: [null, [Validators.required]], // 户籍地址
      householdAddressDetail: [null, [Validators.required]], // 请输入家庭详细地址
      registrationAddressDetail: [null, [Validators.required]], // 请输入户籍详细地址
      vaccineSubclassName: [null, [Validators.required]], // 疫苗名称
      vaccineBatchNo: [null, [Validators.required]], // 疫苗批号
      validity: [null, [Validators.required]], // 有效期
      manufactureData: [null, [Validators.required]], // 生产企业
      VaccinateDate: [null, [Validators.required]], // 接种日期
      newOrOldVaccine: [null, [Validators.required]], // 新旧苗
      vaccinatePart: [null, [Validators.required]], // 接种部位
      actualVaccinatePovCode: [null, [Validators.required]], // 接种单位
      vaccinateDoctorCode: [null, [Validators.required]], // 接种人员
      reason: [null, [Validators.required]] // 缺种原因
    });
    this.queryForm = this.fb.group({
      address: [null, [Validators.required]], // 地区
      temporaryCode: [null, [Validators.required]], // 临时编码
      childName: [null, [Validators.required]], // 儿童姓名
      motherName: [null, [Validators.required]], // 母亲姓名
      createDate: [null, [Validators.required]], // 建档起始日期
      endDate: [null, [Validators.required]], // 建档截止日期
      motherId: [null, [Validators.required]], // 母亲身份证
      idType: [null, [Validators.required]], // 户口类别
      checkPrint: [null, [Validators.required]], // 是否已打印
      bedNo: [null, [Validators.required]], // 床号
      hospitalNo: [null, [Validators.required]], // 住院号
      residentialTypeCode: [null, [Validators.required]] // 居住属性
    });
    this.newQueryForm = this.fb.group({
      address: [null, [Validators.required]], // 地区
      birthDateStart: [null, [Validators.required]], // 出生日期
      birthDateEnd: [null, [Validators.required]] // 出生日期
    });
  }

  // 选苗
  selectSeeed(data: any) {
    console.log('关闭>>>>>', data);
    const orderConditions = JSON.parse(JSON.stringify(this.vaccineDetail));
    const modal2 = this.modalSvc.create({
      nzTitle: '选择疫苗',
      nzContent: SelectSeedDialogComponent,
      nzWidth: 1200,
      nzMask: false,
      nzComponentParams: {
        orderConditions: orderConditions
      },
      nzFooter: null,
    });
    modal2.afterClose.subscribe(resp => {
      console.log('关闭参数>>>>>', resp);
      data.vaccineSubclassName = resp.data.vaccine;
      data.vaccineBatchNo = resp.data.number;
      data.validity = resp.data.validity;
      data.manufactureData = resp.data.company;
      data.selectType = resp.selectType;
      console.log('关闭>>>>>', data);
      // console.log('关闭参数>>>>>', resp.data.company);
      // console.log('关闭参数>>>>>', resp.selectType);
    });
  }


  close() {
    this.tabIndex = 1;
  }

  query(): void {
    console.log('query====');
  }

  save(): void {
    console.log('save====');
    // tslint:disable-next-line:forin
    for (const i in this.saveForm.controls) {
      this.saveForm.controls[i].markAsDirty();
      this.saveForm.controls[i].updateValueAndValidity();
    }
  }

}

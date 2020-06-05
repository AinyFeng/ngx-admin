import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {
  TreeDataApi, VaccBroadHeadingDataService, VaccineSubclassInitService, VaccManufactureDataService
} from '@tod/svs-common-lib';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';
import {formatDate} from '@angular/common';
import {AEFIService} from '../vaccine-aefi-manage/aefi.service';

@Component({
  selector: 'uea-vaccine-record-add',
  templateUrl: './vaccine-aefi-add.component.html',
  styleUrls: ['./vaccine-aefi-add.component.scss']
})
export class VaccineAefiAddComponent implements OnInit {
  tabIndex: number = 0;
  aefiAddForm: FormGroup;
  loading = false;

  /**
   * 当前日期
   */
  currentDate = moment();


  @Input() operationUpdate = false;
  updateData: any;

  genderOptions = [];


  // 户口类型选项
  idType = [];

  // 居住属性
  residentialType = [];

  // 在册状态
  profileStatus = [];

  // 用户信息
  userInfo: any;

  vacPovCodeNodes = [{label: '未住院', value: '2'},
    {label: '住院', value: '1'},
    {label: '不详', value: '3'}];
  reactionTypeNodes = [{label: '未住院', value: '2'},
    {label: '住院', value: '1'},
    {label: '不详', value: '3'}];

  constructor(
    private fb: FormBuilder,
    private vacSubClassSvc: VaccineSubclassInitService,
    private manufaSvc: VaccManufactureDataService,
    private modalSvc: NzModalService,
    private msg: NzMessageService,
    private vacBroadHeaderSvc: VaccBroadHeadingDataService,
    private user: UserService,
    private treeDataApi: TreeDataApi,
    private aefiService: AEFIService,
  ) {
  }

  ngOnInit() {
    this.aefiAddForm = this.fb.group({
      aefiCode: [null],
      reportCardCode: [null],
      profileCode: [null],
      vacRecordCode: [null],
      surveyCode: [null],
      surveyReportCode: [null],
      vacPovCode: [null],
      aefiDate: [null],
      discoverDate: [null],
      reaction: [null],
      pic: [null],
      patientOutcome: [null],
      reportDate: [null],
      survey_date: [null],
      reactionType: [null],
      seriousStatus: [null],
      groupStatus: [null],
      reportCode: [null],
      hospitalType: [null],
      provincialCheckStatus: [null],
      cityCheckStatus: [null],
      countyCheckStatus: [null],
      aefiAddFormCode: [null]
    });
  }

  close() {
  }

  save(): void {
    const params = {
      aefiCode: this.aefiAddForm.value.aefiCode,
      reportCardCode: this.aefiAddForm.value.reportCardCode,
      profileCode: this.aefiAddForm.value.profileCode,
      vacRecordCode: this.aefiAddForm.value.vacRecordCode,
      surveyCode: this.aefiAddForm.value.surveyCode,
      surveyReportCode: this.aefiAddForm.value.surveyReportCode,
      vacPovCode: this.aefiAddForm.value.vacPovCode,
      aefiDate: formatDate(this.aefiAddForm.value.aefiDate, 'yyyy-MM-dd HH:mm:ss', 'zh-Hans'),
      discoverDate: formatDate(this.aefiAddForm.value.discoverDate, 'yyyy-MM-dd HH:mm:ss', 'zh-Hans'),
      reaction: this.aefiAddForm.value.reaction,
      pic: this.aefiAddForm.value.pic,
      patientOutcome: this.aefiAddForm.value.patientOutcome,
      reportDate: formatDate(this.aefiAddForm.value.reportDate, 'yyyy-MM-dd HH:mm:ss', 'zh-Hans'),
      survey_date: formatDate(this.aefiAddForm.value.survey_date, 'yyyy-MM-dd HH:mm:ss', 'zh-Hans'),
      reactionType: this.aefiAddForm.value.reactionType,
      seriousStatus: this.aefiAddForm.value.seriousStatus,
      groupStatus: this.aefiAddForm.value.groupStatus,
      provincialCheckStatus: this.aefiAddForm.value.provincialCheckStatus,
      cityCheckStatus: this.aefiAddForm.value.cityCheckStatus,
      countyCheckStatus: this.aefiAddForm.value.countyCheckStatus,
      taefiAddFormCode: this.aefiAddForm.value.aefiAddFormCode
    };
    console.log('参数', params);
    this.loading = true;
    this.aefiService.saveAEFIReport(params, (queryData, countData) => {
      this.loading = false;
      console.log('返回来的数据', queryData, countData);
    });
  }

  // 重置
  resetForm() {
    this.aefiAddForm.reset();
    this.loading = false;
  }
}

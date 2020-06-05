import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VaccinatePlatformService} from '../vaccinate-platform.service';
import {
  DateUtils,
  QueueApiService,
  RegObstetricsService,
  SysConfInitService,
  VACCINATE_STATUS
} from '@tod/svs-common-lib';
import {interval} from 'rxjs';
import {take} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'uea-vaccinate-queue-list',
  templateUrl: './vaccinate-queue-list.component.html',
  styleUrls: ['./vaccinate-queue-list.component.scss']
})
export class VaccinateQueueListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  showCard: boolean = true;
  checkVaccineFlag: boolean = false;
  queryForm: FormGroup;

  constructor(public platformService: VaccinatePlatformService,
              private fb: FormBuilder,
              private regObstetricsService: RegObstetricsService,
              private message: NzMessageService,
              private queueApiSvc: QueueApiService,
              private sysConfService: SysConfInitService) {
  }

  ngOnInit() {
    this.resetForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkVaccineFlag = this.sysConfService.getConfValue('checkTraceCode') === '1';
      this.platformService.setCheckVaccineFlag(this.checkVaccineFlag);
    }, 250);
  }

  ngOnDestroy(): void {
  }

  getWaitingQueueLength(): number {
    if (this.platformService.waitingQueueDataDisplay) {
      return this.platformService.waitingQueueDataDisplay.length;
    }
    return 0;
  }

  getSuccessQueueLength(): number {
    if (this.platformService.successQueueData) {
      return this.platformService.successQueueData.length;
    }
    return 0;
  }

  /**
   * 查看队列中接种人信息
   */
  consultVaccinatePersonInfo(data, flag) {
    let temp = JSON.parse(JSON.stringify(data));
    if (flag) {
      temp.queueCode = temp.businessType ? temp.businessType + temp.queueCode : temp.queueCode ;
    }
    this.platformService.consultVaccinatePersonInfo(temp, flag);
  }


  initTopic() {
    this.platformService.initTopic(this.platformService.vaccinateWaitTopicShared, this.platformService.vaccinateWaitTopic);
    this.platformService.initTopic(
      this.platformService.vaccinateCalledTopicShared + '_' + this.platformService.selectedDepartmentCode,
      this.platformService.vaccinateCalledTopic + '_' + this.platformService.selectedDepartmentCode);
  }

  vaccinate(data) {
    const baseQueueItem = this.platformService.initQueueData(JSON.parse(JSON.stringify(data)));
    if (this.platformService.vaccinatingQueueData.length > 0) {
      this.platformService.warning('正在接种中！');
    } else {
      this.callNumber(baseQueueItem);
    }
  }

  callNumber(queueItem) {
    this.queueApiSvc.vaccinateCallNumber(queueItem, resp => {
      if (resp.hasOwnProperty('code') && resp.code === 0) {
        this.message.success('叫号成功');
      } else {
        this.platformService.error('出错了！');
      }
    });
  }

  search() {
    const param = {
      motherName: this.queryForm.controls['motherName'].value ? this.queryForm.controls['motherName'].value.trim() : null,
      motherIdCardNo: this.queryForm.controls['motherIdCardNo'].value ? this.queryForm.controls['motherIdCardNo'].value.trim() : null,
      profileName: this.queryForm.controls['profileName'].value ? this.queryForm.controls['profileName'].value.trim() : null,
      birthDate: this.queryForm.controls['birthDate'].value ? DateUtils.getFormatTime(this.queryForm.controls['birthDate'].value, 'YYYY-MM-DD') : null,
      povCode: this.platformService.userInfo['pov'],
      vaccinateStatus: '0',
      pageEntity: {page: 1, pageSize: 999, sortBy: ['createTime,ASC']},
    };
    this.deleteEmptyProperty(param);
    this.regObstetricsService.query(param, resp => {
      if (resp['code'] === 0) {
        this.platformService.waitingQueueDataDisplay = resp['data'];
      }
    });
  }

  switchFlag(event) {
    this.platformService.setCheckVaccineFlag(event);
  }

  reset(flag = false) {
    console.log('flag', flag);
    if (flag) {
      this.initTopic();
    }
    this.resetForm();
    this.search();
  }

  resetForm() {
    this.queryForm = this.fb.group({
      motherName: [null],
      motherIdCardNo: [null],
      profileName: [null],
      birthDate: [null],
      povCode: this.platformService.userInfo['pov'],
      vaccinateStatus: '0'
    });
  }

  deleteEmptyProperty(object) {
    for (const i of Object.keys(object)) {
      const value = object[i];
      if (value === '' || value === null || value === undefined) {
        delete object[i];
      }
    }
  }
}

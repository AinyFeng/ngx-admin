import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {PlanConfigService} from '../../../services/plan-config.service';
import {DateUtils} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-type-two-yearly-audit',
  templateUrl: './type-two-yearly-audit.component.html',
  styleUrls: ['./type-two-yearly-audit.component.scss']
})
export class TypeTwoYearlyAuditComponent implements OnInit {

  tabIndex: number = 0;

  isSHow: boolean = false;

  planYearCode: string;

  total: number = 0;

  page: number = 1;

  pageSize: number = 10;

  queryForm: FormGroup;


  dataSet: any[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              public planConfigService: PlanConfigService) {
  }

  ngOnInit(): void {
    this.resetForm();
    this.query(true);
  }

  query(reset = false, event?: number): void {
    if (reset) {
      this.page = 1;
    } else {
      this.page = event;
    }
    const param = {
      planStatus: this.queryForm.controls['planStatus'].value === 'null' ? null : this.queryForm.controls['planStatus'].value,
      fromOrgCode: this.queryForm.controls['fromOrgCode'].value,
      type: this.queryForm.controls['type'].value,
      quarter: this.queryForm.controls['quarter'].value,
      planDate: this.queryForm.controls['planDate'].value ? DateUtils.getFormatTime(new Date(this.queryForm.controls['planDate'].value), 'YYYY-MM-DD') : null,
      pageEntity: {
        page: this.page,
        pageSize: this.pageSize
      }
    };
    this.planConfigService.queryPlanYearToll(param, resp => {
      console.log('resp====', resp);
      if (resp[0]['code'] === 0 && resp[0]['data'].length > 0) {
        this.dataSet = resp[0]['data'];
      } else {
        this.dataSet = [];
      }
      if (resp[1]['code'] === 0 && resp[1]['data'].length > 0) {
        this.total = resp[1]['data'][0]['count'];
      } else {
        this.total = 0;
      }
    });
  }

  resetForm() {
    this.queryForm = this.fb.group({
      planStatus: ['1'],
      fromOrgCode: [{ value: this.planConfigService.userInfo['pov'], disabled: true }],
      planDate: [null],
      quarter: ['1'],
      type: [null]
    });
  }

  tabIndexChange(event) {
    if (event === 0) {
      this.resetForm();
      this.query(true);
      this.isSHow = false;
    }
  }

  auditPlan(planYearCode) {
    this.isSHow = true;
    this.tabIndex = 1;
    this.planYearCode = planYearCode;
  }

}

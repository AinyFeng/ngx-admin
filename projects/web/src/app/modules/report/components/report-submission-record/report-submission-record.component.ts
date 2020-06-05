import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { REPORT_STATUS, DepartmentInitService, ReportSubmitRecordService, DateUtils } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-report-submission-record',
  templateUrl: './report-submission-record.component.html',
  styleUrls: ['./../report.common.scss']
})
export class ReportSubmissionRecordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  pageSize = 10;
  pageIndex = 1;
  total = 0;

  // 部门
  departmentOption: any;

  // 上报记录结果
  listOfData: any = [];
  // 报表上报状态
  reportStatus = REPORT_STATUS;

  constructor(
    private fb: FormBuilder,
    private departmentInitSvc: DepartmentInitService,
    private reportSubRecordSvc: ReportSubmitRecordService,
  ) { }

  ngOnInit() {
    // 获取科室(部门)
    this.departmentOption = this.departmentInitSvc.getDepartmentData();
    // 初始化表单
    this.form = this.fb.group({
      submissionTime: [null], // 上报时间
      name: [null], // 上报人
      povCode: [null], // 上报科室号
      status: [null] // 上报状态 1成功, 0失败
    });
  }

  // 查询
  queryReportRecord() {
    if (this.loading) return;
    this.loading = true;
    let params = JSON.parse(JSON.stringify(this.form.value));
    if (this.form.get('submissionTime').value) {
      params['date'] = DateUtils.formatToDate(
        this.form.get('submissionTime').value
      );
    }
    let query = {
      date: params.date,
      peo: params.name,
      pov: params.povCode,
      status: params.status
    };
    this.listOfData = [];
    console.log(query);
    this.reportSubRecordSvc.queryReportSubRecords(query, resp => {
      this.loading = false;
      console.log('result', resp);
      if (
        !resp ||
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp.data.length === 0
      ) {
        return;
      }
      this.listOfData = resp.data;
    });
  }

  // 重置
  reset() {
    this.form.reset();
  }
}

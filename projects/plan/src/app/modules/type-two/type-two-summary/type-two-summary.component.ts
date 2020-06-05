import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {DateUtils, FileDownloadUtils, TreeDataApi} from '@tod/svs-common-lib';
import {PlanConfigService} from '../../services/plan-config.service';

@Component({
  selector: 'uea-type-two-summary',
  templateUrl: './type-two-summary.component.html',
  styleUrls: ['./type-two-summary.component.scss']
})
export class TypeTwoSummaryComponent implements OnInit {

  queryForm: FormGroup;

  officeList: any[] = [];

  summaryDetailList: any[] = [];

  list: any[] = [];

  tabList: any[] = [];

  tabIndex: number = 0;

  nodes = [];

  selectedNode: any;

  constructor(private fb: FormBuilder,
              private modalService: NzModalService,
              private message: NzMessageService,
              private treeDataApi: TreeDataApi,
              private el: ElementRef,
              public planConfigService: PlanConfigService) {
    const code: string = this.planConfigService.userInfo['pov'];
    this.treeDataApi.queryTreeDataByCityCode(code.substring(0, 4), resp => {
      if (resp['code'] === 0) {
        this.nodes = resp['data'];
        console.log('nodes', this.nodes);
      }
    });
  }

  ngOnInit(): void {
    this.queryForm = this.fb.group({
      userName: this.planConfigService.userInfo['name'],
      toOrgCode: this.planConfigService.userInfo['pov'],
      areaCode: [this.planConfigService.userInfo['pov']],
      areaName: [this.planConfigService.povInfo['name']],
      planDate: [new Date()],
    });
    this.query();
  }

  query(): void {
    const param = {
      userName: this.planConfigService.userInfo['name'],
      // toOrgCode: this.planConfigService.userInfo['pov'],
      toOrgCode: this.planConfigService.userInfo['pov'],
      areaCode: this.queryForm.controls['areaCode'].value,
      planDate: DateUtils.getFormatTime(this.queryForm.controls['planDate'].value, 'YYYY-MM-DD')
    };
    this.planConfigService.statisticalPlanMonthToll(param, resp => {
      if (resp['code'] === 0) {
        const data = resp['data'];
        this.officeList = data['officeList'];
        this.list = data['list'];
        this.summaryDetailList = data['summaryDetailList'];
      }
      console.log(resp);
    });
  }

  queryTabSet(storeCode?: string): void {
    const param = {
      storeCode: storeCode ? storeCode : this.queryForm.controls['areaCode'].value,
      planDate: DateUtils.getFormatTime(this.queryForm.controls['planDate'].value, 'YYYY-MM-DD')
    };
    this.planConfigService.statisticalBranchPlanMonthToll(param, resp => {
      if (resp['code'] === 0) {
        const data = resp['data'];
        this.tabList = data;
      }
      console.log(resp);
    });
  }

  getNumMonth(row) {
    let sum = 0;
    this.el.nativeElement.querySelectorAll(`.${row}`).forEach(item => {
      sum += Number(item.innerText);
    });
    return sum;
  }

  changeTab(event) {
    if (event > 0) {
      this.queryTabSet(this.officeList[event - 1]['code']);
    } else {
      this.query();
    }
  }

  exportFile() {
    const param = {
      userName: this.planConfigService.userInfo['name'],
      // toOrgCode: this.planConfigService.userInfo['pov'],
      toOrgCode: this.planConfigService.userInfo['pov'],
      fromOrgName: this.planConfigService.povInfo['name'],
      areaCode: this.queryForm.controls['areaCode'].value,
      planDate: DateUtils.getFormatTime(this.queryForm.controls['planDate'].value, 'YYYY-MM-DD')
    };
    this.planConfigService.statisticalExportFilePlanMonthToll(param, (blob, fileName, type) => {
      FileDownloadUtils.downloadFile(blob, type, fileName);
    });
  }
}

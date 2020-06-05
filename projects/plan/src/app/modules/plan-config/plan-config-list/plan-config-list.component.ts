import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { PlanConfigService } from '../../services/plan-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'uea-plan-config-list',
  templateUrl: './plan-config-list.component.html',
  styleUrls: ['./plan-config-list.component.scss']
})
export class PlanConfigListComponent implements OnInit {

  @Output()
  readonly dataChange = new EventEmitter();

  _tabIndex: number;
  @Input()
  set tabIndex(value) {
    this._tabIndex = value;
    if (this._tabIndex === 0) {
      this.resetQueryForm();
      this.query();
    }
  }
  get tabIndex() {
    return this._tabIndex;
  }
  @Output()
  readonly tabIndexChange = new EventEmitter();

  queryForm: FormGroup;

  dataSet: any[] = [];

  total: number = 0;

  page: number = 1;

  pageSize: number = 20;

  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    public planConfigService: PlanConfigService) {
  }

  ngOnInit() {
    this.resetQueryForm();
    this.query();
  }

  query(reset = false, event?: number): void {
    if (reset) {
      this.page = 1;
    } else {
      this.page = event;
    }
    this.queryForm.controls['page'].setValue(this.page);
    const pageEntity = {
      pageEntity: {
        page: this.queryForm.controls['page'].value,
        pageSize: this.queryForm.controls['pageSize'].value,
        sortBy: ['vaccineSubclassCode asc']
      }
    };
    const param = Object.assign({}, pageEntity, this.queryForm.value);
    this.planConfigService.queryPlanConfig(param, resp => {
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

  update(data: any) {
    this.dataChange.emit(data);
    this.tabIndexChange.emit(1);
  }

  delete(data): void {
    this.planConfigService.deletePlanConfig({ planConfigCode: data['planConfigCode'] }, resp => {
      if (resp['code'] === 0 && resp['data']) {
        this.message.success('删除成功！');
        this.query(false, this.page);
      } else {
        this.message.error('删除失败！');
      }
    });
  }

  resetQueryForm() {
    this.queryForm = this.fb.group({
      vaccineSubclassCode: [null],
      vaccineSubclassName: [null],
      type: [null],
      delFlag: ['0'],
      page: this.page,
      pageSize: this.pageSize
    });
  }
}

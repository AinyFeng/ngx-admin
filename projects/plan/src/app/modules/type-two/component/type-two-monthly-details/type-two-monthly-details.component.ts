import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {DateUtils, FileDownloadUtils, SelectDistrictComponent, TreeDataApi} from '@tod/svs-common-lib';
import {PlanConfigService} from '../../../services/plan-config.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'uea-type-two-monthly-details',
  templateUrl: './type-two-monthly-details.component.html',
  styleUrls: ['./type-two-monthly-details.component.scss']
})
export class TypeTwoMonthlyDetailsComponent implements OnInit {
  @Input()
  tabIndex: number;

  @Output()
  readonly tabIndexChange = new EventEmitter();

  // add, edit, view, audit
  @Input()
  action: string = 'add';

  @Input()
  planYearCode: string;

  @Input()
  planMonthCode: string;

  planMonth: any;

  planStatus: string;

  affirmStatus: string;

  isAudit: boolean = false;

  title = 'xxxx年度计划';

  isTitleEdit: boolean = false;

  queryForm: FormGroup;

  dataSet: any[] = [];

  nodes = [];
  selectedNode: any;

  editRealNumMonth: string | null;
  editMemo: string | null;
  @ViewChild('titleInput', { static: false, read: ElementRef }) titleInputElement: ElementRef;
  @ViewChild('realNumMonthInput', { static: false, read: ElementRef }) realNumMonthInput: ElementRef;
  @ViewChild('memoInput', { static: false, read: ElementRef }) memoInputElement: ElementRef;

  @HostListener('window:click', ['$event'])
  handleClick(e: MouseEvent): void {
    if (this.isTitleEdit && this.titleInputElement && this.titleInputElement.nativeElement !== e.target) {
      this.isTitleEdit = false;
    }
    if (this.editRealNumMonth && this.realNumMonthInput && this.realNumMonthInput.nativeElement !== e.target) {
      this.editRealNumMonth = null;
    }
    if (this.editMemo && this.memoInputElement && this.memoInputElement.nativeElement !== e.target) {
      this.editMemo = null;
    }

  }

  constructor(private modalService: NzModalService,
              private fb: FormBuilder,
              private message: NzMessageService,
              private treeDataApi: TreeDataApi,
              public planConfigService: PlanConfigService) {
  }

  ngOnInit(): void {
    this.resetForm();
    if (this.action !== 'add') {
      this.getPlanMonth();
    } else {
      this.getPlanMonthDetailWithYearPlanDetails();
    }
    const code: string = this.planConfigService.userInfo['pov'];
    this.treeDataApi.queryTreeDataByCityCode(code.substring(0, 4), resp => {
      if (resp['code'] === 0) {
        this.nodes = resp['data'];
        console.log('nodes', this.nodes);
      }
    });
  }

  checkPlanMonth() {
    const param = {
      fromOrgCode: this.planConfigService.userInfo.pov,
      planDate: DateUtils.getFormatTime(this.queryForm.controls['planDate'].value, 'YYYY-MM-DD'),
    };
    this.planConfigService.checkPlanMonthToll(param, resp => {
      console.log(resp);
      if (resp['code'] === 0) {
        if (resp['data']) {
          this.message.warning('该月度计划已上报！');
        } else {
          this.savePlan(true);
        }
      }
    });
  }

  getPlanMonthDetailWithYearPlanDetails(event?: any) {
    const param = {
      toOrgCode: this.planConfigService.userInfo['pov'],
      planYearCode: this.planYearCode,
      planDate: DateUtils.getFormatTime(event ? event : new Date(), 'YYYY-MM-DD'),
    };
    this.planConfigService.getPlanMonthTollDetailWithYearPlanDetails(param, resp => {
      if (resp['code'] === 0) {
        this.dataSet = resp['data'];
        const date = event ? event : new Date();
        this.title = `${date.getFullYear()}年${date.getMonth() + 1}月领用计划-${this.planConfigService.povInfo['name']}`;
      }
    });
  }

  getPlanMonth() {
    this.planConfigService.getPlanMonthToll({ planMonthCode: this.planMonthCode }, resp => {
      if (resp['code'] === 0) {
        const data = resp['data'][0];
        this.queryForm = this.fb.group({
          // fromOrgCode: [ {value: this.planConfigService.userInfo['pov'], disabled: true} ],
          fromOrgCode: [{ value: data['fromOrgCode'], disabled: true }],
          fromOrgName: [{ value: data['fromOrgName'], disabled: true }],
          createBy: [{ value: data['createBy'], disabled: this.isDisabled() }],
          toOrgCode: [{ value: data['toOrgCode'] ? data['toOrgCode'] : null, disabled: this.isDisabled() }],
          toOrgName: [{ value: data['toOrgName'] ? data['toOrgName'] : null, disabled: this.isDisabled() }],
          planDate: [{ value: data['planDate'], disabled: this.isDisabled() }],
          affirmStatus: [{ value: data['affirmStatus'] ? data['affirmStatus'] : '0', disabled: false }]
        });
        this.title = `${data['planTitle']}`;
        this.planStatus = data['planStatus'];
        this.affirmStatus = data['affirmStatus'];
        this.planMonth = data;
        this.getMonthDetail();
      }
    });
  }

  getMonthDetail() {
    const param = {
      storeCode: this.planMonth['fromOrgCode'],
      storeName: this.planMonth['fromOrgName'],
      planDate: DateUtils.getFormatTime(this.queryForm.controls['planDate'].value, 'YYYY-MM-DD'),
      planMonthCode: this.planMonthCode
    };
    this.planConfigService.getMonthTollDetail(param, resp => {
      if (resp['code'] === 0) {
        this.dataSet = resp['data'];
      }
    });
  }


  save(check = false) {
    if (check) {
      if (!this.queryForm.controls['toOrgCode'].value) {
        this.message.warning('请选择审核单位！');
      } else {
        this.checkPlanMonth();
      }
    } else {
      this.savePlan();
    }
  }


  exportPlan() {
    const param = {
      areaCode: this.planConfigService.userInfo['pov'],
      storeCode: this.planMonth['fromOrgCode'],
      storeName: this.planMonth['fromOrgName'],
      planDate: DateUtils.getFormatTime(this.queryForm.controls['planDate'].value, 'YYYY-MM-DD'),
      planMonthCode: this.planMonthCode
    };
    this.planConfigService.exportFilePlanMonthToll(param, (blob, fileName, type) => {
      FileDownloadUtils.downloadFile(blob, type, fileName);
    });
  }

  saveAndConfirmPlan() {
    const param = {
      planMonthCode: this.planMonthCode,
      planStatus: '3',
      affirmStatus: this.queryForm.controls['affirmStatus'].value
    };
    this.planConfigService.updatePlanMonthToll(param, resp => {
      if (resp['code'] === 0 && resp['data']) {
        this.message.success('审核成功！');
        this.tabIndexChange.emit(0);
      } else {
        this.message.error('审核失败！');
      }
    });
  }

  accessPlan() {
    const param = {
      planMonthCode: this.planMonthCode,
      planStatus: '2',
    };
    this.planConfigService.updatePlanMonth(param, resp => {
      if (resp['code'] === 0 && resp['data']) {
        this.message.success('审核成功！');
        this.tabIndexChange.emit(0);
      } else {
        this.message.error('审核失败！');
      }
    });
  }

  refusePlan() {
    const param = {
      planMonthCode: this.planMonthCode,
      planStatus: '9'
    };
    this.planConfigService.updatePlanMonth(param, resp => {
      if (resp['code'] === 0 && resp['data']) {
        this.message.success('退回成功！');
        this.tabIndexChange.emit(0);
      } else {
        this.message.error('退回失败！');
      }
    });
  }

  savePlan(isCheck = false, affirmStatus?: string) {
    const isEdit = this.action === 'edit';
    const planMonth = {
      planMonthCode: this.planMonthCode ? this.planMonthCode : null,
      planYearCode: this.planYearCode,
      planTitle: this.title,
      planStatus: affirmStatus ? '2' : (isCheck ? '1' : '0'),
      fromOrgCode: this.queryForm.controls['fromOrgCode'].value,
      fromOrgName: this.queryForm.controls['fromOrgName'].value,
      toOrgCode: this.queryForm.controls['toOrgCode'].value,
      toOrgName: this.queryForm.controls['toOrgName'].value,
      createOrgName: isEdit ? null : this.planConfigService.userInfo['pov'],
      createOrgCode: isEdit ? null : this.planConfigService.userInfo['pov'],
      planDate: DateUtils.getFormatTime(this.queryForm.controls['planDate'].value, 'YYYY-MM-DD HH:mm:ss'),
      type: '2',
      delFlag: '0',
      createBy: !!this.planMonth['createBy'] ? null : this.queryForm.controls['createBy'].value,
      updateBy: this.planConfigService.staffInfo['realName'],
      planBy: isEdit ? null : this.queryForm.controls['createBy'].value,
    };
    this.dataSet.forEach(value => {
      value['createBy'] = isEdit ? null : this.queryForm.controls['createBy'].value;
      value['updateBy'] = this.queryForm.controls['createBy'].value;
    });
    const param = {
      platformPlanMonthToll: planMonth,
      platformPlanMonthTollDetailList: this.dataSet
    };
    this.planConfigService.savePlanMonthToll(param, resp => {
      if (resp.code === 0) {
        if (resp['data']) {
          this.message.success(`${isEdit ? '修改' : '保存'}成功！`);
        } else {
          this.message.error(`${isEdit ? '修改' : '保存'}失败！`);
        }
      } else {
        this.message.error(`${isEdit ? '修改' : '保存'}失败！`);
      }
    });
  }

  editTitle(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isTitleEdit = true;
  }

  startEdit(id: string, type: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (type === 'realNumMonth') {
      this.editRealNumMonth = id;
    } else if (type === 'packNum') {
    } else {
      this.editMemo = id;
    }
  }

  resetForm() {
    this.queryForm = this.fb.group({
      fromOrgCode: [{ value: this.planConfigService.userInfo['pov'], disabled: true }],
      fromOrgName: [{ value: this.planConfigService.povInfo['name'], disabled: true }],
      createBy: [{ value: this.planConfigService.staffInfo['realName'], disabled: this.isDisabled() }],
      toOrgCode: [{ value: null, disabled: this.isDisabled() }],
      toOrgName: [{ value: null, disabled: this.isDisabled() }],
      planDate: [{ value: new Date(), disabled: this.isDisabled() || this.action === 'edit' }],
      affirmStatus: [{ value: '0', disable: false }]
    });
    this.queryForm.controls['fromOrgCode'].disable();
  }

  isDisabled() {
    return this.action === 'audit' || (this.action === 'view' && this.planStatus === '9');
  }

  back() {
    this.tabIndexChange.emit(0);
  }


  selectDistrict() {
    const modal = this.modalService.create({
      nzTitle: '选择单位',
      nzContent: SelectDistrictComponent,
      nzComponentParams: {
        treeData: this.nodes,
        expandAll: false,
        expandedKeys: [this.nodes[0]['key']]
      },
      nzBodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      nzFooter: [
        {
          label: '确定',
          type: 'primary',
          onClick: comp => {
            modal.close(comp['selectedNode']);
          }
        },
        {
          label: '取消',
          type: 'default',
          onClick: () => modal.close()
        }
      ]
    });

    // 订阅关闭时获取的数值
    modal.afterClose.pipe(take(1)).subscribe(res => {
      if (res) {
        this.selectedNode = res;
        // console.log('selectedNode', this.selectedNode['organizationCode']);
        this.queryForm.controls['toOrgCode'].setValue(this.selectedNode['organizationCode']);
        this.queryForm.controls['toOrgName'].setValue(this.selectedNode['title']);
      }
    });
  }

  calculate(row, field) {
    console.log('calculate', row);
    if (field === 'population') {
      row.planNumYear = Math.ceil((row.planPopulation * row.dosage * row.lossFactor) / row.spec);
      row.planNumMonth = Math.ceil((row.planNumYear / row.monthNum) * 1.5);
    }
    if (field === 'month' || field === 'year') {
      row.planNumMonth = Math.ceil((row.planNumYear / row.monthNum) * 1.5);
    }
  }

}

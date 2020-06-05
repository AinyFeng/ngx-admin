import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {
  DateUtils,
  FileDownloadUtils,
  SelectDistrictComponent,
  TreeDataApi
} from '@tod/svs-common-lib';
import {PlanConfigService, PlanStatusPipe} from '../../../services/plan-config.service';
import {take} from 'rxjs/operators';
import {VaccineStockInfoComponent} from '../../../stock-shared/components/vaccine-stock-info/vaccine-stock-info.component';
import {LocalStorageService} from '@tod/ngx-webstorage';
import {LOCAL_STORAGE} from '../../../../../../../svs-common-lib/src/lib/base/localStorage.base';

@Component({
  selector: 'uea-type-two-yearly-details',
  templateUrl: './type-two-yearly-details.component.html',
  styleUrls: ['./type-two-yearly-details.component.scss']
})
export class TypeTwoYearlyDetailsComponent implements OnInit {
  @Input()
  tabIndex: number;

  @Output()
  readonly tabIndexChange = new EventEmitter();

  // add, edit, view, audit
  @Input()
  action: string = 'add';

  @Input()
  planYearCode: string;

  planYear: any;

  planStatus: string;

  title = 'xxxx年度计划';

  isTitleEdit: boolean = false;

  queryForm: FormGroup;

  dataSet: any[] = [];

  nodes = [];
  selectedNode: any;

  editSellPrice: string | null;
  editPlanNumYear: string | null;
  editMemo: string | null;
  @ViewChild('titleInput', {static: false, read: ElementRef}) titleInputElement: ElementRef;
  @ViewChild('sellPriceInput', {static: false, read: ElementRef}) sellPriceInput: ElementRef;
  @ViewChild('yearInput', {static: false, read: ElementRef}) yearInputElement: ElementRef;
  @ViewChild('memoInput', {static: false, read: ElementRef}) memoInputElement: ElementRef;

  @HostListener('window:click', ['$event'])
  handleClick(e: MouseEvent): void {
    if (this.isTitleEdit && this.titleInputElement && this.titleInputElement.nativeElement !== e.target) {
      this.isTitleEdit = false;
    }
    if (this.editSellPrice && this.sellPriceInput && this.sellPriceInput.nativeElement !== e.target) {
      this.editSellPrice = null;
    }
    if (this.editPlanNumYear && this.yearInputElement && this.yearInputElement.nativeElement !== e.target) {
      this.editPlanNumYear = null;
    }
    if (this.editMemo && this.memoInputElement && this.memoInputElement.nativeElement !== e.target) {
      this.editMemo = null;
    }

  }

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};

  currentPageDataChange($event: any[]): void {
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
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
      this.queryPlanYear();
    } else {
      this.changePlanTitle();
    }
    const code: string = this.planConfigService.userInfo['pov'];
    this.treeDataApi.queryTreeDataByCityCode(code.substring(0, 4), resp => {
      if (resp['code'] === 0) {
        this.nodes = resp['data'];
        console.log('nodes', this.nodes);
      }
    });
  }

  checkPlanYear() {
    const param = {
      fromOrgCode: this.planConfigService.userInfo.pov,
      planDate: DateUtils.getFormatTime(this.queryForm.controls['planDate'].value, 'YYYY-MM-DD'),
      quarter: this.queryForm.controls['quarter'].value,
    };
    this.planConfigService.checkPlanYearToll(param, resp => {
      console.log(resp);
      if (resp['code'] === 0) {
        if (resp['data']) {
          this.message.warning('该季度计划已上报！');
        } else {
          this.savePlan(true);
        }
      }
    });
  }

  changePlanTitle() {
    this.title = `${DateUtils.getFormatTime(this.queryForm.controls['planDate'].value, 'YYYY')}年第${this.queryForm.controls['quarter'].value}季度计划-${this.planConfigService.povInfo['name']}`;
  }

  queryPlanYear(planId?: number) {
    this.planConfigService.getPlanYearToll({planYearCode: this.planYearCode}, resp => {
      if (resp['code'] === 0) {
        const data = resp['data'][0];
        this.queryForm = this.fb.group({
          fromOrgCode: [{value: data['fromOrgCode'], disabled: true}],
          fromOrgName: [{value: data['fromOrgName'], disabled: true}],
          planBy: [{value: data['planBy'], disabled: this.isDisabled()}],
          toOrgCode: [{value: data['toOrgCode'] ? data['toOrgCode'] : null, disabled: this.isDisabled()}],
          toOrgName: [{value: data['toOrgName'] ? data['toOrgName'] : null, disabled: this.isDisabled()}],
          planDate: [{value: data['planDate'], disabled: this.isDisabled() || this.action === 'edit'}],
          quarter: [{value: data['quarter'], disabled: this.isDisabled() || this.action === 'edit'}],
        });
        this.planStatus = data['planStatus'];
        this.title = data['planTitle'];
        this.planYear = data;
        this.getPlanYearDetail();
      }
    });
  }

  getPlanYearDetail(planId?: number) {
    const param = {
      storeCode: this.planYear['fromOrgCode'],
      planYearCode: this.planYearCode
    };
    this.planConfigService.getPlanYearTollDetail(param, resp => {
      if (resp['code'] === 0) {
        this.listOfDisplayData = resp.data;
      }
    });
  }

  save(check = false) {
    if (check) {
      if (!this.queryForm.controls['toOrgCode'].value) {
        this.message.warning('请选择审核单位！');
      } else {
        this.checkPlanYear();
      }
    } else {
      this.savePlan();
    }
  }


  exportPlan() {
    const param = {
      areaCode: this.planConfigService.userInfo['pov'],
      storeCode: this.planYear['fromOrgCode'],
      storeName: this.planYear['fromOrgName'],
      planDate: DateUtils.getFormatTime(this.queryForm.controls['planDate'].value, 'YYYY-MM-DD'),
      planYearCode: this.planYearCode
    };
    this.planConfigService.exportFilePlanYearToll(param, (blob, fileName, type) => {
      FileDownloadUtils.downloadFile(blob, type, fileName);
    });
  }

  accessPlan() {
    const param = {
      planYearCode: this.planYearCode,
      planStatus: '2'
    };
    this.planConfigService.updatePlanYearToll(param, resp => {
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
      planYearCode: this.planYearCode,
      planStatus: '9'
    };
    this.planConfigService.updatePlanYearToll(param, resp => {
      if (resp['code'] === 0 && resp['data']) {
        this.message.success('退回成功！');
        this.tabIndexChange.emit(0);
      } else {
        this.message.error('退回失败！');
      }
    });
  }

  savePlan(isCheck = false) {
    const isEdit = this.action === 'edit';
    const planYear = {
      planYearCode: isEdit ? this.planYearCode : null,
      planStatus: isCheck ? '1' : '0',
      planTitle: this.title,
      planBy: isEdit ? null : this.queryForm.controls['planBy'].value,
      createBy: !!this.planYear['createBy'] ? null : this.queryForm.controls['planBy'].value,
      updateBy: this.queryForm.controls['planBy'].value,
      createOrgCode: isEdit ? null : this.planConfigService.userInfo['pov'],
      type: '2',
      delFlag: '0',
      fromOrgCode: this.queryForm.controls['fromOrgCode'].value,
      fromOrgName: this.queryForm.controls['fromOrgName'].value,
      toOrgCode: this.queryForm.controls['toOrgCode'].value,
      toOrgName: this.queryForm.controls['toOrgName'].value,
      quarter: this.queryForm.controls['quarter'].value,
      planDate: DateUtils.getFormatTime(this.queryForm.controls['planDate'].value, 'YYYY-MM-DD HH:mm:ss'),
    };
    this.listOfDisplayData.forEach(value => {
      value['createBy'] = isEdit ? null : this.queryForm.controls['planBy'].value;
      value['updateBy'] = this.queryForm.controls['planBy'].value;
    });
    const param = {
      platformPlanYearToll: planYear,
      platformPlanYearTollDetailList: this.listOfDisplayData
    };
    this.planConfigService.savePlanYearToll(param, resp => {
      if (resp.code === 0) {
        if (resp['data']) {
          this.message.success(`${isEdit ? '修改' : '保存'}成功！`);
          this.back();
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
    switch (type) {
      case 'price':
        this.editSellPrice = id;
        break;
      case 'year':
        this.editPlanNumYear = id;
        break;
      default:
        this.editMemo = id;
        break;
    }
  }

  resetForm() {
    this.queryForm = this.fb.group({
      fromOrgCode: [{value: this.planConfigService.userInfo['pov'], disabled: true}],
      fromOrgName: [{value: this.planConfigService.povInfo['name'], disabled: true}],
      planBy: [{value: this.planConfigService.staffInfo['realName'], disabled: this.isDisabled()}],
      toOrgCode: [{value: null, disabled: this.isDisabled()}],
      toOrgName: [{value: null, disabled: this.isDisabled()}],
      planDate: [{value: new Date(), disabled: this.isDisabled() || this.action === 'edit'}],
      quarter: [{value: '1', disabled: this.isDisabled() || this.action === 'edit'}],
    });
  }

  calculate(row, field) {
    if (field === 'month' || field === 'year') {
      row.planNumMonth = Math.ceil(Number(row.planNumYear) / Number(row.monthNum));
    }
  }

  isDisabled() {
    return this.action === 'audit' || this.action === 'view';
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
        console.log('res', res);
        this.selectedNode = res;
        // console.log('selectedNode', this.selectedNode['organizationCode']);
        this.queryForm.controls['toOrgCode'].setValue(this.selectedNode['organizationCode']);
        this.queryForm.controls['toOrgName'].setValue(this.selectedNode['title']);
      }
    });
  }

  selectVacc() {
    const modal = this.modalService.create({
      nzTitle: '库存列表',
      nzContent: VaccineStockInfoComponent,
      nzComponentParams: {
        selectedVacData: JSON.parse(JSON.stringify(this.listOfDisplayData))
      },
      nzWidth: '1300px',
      nzFooter: null
    });

    modal.afterClose.pipe(take(1)).subscribe(res => {
      if (res) {
        res.forEach(r => {
          const vac = this.listOfDisplayData.find(b => b['id'] === r['id']);
          if (!vac) {
            this.listOfDisplayData.push(r);
          }
        });
        this.listOfDisplayData = [...this.listOfDisplayData];
      }
    });
  }
}

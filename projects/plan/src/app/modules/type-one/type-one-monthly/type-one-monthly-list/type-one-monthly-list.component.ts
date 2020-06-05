import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PlanConfigService } from '../../../services/plan-config.service';
import { DateUtils, SelectDistrictComponent, TreeDataApi } from '@tod/svs-common-lib';
import { take } from 'rxjs/operators';

@Component({
  selector: 'uea-type-one-monthly-list',
  templateUrl: './type-one-monthly-list.component.html',
  styleUrls: ['./type-one-monthly-list.component.scss']
})
export class TypeOneMonthlyListComponent implements OnInit {

  tabIndex: number = 0;
  // 是否展示第二个tab页
  isShow: boolean = false;

  action: string = 'add';

  planYearCode: string;

  planMonthCode: string;

  total: number = 0;

  page: number = 1;

  pageSize: number = 10;

  queryForm: FormGroup;

  dataSet: any[] = [];

  nodes = [];
  selectedNode: any;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private treeDataApi: TreeDataApi,
    public planConfigService: PlanConfigService) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.hasOwnProperty('planYearCode')) {
        this.planYearCode = params['planYearCode'];
        this.isShow = true;
        this.tabIndex = 1;
        this.action = 'add';
      }
    });
  }

  ngOnInit(): void {
    this.queryForm = this.fb.group({
      // this.planConfigService.userInfo['pov']
      planStatus: ['null'],
      areaCode: [this.planConfigService.userInfo['pov']],
      areaName: [this.planConfigService.povInfo['name']],
      planDate: [null],
    });
    this.query();
    const code: string = this.planConfigService.userInfo['pov'];
    this.treeDataApi.queryTreeDataByCityCode(code.substring(0, 4), resp => {
      if (resp['code'] === 0) {
        this.nodes = resp['data'];
        console.log('nodes', this.nodes);
      }
    });
  }

  query(reset = false, event?: number): void {
    if (reset) {
      this.page = 1;
    } else {
      this.page = event;
    }
    const param = {
      planStatus: this.queryForm.controls['planStatus'].value === 'null' ? null : this.queryForm.controls['planStatus'].value,
      areaCode: this.queryForm.controls['areaCode'].value,
      planDate: this.queryForm.controls['planDate'].value ? DateUtils.getFormatTime(new Date(this.queryForm.controls['planDate'].value), 'YYYY-MM-DD') : null,
      pageEntity: {
        page: this.page,
        pageSize: this.pageSize
      }
    };
    this.planConfigService.queryPlanMonth(param, resp => {
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

  update(data) {
    this.isShow = true;
    this.action = 'edit';
    this.planMonthCode = data['planMonthCode'];
    this.planYearCode = data['planYearCode'];
    this.tabIndex = 1;
  }

  view(data) {
    this.isShow = true;
    this.action = 'view';
    this.planMonthCode = data['planMonthCode'];
    this.planYearCode = data['planYearCode'];
    this.tabIndex = 1;
  }

  delete(planMonthCode) {
    this.planConfigService.deletePlanMonth({ planMonthCode: planMonthCode }, resp => {
      console.log(resp);
      if (resp['code'] === 0 && resp['data']) {
        this.message.success('删除成功！');
      } else {
        this.message.error('删除失败！');
      }
    });
  }

  tabIndexChange(event) {
    if (event === 0) {
      this.isShow = false;
      this.query(true);
      this.action = 'edit';
    }
  }

  getTitle() {
    switch (this.action) {
      case 'add':
        return '月度计划填报';
      case 'edit':
        return '月度计划修改';
      case 'view':
        return '月度计划查看';
      default:
        return '月度计划审核';
    }
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
        this.queryForm.controls['areaName'].setValue(this.selectedNode['title']);
        this.queryForm.controls['areaCode'].setValue(this.selectedNode['organizationCode']);
      }
    });
  }
}

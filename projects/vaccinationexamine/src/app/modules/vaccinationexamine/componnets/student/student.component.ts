import { SelectSchoolComponent } from './../select-school/select-school.component';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  DicDataService,
  ApiReportNationSixOneService,
  DateUtils,
  FileDownloadUtils,
  FILE_TYPE, FILE_TYPE_SUFFIX,
  VaccRecordTransformService,
  VaccExamineApi
} from '@tod/svs-common-lib';
import { FormBuilder } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService, NzTreeNodeOptions } from 'ng-zorro-antd';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { AppStateService } from '../../../../@uea/service/app.state.service';

@Component({
  selector: 'uea-student-component',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, OnDestroy {

  loading = false;
  allChecked: boolean = true;
  nodes: any = SelectSchoolComponent.sampleNodes;
  detailTitle: string = '请在左侧选择班级';

  listOfData: any[] = StudentComponent.sampleListOfData;
  displayData: any[] = [];
  userInfo: any;
  povInfo = {
    curProvCode: '',
    curCityCode: '',
    curDistrictCode: ''
  };

  constructor(
    // private apiReportNationSixOneService: ApiReportNationSixOneService,
    private dicSvc: DicDataService,
    private fb: FormBuilder,
    private userSvc: UserService,
    private msg: NzMessageService,
    private dialogSvc: NbDialogService,
    // private transformPovNameSvc: VaccRecordTransformService
    private vaccExaminApi: VaccExamineApi,
    private appStateService: AppStateService,
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      // 获取当前地区-市-区
      this.getCurDistrictCode();
    });
  }

  ngOnInit() {
    this.appStateService.setSubTitle('学生管理');
    this.querySchool();
  }

  @ViewChild('schoolTree', { static: false }) schoolTree: SelectSchoolComponent;
  querySchool() {
    const myPovCode = this.userInfo.pov;
    const params = {
      // belongPovCode: myPovCode
    };
    this.vaccExaminApi.querySchoolListByBelongPovCode(params, resp => {

      if (!resp || resp.code !== 0 || !resp.hasOwnProperty('data')) {
        return;
      }
      console.log('resp.data=', resp.data);
      console.log('this.povInfo=', this.povInfo);
      let tmpNodes: NzTreeNodeOptions = {
        title: myPovCode,
        key: myPovCode,
        expanded: true,
        children: []
      };
      for (let i = 0; i < resp.data.length; i++) {
        let tmpSubNode: NzTreeNodeOptions = {
          title: resp.data[i].schoolName,
          key: resp.data[i].schoolCode,
          expanded: true,
          children: []
        };
        tmpNodes.children.push(tmpSubNode);
      }
      tmpNodes.selected = true;
      this.nodes = [tmpNodes];
    });
  }

  onSelectClassNode(event) {
    // console.log(event);
    this.detailTitle = `${event.title}[${event.key}]`;
  }

  /**
   * 获取登录用户所在 pov的前6位，使用前六位的数字作为当前地区的编码
   */
  getCurDistrictCode() {
    if (this.userInfo.pov) {
      this.povInfo['curProvCode'] = this.userInfo.pov.substring(0, 2) + '0000';
      this.povInfo['curCityCode'] = this.userInfo.pov.substring(0, 4) + '00';
      this.povInfo['curDistrictCode'] = this.userInfo.pov.substring(0, 6);
    }
  }

  currentPageDataChange($event: any[]): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const validData = this.displayData.filter(value => !value.disabled);
    const allChecked = validData.length > 0 && validData.every(value => value.checked === true);
    const allUnChecked = validData.every(value => !value.checked);
    this.allChecked = allChecked;
    // this.indeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  /*查询数据*/
  queryData() {
    if (this.loading) return;
    // let query = JSON.parse(JSON.stringify(this.form.value));
    // if (this.form.get('years').value) {
    //   query['years'] = DateUtils.getFormatDateTime(this.form.get('years').value).slice(0, 7);
    // }
    // this.year = DateUtils.getFormatDateTime(this.form.get('years').value).slice(0, 4);
    // this.month = DateUtils.getFormatDateTime(this.form.get('years').value).slice(5, 7);
    const params = {
      // yearMonthInoculates: [query.years],
      // reside: query.residentialType,
      povCode: this.userInfo.pov,
      // displayTypes: query.showType === '' ? null : query.showType
    };
    this.loading = true;
    this.listOfData = [];
    // this.apiReportNationSixOneService.statisticsSixOneData(params, resp => {
    //   this.loading = false;
    //   if (resp && resp.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
    //     let fianllist = [];
    //     let dlist = [];
    //     for (let i = 0; i < resp.data.length; i++) {
    //       if (i % 10 === 0 && i !== 0) {
    //         fianllist.push(dlist);
    //         dlist = [];
    //         dlist.push(resp.data[i]);
    //       } else {
    //         dlist.push(resp.data[i]);
    //       }
    //     }
    //     if (dlist.length > 0) {
    //       fianllist.push(dlist);
    //     }
    //     this.listOfData = fianllist;
    //   }
    // });
  }

  // 上报查询
  reported() {
    if (this.loading) return;
    const params = {
      // yearMonthInoculate: DateUtils.getFormatDateTime(this.form.get('years').value).slice(0, 7),
      povCode: this.userInfo.pov,
    };
    this.loading = true;
    // this.apiReportNationSixOneService.querySixOneReport(params, resp => {
    //   this.loading = false;
    //   if (resp && resp.code === 0) {
    //     this.msg.info(resp.data);
    //     return;
    //   } else {
    //     this.msg.warning('上报失败');
    //     return;
    //   }
    // });
  }

  // 导出报表
  exportStudent() {
    /*let povName = '';
    this.transformPovNameSvc.transformPovName(this.userInfo.pov).subscribe(resp => {
      if (resp) {
        povName = resp;
      }
    });*/
    this.dialogSvc.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认导出',
        content: '是否确认导出此报表?'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        const params = {
          // yearMonthInoculates: [DateUtils.getFormatDateTime(this.form.get('years').value).slice(0, 7)],
          povCode: this.userInfo.pov,
          // displayTypes: this.form.get('showType').value === '' ? null : this.form.get('showType').value
        };
        console.log(params);
        // this.apiReportNationSixOneService.querySixOneExport(params, resp => {
        //   // console.log(resp);
        //   FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '国家报表6-1_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        // });
      }
    });
  }

  ngOnDestroy() {
    this.appStateService.clearSubTitle();
  }

  private static sampleListOfData = [
    {
      key: '1',
      name: '刘沐晴',
      gender: '女',
      birthdate: '2017-09-03',
      city: '340100',
      district: '340101',
      pov: '3401020150',
      school: '凤阳县实验小学',
      classes: '一年级三班',
      entrytime: '2019',
      done: false,
      unreceived: '脊灰疫苗[1]',
      mobile: '13910901234',
      importtime: '2020-01-01',
    },
    {
      key: '2',
      name: '刘沐晴',
      gender: '女',
      birthdate: '2017-09-03',
      city: '340100',
      district: '340101',
      pov: '3401020150',
      school: '凤阳县实验小学',
      classes: '一年级三班',
      entrytime: '2019',
      done: false,
      unreceived: '脊灰疫苗[1]',
      mobile: '13910901234',
      importtime: '2020-01-01',
    },
    {
      key: '3',
      name: '刘沐晴',
      gender: '女',
      birthdate: '2017-09-03',
      city: '340100',
      district: '340101',
      pov: '3401020150',
      school: '凤阳县实验小学',
      classes: '一年级三班',
      entrytime: '2019',
      done: false,
      unreceived: '脊灰疫苗[1]',
      mobile: '13910901234',
      importtime: '2020-01-01',
    }
  ];
  searchProfile() { }
  importStudents() { }
  exportStudents() { }
  searchContent: any;
}

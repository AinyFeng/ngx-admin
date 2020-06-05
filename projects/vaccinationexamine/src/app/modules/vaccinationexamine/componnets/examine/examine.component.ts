import { AppStateService } from '../../../../@uea/service/app.state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  DicDataService,
  ApiReportNationSixOneService,
  DateUtils,
  FileDownloadUtils,
  FILE_TYPE, FILE_TYPE_SUFFIX,
  VaccRecordTransformService
} from '@tod/svs-common-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { SelectSchoolComponent } from '../select-school/select-school.component';


@Component({
  selector: 'uea-examine-component',
  templateUrl: './examine.component.html',
  styleUrls: ['./examine.component.scss']
})
export class ExamineComponent implements OnInit, OnDestroy {

  nodes: any = SelectSchoolComponent.sampleNodes;
  detailTitle: string = '请在左侧选择班级';

  form: FormGroup;
  /*years = YEARS;
  months = MONTHS;*/
  loading = false;

  // 居住类型数据
  residentialTypeData: any;
  // 默认居住类型为本地
  residentialType = '本地';
  listOfData: any[] = [];
  currentDate = new Date();
  year: any;
  month: any;

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
    private appStateService: AppStateService,
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      // 获取当前地区-市-区
      this.getCurDistrictCode();
    });
  }

  ngOnInit() {
    this.appStateService.setSubTitle('接种查验管理');
    // 获取居住类型
    this.residentialTypeData = this.dicSvc.getDicDataByKey('residentialType');
    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth();

    this.form = this.fb.group({
      years: [new Date(this.year, this.month - 1), null],
      residentialType: ['1', null], // 居住类型 1	本地2	外来3	流动
      showType: ['0', null] // 显示类型 0 - 居委名称;1 - 居住属性; 2 - 常规修订
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

  // 改变类型
  onChange(ev) {
    this.residentialTypeData.forEach(item => {
      if (item.value === ev) {
        this.residentialType = item.label;
      }
    });
  }

  /*查询数据*/
  queryData() {
    if (this.loading) return;
    let query = JSON.parse(JSON.stringify(this.form.value));
    if (this.form.get('years').value) {
      query['years'] = DateUtils.getFormatDateTime(this.form.get('years').value).slice(0, 7);
    }
    this.year = DateUtils.getFormatDateTime(this.form.get('years').value).slice(0, 4);
    this.month = DateUtils.getFormatDateTime(this.form.get('years').value).slice(5, 7);
    const params = {
      yearMonthInoculates: [query.years],
      reside: query.residentialType,
      povCode: this.userInfo.pov,
      displayTypes: query.showType === '' ? null : query.showType
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
      yearMonthInoculate: DateUtils.getFormatDateTime(this.form.get('years').value).slice(0, 7),
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
  exportSixOne() {
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
          yearMonthInoculates: [DateUtils.getFormatDateTime(this.form.get('years').value).slice(0, 7)],
          povCode: this.userInfo.pov,
          displayTypes: this.form.get('showType').value === '' ? null : this.form.get('showType').value
        };
        console.log(params);
        // this.apiReportNationSixOneService.querySixOneExport(params, resp => {
        //   // console.log(resp);
        //   FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '国家报表6-1_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        // });
      }
    });
  }
  searchContent: any;
  searchProfile() { }
  importStudents() { }
  exportStudents() { }
  ngOnDestroy() {
    this.appStateService.clearSubTitle();
  }

}

import { VEClassesTableComponent } from './../veclassestable/veclassestable.component';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  DateUtils,
  VaccExamineApi,
  YEARS,
  MONTHS
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { AppStateService } from '../../../../@uea/service/app.state.service';
import { ExcelService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-school-component',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit, OnDestroy {

  nodes: any = [];
  onlyFromCurrentPov: boolean = true;
  detailTitle: string = '当前所属门诊';

  years = YEARS;
  months = MONTHS;
  loading = false;



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
    private userSvc: UserService,
    private msg: NzMessageService,
    private dialogSvc: NbDialogService,
    private vaccExaminApi: VaccExamineApi,
    private appStateService: AppStateService,
    private excelService: ExcelService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      // 获取当前地区-市-区
      this.getCurDistrictCode();
    });
  }

  ngOnInit() {
    this.appStateService.setSubTitle('学校管理');
    this.querySchool();

    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth();
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

  @ViewChild('veClassTableComponent', { static: false }) veClassTableComponent: VEClassesTableComponent;

  onModeChange(event) {
    this.querySchool();
  }
  querySchool() {
    const myPovCode = this.userInfo.pov;
    const params = {
      belongPovCode: this.onlyFromCurrentPov ? myPovCode : ''
    };
    this.vaccExaminApi.querySchoolListByBelongPovCode(params, resp => {

      if (!resp || resp.code !== 0 || !resp.hasOwnProperty('data')) {
        return;
      }
      this.listOfData = resp.data;
    });
  }

  search() {
    this.veClassTableComponent.search();
  }

  // 导出学校数据
  exportStudents() {
    const myPovCode = this.userInfo.pov;
    let myPovName = this.veClassTableComponent.title;
    if (!myPovName) myPovName = myPovCode;

    let scope: string = this.onlyFromCurrentPov ? myPovName : '全部门诊';

    this.dialogSvc.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认导出',
        content: '是否确认导出【' + `${scope}` + '】所属的学校数据？'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        this.excelService.exportAsExcelFile(this.listOfData, `【${scope}】所属学校数据清单` + DateUtils.getNewDateTime());
      }
    });
  }

  searchContent: any;
  searchProfile() { }
  importStudents() { }
  ngOnDestroy() {
    this.appStateService.clearSubTitle();
  }

}

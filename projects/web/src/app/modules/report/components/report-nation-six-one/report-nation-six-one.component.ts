import { Component, OnInit } from '@angular/core';
import {
  DicDataService,
  ApiReportNationSixOneService,
  DateUtils,
  FileDownloadUtils,
  FILE_TYPE, FILE_TYPE_SUFFIX,
  VaccRecordTransformService,
  PovStaffInitService, LodopPrintService
} from '@tod/svs-common-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';
import {DetailChildCaseComponent} from '../dialog/detail-child-case/detail-child-case.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'uea-report-nation-six-one',
  templateUrl: './report-nation-six-one.component.html',
  styleUrls: ['./report-nation-six-one.component.scss']
})
export class ReportNationSixOneComponent implements OnInit {
  form: FormGroup;
  /*years = YEARS;
  months = MONTHS;*/
  loading = false;

  // 居住类型数据
  residentialTypeData: any;
  // 默认居住类型为本地(需求更改 :默认为合计)
  residentialType = '合计';
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
  // 行政区划
  division: any;
  // 人名
  staffName: any;

  // 加载lodop 错误信息
  closeAlert = false;
  // 订阅集合
  private subScription: Subscription[] = [];
  constructor(
    private apiReportNationSixOneService: ApiReportNationSixOneService,
    private dicSvc: DicDataService,
    private fb: FormBuilder,
    private userSvc: UserService,
    private msg: NzMessageService,
    private dialogSvc: NbDialogService,
    private transformPovNameSvc: VaccRecordTransformService,
    private povInitSvc: PovStaffInitService,
    private modalSvc: NzModalService,
    private lodopPrintSvc: LodopPrintService,
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => {
      if (user) {
        this.userInfo = user;
        this.staffName = this.povInitSvc.getPovStaffData(this.userInfo.userCode)[0].realName;
        console.log('staffName', this.povInitSvc.getPovStaffData(this.userInfo.userCode));
        // 获取当前地区-市-区
        this.getCurDistrictCode();
      }
    });
    // 初始化打印机
    const sub = this.lodopPrintSvc.getLodopStatus().subscribe(show => (this.closeAlert = show));
    this.subScription.push(sub);
  }

  ngOnInit() {
    // 获取居住类型
    this.residentialTypeData = this.dicSvc.getDicDataByKey('residentialType');
    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth() + 1;

    this.form = this.fb.group({
      years: [new Date(this.year, this.month - 1), null],
      residentialType: ['', null], // 居住类型 1	本地2	外来3	流动, ''合计
      showType: ['', null] // 显示类型 0 - 居委名称;1 - 居住属性; '' - 常规修订 默认设置为常规修订
    });
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
    for (const key in this.povInfo) {
      if (this.povInfo.hasOwnProperty(key)) {
        this.transformPovNameSvc.transformAdministrativeName(this.povInfo[key]).subscribe(res => {
          console.log('res', res);
          if (this.division) {
            this.division += res;
          } else {
            this.division = res;
          }
        });
      }
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
    this.apiReportNationSixOneService.queryDateList(params, resp => {
      this.loading = false;
      if (resp && resp.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        let fianllist = [];
        let dlist = [];
        for (let i = 0; i < resp.data.length; i++) {
          if (i % 10 === 0 && i !== 0) {
            fianllist.push(dlist);
            dlist = [];
            dlist.push(resp.data[i]);
          } else {
            dlist.push(resp.data[i]);
          }
        }
        if (dlist.length > 0) {
          fianllist.push(dlist);
        }
        this.listOfData = fianllist;
      } else {
        this.msg.warning(`${resp.msg}`);
        return;
      }
      // console.log('结果数据', resp.data);
    });
  }

  // 上报查询
  reported() {
    if (this.loading) return;
    const params = {
      yearMonthInoculate: DateUtils.getFormatDateTime(this.form.get('years').value).slice(0, 7),
      povCode: this.userInfo.pov,
    };
    this.loading = true;
    console.log('上报', params);
    this.apiReportNationSixOneService.querySixOneReport(params, resp => {
      this.loading = false;
      console.log(resp);
      if (resp && resp.code === 0) {
        this.msg.info(resp.data);
        return;
      } else {
        this.msg.warning('上报失败');
        return;
      }
    });
  }

  // 导出报表
  exportSixOne() {
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
          displayTypes: this.form.get('showType').value === '' ? null : this.form.get('showType').value,
          reside: this.form.get('residentialType').value,
          division: this.division, // 行政区
          applicant: this.staffName // 填报人
        };
        console.log(params);
        this.apiReportNationSixOneService.querySixOneExport(params, resp => {
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '国家报表6-1_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

  // 打印(先预览,再打印)
  printSixOne(preview: boolean, printId: string) {
    if (this.loading) return;
    this.loading = true;
    if (this.listOfData.length === 0) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: '没有数据，请先执行查询操作',
        nzMaskClosable: true
      });
      this.loading = false;
      return;
    }
    // console.log('打印机是否加载成功', this.closeAlert);
    if (this.closeAlert) {
      this.loading = false;
      return;
    }
    if (printId === '' || printId === undefined) {
      this.msg.info('没有内容，无法打印');
      this.loading = false;
      return;
    }
    this.lodopPrintSvc.print(preview, printId, 20, 10, '100%', '100%');
    this.loading = false;


  }

  /**
   * 查看详情
   * @param data 此行数据
   * @param value 疫苗名称
   * @param ele 具体的值
   */
  checkDetail(data, value, ele) {
    console.log(data);
    console.log(value);
    console.log('ele', ele);
    if (ele !== 0) {
      this.dialogSvc.open(DetailChildCaseComponent, {
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          data: data,
          type: value,
          formData: JSON.parse(JSON.stringify(this.form.value)), // 表单的数据
        }
      }).onClose.subscribe(resp => {
        console.log(resp);
      });
    }
  }
  // 预览全部
  previewAll() {
    if (this.loading) return;
    this.loading = true;
    this.dialogSvc.open(DetailChildCaseComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        formData: JSON.parse(JSON.stringify(this.form.value)), // 表单的数据
      }
    }).onClose.subscribe(resp => {
      console.log(resp);
    });
    this.loading = false;
  }


}

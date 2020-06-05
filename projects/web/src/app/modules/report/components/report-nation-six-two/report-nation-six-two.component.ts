import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
  ApiReportNationSixTwoService,
  DateUtils,
  FILE_TYPE,
  FileDownloadUtils,
  FILE_TYPE_SUFFIX,
  LodopPrintService
} from '@tod/svs-common-lib';
import {UserService} from '@tod/uea-auth-lib';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ConfirmDialogComponent} from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import {NbDialogService} from '@nebular/theme';
import {Subscription} from 'rxjs';

@Component({
  selector: 'uea-report-nation-six-two',
  templateUrl: './report-nation-six-two.component.html',
  styleUrls: ['./../report.common.scss']
})
export class ReportNationSixTwoComponent implements OnInit {

  userInfo: any;
  povInfo = {
    curProvCode: '',
    curCityCode: '',
    curDistrictCode: ''
  };
  listOfData: any[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  form: FormGroup;
  currentDate = new Date();
  year: any;
  month: any;

  // 加载lodop 错误信息
  closeAlert = false;
  // 订阅集合
  private subScription: Subscription[] = [];

  constructor(
    private apiReportNationSixTwoService: ApiReportNationSixTwoService,
    private userSvc: UserService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private dialogSvc: NbDialogService,
    private lodopPrintSvc: LodopPrintService,
    private modalSvc: NzModalService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      // 获取当前地区-市-区
      this.getCurDistrictCode();
    });
    // 初始化打印机
    const sub = this.lodopPrintSvc.getLodopStatus().subscribe(show => (this.closeAlert = show));
    this.subScription.push(sub);
  }

  ngOnInit() {
    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth() + 1;
    this.form = this.fb.group({
      yearAndMonth: [new Date(this.year, this.month - 1)]
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
  }

  /*查询数据*/
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    this.year = DateUtils.getFormatDateTime(this.form.get('yearAndMonth').value).slice(0, 4);
    this.month = DateUtils.getFormatDateTime(this.form.get('yearAndMonth').value).slice(5, 7);
    const param = {
      povCode: this.userInfo.pov,
      yearMonths: [DateUtils.formatToDate(this.form.get('yearAndMonth').value).slice(0, 7)],
    };
    this.listOfData = [];
    this.apiReportNationSixTwoService.queryDateList(param, resp => {
      if (resp && resp.code === 0) {
        let fianllist = [];
        let dlist = [];
        for (let i = 0; i < resp.data.length; i++) {
          if (i % 2 === 0 && i !== 0) {
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
      }
    });
  }

  // 上报6-2数据
  reportSixTow() {
    if (this.loading) return;
    const params = {
      povCode: this.userInfo.pov,
      yearMonth: DateUtils.formatToDate(this.form.get('yearAndMonth').value).slice(0, 7),
    };
    this.loading = true;
    console.log('参数', params);
    this.apiReportNationSixTwoService.querySixTowReport(params, resp => {
      console.log('6-2上报', resp);
      this.loading = false;
      if (resp && resp.code === 0) {
        this.msg.info(resp.data);
      } else {
        this.msg.warning('上报失败');
        return;
      }

    });


  }

  // 导出6-2数据
  exportSixTow() {
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
          povCode: this.userInfo.pov,
          yearMonths: [DateUtils.formatToDate(this.form.get('yearAndMonth').value).slice(0, 7)],
          // unitName: povName,
        };
        console.log('参数', params);
        this.apiReportNationSixTwoService.querySixTwoExport(params, resp => {
          // console.log('结果', resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '国家报表6-2_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);

        });
      }
    });


  }

  // 打印(先预览,再打印)
  printSixTwo(preview: boolean, printId: string) {
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
    if (this.closeAlert) {
      this.loading = false;
      return;
    }
    if (printId === '' || printId === undefined) {
      this.msg.info('没有内容，无法打印');
      this.loading = false;
      return;
    }
    this.lodopPrintSvc.print(preview, printId, 20, 10, '98%', '100%');
    this.loading = false;

  }
}

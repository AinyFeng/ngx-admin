import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbDialogService} from '@nebular/theme';
import {FPickVaccineComponent} from '../f-pick-vaccine/f-pick-vaccine.component';
import {
  ApiReportNationSixOneService,
  YEARS, MONTHS, DateUtils,
  FileDownloadUtils, FILE_TYPE,
  FILE_TYPE_SUFFIX,
  LodopPrintService
} from '@tod/svs-common-lib';
import {UserService} from '@tod/uea-auth-lib';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ConfirmDialogComponent} from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import {DetailChildCaseComponent} from '../dialog/detail-child-case/detail-child-case.component';
import {ConfigService} from '@ngx-config/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'uea-report-nation-six-one-sum',
  templateUrl: './report-nation-six-one-sum.component.html',
  styleUrls: ['./../report.common.scss']
})
export class ReportNationSixOneSumComponent implements OnInit, OnDestroy {

  selectedVaccine = {selectName: '', selectCode: '', selectAcronym: '', aliasName: []};

  listOfData: any[] = [];
  sumData: any[] = [];
  loading = false;

  years = YEARS;
  months = MONTHS;
  // 显示的类型
  showType = '0';
  year: any;
  monthStart: any;
  monthEnd: any;

  zero = true;
  lessThen = false;
  userInfo: any;

  // 选择的月份的组合数据
  yearMonthInoculates: any;

  // sum6-1的json数据
  sumDate: any;

  // 加载lodop 错误信息
  closeAlert = false;
  // 订阅集合
  private subScription: Subscription[] = [];

  constructor(
    private dialogService: NbDialogService,
    private apiReportNationSixOneService: ApiReportNationSixOneService,
    private userSvc: UserService,
    private msg: NzMessageService,
    private dialogSvc: NbDialogService,
    private configService: ConfigService,
    private modalSvc: NzModalService,
    private lodopPrintSvc: LodopPrintService,
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
    this.sumDate = this.configService.getSettings('report.VaccinePickerDataSum61');
    // console.log('6-1的疫苗', this.sumDate);
    this.sumDate.forEach(item => item.selected = false);

    // 初始化打印机
    const sub = this.lodopPrintSvc.getLodopStatus().subscribe(show => (this.closeAlert = show));
    this.subScription.push(sub);

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subScription.forEach(sub => sub.unsubscribe());
  }


  /*选择疫苗操作*/
  selectVac() {
    this.dialogService.open(FPickVaccineComponent, {
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
      context: {
        groupType: 'sum61'
      },
    }).onClose.subscribe(resp => {
      console.log('选择的疫苗', resp);
      if (resp) {
        this.selectedVaccine = resp;
      }
    });
  }

  /*查询数据*/
  queryData() {
    if (this.loading) return;
    if (!this.year) {
      this.msg.warning('请选择需要统计的年份');
      return;
    }
    if (!this.selectedVaccine.selectCode.length) {
      this.msg.warning('请选择疫苗');
      return;
    }
    // 开始月大于终止月
    const yearMonthInoculates = [];
    if (this.monthStart && this.monthEnd) {
      if (Number(this.monthStart) > Number(this.monthEnd)) {
        for (let i = 0; i <= (this.monthStart - this.monthEnd); i++) {
          const month = Number(this.monthEnd) + i;
          let date;
          if (month < 10) {
            date = this.year + '-' + '0' + month;
          } else {
            // console.log('10', month);
            date = this.year + '-' + month;
            // console.log(date);
          }
          yearMonthInoculates.push(date);
        }
      } else {
        for (let i = 0; i <= (this.monthEnd - this.monthStart); i++) {
          const month = Number(this.monthStart) + i;
          let date;
          if (month < 10) {
            date = this.year + '-' + '0' + month;
          } else {
            date = this.year + '-' + month;
          }
          yearMonthInoculates.push(date);
        }
      }
    } else {
      this.msg.warning('请选择月份范围');
      return;
    }
    let params = {
      yearMonthInoculates: [...yearMonthInoculates],
      displayTypes: this.showType ? this.showType : null,
      povCode: this.userInfo.pov,
      vaccName: [...this.selectedVaccine.aliasName],
    };
    this.listOfData = [];
    this.sumData = [];
    this.loading = true;
    // 只要统计都要将只显示0值勾选
    this.zero = true;
    console.log('参数', params);
    this.yearMonthInoculates = [];
    this.yearMonthInoculates = [...yearMonthInoculates];
    this.apiReportNationSixOneService.queryDateSumList(params, resp => {
      console.log('查询结果', resp);
      this.loading = false;
      if (resp && resp.code === 0) {
        this.sumData = resp.data;
        if (this.lessThen) {
          this.listOfData = JSON.parse(JSON.stringify(resp.data));
          if (this.listOfData.length) {
            for (let i = 0; i < this.listOfData.length; i++) {
              const ele = this.listOfData[i];
              for (const key in ele) {
                if (ele.hasOwnProperty(key)) {
                  const str = key.substring(key.length - 4); // 后缀
                  const pre = key.substring(0, key.length - 4); // 前缀
                  const one = pre + 're_s';
                  const two = pre + 'sh_s';
                  if (str === 'sr_s') {
                    if ((parseFloat(ele[key])) >= 80) {
                      ele[key] = '';
                      ele[one] = '';
                      ele[two] = '';
                    }
                  }
                }
              }
            }
          }

        } else {
          this.listOfData = [];
          this.listOfData = JSON.parse(JSON.stringify(this.sumData));
        }
      }

    });
  }

  // 显示0值
  showZero(event) {
    this.zero = event;
    if (!this.zero) {
      if (this.listOfData.length) {
        for (let i = 0; i < this.listOfData.length; i++) {
          const item = this.listOfData[i];
          for (const key in item) {
            if (item.hasOwnProperty(key)) {
              if (item[key] === '0') {
                item[key] = '';
              }
            }
          }
        }
      }
    } else {
      this.listOfData = JSON.parse(JSON.stringify(this.sumData));
    }
  }

  // >80%
  showLess(event) {
    this.lessThen = event;
    if (this.lessThen) {
      if (this.listOfData.length) {
        for (let i = 0; i < this.listOfData.length; i++) {
          const ele = this.listOfData[i];
          for (const key in ele) {
            if (ele.hasOwnProperty(key)) {
              const str = key.substring(key.length - 4);
              const pre = key.substring(0, key.length - 4);
              const one = pre + 're_s';
              const two = pre + 'sh_s';
              if (str === 'sr_s') {
                if (parseFloat(ele[key]) >= 80) {
                  ele[key] = '';
                  ele[one] = '';
                  ele[two] = '';
                }
              }
            }
          }
        }
      }
    } else {
      this.listOfData = [];
      this.listOfData = JSON.parse(JSON.stringify(this.sumData));
    }
  }

  // 导出
  exportSum() {
    if (!this.year) {
      this.msg.warning('请选择需要统计的年份');
      return;
    }
    if (!this.selectedVaccine.selectCode.length) {
      this.msg.warning('请选择疫苗');
      return;
    }
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
        // 开始月大于终止月
        const yearMonthInoculates = [];
        if (this.monthStart && this.monthEnd) {
          if (Number(this.monthStart) > Number(this.monthEnd)) {
            for (let i = 0; i <= (this.monthStart - this.monthEnd); i++) {
              const month = Number(this.monthEnd) + i;
              let date;
              if (month < 10) {
                date = this.year + '-' + '0' + month;
              } else {
                console.log('10', month);
                date = this.year + '-' + month;
                console.log(date);
              }
              yearMonthInoculates.push(date);
            }
          } else {
            for (let i = 0; i <= (this.monthEnd - this.monthStart); i++) {
              const month = Number(this.monthStart) + i;
              let date;
              if (month < 10) {
                date = this.year + '-' + '0' + month;
              } else {
                date = this.year + '-' + month;
              }
              yearMonthInoculates.push(date);
            }
          }
        } else {
          this.msg.warning('请选择月份范围');
          return;
        }
        let params = {
          yearMonthInoculates: [...yearMonthInoculates],
          displayTypes: this.showType ? this.showType : null,
          povCode: this.userInfo.pov,
          vaccName: [...this.selectedVaccine.aliasName],
        };
        console.log(params);
        this.apiReportNationSixOneService.querySixOneExportSum(params, resp => {
          // console.log(resp);
          if (resp && resp.code === 0 && resp.hasOwnProperty('data') && resp.data.length === 0) {

          } else {
            FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '国家报表6-1汇总_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
          }
        });
      }
    });
  }
  /**
   * 查看详情
   * @param data 郑
   * @param type
   * @param value
   */
  checkDetail(data, type, value) {
    // console.log('data', data);
    // console.log('value', value);
    const formData = {
      yearMonthInoculates: this.yearMonthInoculates,
      showType: this.showType,
      vaccName: [...this.selectedVaccine.aliasName]
    };
    if (value !== 0) {
      this.dialogSvc.open(DetailChildCaseComponent, {
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          data: data,
          type: value,
          conditions: formData, // 表单的数据
        }
      }).onClose.subscribe(resp => {
        console.log(resp);
      });
    }
  }
  // 预览全部
  previewAll() {
    if (this.loading) return;
    if (!this.year) {
      this.msg.warning('请选择需要统计的年份');
      return;
    }
    // 开始月大于终止月
    let yearMonthInoculate = [];
    if (this.monthStart && this.monthEnd) {
      if (Number(this.monthStart) > Number(this.monthEnd)) {
        for (let i = 0; i <= (this.monthStart - this.monthEnd); i++) {
          const month = Number(this.monthEnd) + i;
          let date;
          if (month < 10) {
            date = this.year + '-' + '0' + month;
          } else {
            console.log('10', month);
            date = this.year + '-' + month;
            console.log(date);
          }
          yearMonthInoculate.push(date);
        }
      } else {
        for (let i = 0; i <= (this.monthEnd - this.monthStart); i++) {
          const month = Number(this.monthStart) + i;
          let date;
          if (month < 10) {
            date = this.year + '-' + '0' + month;
          } else {
            date = this.year + '-' + month;
          }
          yearMonthInoculate.push(date);
        }
      }
    } else {
      this.msg.warning('请选择月份范围');
      return;
    }
    const formData = {
      yearMonthInoculates: [...yearMonthInoculate],
      showType: this.showType,
      vaccName: [...this.selectedVaccine.aliasName]
    };
    this.loading = true;
    this.dialogSvc.open(DetailChildCaseComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        conditions: formData, // 表单的数据
      }
    }).onClose.subscribe(resp => {
      console.log(resp);
    });
    this.loading = false;
  }

  // 打印(先预览,再打印)
  printSixOneSum(preview: boolean, printId: string) {
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

}

import { Component, OnInit } from '@angular/core';
import { FPickVaccineComponent } from '../f-pick-vaccine/f-pick-vaccine.component';
import { NbDialogService } from '@nebular/theme';
import {
  ApiReportNationSixTwoService,
  YEARS, MONTHS, DateUtils, FileDownloadUtils,
  FILE_TYPE, FILE_TYPE_SUFFIX,
  LodopPrintService
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'uea-report-nation-six-two-sum',
  templateUrl: './report-nation-six-two-sum.component.html',
  styleUrls: ['./../report.common.scss']
})
export class ReportNationSixTwoSumComponent implements OnInit {
  selectedVaccine = { selectName: '', selectCode: '', selectAcronym: '' };
  listOfData: any[] = [];
  sumData: any[] = [];

  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  years = YEARS;
  months = MONTHS;

  year: any;
  monthStart: any;
  monthEnd: any;

  userInfo: any;
  povInfo = {
    curProvCode: '',
    curCityCode: '',
    curDistrictCode: ''
  };

  zero = true;

  // 疫苗数据
  vaccineTypeData: any;

  // 加载lodop 错误信息
  closeAlert = false;
  // 订阅集合
  private subScription: Subscription[] = [];

  constructor(
    private dialogService: NbDialogService,
    private apiReportNationSixTwoService: ApiReportNationSixTwoService,
    private userSvc: UserService,
    private msg: NzMessageService,
    private dialogSvc: NbDialogService,
    private modalSvc: NzModalService,
    private lodopPrintSvc: LodopPrintService
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
    this.getVaccineData();
  }

  // 获取疫苗数据
  getVaccineData() {
    this.apiReportNationSixTwoService.queryVaccTypeInfo({}, resp => {
      if (resp && resp.code === 0) {
        this.vaccineTypeData = resp.data;
        for (let i = 0; i < this.vaccineTypeData.length; i++) {
          const item = this.vaccineTypeData[i];
          item['aliasName'] = '';
          item['selected'] = false;
          item['tags'] = [];
        }
      }
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

  // 选择疫苗
  selectVac() {
    this.dialogService
      .open(FPickVaccineComponent, {
        hasBackdrop: true,
        closeOnEsc: false,
        closeOnBackdropClick: false,
        context: {
          groupType: 'sum62',
          vaccineTypeData: this.vaccineTypeData
        },
      })
      .onClose.subscribe(resp => {
      // console.log('弹框返回的数据', resp);
      if (resp) {
        this.selectedVaccine = resp.selectData;
        this.vaccineTypeData = [];
        this.vaccineTypeData = [...resp.pickerData];

        // console.log('vaccine', this.selectedVaccine);
        // console.log('vaccineTypeData', this.vaccineTypeData);
      }

    });
  }

  /*查询数据*/
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
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
    let param = {
      yearMonths: [...yearMonthInoculates],
      vaccCodes: this.selectedVaccine.selectCode ? [...this.selectedVaccine.selectCode.split(',')] : null,
      povCode: this.userInfo.pov,
    };
    // console.log('参数', param);
    this.loading = true;
    this.listOfData = [];
    this.zero = true;
    this.apiReportNationSixTwoService.queryDateSumList(param, resp => {
      this.loading = false;
      // console.log('结果', resp);
      if (resp && resp.code === 0) {
        this.sumData = resp.data;
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
      } else {
        this.listOfData = [];
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
          item.forEach(ele => {
            for (let key in ele) {
              if (ele.hasOwnProperty(key)) {
                if (ele[key] === '0') {
                  ele[key] = 0;
                }
              }
            }
          });
        }
      }
    } else {
      this.listOfData = [];
      let fianllist = [];
      let dlist = [];
      for (let i = 0; i < this.sumData.length; i++) {
        if (i % 2 === 0 && i !== 0) {
          fianllist.push(dlist);
          dlist = [];
          dlist.push(this.sumData[i]);
        } else {
          dlist.push(this.sumData[i]);
        }
      }
      if (dlist.length > 0) {
        fianllist.push(dlist);
      }
      this.listOfData = fianllist;
    }
  }

  // 导出数据
  exportSum() {
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
          yearMonths: [...yearMonthInoculates],
          vaccCodes: [...this.selectedVaccine.selectCode.split(',')],
        };
        console.log('参数', params);
        this.apiReportNationSixTwoService.querySixTwoExport(params, resp => {
          console.log('结果', resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '国家报表6-2汇总_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);

        });
      }
    });
  }

  // 打印(先预览,再打印)
  printSixTwoSum(preview: boolean, printId: string) {
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

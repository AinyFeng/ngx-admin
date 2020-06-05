import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  VaccinateLogApiService,
  LodopPrintService,
  DateUtils,
  PovStaffInitService,
  FileDownloadUtils, FILE_TYPE, FILE_TYPE_SUFFIX, StockExportService
} from '@tod/svs-common-lib';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'uea-vaccinate-log',
  templateUrl: './vaccinate-log.component.html',
  styleUrls: ['./vaccinate-log.component.scss'],
  providers: [VaccinateLogApiService]
})
export class VaccinateLogComponent implements OnInit {
  // 查询表单
  searchForm: FormGroup;
  // 待选医生列表
  doctorOptions = [];
  // 已选择的table
  tableOption = '1';
  // 疫苗消耗
  vaccineConsume = [];
  // 接种明细
  vaccinateDetails = [];
  // 各疫苗具体剂次
  vaccineDosages = [];
  // 用户信息
  userInfo: any;
  // 加载中
  loading = false;
  // 加载lodop 错误信息
  closeAlert = false;
  // 接种日志明细统计人数
  detailCount = [];
  // 接种日志人数
  count = 0;
  // 当前日期
  currentDate = new Date(DateUtils.formatEndDate(new Date()));
  // 订阅集合
  private subscription: Subscription[] = [];

  total = 0;
  pageIndex = 1;
  pageSize = 10;

  // 接种明细中的过敏史,发热...等的图片信息
  vacRecordLogImg: any;

  constructor(
    private fb: FormBuilder,
    private vacLogApiSvc: VaccinateLogApiService,
    private location: Location,
    private lodopPrintSvc: LodopPrintService,
    private msg: NzMessageService,
    private userSvc: UserService,
    private dialogService: NbDialogService,
    private exportSvc: StockExportService,
    private povStaffInitSvc: PovStaffInitService,
    private modalSvc: NzModalService
  ) {
    const sub = this.userSvc
      .getUserInfoByType()
      .subscribe(user => (this.userInfo = user));
    const sub1 = this.lodopPrintSvc
      .getLodopStatus()
      .subscribe(show => (this.closeAlert = show));
    this.subscription.push(sub);
    this.subscription.push(sub1);
    this.vacRecordLogImg = require('../../../../../assets/images/vaccineRecordLog/loglist_circle.png');
  }

  ngOnInit(): void {
    const today = new Date();
    const startTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    );
    const endTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );
    this.searchForm = this.fb.group({
      startTime: [startTime],
      endTime: [endTime],
      vaccinateDoctor: []
    });
    this.doctorOptions = this.povStaffInitSvc.getPovStaffData().filter(staff => staff.hasOwnProperty('number'));
  }

  goBack() {
    this.location.back();
  }

  /**
   * 过滤开始日期
   * @param d
   */
  filterStartDate = (d: Date) => {
    // const endDate = this.searchForm.get('endTime').value;
    // if (endDate) {
    //   return d > endDate || d > this.currentDate;
    // } else {
    return d > this.currentDate;
    // }
  }

  /**
   * 过滤结束日期
   * @param d
   */
  filterEndDate = (d: Date) => {
    // const startDate = this.searchForm.get('startTime').value;
    // if (startDate) {
    //   return d > this.currentDate || d < startDate;
    // }
    return d > this.currentDate;
  }

  search(page = 1) {
    this.pageIndex = page;

    if (!this.userInfo) return;
    const startTime = this.searchForm.get('startTime').value;
    const endTime = this.searchForm.get('endTime').value;
    if (startTime && endTime) {
      if (startTime > endTime) {
        this.modalSvc.warning({
          nzTitle: '提示',
          nzContent: '开始时间不得大于结束时间，请重新选择',
          nzMaskClosable: true
        });
        return;
      }
    }
    this.loading = true;
    // console.log(this.searchForm);
    const query = {
      vaccinateDoctor: this.searchForm.get('vaccinateDoctor').value,
      startTime: DateUtils.getFormatDateTime(
        this.searchForm.get('startTime').value
      ),
      endTime: DateUtils.getFormatDateTime(
        this.searchForm.get('endTime').value
      ),
      povCode: this.userInfo.pov,

      pageEntity: {
      page: this.pageIndex,
        pageSize: this.pageSize,
      }

    };
    console.log(query);
    this.vacLogApiSvc.getVaccinateLogAllData(query, ([consumeData, dosageData, detailData, detailDataCount]) => {
        console.log('查询疫苗消耗', consumeData, dosageData, detailData, detailDataCount);
        this.loading = false;
        if (consumeData.code === 0) {
          const vaccineConsume = consumeData.data;
          // pinBase: 1, pinPro: 0, pinTemp: 0, vaccineProductName: "卡介疫苗"
          let count = {
            pinBase: 0,
            pinPro: 0,
            pinTemp: 0,
            vaccineProductName: '合计'
          };
          for (let i = 0; i < vaccineConsume.length; i++) {
            const v = vaccineConsume[i];
            count.pinBase += v['pinBase'];
            count.pinPro += v['pinPro'];
            count.pinTemp += v['pinTemp'];
          }
          vaccineConsume.push(count);
          // console.log(vaccineConsume);
          this.vaccineConsume = vaccineConsume;
        }
        if (dosageData.code === 0) {
          this.reformatDosageTableData(dosageData.data);
        }
        if (detailData.code === 0) {
          this.vaccinateDetails = detailData.data;
          // 统计人数
          let count = [];
          for (let i = 0; i < this.vaccinateDetails.length; i++) {
            const v = this.vaccinateDetails[i];
            const index = count.findIndex(c => c.name === v.vaccineProductName);
            if (index > -1) {
              count[index]['num']++;
            } else {
              count.push({
                name: v['vaccineProductName'],
                num: 1
              });
            }
          }
          this.detailCount = count;
        }
        // 解析count数据
        if (detailDataCount && detailDataCount.code === 0) {
          this.total = detailDataCount.data[0].count;
        } else {
          this.total = 0;
        }
      }
    );

    this.count = 0;
    this.vacLogApiSvc.getVaccinateLogCount(query, resp => {
      if (resp.code === 0) {
        this.count = resp.data[0]['count'];
      }
    });
  }

  /**
   * 将获取到的疫苗剂次数据进行重新组合
   * @param data
   */
  reformatDosageTableData(data: any[]) {
    // 先排序，将同样名字的排在一起
    data.sort((a, b) => {
      if (a.vaccineProductCode === b.vaccineProductCode) {
        return a.pinNum - b.pinNum;
      }
      return a.vaccineProductCode - b.vaccineProductCode;
    });
    console.log('排序之后的数据', data);

    // 复制一个用于插入新数据的对象，以及用于统计已插入数据数量的计次，以及用于确定 rowspan 的计次
    let countAmount = [];
    for (let i = 0; i < data.length; i++) {
      let amount = JSON.parse(JSON.stringify(data[i]));
      amount['pinNum'] = '合计';
      amount['rowspan'] = 2;
      this.checkTotalAmount(amount, countAmount);
    }
    console.log('转换之后的数据', countAmount);
    let dosageNData = [];
    for (let i = 0; i < countAmount.length; i++) {
      const amount = countAmount[i];
      const index = data.findIndex(
        item => item.vaccineProductName === amount.vaccineProductName
      );
      const d = data[index];
      d['rowspan'] = amount['rowspan'];
    }
    console.log('添加完rowspan ', data);
    let vaccineProductName = '';
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const dName = d['vaccineProductName'];
      if (vaccineProductName === '') {
        vaccineProductName = dName;
      } else if (vaccineProductName !== dName) {
        const totalAmount = countAmount.filter(
          a => a.vaccineProductName === vaccineProductName
        )[0];
        totalAmount['rowspan'] = null;
        dosageNData.push(totalAmount);
        vaccineProductName = dName;
      }
      dosageNData.push(d);
      if (i === data.length - 1) {
        const totalAmount = countAmount.filter(
          a => a.vaccineProductName === dName
        )[0];
        totalAmount['rowspan'] = null;
        dosageNData.push(totalAmount);
      }
    }
    let totalCountAmount = {
      forFree: '0',
      forPay: '0',
      totalAmount: '0',
      pinNum: '',
      vaccineProductName: '总计',
      rowspan: 1
    };
    for (let i = 0; i < countAmount.length; i++) {
      const amount = countAmount[i];
      totalCountAmount.forFree = ( Number(amount['forFree']) + Number(totalCountAmount.forFree)).toString();
      totalCountAmount.forPay = (Number(amount['forPay']) + Number(totalCountAmount.forPay)).toString();
      totalCountAmount.totalAmount = (Number(amount['totalAmount']) + Number(totalCountAmount.totalAmount)).toString();
    }
    dosageNData.push(totalCountAmount);
    console.log(dosageNData);
    this.vaccineDosages = dosageNData;
  }

  checkTotalAmount(data: any, amountArray: any[]) {
    const index = amountArray.findIndex(
      amount => amount.vaccineProductName === data.vaccineProductName
    );
    // 如果大于 -1 ，说明数据中已经存在相同的疫苗产品
    if (index > -1) {
      let d = amountArray[index];
      if (data.hasOwnProperty('forFree')) {
        d['forFree'] = (
          Number(d['forFree']) + Number(data['forFree'])
        ).toString();
      }
      if (data.hasOwnProperty('forPay')) {
        d['forPay'] = (
          Number(d['forPay']) + Number(data['forPay'])
        ).toString();
      }
      if (data.hasOwnProperty('totalAmount')) {
        d['totalAmount'] = (
          Number(d['totalAmount']) + Number(data['totalAmount'])
        ).toString();
      }
      d['rowspan']++;
    } else {
      amountArray.push({
        forFree: Number(data['forFree']).toString(),
        forPay: Number(data['forPay']).toString(),
        totalAmount: Number(data['totalAmount']).toString(),
        pinNum: data['pinNum'],
        vaccineProductName: data['vaccineProductName'],
        rowspan: data['rowspan']
      });
    }
  }

  print(preview = true, printId) {
    if (this.closeAlert) {
      return;
    }
    if (printId === '' || printId === undefined) {
      this.msg.info('没有内容，无法打印');
      return;
    }
    this.lodopPrintSvc.print(preview, printId, 20, 0, '100%', '85%');
  }

  // 导出 StockExportService
  export() {
    if (this.vaccineConsume.length === 0) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: '没有数据，请先执行查询操作',
        nzMaskClosable: true
      });
      return;
    }
    this.dialogService.open(ConfirmDialogComponent, {
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
          vaccinateDoctor: this.searchForm.get('vaccinateDoctor').value,
          startTime: DateUtils.getFormatDateTime(
            this.searchForm.get('startTime').value
          ),
          endTime: DateUtils.getFormatDateTime(
            this.searchForm.get('endTime').value
          ),
          povCode: this.userInfo.pov
        };
        // console.log('params1',params);
        this.loading = true;
        this.exportSvc.inoculateLogExport(params, resp => {
          this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '接种日志报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

}

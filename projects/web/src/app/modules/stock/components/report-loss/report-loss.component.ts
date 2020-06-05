import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { StockService, VaccBroadHeadingDataService, VaccineSubclassInitService, DateUtils } from '@tod/svs-common-lib';
import * as moment from 'moment';
@Component({
  selector: 'uea-report-loss',
  templateUrl: './report-loss.component.html',
  styleUrls: ['../stock.common.scss']
})
export class ReportLossComponent implements OnInit {
  searchFrom: FormGroup;
  // 疫苗大类
  vacTypeList = [];
  // 疫苗小类名称
  vacSubClassData = [];
  vacSubClassOptions = [];
  userInfo: any;
  loading = false;
  listOfData = [];

  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private stockService: StockService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private msg: NzMessageService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    // 拉取疫苗大类的数据
    this.vacTypeList = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    // 拉取疫苗小类的数据
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 入库查询参数
    let startTime = new Date();
    startTime.setDate(new Date().getDate() - 1);
    this.searchFrom = this.fb.group({
      startTime: [moment(startTime)],
      endTime: [moment(new Date())],
      vacType: [null],
      vacSubClassCode: [null],
      vacNumber: [null],
      facilityCode: [null], // 冷藏设备编码
      stockBy: [null] // 出库人
    });

    this.toSearch();
  }

  toSearch() {
    if (this.loading) return;
    // 判断时间的有效性
    if (
      this.searchFrom.get('startTime').value ||
      this.searchFrom.get('endTime').value
    ) {
      if (
        !this.searchFrom.get('startTime').value ||
        !this.searchFrom.get('endTime').value
      ) {
        this.msg.warning('请正确填写日期范围');
        return;
      } else {
        let start = this.searchFrom.get('startTime').value.format('YYYY-MM-DD');
        let end = this.searchFrom.get('endTime').value.format('YYYY-MM-DD');
        if (moment(end).isBefore(start)) {
          this.msg.warning('你输入的起始时间晚于截止时间');
          return;
        }
      }
    }
    const params = {
      povCode: this.userInfo.pov,
      stockBy: this.searchFrom.value.stockBy,
      facilityCode: this.searchFrom.value.facilityCode,
      batchCode: this.searchFrom.value.batchCode,
      stockTimeStart: DateUtils.getFormatDateTime(
        this.searchFrom.value.startTime
      ),
      stockTimeEnd: DateUtils.getFormatDateTime(this.searchFrom.value.endTime)
    };
    console.log('参数====', params);
    this.loading = true;
    this.stockService.stockBreakage(params, res => {
      this.loading = false;
      console.log('报损====', res);
      if (res.code === 0) {
        this.listOfData = res.data;
      } else {
        this.msg.warning(`${res.msg}`);
      }
    });
  }

  /**
   * 根据疫苗大类选择疫苗小类
   * @param ev
   */
  vaccineBroadHeadingChange(ev) {
    if (!ev) {
      return;
    }
    this.vacSubClassOptions = [];
    this.vacSubClassData.forEach(vac => {
      if (vac.value.substring(0, 2) === ev) {
        this.vacSubClassOptions.push(vac);
      }
    });
  }

  transferTime(time) {
    return DateUtils.getFormatDateTime(time) || '';
  }
  // 重置
  reset() {
    /* this.searchFrom.reset();*/
    this.listOfData = [];
    this.loading = false;
  }
}

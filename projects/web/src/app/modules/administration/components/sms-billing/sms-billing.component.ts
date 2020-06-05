import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '@tod/uea-auth-lib';
import {NzMessageService} from 'ng-zorro-antd';
import {NbMomentDateService} from '@nebular/moment';
import {ApiSystemMessageInfoService} from '@tod/svs-common-lib';

import {DateUtils} from '../../../../../../../svs-common-lib/src/lib/utils/date.utils';

@Component({
  selector: 'uea-sms-billing',
  templateUrl: './sms-billing.component.html',
  styleUrls: ['../admin.common.scss'],
  providers: [NbMomentDateService]
})
export class SmsBillingComponent implements OnInit {
  listOfData: any[] = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  form: FormGroup;
  userInfo: any;
  // 统计类型
  staticTypes = [
    {label: '年', value: 'year'},
    {label: '月', value: 'month'},
    {label: '日', value: 'day'}
  ];
  // 选择统计的类型
  staticType: any;

  currentDate = new Date();

  constructor(
    private messageSvc: ApiSystemMessageInfoService,
    private fb: FormBuilder,
    private userSvc: UserService,
    private msg: NzMessageService,
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.form = this.fb.group({
      sendStart: [null],
      sendEnd: [null],
      statisticType: [null], // 统计类型
    });
  }

  // 统计类型选择改变的时候,后面的日期也要改变
  changeSelect(event) {
    this.staticType = event;
    this.listOfData = [];
  }

  // 重置
  reset() {
    this.form.reset();
    this.listOfData = [];
    this.pageIndex = 1;
  }

  /*filterStartDate = (d: Date) => {
    const endTime = this.searchForm.get('createEndTime').value;
    if (endTime) {
      return d > endTime || d > this.currentDate;
    }
    return d > this.currentDate;
  }

  filterEndDate = (d: Date) => {
    const startTime = this.searchForm.get('createStartTime').value;
    if (startTime) {
      return d > this.currentDate || d < startTime;
    }
    return d > this.currentDate;
  }*/

  // 年
  disabledYearStart = (d: Date) => {
    const endTime = this.form.get('sendEnd').value;
    if (endTime) {
      return d >= endTime || d >= this.currentDate;
    }
    return d >= this.currentDate;
  }
  // 年(止)
  disabledYearEnd = (d: Date) => {
    /*const sendStart = this.form.get('sendStart').value;
    if (sendStart) {
      const year = sendStart.getFullYear();
      return d.getFullYear() < year || d >= new Date();
    } else {
      return d > new Date();
    }*/
    const startTime = this.form.get('sendStart').value;
    if (startTime) {
      return d >= this.currentDate || d <= startTime;
    }
    return d >= this.currentDate;
  }
  // 月
  disabledMonthStart = (d: Date) => {
    return d > new Date();
  }
  // 月(止)
  disabledMonthEnd = (d: Date) => {
    const sendStart = this.form.get('sendStart').value;
    if (sendStart) {
      const year = sendStart.getFullYear();
      const month = sendStart.getMonth();
      return d < new Date(year, month) || d >= new Date();
    } else {
      return d > new Date();
    }
  }
  // 日(起)
  disabledDayStart = (d: Date) => {
    // return d > new Date();
    const endTime = this.form.get('sendEnd').value;
    if (endTime) {
      return d > endTime || d > this.currentDate;
    }
    return d > this.currentDate;
  }
  // 日(止)
  disabledDayEnd = (d: Date) => {
    /* const sendStart = this.form.get('sendStart').value;
     if (sendStart) {
       const year = sendStart.getFullYear();
       const month = sendStart.getMonth();
       const day = sendStart.getDate();
       return d < new Date(year, month, day) || d >= new Date();
     } else {
       return d > new Date();
     }*/
    const startTime = this.form.get('sendStart').value;
    if (startTime) {
      return d > this.currentDate || d < startTime;
    }
    return d > this.currentDate;
  }

  // 查询
  searchData(page = 1) {
    this.pageIndex = page;
    if (this.loading) return;
    if (!this.staticType) {
      this.msg.warning('请选择统计类型');
      return;
    }
    let startYear, endYear, startMonth, endMonth, startDay, endDay;
    if (this.staticType === 'year') {
      if (this.form.get('sendStart').value && this.form.get('sendEnd').value) {
        startYear = DateUtils.getFormatDateTime(this.form.get('sendStart').value).slice(0, 4);
        endYear = DateUtils.getFormatDateTime(this.form.get('sendEnd').value).slice(0, 4);
        if (startYear > endYear) {
          this.msg.warning('你输入的发送开始时间晚于发送止时间');
          return;
        }
      }
    }
    if (this.staticType === 'month') {
      if (this.form.get('sendStart').value && this.form.get('sendEnd').value) {
        startMonth = DateUtils.getFormatDateTime(this.form.get('sendStart').value).slice(0, 7);
        endMonth = DateUtils.getFormatDateTime(this.form.get('sendEnd').value).slice(0, 7);
        if (DateUtils.getTimestamp(startMonth) > DateUtils.getTimestamp(endMonth)) {
          this.msg.warning('你输入的发送开始时间晚于发送止时间');
          return;
        }
      }
    }
    if (this.staticType === 'day') {
      if (this.form.get('sendStart').value && this.form.get('sendEnd').value) {
        startDay = DateUtils.getFormatDateTime(this.form.get('sendStart').value).slice(0, 10);
        endDay = DateUtils.getFormatDateTime(this.form.get('sendEnd').value).slice(0, 10);
        if (DateUtils.getTimestamp(startDay) > DateUtils.getTimestamp(endDay)) {
          this.msg.warning('你输入的发送开始时间晚于发送止时间');
          return;
        }
      }
    }
    if (!this.form.get('sendStart').value) {
      this.msg.warning('请输入发送开始时间');
      return;
    }
    if (!this.form.get('sendEnd').value) {
      this.msg.warning('请输入发送结束时间');
      return;
    }

    let query = {
      statisticType: this.form.get('statisticType').value,
      povCode: this.userInfo.pov,
      startTime: this.staticType === 'year' ? (startYear + '-01-01 00:00:00') : this.staticType === 'month' ? (startMonth + '-01 00:00:00') : this.staticType === 'day' ? (startDay + ' 00:00:00') : null,
      endTime: this.staticType === 'year' ? (endYear + '-12-31 23:59:59') : this.staticType === 'month' ? (endMonth + '-31 23:59:59') : this.staticType === 'day' ? (endDay + ' 23:59:59') : null,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log(query);
    this.loading = true;
    this.listOfData = [];
    this.messageSvc.querySmsBillingAndCount(query, resp => {
      this.loading = false;
      console.log(resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        this.msg.warning('未查询到相关数据');
        return;
      }
      this.listOfData = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data') || resp[1].data.length === 0) {
        return;
      }
      this.total = resp[1].data[0].count;
    });
  }
}

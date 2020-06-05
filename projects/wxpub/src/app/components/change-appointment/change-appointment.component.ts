import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params} from '@angular/router';
import {WxService} from '../../services/wx.service';
import {DateUtils} from '@tod/svs-common-lib';

@Component({
  selector: 'app-change-appointment',
  templateUrl: './change-appointment.component.html',
  styleUrls: ['./change-appointment.component.scss']
})
export class ChangeAppointmentComponent implements OnInit {
  baseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private wxService: WxService
  ) {
    this.activeRoute.params.subscribe((params: Params) => {
      const tempParams = JSON.parse(params['appoint']);
      this.appointInfo = {
        ...tempParams,
        appointTime: tempParams['appointTime']
      };
      console.log(22, this.appointInfo);
    });
  }

  appointInfo = {};
  // 可预约时间
  appointDateArr = [];
  // 可预约时间段
  appointTimeArr = [];

  ngOnInit() {
    this.baseForm = this.fb.group({
      birthday: [null, [Validators.required]],
      appointTime: [null],
      timeRange: [null]
    });
    this.getAppointDateRange();
  }

  sureChange() {
    const params = {
      reservationSerial: this.appointInfo['reservationSerial'],
      confirmDate: this.appointInfo['timeRange'][0],
      workingTimeSerial: this.appointInfo['workingTime'],
      channel: this.appointInfo['povName'],
      channelAccount: this.appointInfo['povCode']
    };
    return;
    this.wxService.changeAppoint(params, res => {
      console.log('确定改期', res);
    });
  }

  getAppointDateRange() {
    const params = {
      povCode: this.appointInfo['povCode'],
      reservationDate: this.currentDateFormat(
        this.appointInfo['appointTime'],
        'YYYY-MM-DD HH:mm:ss'
      )
    };

    this.wxService.getNextWorkingDay(params, res => {
      const appointTime = res.data.map(item =>
        DateUtils.getTimeFromTimestamp(item, 'YYYY-MM-DD')
      );
      this.appointDateArr = appointTime;
      console.log('根据预约时间获取一周可预约时间', appointTime);
      this.getAppointTimeRange(undefined);
    });
  }

  getAppointTimeRange(event) {
    console.log(33, event, this.appointInfo['appointTime']);
    const params = {
      povCode: this.appointInfo['povCode'],
      reservationDate: this.currentDateFormat(
        this.appointInfo['appointTime'],
        'YYYY-MM-DD HH:mm:ss'
      )
    };

    this.wxService.getWorkingTimeByDate(params, res => {
      const appointTime = res.data.map(item =>
        DateUtils.getTimeFromTimestamp(item)
      );
      this.appointTimeArr = appointTime;
      console.log('根据日期查询可预约时段===', appointTime);
    });
  }

  getMinDate() {
    return new Date();
  }

  currentDateFormat(date, format: string = 'YYYY-MM-DD HH:mm'): any {
    return DateUtils.getFormatTime(date, format);
  }
}

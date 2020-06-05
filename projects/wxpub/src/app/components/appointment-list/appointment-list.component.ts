import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {WxService} from '../../services/wx.service';
import {DateUtils} from 'dist/svs-common-lib';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  constructor(private router: Router, private wxService: WxService) {
  }

  listData = [];
  userInfo = {};

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('wxUserInfo'));
    this.listData = [];
    const params = {
      userAccount: this.userInfo['userAccount']
    };
    this.wxService.queryAppointRecord(params, res => {
      if (res.code === 0) {
        this.listData = res.data.map(item => {
          return {
            ...item,
            appointTime: this.translateTime(item.reservationDate)
          };
        });
        console.log('预约列表====', res);
      }
    });
  }

  checkAppoint(item) {
    this.router.navigate([
      '/appointmentSign',
      JSON.stringify(item)
    ]);
  }

  changeAppoint(item) {
    this.router.navigate([
      '/changeAppointment',
      JSON.stringify(item)
    ]);
  }

  translateTime(date) {
    return date ? DateUtils.getFormatTime(date, 'YYYY-MM-DD') : '';
  }
}

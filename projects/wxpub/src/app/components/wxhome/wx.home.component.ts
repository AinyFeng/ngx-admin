import {Component, OnInit} from '@angular/core';
import {AuthService} from '@tod/uea-auth-lib';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-component',
  templateUrl: './wx.home.component.html',
  styleUrls: [
    './wx.home.component.scss',
    '../../wx.component.scss'
  ]
})
export class WxHomeComponent implements OnInit {
  dataList = [];

  constructor(
    private authService: AuthService,
    protected router: Router,
  ) {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        console.log(33888, this.authService);
        // this.router.navigateByUrl('/modules/dashboard');
      }
    });
  }

  ngOnInit() {
    this.dataList = [
      {
        img: 'assets/images/home/icon_home_order.png',
        title: '预约服务',
        routeLink: '/appointmentList'
      },
      {
        img: 'assets/images/home/icon_home_focus.png',
        title: '关注绑定',
        routeLink: '/associaChild'
      },
      {
        img: 'assets/images/home/icon_home_focus.png',
        title: '我的关注',
        routeLink: '/myAttention'
      },
      {
        img: 'assets/images/home/icon_home_focus.png',
        title: '建卡记录',
        routeLink: '/archivesList'
      },
      {
        img: 'assets/images/home/icon_home_createcard.png',
        title: '自助建卡',
        routeLink: '/addArchives'
      },
      {}
      // {
      //   img: 'assets/images/home/icon_home_vaccinate.png',
      //   title: '接种反馈',
      //   routeLink: '/injectFeedbackList'
      // }
    ];
  }

  loginOut() {
    this.authService.logout();
  }
}

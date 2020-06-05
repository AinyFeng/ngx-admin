import {tap} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {DateUtils} from '@tod/svs-common-lib';
import {WxService} from '../../services/wx.service';
import {AuthService, UserService, UserProfile} from '@tod/uea-auth-lib';

@Component({
  selector: 'app-my-attention',
  templateUrl: './my-attention.component.html',
  styleUrls: [
    './my-attention.component.scss',
    '../../wx.component.scss'
  ]
})
export class MyAttentionComponent implements OnInit {
  listData = [];

  constructor(
    private wxService: WxService,
    private authService: AuthService,
    private userService: UserService) {
  }

  userInfo: Partial<UserProfile>;

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('wxUserInfo'));
    this.fetchAttentionList(this.userInfo);
    // .pipe(
    //   tap((userProfile) => {
    //     this.userInfo = userProfile;
    //   }),
    //   tap(userProfile => {
    //     this.fetchAttentionList(userProfile);
    //   })
    // );
  }

  fetchAttentionList(userProfile: any) {
    const params = {
      userAccount: userProfile['userAccount']
    };
    this.wxService.queryAttendList(params, res => {
      if (res.code === 0) {
        this.listData = res.data.map(item => {
          return {
            ...item,
            birthDate: DateUtils.getTimeFromTimestamp(item.birthDate)
          };
        });
        console.log('我的关注列表====', res);
      }
    });
  }
}

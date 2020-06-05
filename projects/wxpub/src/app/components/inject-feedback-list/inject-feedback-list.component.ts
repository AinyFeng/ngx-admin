import {Component, OnInit} from '@angular/core';
import {DateUtils} from '@tod/svs-common-lib';
import {WxService} from '../../services/wx.service';

@Component({
  selector: 'app-inject-feedback-list',
  templateUrl: './inject-feedback-list.component.html',
  styleUrls: [
    './inject-feedback-list.component.scss',
    '../../wx.component.scss'
  ]
})
export class InjectFeedbackListComponent implements OnInit {
  constructor(private wxService: WxService) {
  }

  userInfo = {};
  listData = [];
  imageConfig: any;

  ngOnInit() {
    this.imageConfig = require('../../../assets/data/resourcePath/resourceConfig.json');
    this.userInfo = JSON.parse(localStorage.getItem('wxUserInfo'));
    const params = {
      feedbackUserId: this.userInfo['userAccount']
    };
    this.wxService.queryObserveRecordList(params, res => {
      if (res.code === 0) {
        this.listData = res.data.map(item => {
          return {
            ...item,
            time: DateUtils.getTimeFromTimestamp(
              item.selfObserveRecord.feedbackTime,
              'YYYY-MM-DD'
            )
          };
        });
        console.log('接种反馈列表====', this.listData, res);
      }
    });
  }

  getImageUrl(img) {
    // this.wxService.resourceHandler(img['feedbackImgUrl'],  res=>{
    //
    // });
    // const imgUrl = this.imageConfig['imageHost'] + img['feedbackImgUrl'];
    return this.imageConfig['imageHost'] + img['feedbackImgUrl'];
  }
}

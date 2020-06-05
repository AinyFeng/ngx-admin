import {Component, OnInit} from '@angular/core';
import {WxService} from '../../services/wx.service';
import {DateUtils} from '@tod/svs-common-lib';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-archives-list',
  templateUrl: './archives-list.component.html',
  styleUrls: ['./archives-list.component.scss']
})
export class ArchivesListComponent implements OnInit {
  constructor(
    private wxService: WxService,
    private router: Router,
    private notifier: NotifierService
  ) {
  }

  listData = [];
  userInfo = {userAccount: ''};

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('wxUserInfo'));
    this.queryArchiveList();
  }
  queryArchiveList() {
    const params = {
      createAccount: this.userInfo.userAccount
    };
    this.wxService.queryProfileList(params, res => {
      if (res.code === 0) {
        this.listData = res.data.map(item => {
          return {
            ...item,
            time: DateUtils.getTimeFromTimestamp(item.updateTime)
          };
        });
        console.log('建档列表====', res);
      }
    });
  }
  deleteArchive(item) {
    this.wxService.deleteProfile(item['id'], res => {
      if (res.code === 0) {
        console.log('deleteArchive', res);
        this.notifier.notify('success', '删除档案成功!');
        this.queryArchiveList();
      }
    });
  }

  showDetail(item) {
    const params = {
      checkCode: item['checkCode'],
      createAccount: item['createAccount']
    };
    this.router.navigate([
      '/archiveDetail',
      JSON.stringify(item)
    ]);
  }
}

import { AppStateService } from './../../../@uea/service/app.state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { SystemAnnouncementService, LOCAL_STORAGE } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit, OnDestroy {
  isVisible = true;
  checked: boolean;
  pageIndex = 1;
  pageSize = 5;
  total = 0;
  /*noticeData = [
    {
      id: 1,
      sender: '淮海路接种门诊',
      content: '您的孩子刘力扬的2017-07-29已经超过应种时间,请尽快来接种',
      sendTime: '2019-06-20',
      description: '淮海路接种门诊提醒您,您的孩子刘力扬的2017-07-29已经超过应种时间,请尽快来接种,2019-06-20'
    },
    {
      id: 2,
      sender: '望江西路接种门诊',
      content: '您的孩子刘思思的2017-07-29已经超过应种时间,请尽快来接种',
      sendTime: '2019-03-20',
      description: '望江西路接种门诊提醒您,您的孩子小明的2017-07-29已经超过应种时间,请尽快来接种,2019-04-20'
    },
    {
      id: 3,
      sender: '长江西路接种门诊',
      content: '您的孩子李子柒的2017-07-29已经超过应种时间,请尽快来接种',
      sendTime: '2019-02-20',
      description: '长江西路接种门诊提醒您,您的孩子刘思思的2017-07-29已经超过应种时间,请尽快来接种,2019-07-20'
    },
    {
      id: 4,
      sender: '科学大道接种门诊',
      content: '您的孩子张小小的2017-07-29已经超过应种时间,请尽快来接种',
      sendTime: '2019-05-20',
      description: '科学大道接种门诊提醒您,您的孩子李子柒的2017-07-29已经超过应种时间,请尽快来接种,2019-05-20'
    },
  ];
  messages: any[] = [
    '【近效期预警】 今日库存中有 37 个疫苗在近效期预警内（180天）。',
    '【卡介苗-20199999-深圳卫武】：剩余 41，（近效期 -139 天）',
    '【卡介苗-201705a47-成都生物】：剩余 14，（近效期 -1165 天）',
    '【卡介苗-201703a029-成都生物】：剩余 3，（近效期 -114 天）',
    '【卡介苗-201703a030-成都生物】：剩余 102，（近效期 -112 天）',
    '【卡介苗-201703a030-成都生物】：剩余 102，（近效期 -112 天）'
  ];*/
  noticeData: any[] = [];
  messages: any[] = [];

  constructor(
    private appStateService: AppStateService,
    private localSt: LocalStorageService,
    private systemAnnouncementSvc: SystemAnnouncementService
  ) {
  }

  ngOnInit() {
    this.appStateService.setSubTitle('系统公告');
    this.checked = this.localSt.retrieve(LOCAL_STORAGE.SYSTEM_NOTICE);
    this.getSysAllInfo();
  }

  closeDrawer() {
    this.isVisible = !this.isVisible;
  }

  // 不再提示
  toggle(checked: boolean) {
    this.checked = checked;
    this.localSt.store(LOCAL_STORAGE.SYSTEM_NOTICE, this.checked);
  }

  // 获取全部信息
  getSysAllInfo(page = 1) {
    this.pageIndex = page;
    let params = {
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log(params);
    this.systemAnnouncementSvc.querySysAnnouncementInfoAndCount(params, resp => {
      console.log('result', resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        return;
      }
      this.noticeData = resp[0].data;
      this.noticeData.forEach(item => {
        if (item.messageType === '1') {
          this.messages.push(item);
        }
      });
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data') || resp[1].data.length === 0) {
        this.total = 0;
        return;
      }
      this.total = resp[1].data[0].count;
    });
  }

  ngOnDestroy() {
    this.appStateService.clearSubTitle();
  }

}

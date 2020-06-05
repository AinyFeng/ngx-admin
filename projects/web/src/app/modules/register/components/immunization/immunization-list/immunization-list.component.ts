import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { ImmunizationAddComponent } from '../immunization-add/immunization-add.component';
import { ProfileDataService, ImmunizationService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-immunization-list',
  templateUrl: './immunization-list.component.html',
  styleUrls: ['./immunization-list.component.scss']
})
export class ImmunizationListComponent implements OnInit, OnDestroy {
  profile: any;
  loading = false;

  editable = false;

  data = [];
  subscriptionArr: Subscription[] = [];

  constructor(
    private profileDataSvc: ProfileDataService,
    private ref: NbDialogRef<ImmunizationListComponent>,
    private immuSvc: ImmunizationService,
    private msg: NzMessageService,
    private dialog: NbDialogService
  ) {
    const sub = this.profileDataSvc.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
        this.queryImmuCard();
      }
    });
    this.subscriptionArr.push(sub);
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.subscriptionArr.forEach(sub => sub.unsubscribe());
  }

  queryImmuCard() {
    if (!this.profile) return;
    const profileCode = this.profile['profileCode'];
    const query = {
      condition: [{ key: 'profileCode', value: profileCode, logic: '=' }]
    };
    this.loading = true;
    this.immuSvc.getImmunizationList(query, resp => {
      console.log(resp);
      this.loading = false;
      this.data = [];
      if (resp.code !== 0 || !resp.hasOwnProperty('data')) {
        return;
      }
      this.data = resp.data;
    });
  }

  onClose() {
    this.ref.close();
  }

  addRecord() {
    this.dialog
      .open(ImmunizationAddComponent, {
        context: {
          cardListData: this.data
        }
      })
      .onClose.subscribe(resp => this.queryImmuCard());
  }

  delete(data) {
    const vacCardStatus = data['vacCardStatus'];
    if (vacCardStatus === '1') {
      this.msg.warning('不可删除状态为【有效】的免疫卡');
      return;
    }
    const immuCardRecordCode = data['immuCardRecordCode'];
    this.immuSvc.deleteImmunizationCard(immuCardRecordCode, resp => {
      console.log('删除免疫接种卡信息', resp);
      if (resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data !== 1) {
        this.msg.error('操作失败，请重试');
        return;
      }
      this.data = this.data.filter(
        item => data['immuCardRecordCode'] !== item['immuCardRecordCode']
      );
    });
  }

  update(data) {
    const cardNeedToActivate = {
      immuCardRecordCode: data['immuCardRecordCode'],
      vacCardStatus: '1'
    };
    let cardNeedToInactive = {};
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]['vacCardStatus'] === '1') {
        cardNeedToInactive['vacCardStatus'] = '0';
        cardNeedToInactive['immuCardRecordCode'] = this.data[i][
          'immuCardRecordCode'
        ];
        break;
      }
    }
    let activate = [];
    activate.push(cardNeedToInactive);
    activate.push(cardNeedToActivate);
    this.immuSvc.activateImmuCard(activate, resp => {
      console.log('激活免疫卡返回结果', resp);
      if (resp.code !== 0 || !resp.hasOwnProperty('data')) {
        this.msg.error('启用免疫卡失败，请重试');
        return;
      }
      this.queryImmuCard();
    });
  }
}

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VaccinatePlatformService} from '../vaccinate-platform.service';
import {Subscription} from 'rxjs';
import {DateUtils, DicDataService, ProfileService, TransformUtils} from '@tod/svs-common-lib';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'uea-vaccinate-base-info',
  templateUrl: './vaccinate-base-info.component.html',
  styleUrls: ['./vaccinate-base-info.component.scss']
})
export class VaccinateBaseInfoComponent  implements OnInit, OnDestroy {
  @Input()
  isSingle: boolean = false;
  @Input()
  showCard: boolean = true;
  // 基本信息Form
  basicInfo: any = {
    name: '',
    gender: '',
    immunityVacCard: '',
    birthDate: '',
    profileCode: '',
    guardian: ''
  };

  private subscription: Subscription[] = [];

  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private profileService: ProfileService,
    private dicDataService: DicDataService,
    private platformService: VaccinatePlatformService) {
  }

  ngOnInit() {
    this.initCurrentQueueItem();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  initCurrentQueueItem() {
    const sub = this.platformService.getCurrentQueueItem().subscribe(queueItem => {
      if (queueItem) {
        this.queryProfile(queueItem['profileCode']);
      } else {
        this.resetBasicInfo();
      }
    });
    this.subscription.push(sub);
  }

  /**
   * 查询档案信息
   * @param profileCode 档案编号
   */
  queryProfile(profileCode: string) {
    if (profileCode) {
      const query = {
        profileCode: profileCode
      };
      this.profileService.queryProfile(query, resp => {
        if (resp.code === 0 && resp.data.length > 0) {
          const profileInfo = resp.data[0];
          const birthDayTime = profileInfo.birthDate;
          let transFormAge = TransformUtils.getAgeFromBirthDate(birthDayTime);
          let strAge = `(${transFormAge.age}岁${transFormAge.month ? transFormAge.month : 0}月龄)`;
          this.basicInfo = profileInfo;
          this.basicInfo.birthDate = DateUtils.formatToDate(birthDayTime) + strAge;
          this.platformService.profileInfo = profileInfo;
        } else if (resp.code === 0 && resp.data.length === 0) {
          if (profileCode !== '0' && profileCode !== null) {
            this.modalService.warning({
              nzTitle: '警告',
              nzContent: '未查询到档案信息！'
            });
            this.resetBasicInfo();
          }
        } else {
          this.modalService.error({
            nzTitle: '错误',
            nzContent: '查询档案信息失败！'
          });
          this.resetBasicInfo();
        }
      });
    } else {
      this.resetBasicInfo();
    }
  }

  /**
   * 重置基本信息
   */
  resetBasicInfo() {
    this.basicInfo = {};
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
// @ts-ignore
import { BigScreenApi } from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { Subscription } from 'rxjs';
import * as echarts from 'echarts';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'uea-vaccination-display',
  templateUrl: './vaccination-display.component.html',
  styleUrls: ['./vaccination-display.component.scss']
})
export class VaccinationDisplayComponent implements OnInit, OnDestroy {



  /**
   * 用户信息
   */
  userInfo: any;
  /**
   * 视图模式 - 分 区域模式 - district和 POV - pov 模式
   */
  viewType = 'district';

  viewTypeDistrict = 'district';

  /**
   * 地理位置数据路径
   */
  dataPath = '../../../../../assets/data/bigscreen/';
  /**
   * 地图echarts
   */
  mapOption: any;
  /**
   * 地图json数据
   */
  mapData = [];
  /**
   * 订阅集合
   */
  private subscription: Subscription[] = [];

  searchDistrictCode: string;

  constructor(private bsApi: BigScreenApi,
              private userSvc: UserService) {
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      console.log(user);
    });
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }



}

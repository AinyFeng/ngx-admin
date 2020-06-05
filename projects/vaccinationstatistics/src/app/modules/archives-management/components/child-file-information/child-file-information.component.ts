import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiAdminDailyManagementService, LodopPrintService } from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'uea-child-file-information',
  templateUrl: './child-file-information.component.html',
  styleUrls: ['./child-file-information.component.scss']
})
export class ChildFileInformationComponent implements OnInit {

  private subscription: Subscription[] = [];

  // 基本信息
  userInfo: any;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  childInfo: any;
  dataSet: any;
  // 打印机加载错误
  error: boolean;
  showError: boolean;
  // 打印儿童个案信息详情 template
  @ViewChild('printChildrenInfo', {static: false}) printRecord: any;
  // 打印儿童个案信息所需数据
  printChildrenDetailInfo = {
    baseInfo: {}, // 儿童基本信息
    vaccineRecord: [], // 接种记录信息
    id: 'childInfo_1' // 儿童个案 打印信息id
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private lodopPrintSvc: LodopPrintService,
    private vacRecordService: ApiAdminDailyManagementService,
    private userSvc: UserService,
  ) {
    this.userSvc.getUserInfoByType().subscribe(resp => {
      if (resp) {
        this.userInfo = resp;
      }
    });
    const sub = this.route.queryParams.subscribe((params: Params) => {
      console.log('childInfo：', params);
      this.childInfo = params;
      this.printChildrenDetailInfo.baseInfo = params;
    });
    this.subscription.push(sub);
    // 初始化打印机
    this.lodopPrintSvc.getLodopStatus().subscribe(status => {
      this.showError = status ? status : !status;
      this.error = status;
    });
  }

  ngOnInit() {
    this.queryVacRecord();
  }


  /**
   * 查询接种记录，按照档案编码查询
   */
  queryVacRecord(page = 1) {
    this.pageIndex = page;
    const query = {
      managePovCode: this.userInfo.pov,
      profileCode: this.childInfo['profileCode'],
      vaccinateStatus: ['3'],
      vaccinateStatusCode: '0',
      pageEntity: {page: page, pageSize: this.pageSize}
    };
    this.loading = true;
    this.vacRecordService.vaccinateRecord(
      query,
      (queryData, countData) => {
        this.loading = false;
        console.log('查询到的接种记录', queryData, countData);
        if (!queryData || !countData) {
          console.warn('未查到接种记录数据');
          return;
        }
        if (queryData.code !== 0 || countData.code !== 0) {
          console.warn('未查到接种记录数据');
          return;
        }
        this.dataSet = queryData.data;
        this.total = countData.data[0].count;
        const vaccineDetail = [];
        for (let i = 0; i < queryData.data.length; i++) {
          vaccineDetail.push(queryData.data[i]);
        }
        if (queryData.data.length >= 0 && queryData.data.length < 10) {
          for (let i = queryData.data.length; i < 12; i++) {
            vaccineDetail.push({
              totalAmount: ''
            });
          }
        }
        this.printChildrenDetailInfo.vaccineRecord = vaccineDetail;
      }
    );
  }

  // 返回
  goBack() {
    this.location.back();
  }

  detail(data: any) {
    this.router.navigate(['/modules/archivesmanagement/vaccineInOutRecord'], {queryParams: data});
  }

  // 打印接种记录
  print(preview: boolean) {
    if (this.error) {
      return;
    }
    this.printRecord.print(preview);
  }
}

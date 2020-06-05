import {Component, OnInit, ViewChild} from '@angular/core';
import {ProfileService, ApiAdminDailyManagementService, DateUtils, BigScreenApi} from '@tod/svs-common-lib';
import {NbDialogService} from '@nebular/theme';
import {UserService} from '../../../../../../../uea-auth-lib/src/core/user.service';
import {SearchResultComponent} from '../vaccine-trace/search-result/search-result.component';

@Component({
  selector: 'uea-vaccination-trace',
  templateUrl: './vaccination-trace.component.html',
  styleUrls: ['./vaccination-trace.component.scss']
})
export class VaccinationTraceComponent implements OnInit {

  // 搜索的名称
  searchContent: any;
  loading = false;

  // 接种记录查询的数据
  listOfData = [];

  // 档案信息
  profile: any;
  // 登录用户信息
  userInfo: any;
  // 查看的接种记录详情
  vaccineDetail: any;
  // 蒙版
  mask = false;
  // 查询的档案list
  listData: any  = [];

  constructor(
    private profileSvc: ProfileService,
    private dialogService: NbDialogService,
    private vacRecordService: ApiAdminDailyManagementService,
    private userSvc: UserService,
    private bsApi: BigScreenApi
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
  }
  // 关闭蒙版
  closeMask(event) {
    console.log('event', event);
    this.mask = event.mask;
    if (event.selectProfile) {
      this.profile = event.selectProfile;
      // 查询接种记录
      this.getVacRecordInfo();
    }
  }
  // 查询信息
  searchProfile() {
    if (this.loading) return;
    if (!this.searchContent || this.searchContent.trim() === '') {
      return;
    }
    this.loading = true;
    let query = {
      pageNo: 1,
      pageSize: 10
    };
    this.loading = true;
    this.profile = '';
    // 查询基本信息
    this.profileSvc.queryProfileByStr(this.searchContent, query, resp => {
      this.loading = false;
      console.log('基本信息', resp);
      if (resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) {
        // this.msg.info('没有查到数据，请重试');
        return;
      }
      if (resp[1].code !== 0 || !resp[1].hasOwnProperty('data')) {
        // this.msg.info('没有查到数据，请重试');
        return;
      }
      // 需要判断3次，第一次判断如果没有查到档案，第二次判断查到的结果是否为大于1，第三次如果查到的结果只有1个，则不需要弹框
      if (resp[0].data.length === 0) {
        // this.msg.info('没有查到档案信息');
        // this.profileDataSvc.setProfileData(null);
      } else if (resp[0].data.length > 1) {
        console.log('aa', resp[0].data);
        // 查到的档案信息大于1个
        this.mask = true;
        this.listData = resp[0].data;
        /*this.dialogService
          .open(SearchResultComponent, {
            hasBackdrop: true,
            closeOnBackdropClick: false,
            closeOnEsc: false,
            context: {
              data: resp[0].data,
              countDate: resp[1].data,
              queryString: this.searchContent,
              pageEntity: query
            }
          })
          .onClose.subscribe(res => {
          console.log(res);
          // this.setProfileData(res);
          // 查询接种记录
            this.getVacRecordInfo();
        });*/
      } else {
        // 当只有一个档案信息时，直接将数据显示到页面
        this.profile = resp[0].data[0];
        // 查询接种记录
        this.getVacRecordInfo();
      }
    });
    // 查询接种记录
    // this.

  }

  // 获取接种记录
  getVacRecordInfo(page = 1, pageSize = 200) {
    if (!this.profile) return;
    if (this.loading) return;
    const query = {
      managePovCode: this.userInfo.pov,
      profileCode: this.profile['profileCode'],
      pageEntity: {
        page: page,
        pageSize: pageSize,
        sortBy: ['vaccinateTime' + ',asc']
      }
    };
    this.listOfData = [];
    this.vacRecordService.vaccinateRecord(query, (queryData, countData) => {
      this.loading = false;
      console.log('查询此儿童的接种记录', queryData, countData);
      if (
        queryData && queryData.code === 0 && queryData.hasOwnProperty('data') && queryData.data.length !== 0) {
        this.listOfData = queryData.data;
      } else {
        this.listOfData = [];
        this.vaccineDetail = ''; // 如果没有了数据,则将之前查看的数据置空
        // this.msg.warning('未查询到数据');
      }
    });
  }

  // 查看追溯
  checkDetail(data) {
    this.vaccineDetail = data;
    this.vaccineDetail['vaccinateTime'] = DateUtils.getFormatDateTime(data.vaccinateTime);
    console.log('vaccineDetail', this.vaccineDetail);
    const params = {
      golabalNumber: data.globalRecordNumber,
      vaccinateTime: DateUtils.getFormatDateTime(data.vaccinateTime),
      productCode: data.vaccProductCode
    };
    console.log('参数', params);
    // 追溯接种过程
    this.bsApi.queryVaccinateReview(params, resp => {
      console.log('结果', resp);
    });
    // 追溯疫苗全流程
    this.bsApi.queryVaccineReview(data.globalRecordNumber, res => {
      console.log('追溯疫苗全流程', res);
    });


  }

}

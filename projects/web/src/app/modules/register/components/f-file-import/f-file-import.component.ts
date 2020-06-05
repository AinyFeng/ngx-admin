import {ConfirmDialogComponent} from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NbDateService, NbDialogRef, NbDialogService} from '@nebular/theme';
import {UserService} from '@tod/uea-auth-lib';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {CommunityDataService, DateUtils, ProfileService} from '@tod/svs-common-lib';
import * as moment from 'moment';

@Component({
  selector: 'uea-f-file-import',
  templateUrl: './f-file-import.component.html',
  styleUrls: ['./f-file-import.component.scss']
})
export class FFileImportComponent implements OnInit {
  // 异地迁入档案查询参数
  caseParam = {
    childName: null,
    childCode: null,
    gender: null,
    birthDate: null,
    motherName: null,
    fatherName: null,
    cardNo: null,
    cardType: 'childCode',
    povCode: null,
    community: '0',
    profileStatusCode: '1',
    residentialTypeCode: '1',
  };
  // 当前登录用户信息
  userInfo: any = {};
  // 异地迁入档案查询结果
  serverCaseData: any = [];
  serverProfile: any = {};
  serverGuardians: any[] = [];
  serverVaccRecord: any[] = [];

  isLoading: boolean = false;
  isCommit: boolean = false;
  tabTitle: string = '';

  // 查询编码
  childCode: string = null;
  queryCode: string = null;

  queryOpt = 'cInfo';
  queryOptions = [
    {label: '证件编码', value: 'id'},
    {label: '儿童信息', value: 'cInfo'}
  ];

  provQuery = {
    queryOpt: 'cInfo',
    queryGender: 'male'
  };
  provQueryOptions = [
    {label: '儿童信息', value: 'cInfo'},
    {label: '免疫卡号', value: 'immId'}
  ];

  maxDate: Date;
  /**
   * 社区选项
   */
  communityOptions = [];


  @ViewChild('dialog', {static: true})
  dialog;

  constructor(
    private ref: NbDialogRef<FFileImportComponent>,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private user: UserService,
    private modalService: NbDialogService,
    private profileService: ProfileService,
    protected dateService: NbDateService<Date>,
    private communitySvc: CommunityDataService
  ) {
    this.maxDate = dateService.today();
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      this.caseParam.povCode = this.userInfo.pov;
    });
  }

  ngOnInit() {
    this.communityOptions = this.communitySvc.getCommunityData();

  }

  onClose(param?: any) {
    console.log('关闭', param);
    this.ref.close(param);
  }

  /**
   * 异地迁入档案查询
   */
  queryCaseImmigrationProfile() {
    this.clearData();
    const param = JSON.parse(JSON.stringify(this.caseParam));
    if (this.queryOpt === 'id') {
      this.profileService.queryCaseImmigrationByCardNumber(param, resp => {
          this.isLoading = false;
          console.log('根据档案编码查询异地迁入', resp);
          if (resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data.length === 0) {
            this.message.warning('没有查到档案数据!');
            return;
          }
          this.serverCaseData = resp.data;
        }
      );
    } else {
      param.birthDate = DateUtils.getFormatTime(param.birthDate, 'YYYY-MM-DD');
      this.profileService.queryCaseImmigrationByBaseInfo(param, resp => {
          this.isLoading = false;
          console.log('根据儿童信息查询异地迁入', resp);
          if (resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data.length === 0) {
            this.message.warning('没有查到档案数据!');
            return;
          }
          this.serverCaseData = resp.data;
        }
      );
    }
  }

  /**
   * 确认档案异地迁入（本系统没有该档案时）
   */
  immigrationProfile(ref2?: any) {
    this.isLoading = true;
    if (this.caseParam.community === '0') {
      this.message.warning('请选择区域划分！', {nzDuration: 3000});
      this.isLoading = false;
      return;
    }
    switch (this.tabTitle) {
      case '省平台产科下载':
        if (this.serverCaseData.downloadStatus === '1') {
          this.message.warning('该档案已被下载，不允许再次下载！', {
            nzDuration: 4000
          });
          this.isLoading = false;
          return;
        }
        this.profileService.commitCaseInProvincePlatform(
          {
            povCode: this.caseParam.povCode,
            newBornId: this.serverCaseData[0].newBornId,
            community: this.caseParam.community,
            profileStatusCode: this.caseParam.profileStatusCode,
            residentialTypeCode: this.caseParam.residentialTypeCode,
          },
          resp => {
            this.isLoading = false;
            if (
              resp.code !== 0 ||
              !resp.hasOwnProperty('data') ||
              resp.data.length === 0
            ) {
              this.message.error('档案迁入失败！', {nzDuration: 4000});
              this.isLoading = false;
              return;
            }
            if (resp.data) {
              this.isLoading = false;
              this.isCommit = true;
              this.message.success('档案迁入成功！', {nzDuration: 4000});
            } else {
              this.isLoading = false;
              this.message.warning('档案迁入失败！请稍后再试！', {
                nzDuration: 4000
              });
            }
          }
        );
        break;
      case '市平台建卡迁入':
        if (this.isBlank(this.queryCode) && this.isBlank(this.childCode)) {
          this.message.warning('请输入编号！', {nzDuration: 3000});
          this.isLoading = false;
          return;
        }
        if (Object.keys(this.serverCaseData).length === 0) {
          this.message.warning('未查询到数据，请先查询数据！', {
            nzDuration: 3000
          });
          this.isLoading = false;
          return;
        }
        this.profileService.commitCaseInCityPlatform(
          {
            povCode: this.caseParam.povCode,
            queryCode: this.queryCode,
            childCode: this.childCode,
            community: this.caseParam.community,
            profileStatusCode: this.caseParam.profileStatusCode,
            residentialTypeCode: this.caseParam.residentialTypeCode,
          },
          resp => {
            this.isLoading = false;
            if (
              resp.code !== 0 ||
              !resp.hasOwnProperty('data') ||
              resp.data.length === 0
            ) {
              this.message.error('档案迁入失败！', {nzDuration: 4000});
              this.isLoading = false;
              return;
            }
            if (resp.data) {
              this.isCommit = true;
              this.message.success('档案迁入成功！', {nzDuration: 4000});
            } else {
              this.isLoading = false;
              this.message.warning('档案迁入失败！请稍后再试！', {
                nzDuration: 4000
              });
            }
          }
        );
        break;
      default:
        console.log('异地迁入', this.serverProfile);
        this.profileService.commitCaseImmigration(
          {
            povCode: this.caseParam.povCode,
            childCode: this.serverProfile.profileCode,
            community: this.caseParam.community,
            profileStatusCode: this.caseParam.profileStatusCode,
            residentialTypeCode: this.caseParam.residentialTypeCode,
          },
          resp => {
            this.isLoading = false;
            if (
              resp.code !== 0 ||
              !resp.hasOwnProperty('data') ||
              resp.data.length === 0
            ) {
              this.message.error('档案迁入失败！', {nzDuration: 4000});
              this.isLoading = false;
              return;
            }
            if (resp.data) {
              this.isLoading = false;
              this.isCommit = true;
              this.message.success('档案迁入成功！', {nzDuration: 4000});
              // 关闭当前弹窗
              ref2.close();
              // 关闭后查询一下迁入的数据
              // this.queryData();
              // 340603030120176991
              // 档案迁入成功后,提醒用户是否查看当前迁入的档案，如果用户选择查看，则使用迁入的档案编码执行档案查询
              this.modalService.open(this.dialog, {
                context: '是否查看当前迁入的档案?',
                closeOnBackdropClick: false,
                closeOnEsc: false
              });
            } else {
              this.isLoading = false;
              this.message.warning('档案迁入失败！请稍后再试！', {
                nzDuration: 4000
              });
            }
          }
        );
        break;
    }
  }

  // 查看当前档案信息
  checkProfile(ref) {
    ref.close();
    // console.log('关闭', this.serverProfile);
    this.ref.close({profile: {...this.serverProfile}});
  }


  provincePlatformQuery() {
    const param = JSON.parse(JSON.stringify(this.caseParam));
    if (this.provQuery.queryOpt === 'immId') {
      this.profileService.queryCaseInProvincePlatformByImmunityCard(param, resp => {
          this.isLoading = false;
          if (resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data.length === 0) {
            this.message.warning('没有查到档案数据!');
            return;
          }
          this.serverCaseData = resp.data;
        }
      );
    } else {
      param.birthDate = DateUtils.getFormatTime(this.caseParam.birthDate, 'YYYY-MM-DD');
      this.profileService.queryCaseInProvincePlatformByChildInfo(param, resp => {
          this.isLoading = false;
          console.log(resp.data);
          if (resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data.length === 0) {
            this.message.warning('没有查到档案数据!');
            return;
          }
          this.serverCaseData = resp.data;
        }
      );
    }
  }

  cityPlatformQuery() {
    const param = {childCode: this.childCode, queryCode: this.queryCode, povCode: this.userInfo.pov};
    this.profileService.queryCaseInCityPlatform(param, resp => {
        this.isLoading = false;
        if (resp.code !== 0 || !resp.hasOwnProperty('data') || JSON.stringify(resp.data) === '{}') {
          this.message.warning('没有查到档案数据!');
          return;
        }
        this.serverCaseData = resp.data;
      }
    );
  }

  clearData() {
    this.serverVaccRecord = [];
  }

  changeTab(event) {
    this.tabTitle = event.tabTitle;
    this.queryCode = null;
    this.childCode = null;
    this.serverCaseData = [];
    this.serverProfile = {};
    this.serverGuardians = [];
    this.serverVaccRecord = [];
    this.caseParam = {
      childName: null,
      childCode: null,
      gender: null,
      birthDate: null,
      motherName: null,
      fatherName: null,
      cardNo: null,
      cardType: 'childCode',
      povCode: this.userInfo.pov,
      community: '0',
      profileStatusCode: '1',
      residentialTypeCode: '1',
    };
  }

  // 查看档案迁入信息
  openProfileInfo(dialog: TemplateRef<any>, data: any) {
    this.serverProfile = data.profile;
    if (data.downloadDepart) {
      this.serverProfile['vaccinationPovCode'] = data.downloadDepart;
    }
    this.serverGuardians = data.guardian;
    this.serverVaccRecord = data.vaccinateRecord;
    this.modalService.open(dialog);
  }

  queryData() {
    this.serverCaseData = [];
    this.serverProfile = {};
    this.serverGuardians = [];
    this.serverVaccRecord = [];
    switch (this.tabTitle) {
      case '省平台产科下载':
        if (this.provQuery.queryOpt === 'immId') {
          if (this.isBlank(this.caseParam.cardNo)) {
            this.message.warning('请输入免疫卡号！', {nzDuration: 3000});
            return;
          }
        } else {
          if (this.isBlank(this.caseParam.motherName)) {
            this.message.warning('请输入母亲姓名！', {nzDuration: 3000});
            return;
          }
          if (this.isBlank(this.caseParam.birthDate)) {
            this.message.warning('请选择出生日期！', {nzDuration: 3000});
            return;
          }
          if (this.isBlank(this.caseParam.gender)) {
            this.message.warning('请选择性别！', {nzDuration: 3000});
            return;
          }
        }
        this.provincePlatformQuery();
        this.isLoading = true;
        break;
      case '市平台建卡迁入':
        if (this.isBlank(this.queryCode) && this.isBlank(this.childCode)) {
          this.message.warning('请输入编号！', {nzDuration: 3000});
          return;
        }
        this.cityPlatformQuery();
        this.isLoading = true;
        break;
      default:
        if (this.queryOpt === 'id') {
          if (this.isBlank(this.caseParam.cardNo)) {
            this.message.warning('请输入相应证件号码！', {nzDuration: 3000});
            return;
          }
        } else {
          if (
            this.isBlank(this.caseParam.childName) &&
            this.isBlank(this.caseParam.motherName) &&
            this.isBlank(this.caseParam.fatherName)
          ) {
            this.message.warning('儿童姓名和父母姓名至少填一个！', {
              nzDuration: 3000
            });
            return;
          }
          if (this.isBlank(this.caseParam.birthDate)) {
            this.message.warning('请选择出生日期！', {nzDuration: 3000});
            return;
          }
          if (this.isBlank(this.caseParam.gender)) {
            this.message.warning('请选择性别！', {nzDuration: 3000});
            return;
          }
        }
        this.queryCaseImmigrationProfile();
        this.isLoading = true;
        break;
    }
  }

  isBlank(str?: any) {
    if (str === null) {
      return true;
    }
    return str.toString().trim() === '';
  }

  openTipsModal(data) {
    this.modalService
      .open(ConfirmDialogComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        hasScroll: false,
        context: {
          title: '信息提示',
          content: '本地已有该个案，是否转到该个案？'
        }
      })
      .onClose.subscribe(isConfirm => {
      if (isConfirm) {
        this.onClose(data);
      }
    });
  }
}

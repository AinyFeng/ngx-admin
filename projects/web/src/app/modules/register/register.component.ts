import { AppStateService } from '../../@uea/service/app.state.service';
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import {
  NbDialogService,
  NbSidebarService,
  NbIconLibraries
} from '@nebular/theme';
import { AddProfileComponent } from './components/profile/add-profile-main/add-profile.component';
import { FFileImportComponent } from './components/f-file-import/f-file-import.component';
import { ProfileStatusChangeComponent } from './components/profile-status-change/profile-status-change.component';
import { FFileComparisonComponent } from './components/f-file-comparison/f-file-comparison.component';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { UserService } from '@tod/uea-auth-lib';
import { SchoolAttendCertificationDialogComponent } from './components/print-dialog/school-attend-certification-dialog/school-attend-certification-dialog.component';
import { PrintProfileDialogComponent } from './components/print-dialog/print-profile-dialog/print-profile-dialog.component';
import { PrintAgreementDialogComponent } from './components/print-dialog/print-agreement-dialog/print-agreement-dialog.component';
import { PrintVaccRecordDialogComponent } from './components/print-dialog/print-vacc-record-dialog/print-vacc-record-dialog.component';
import { PrintChildCaseComponent } from './components/print-dialog/print-child-case/print-child-case.component';
import { PrecheckDialogComponent } from './components/previewing/precheck-dialog/precheck-dialog.component';
import {
  CK_FILE_OPERATIONS,
  CK_PRINT_OPERATIONS,
  MORE_OPERATIONS,
  ProfileService,
  ProfileDataService,
  ProfileChangeService,
  QueueListService,
  SystemPreliminaryClinicalService
} from '@tod/svs-common-lib';
import { ConfirmDialogComponent } from '../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { SearchResultComponent } from '../../@uea/components/dialog/search-result/search-result.component';
import { Route, Router } from '@angular/router';
import { ReservationListByVaccRecordComponent } from './components/reservation/reservation-management/reservation-list-by-vacc-record.component';
import { PreviewingRecordComponent } from './components/previewing/previewing-record/previewing-record.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'mds-register-component',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: []
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  // 档案的状态
  showProfileDeleted: boolean;
  profileDelete: boolean;
  // 档案信息
  profile: any;
  btnSize = 'medium';

  alive = true;

  fieldSize = 'medium';
  fileOps = [...CK_FILE_OPERATIONS, ...MORE_OPERATIONS];
  printOps = CK_PRINT_OPERATIONS;
  printOption = { label: '', value: '' };
  // moreOps = MORE_OPERATIONS;
  // moreOption = { label: '', value: '' };

  // 已经叫号的人员
  calledData: any;

  // input 框的输入参数
  searchContent: string;
  loading = false;

  private subscription: Subscription[] = [];

  // 登记记录表数量
  registRecordCount = 0;
  // 预约记录数量
  reservationRecordCount = 0;
  // 用户信息
  userInfo: any;

  // 预诊模板
  modelContent: any;

  // 预诊是否通过
  diagnosePass: any;

  constructor(
    private appStateService: AppStateService,
    private dialogService: NbDialogService,
    private profileSvc: ProfileService,
    private msg: NzMessageService,
    private profileDataSvc: ProfileDataService,
    private profileChangeDataSvc: ProfileChangeService,
    private userSvc: UserService,
    private sidebarService: NbSidebarService,
    iconLibraries: NbIconLibraries,
    private callNumberSvc: QueueListService,
    private preliminaryClinicalSvc: SystemPreliminaryClinicalService,
    private notifier: NotifierService
  ) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconLibraries.setDefaultPack('fas');

    const sub2 = this.profileDataSvc.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
        this.searchContent = resp['profileCode'];
      }
    });
    const sub1 = this.profileDataSvc
      .getProfileDeletedStatus()
      .subscribe(resp => {
        // console.log('档案状态', resp);
        this.showProfileDeleted = resp;
        this.profileDelete = resp;
      });
    this.subscription.push(sub1);
    this.subscription.push(sub2);
    const sub3 = this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
    });
    this.subscription.push(sub3);
  }

  ngOnInit() {
    this.appStateService.setSubTitle('医生工作台');
    this.profileDataSvc.resetProfileData();
    // 获取预诊模板
    this.getPreliminaryContent();
  }

  ngAfterViewInit() {
    this.sidebarService.collapse();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
    this.appStateService.clearSubTitle();
    this.profileDataSvc.resetProfileData();
  }

  openDialog(indx: string) {
    // 打开 新增档案 组件
    if (indx === 'profile_add') {
      this.dialogService.open(AddProfileComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false
      });
      return;
    }
    // 档案迁入
    if (indx === 'profile_import') {
      this.dialogService
        .open(FFileImportComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false
        })
        .onClose.subscribe(serverData => {
        console.log('档案迁入', serverData);
        if (serverData) {
          let serverProfile = serverData.profile;
          this.searchContent = serverProfile.name;
          this.searchProfile();
        }
      });
      return;
    }
    // 预诊记录
    if (indx === 'prognostics_record') {
      if (!this.profile) {
        this.msg.info('请进行查询操作获取档案信息！');
        return;
      }
      this.dialogService
        .open(PreviewingRecordComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false
        });
      return;
    }
    if (this.checkProfileDeleteStatus()) return;

    // 在册状态变更
    if (indx === 'registered_change') {
      this.dialogService.open(ProfileStatusChangeComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false
      }).onClose.subscribe(r => {
        if (r) {
          this.searchProfile();
        }
      });
      return;
    }
    // 个案更新
    if (indx === 'file-comparison') {
      this.dialogService.open(FFileComparisonComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false
      });
      return;
    }
    // 打印接种记录
    if (indx === 'printVaccRecord') {
      if (this.checkProfileDeleteStatus()) {
        return;
      }
      this.dialogService.open(PrintVaccRecordDialogComponent, {
        closeOnBackdropClick: false,
        closeOnEsc: false
      });
      return;
    }
    // 打印受种者档案
    if (indx === 'printProfile') {
      this.dialogService.open(PrintProfileDialogComponent, {
        closeOnBackdropClick: false,
        closeOnEsc: false
      });
      return;
    }
    // 打印儿童接种本档案
    if (indx === 'printChildCase') {
      this.dialogService.open(PrintChildCaseComponent, {
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          profile: this.profile,
          userInfo: this.userInfo
        }
      });
      return;
    }

    // 打印告知书
    if (indx === 'vacAgreement') {
      this.dialogService.open(PrintAgreementDialogComponent, {
        closeOnBackdropClick: false,
        closeOnEsc: false
      });
      return;
    }

    // 入托证明
    if (indx === 'careToProve') {
      if (this.checkProfileDeleteStatus()) {
        return;
      }
      if (this.profile.age >= 16) {
        this.msg.warning('成人没有入托证明');
      } else {
        this.dialogService.open(SchoolAttendCertificationDialogComponent, {
          closeOnBackdropClick: false,
          closeOnEsc: false
        });
      }
      return;
    }
  }

  /**
   * 当叫号成功之后，则开始查询档案同时修改叫号的状态
   * 1. 先修改叫号的状态 - 改为登记中
   * 2. 查询档案
   * @param e
   */
  onCallNumberQueryProfile(e) {
    // console.log('register component 收到当前叫号数据', e);
    this.calledData = e;
    this.searchContent = e['profileCode'];
    this.callNumberSvc.setCallingNumber(e);
    this.searchProfile(e);
    this.profileDataSvc.setProfileData(null);
    // 点击叫号之后，如果没有档案信息，可以提示是否创建新的档案
    if (!this.searchContent || this.searchContent === '') {
      this.dialogService
        .open(ConfirmDialogComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: {
            title: '信息提示',
            content: '没有查到任何档案信息，是否创建新的档案？'
          }
        })
        .onClose.subscribe(confirm => {
        if (confirm) {
          // 如果有叫号数据，说明是叫号成功之后查询的档案信息，根据叫号信息中的姓名开始创建档案
          if (this.calledData) {
            console.log(
              '当没有查到档案时，需要新建档案传递的数据是',
              this.calledData
            );
            this.profileChangeDataSvc.setCallNumberProfileName(
              this.calledData
            );
          }
          this.dialogService
            .open(AddProfileComponent, {
              hasBackdrop: true,
              closeOnBackdropClick: false,
              closeOnEsc: false
            })
            .onClose.subscribe(_ => {
            // 如果有叫号数据，说明是叫号成功之后查询的档案信息，根据叫号信息中的姓名开始创建档案
            // 并在关闭新建档案之后，清除叫号数据，避免建档时出现看见姓名处有内容而忽略填写正确姓名的情况
            if (this.calledData) {
              this.calledData = null;
            }
          });
        }
      });
    }

  }

  /**
   * 查询档案，根据input 输入参数
   */
  searchProfile(callingData?: any) {
    // 如果还在查询，则不执行查询操作
    if (this.loading) return;
    if (!this.searchContent || this.searchContent.trim() === '') {
      return;
    }
    this.loading = true;
    let query = {
      pageNo: 1,
      pageSize: 10
    };
    this.profileSvc.queryProfileByStr(this.searchContent, query, resp => {
      this.loading = false;
      console.log(resp);
      if (resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) {
        this.msg.info('没有查到数据，请重试');
        return;
      }
      if (resp[1].code !== 0 || !resp[1].hasOwnProperty('data')) {
        this.msg.info('没有查到数据，请重试');
        return;
      }
      // 需要判断3次，第一次判断如果没有查到档案，第二次判断查到的结果是否为大于1，第三次如果查到的结果只有1个，则不需要弹框
      if (resp[0].data.length === 0) {
        this.msg.info('没有查到档案信息');
        this.profileDataSvc.setProfileData(null);
      } else if (resp[0].data.length > 1) {
        // 查到的档案信息大于1个
        this.dialogService
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
          // console.log(res);
          this.setProfileData(res);
        });
      } else {
        // 当只有一个档案信息时，直接将数据设置到全局中
        const profile = resp[0].data[0];
        if (callingData) {
          profile['globalRecordNumber'] = callingData['globalRecordNumber'];
        }
        this.setProfileData(profile);
      }
    });
  }

  // 获取预诊模板
  getPreliminaryContent() {
    const params = {
      modalCode: null,
    };
    this.preliminaryClinicalSvc.queryPreliminaryClinical(params, resp => {
      this.modelContent = [];
      if (!resp || resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data.length === 0) {
        // this.msg.warning('暂时未查询到数据');
        return;
      }
      this.modelContent = resp.data;
    });
  }

  /**
   * 预诊功能
   * @author ainy
   * @params:
   * @date 2019/11/13
   */
  preliminaryClinical() {
    if (this.checkProfileDeleteStatus()) return;
    this.dialogService.open(PrecheckDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        modelContent: this.modelContent,
        profile: this.profile,
      }
    }).onClose.subscribe(resp => {
      // console.log('返回的结果', resp);
      if (resp !== undefined) {
        this.diagnosePass = resp;
      } else {
        this.diagnosePass = null;
      }
    });
  }

  /**
   * 将档案信息设置到全局 service 中
   * @param res
   */
  setProfileData(res) {
    if (res) {
      // 判断查询到的档案是否是本部门，如果不是则提示执行档案迁入
      if (res['vaccinationPovCode'] === this.userInfo.pov) {
        this.profileDataSvc.setProfileData(res);
      } else {
        this.dialogService
          .open(ConfirmDialogComponent, {
            hasBackdrop: true,
            closeOnBackdropClick: false,
            closeOnEsc: false,
            hasScroll: false,
            context: {
              title: '信息提示',
              content: '当前档案不属于本部门，请先执行档案迁入操作！'
            }
          })
          .onClose.subscribe(isUpdate => {
          if (isUpdate) {
            this.dialogService.open(FFileComparisonComponent, {
              hasBackdrop: true,
              closeOnBackdropClick: false,
              closeOnEsc: false,
              hasScroll: false,
              context: {
                localProfile: res
              }
            }).onClose.subscribe(ret => {
              // 如果叫号信息中包含档案编码，说明已经查到了档案信息，则在查询到的档案信息中添加全局流水号 -  globalRecordNumber
              if (this.calledData && this.calledData['profileCode']) {
                res['globalRecordNumber'] = this.calledData['globalRecordNumber'];
                this.calledData = null;
                // console.log(res);
              }
            });
          } else {
            this.profileDataSvc.setProfileData(null);
          }
        });
      }
    }
  }

  /**
   * 检查档案的状态
   */
  checkProfileDeleteStatus(): boolean {
    if (this.profileDelete) {
      this.notifier.notify('warning', '当前档案已经被删除，无法操作');
      // this.msg.warning('当前档案已经被删除，无法操作');
      return true;
    }
    if (!this.profile) {
      this.notifier.notify('warning', '请先查询档案信息再执行后续操作');
      // this.msg.warning('');
      return true;
    }
    if (this.profile['vaccinationPovCode'] !== this.userInfo.pov) {
      this.notifier.notify('warning', '当前档案不属于本部门，请先执行档案迁入操作');
      // this.msg.warning('当前档案不属于本部门，请先执行档案迁入操作');
      return true;
    }
    return false;
  }

  /**
   * 监听登记记录表事件
   * 用于展示查询的登记记录数量，没有别的用途
   * @param ev
   */
  onRegistRecordCount(ev) {
    this.registRecordCount = ev;
  }

  /**
   * 监听预约记录输出事件
   * 展示预约记录的数量
   * @param ev
   */
  onReservationRecordCount(ev) {
    this.reservationRecordCount = ev;
  }

  /**
   * 跳转到预约管理
   */
  gotoReservationManagement() {
    this.dialogService.open(ReservationListByVaccRecordComponent, {
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false
    });
  }


}

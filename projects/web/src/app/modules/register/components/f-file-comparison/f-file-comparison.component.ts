import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { DateUtils, IsHaveLocalProfilePipe } from '@tod/svs-common-lib';
import { VaccinateService, ProfileService, ProfileDataService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-f-file-comparison',
  templateUrl: './f-file-comparison.component.html',
  styleUrls: ['./f-file-comparison.component.scss'],
  providers: [IsHaveLocalProfilePipe]
})
export class FFileComparisonComponent implements OnInit {
  // 当前登录用户信息
  userInfo: any = {};
  // 本地信息
  localProfile: any = {};
  localProfileTemp: any = {};
  localVaccRecord: any[] = [];
  // 省平台信息
  serverProfile: any = {};
  serverVaccRecord: any[] = [];

  // 省平台接种记录是否和本地接种记录相同
  isSame: boolean = true;
  isLoading: boolean = false;
  isCommit: boolean = false;
  isLocalPov: boolean = true;
  isBasedLocal: any = true;
  isUpdate: any = false;

  options = [
    { value: true, label: '本地为主', checked: true },
    { value: false, label: '省平台为主' }
  ];

  constructor(
    private ref: NbDialogRef<FFileComparisonComponent>,
    private vaccService: VaccinateService,
    private userService: UserService,
    private message: NzMessageService,
    private profileService: ProfileService,
    // private statusPipe: IsHaveLocalProfilePipe,
    private modalService: NbDialogService,
    private profileDataSvc: ProfileDataService
  ) {
    this.userService.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
    });
    this.profileDataSvc.getProfileData().subscribe(data => {
      if (0 === Object.keys(this.localProfile).length) {
        this.localProfile = data;
      }
    });
  }

  ngOnInit() {
    this.queryCaseProfile();
  }

  onClose() {
    this.ref.close(this.isUpdate);
  }

  /**
   * 本地数据和省平台数据比较
   * @param arr1 本地数据
   * @param arr2 省平台数据
   */
  compareRecord(arr1: any[], arr2: any): boolean {
    let isHaveSame = true;
    let map1 = new Map();
    let map2 = new Map();
    arr1.forEach((a1, i) => {
      a1.index = i;
      map1.set(a1.vaccineSubclassCode + DateUtils.getFormatTime(a1.vaccinateTime, 'YYYY-MM-DD'), a1);
    });

    arr2.forEach((a2, i) => {
      a2.index = i;
      map2.set(a2.vaccineSubclassCode + DateUtils.getFormatTime(a2.vaccinateTime, 'YYYY-MM-DD'), a2);
    });

    arr1.forEach(a1 => {
      let str1 = a1.vaccineSubclassCode + DateUtils.getFormatTime(a1.vaccinateTime, 'YYYY-MM-DD');
      if (!map2.has(str1)) {
        a1.class = 'not-same';
      } else {
        a1.class = 'same';
      }
    });

    arr2.forEach(a2 => {
      let str2 = a2.vaccineSubclassCode + DateUtils.getFormatTime(a2.vaccinateTime, 'YYYY-MM-DD');
      if (!map1.has(str2)) {
        a2.class = 'not-same';
        isHaveSame = false;
      } else {
        a2.class = 'same';
      }
    });
    console.log(isHaveSame);
    return isHaveSame;
  }

  /**
   * 获取母亲名字
   * @param guardians
   */
  getMother(guardians) {
    let motherName = '';
    guardians.forEach(guardian => {
      if (guardian.relationshipCode === '2') {
        motherName = guardian.name;
      }
    });
    return motherName;
  }

  /**
   * 获取父亲名字
   * @param guardians
   */
  getFather(guardians) {
    let fatherName = '';
    guardians.forEach(guardian => {
      if (guardian.relationshipCode === '1') {
        fatherName = guardian.name;
      }
    });
    return fatherName;
  }

  /**
   * 查询异地个案和本地个案
   */
  queryCaseProfile() {
    this.profileService.queryProfile(
      { profileCode: this.localProfile.profileCode },
      resp => {
        if (
          resp.code !== 0 ||
          !resp.hasOwnProperty('data') ||
          resp.data.length === 0
        ) {
          this.message.warning('没有查到档案数据', { nzDuration: 3000 });
        } else {
          this.localProfileTemp = resp.data[0];
        }
      }
    );
    const param = {
      profileCode: this.localProfile.profileCode,
      pageEntity: {
        page: 1,
        pageSize: 999,
        sortBy: [
          'vaccinateTime,DESC',
        ]
      }
    };
    this.vaccService.queryVaccinateRecordSingle(param,
      resp => {
        if (resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data.length === 0) {
          this.message.warning('没有查到档案数据', { nzDuration: 3000 });
          return;
        }
        this.localVaccRecord = resp.data;
        this.localVaccRecord.sort((a, b) => b.vaccinateTime - a.vaccinateTime);
        this.profileService.queryCaseImmigrationByCardNumber(
          {
            povCode: this.userInfo.pov,
            cardType: 'childCode',
            cardNo: this.localProfile.profileCode
          },
          resp2 => {
            if (
              resp2.code !== 0 ||
              !resp2.hasOwnProperty('data') ||
              resp2.data.length === 0
            ) {
              this.message.warning('省平台服务器没有查到档案数据', {
                nzDuration: 3000
              });
              return;
            }
            this.serverProfile = resp2.data[0].profile;
            // this.isLocalPov = this.userInfo.pov === this.serverProfile.vaccinationPovCode === this.localProfile.vaccinationPovCode;
            // 判断当前登录 pov 是否为档案管理的 pov
            this.isLocalPov = this.userInfo.pov === this.localProfile.vaccinationPovCode;
            this.serverVaccRecord = resp2.data[0].vaccinateRecord;
            this.serverVaccRecord.sort((a, b) => b.vaccinateTime - a.vaccinateTime);
            this.isSame = this.compareRecord(this.localVaccRecord, this.serverVaccRecord);
          }
        );
      }
    );
  }

  /**
   * 变更在册状态 或 变更在册状态及插入选中的省平台数据
   */
  commitCaseAndOrChangeStatus() {
    let profileCode = this.localProfile.profileCode;
    let param: any = {
      departCode: this.userInfo.pov,
      povCode: this.userInfo.pov,
      childCode: profileCode,
      changeBy: this.userInfo.name,
      // 是否基于本地档案信息更新数据
      isBasedLocal: this.isBasedLocal
    };
    // 判断档案现管理单位是否为本单位，如果现管理单位是本单位，则不通知省平台迁移，如果现管理单位不是本单位，则通知省平台迁移且插入在册状态变更记录
    if (this.isLocalPov) {
      param.isNotice = '0';
    } else {
      param.isNotice = '1';
    }
    this.profileService.updateCaseImmunity(param, resp => {
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp.data.length === 0
      ) {
        this.message.error('档案迁入失败！', { nzDuration: 4000 });
        this.isLoading = false;
        return;
      }
      if (resp.data === true) {
        this.message.success('档案迁入成功！', { nzDuration: 4000 });
        this.serverVaccRecord
          .filter(item => item.class !== 'same')
          .forEach(item => {
            item.class = 'same';
          });
        this.queryCaseProfile();
        this.isLoading = false;
        this.isCommit = true;
        this.isUpdate = true;
        this.localProfileTemp['vaccinationPovCode'] = this.userInfo.pov;
        this.profileDataSvc.setProfileData(this.localProfileTemp);
      } else {
        this.message.warning('档案迁入失败！请稍后再试！', {
          nzDuration: 4000
        });
        this.isLoading = false;
      }
    });
  }

  openModal() {
    this.isLoading = true;
    this.modalService
      .open(ConfirmDialogComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        hasScroll: false,
        context: {
          title: '信息提示',
          content: this.isBasedLocal
            ? '将以本地数据为主进行更新和迁入！'
            : '将以省平台数据为主进行更新和迁入！'
        }
      })
      .onClose.subscribe(isConfirm => {
      if (isConfirm) {
        this.commitCaseAndOrChangeStatus();
      }
      this.isLoading = false;
    });
  }
}

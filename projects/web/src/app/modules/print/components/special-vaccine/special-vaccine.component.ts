import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { InjectionSheetDialogComponent } from '../injection-sheet-dialog/injection-sheet-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { UserService } from '@tod/uea-auth-lib';
import { RabiesAgreementComponent } from '../rabies-agreement/rabies-agreement.component';
import { PrintRabiesProveComponent } from '../print-rabies-prove/print-rabies-prove.component';
import {ProfileDataService, PovInfoService, AgreementService, VaccinateStrategyApiService} from '@tod/svs-common-lib';
import {DateUtils} from '../../../../../../../svs-common-lib/src/lib/utils/date.utils';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'uea-special-vaccine',
  templateUrl: './special-vaccine.component.html',
  styleUrls: ['./special-vaccine.component.scss'],
  providers: [VaccinateStrategyApiService]
})
export class SpecialVaccineComponent implements OnInit, OnDestroy {
  @Input()
  specialVaccineInfo: any;
  btnSize = 'small';

  // 此档案人的信息
  profile: any;
  isChild = true;
  // 登录用户信息
  userInfo: any;
  // 获取pov
  povInfo: any;
  // 获取狂犬告知书模板
  rabiesAgreementTemplate: any;

  // 取消观察者对象队列
  subscriptionArr: Subscription[] = [];

  constructor(
    private dialogService: NbDialogService,
    private profileDataSvc: ProfileDataService,
    private userSvc: UserService,
    private povApiSvc: PovInfoService,
    private agreementSvc: AgreementService,
    private vacStraSvc: VaccinateStrategyApiService,
    private msg: NzMessageService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => (this.userInfo = user));
    const sub = this.profileDataSvc.getProfileData().subscribe(resp => {
      if (resp) {
        this.isChild = resp.age < 16;
        this.profile = resp;
      }
    });
    this.subscriptionArr.push(sub);
  }

  ngOnInit() {
    this.getPovInfo();
    console.log('特需', this.specialVaccineInfo);
  }

  ngOnDestroy(): void {
    this.subscriptionArr.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  // 根据登录用户查询接种门诊的基本信息，比如接种门诊的工作时间等
  getPovInfo() {
    const query = {
      povCode: this.userInfo.pov
    };
    this.povApiSvc.queryPovInfo(query, resp => {
      console.log('povInfo', resp);
      if (
        resp.code === 0 &&
        resp.hasOwnProperty('data') &&
        resp.data.length !== 0
      ) {
        this.povInfo = resp.data[0];
      }
    });
  }

  // 打印注射单
  injectionSingle(data: any) {
    console.log('print', data);
    this.getInjectInfo(data);
  }

  // 告知书
  rabiesAgreement(data: any) {
    this.rabiesAgreementTemplate = this.agreementSvc.getAgreementByCode(
      data.broadHeadingCode
    );
    this.dialogService.open(RabiesAgreementComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        rabiesAgreementTemplate: this.rabiesAgreementTemplate
      }
    });
  }

  // 打印狂犬证明
  printProve(data: any) {
    this.dialogService.open(PrintRabiesProveComponent, {
      context: {
        profile: this.profile,
        povInfo: this.povInfo,
        isChild: this.isChild,
        rabiesInfo: data
      }
    });
  }

  // 获取注射单的数据
  getInjectInfo(data) {
    this.vacStraSvc.queryInjectPrintInfo(data.profileCode, data.programCode, DateUtils.formatToDate(new Date()), resp => {
      console.log('结果', resp);
      if (resp && resp.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        // 获取打印注射单信息成功弹框
        this.dialogService.open(InjectionSheetDialogComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: {
            injectSingleData: data,
            profile: this.profile,
            child: this.isChild,
            povInfo: this.povInfo,
            printInfo: resp.data
          }
        });
      } else {
        this.msg.warning('获取数据失败');
        return;
      }
    });

  }
}

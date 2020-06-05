import { ConfirmDialogComponent } from '../../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { IllnessListComponent } from '../../medical-history/illness-list/illness-list.component';
import { RabiesBittenListComponent } from '../../rabies-record/rabies-bitten-list/rabies-bitten-list.component';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { UpdateAdultProfileComponent } from '../../profile/update-adult-profile/update-adult-profile.component';
import { UpdateChildProfileComponent } from '../../profile/update-child-profile/update-child-profile.component';
import { UserService } from '@tod/uea-auth-lib';
import { ImmunizationModifyComponent } from '../../immunization/immunization-modify/immunization-modify.component';
import {
    ProfileDataService,
    ProfileService,
    AefiService,
    MedicalHistoryService,
    BiteService,
    ProfileChangeService,
    ImmunizationService,
    ProfileStatusChangeService,
    RecommendVaccineNotificationService,
    PROFILE_CHANGE_KEY,
    RECOMMEND_VACCINE_REFRESH,
    DateUtils
} from '@tod/svs-common-lib';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'uea-show-profile',
    templateUrl: './basic-info-table.component.html',
    styleUrls: ['./basic-info-table.component.scss']
})
export class BasicInfoTableComponent implements OnInit, OnDestroy {
    isChild = true;

    // 监护人信息列表
    guardianInfo = [];

    // aefi 信息列表
    aefiInfo = [];

    // 禁忌、过敏、病史信息
    medicalInfo = [];
    contraInfo = []; // 禁忌
    allergyInfo = []; // 过敏
    illNessInfo = []; // 病史

    // 犬伤记录
    rabiesBittenInfo = [];

    profile: any;

    basicInfo = [];

    // 免疫接种卡信息列表
    immuCardInfo = [];

    // 档案操作下拉框选项
    dropdownOptions = [
        { label: '添加禁忌、过敏、病史信息', value: 'addMedicalRecord' },
        { label: '查看/登记成人疫苗', value: 'addRabiesRecord' },
        { label: '修改免疫接种卡信息', value: 'modifyImmuVacCard' }
    ];

    // 档案删除状态
    profileDeleted: boolean;

    // 取消观察者对象队列
    subscriptionArr: Subscription[] = [];

    // 用户信息
    userInfo: any;

    constructor(
        private profileDataSvc: ProfileDataService,
        private dialogService: NbDialogService,
        private profileSvc: ProfileService,
        private msg: NzMessageService,
        private aefiSvc: AefiService,
        private medicalSvc: MedicalHistoryService,
        private biteSvc: BiteService,
        private profileChange: ProfileChangeService,
        private immuCardSvc: ImmunizationService,
        private profileStatusChangeSvc: ProfileStatusChangeService,
        private recommendVacSvc: RecommendVaccineNotificationService,
        private userSvc: UserService,
        private notifier: NotifierService
    ) {
        this.resetProfile();
        // 获取用户信息
        this.userSvc.getUserInfoByType().subscribe(user => (this.userInfo = user));
        const sub = this.profileDataSvc.getProfileData().subscribe(resp => {
            this.resetData();
            if (resp) {
                console.log(resp);
                this.isChild = resp.age < 16;
                this.profile = resp;
                this.basicInfo.push(resp);
                this.queryMedical();
                this.queryRabiteAndAdultVaccineRecord();
            }
        });
        const sub1 = this.profileDataSvc
            .getProfileDeletedStatus()
            .subscribe(resp => {
                this.profileDeleted = resp;
            });
        this.subscriptionArr.push(sub);
        this.subscriptionArr.push(sub1);
    }

    resetData() {
        // 档案信息置空
        this.profile = null;
        // 监护人信息列表
        this.guardianInfo = [];

        // aefi 信息列表
        this.aefiInfo = [];

        // 禁忌、过敏、病史信息
        this.medicalInfo = [];
        this.contraInfo = []; // 禁忌
        this.allergyInfo = []; // 过敏
        this.illNessInfo = []; // 病史

        // 犬伤记录
        this.rabiesBittenInfo = [];

        // 免疫接种卡
        this.immuCardInfo = [];
    }

    ngOnInit() {
        const sub = this.profileChange.getProfileChange().subscribe(key => {
            switch (key) {
                case PROFILE_CHANGE_KEY.ILLNESS:
                    this.queryMedical();
                    this.recommendVacSvc.setVaccineStrategyNotification(
                        RECOMMEND_VACCINE_REFRESH
                    );
                    break;
                case PROFILE_CHANGE_KEY.RABIES:
                    // this.queryRabies();
                    this.queryRabiteAndAdultVaccineRecord();
                    this.recommendVacSvc.setVaccineStrategyNotification(
                        RECOMMEND_VACCINE_REFRESH
                    );
                    break;
                case PROFILE_CHANGE_KEY.PROFILE:
                    this.queryProfile();
                    break;
            }
        });
        this.subscriptionArr.push(sub);
    }

    ngOnDestroy(): void {
        this.subscriptionArr.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    openDialog(indx: string) {
        if (this.checkProfileDeleteStatus()) return;
        // 添加 禁忌、过敏、病史
        if (indx === 'addMedicalRecord') {
            this.dialogService.open(IllnessListComponent, {
                hasBackdrop: true,
                closeOnBackdropClick: false,
                closeOnEsc: false
            });
        }
        // 添加AEFI 信息
        // if (indx === 'addAEFI') {
        /*this.dialogService.open(AefiListComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false,
        });*/
        // }
        // 添加犬伤记录  查看登记成人疫苗
        if (indx === 'addRabiesRecord') {
            this.dialogService.open(RabiesBittenListComponent, {
                hasBackdrop: true,
                closeOnBackdropClick: false,
                closeOnEsc: false
            });
          //    .onClose.subscribe(resp => this.queryRabiteAndAdultVaccineRecord())
        }
        // 修改免疫接种卡信息
        if (indx === 'modifyImmuVacCard') {
            this.dialogService
                .open(ImmunizationModifyComponent, {
                    hasBackdrop: true,
                    closeOnBackdropClick: false,
                    closeOnEsc: false
                })
                .onClose.subscribe(closeEvent => {
                if (closeEvent) {
                    this.profileChange.setProfileChange(PROFILE_CHANGE_KEY.PROFILE);
                }
            });
        }
        // 修改档案
        if (indx === 'updateProfile') {
            if (!this.profile) {
                this.msg.info('请先查询档案后再执行修改');
                return;
            }
            const age = this.profile['age'];
            if (age >= 16) {
                // 打开成人档案修改页面
                this.dialogService
                    .open(UpdateAdultProfileComponent, {
                        hasBackdrop: true,
                        closeOnBackdropClick: false,
                        closeOnEsc: false
                    })
                    .onClose.subscribe(resp => {
                    if (resp) {
                        this.queryProfile();
                        this.profileDataSvc.setVaccinateStrategyChange(ProfileDataService.VACCINATE_STRATEGY_CHANGE);
                    }
                });
            } else {
                // 打开儿童档案修改页面
                this.dialogService
                    .open(UpdateChildProfileComponent, {
                        hasBackdrop: true,
                        closeOnBackdropClick: false,
                        closeOnEsc: false
                    })
                    .onClose.subscribe(resp => {
                    if (resp) {
                        this.queryProfile();
                        this.profileDataSvc.setVaccinateStrategyChange(ProfileDataService.VACCINATE_STRATEGY_CHANGE);
                    }
                });
            }
        }
        // 删除档案
        if (indx === 'deleteProfile') {
            this.dialogService
                .open(ConfirmDialogComponent, {
                    hasBackdrop: true,
                    closeOnBackdropClick: false,
                    closeOnEsc: false,
                    context: {
                        title: '档案删除确认',
                        content: `确认删除档案【${this.profile['name']}】吗？`
                    }
                })
                .onClose.subscribe(result => {
                if (result) {
                    this.dialogService
                        .open(ConfirmDialogComponent, {
                            hasBackdrop: true,
                            closeOnBackdropClick: false,
                            closeOnEsc: false,
                            context: {
                                title: '档案删除再次确认',
                                content: `此操作不可逆，档案删除之后将无法恢复，请再次确认删除档案【${this.profile['name']}】？`,
                                status: 'danger'
                            }
                        })
                        .onClose.subscribe(confirmAgain => {
                        if (confirmAgain) {
                            this.deleteProfile();
                        }
                    });
                }
            });
        }
    }

    /**
     * 查询病史信息
     */
    queryMedical() {
        if (!this.profile) return;
        const queryMedical = {
            profileCode: this.profile['profileCode']
        };
        this.medicalSvc.queryMedicalRecord(queryMedical, resp => {
            if (
                resp.code !== 0 ||
                !resp.hasOwnProperty('data') ||
                resp.data.length === 0
            ) {
                // this.msg.warning('没有查到病史记录，请重试！');
                console.warn('没有查到病史记录');
                return;
            }
            this.medicalInfo = resp.data;
            this.contraInfo = [];
            this.allergyInfo = [];
            this.illNessInfo = [];
            this.medicalInfo.forEach(item => {
                if (item.type === '1') {
                    this.contraInfo.push(item);
                }
                if (item.type === '2') {
                    this.allergyInfo.push(item);
                }
                if (item.type === '3') {
                    this.illNessInfo.push(item);
                }
            });
        });
    }

    /**
     * 查询犬伤信息，根据档案编码
     */
    queryRabies() {
        if (!this.profile) return;
        const queryRabies = {
            profileCode: this.profile['profileCode']
        };
        this.biteSvc.queryBiteRecord(queryRabies, resp => {
            if (
                resp.code !== 0 ||
                !resp.hasOwnProperty('data') ||
                resp.data.length === 0
            ) {
                // this.msg.warning('没有查到犬伤记录，请重试！');
                console.warn('没有查到犬伤记录');
                return;
            }
            this.rabiesBittenInfo = resp.data;
        });
    }

    /*
     * 查询犬伤和成人信息,根据档案编码
     * */
    queryRabiteAndAdultVaccineRecord() {
        if (!this.profile) return;
        const queryRabies = {
            profileCode: this.profile['profileCode']
        };
        this.rabiesBittenInfo = [];
        this.biteSvc.queryRabiteAndAdultVaccineRecord(queryRabies, resp => {
          console.log('result成人疫苗', resp);
            if (
                (resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) &&
                (resp[1].code !== 0 || !resp[1].hasOwnProperty('data'))
            ) {
                console.warn('没有查到特需疫苗记录');
                return;
            }
            if (resp[0].data.length) {
                resp[0].data.forEach(item => item['broadHeadingCode'] = '28');
                this.rabiesBittenInfo.push(...resp[0].data);
            }
            if (resp[1].data.length) {
                this.rabiesBittenInfo.push(...resp[1].data);
            }
        });
    }

    queryProfile() {
        if (!this.profile) return;
        let query = {
            profileCode: this.profile['profileCode']
        };
        this.profileSvc.queryProfile(query, resp => {
            if (
                resp.code !== 0 ||
                !resp.hasOwnProperty('data') ||
                resp.data.length === 0
            ) {
                console.warn('没有查到档案数据');
                return;
            }
            this.profileDataSvc.setProfileData(resp.data[0]);
        });
    }

    /**
     * 重置疫苗策略模型
     */
    resetVaccinateStrategy() {

    }

    /**
     * 删除档案，修改档案状态为"平台删除"
     */
    deleteProfile() {
        if (this.checkProfileDeleteStatus()) return;
        // 档案删除成功之后添加一条档案删除的在册变更记录
        const save = {
            record: {
                changeDate: DateUtils.getNewDateTime(),
                changeReason: '6',
                changeBy: this.userInfo.userCode,
                changeDep: this.userInfo.pov,
                preProfileStatus: this.profile['profileStatusCode'],
                curPov: this.userInfo.pov,
                prePov: this.userInfo.pov,
                curProfileStatus: '10',
                profileCode: this.profile['profileCode'],
                memo: `由工号${this.userInfo.userCode}的用户删除此档案信息`
            },
            residentialTypeCode: this.profile['residentialTypeCode'],
            community: this.profile['community']
        };
        this.profileStatusChangeSvc.insertRecord(save, resp => {
            console.log('档案删除后添加在册变更记录返回值', resp);
            if (resp.code === 0) {
                this.notifier.notify('success', '档案删除成功');
                this.queryProfile();
            }
        });
    }

    resetProfile() {
        this.profile = null;
        this.profileDataSvc.resetProfileData();
    }

    /**
     * 检查档案的状态
     */
    checkProfileDeleteStatus(): boolean {
        if (this.profileDeleted) {
            this.notifier.notify('warning', '当前档案已经被删除，无法操作');
            return true;
        }
        if (!this.profile) {
            this.notifier.notify('warning', '请先查询档案信息再执行后续操作');
            return true;
        }
        if (this.profile['vaccinationPovCode'] !== this.userInfo.pov) {
            this.notifier.notify('warning', '当前档案不属于本部门，请先执行档案迁入操作');
            return true;
        }
        return false;
    }

    /*
     * 告知书
     * */
    rabiesAgreement(data: any) {
    }
}

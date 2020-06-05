import { Component, OnInit } from '@angular/core';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { ProfileService, ProfileDataService } from '@tod/svs-common-lib';
import {ModifyDialogComponent} from '../../common/modify-dialog/modify-dialog.component';

@Component({
  selector: 'uea-immunization-modify',
  templateUrl: './immunization-modify.component.html',
  styleUrls: ['./immunization-modify.component.scss'],
  providers: [ProfileService]
})
export class ImmunizationModifyComponent implements OnInit {
  /**
   * 档案信息
   */
  profile: any;

  /**
   * 消息订阅销毁集合
   */
  private subscription: Subscription[] = [];

  /**
   * 免疫接种卡号
   */
  immunityVacCard: string;

  // 默认为手动输入
  radioValue = '手动输入';

  /**
   * 免疫接种卡号校验正则表达式
   */
  immunityVacCardReg = new RegExp(/[a-zA-Z0-9\-{0,2}]{10,20}/);

  constructor(
    private dialogRef: NbDialogRef<ImmunizationModifyComponent>,
    private profileDataSvc: ProfileDataService,
    private profileApiSvc: ProfileService,
    private msg: NzMessageService,
    private dialogSvc: NbDialogService
  ) {
    const sub = this.profileDataSvc.getProfileData().subscribe(resp => {
      this.profile = resp;
    });
    this.subscription.push(sub);
  }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }

  updateImmuCard() {
    if (!this.profile || !this.immunityVacCard) return;
    if (!this.immunityVacCardReg.test(this.immunityVacCard)) {
      this.msg.error('免疫接种卡长度为10-20位，且只能输入英文、数字、横线，请重新填写');
      return;
    }
    const immunityVacCard = this.profile['immunityVacCard'];
    if (this.immunityVacCard === immunityVacCard) {
      this.msg.info('免疫接种卡与现有卡号一致，不做修改');
      return;
    }
    const update = {
      profileCode: this.profile['profileCode'],
      immunityVacCard: this.immunityVacCard
    };
    this.profileApiSvc.updateImmunityVacCard(update, resp => {
      if (resp.code === 0) {
        this.msg.success('免疫接种卡信息更新成功');
        this.dialogRef.close(true);
      } else {
        this.msg.error('免疫接种卡信息更新失败，请重试');
      }
    });
  }

  // 切换radio
  changeRadio(event) {
    if (event === '扫码输入') {
      this.dialogSvc.open(ModifyDialogComponent, {}).onClose.subscribe(resp => {
        // console.log('扫苗的结果', resp);
        if (resp && resp.hasOwnProperty('immunizationNum')) {
          const immunizationNum = resp['immunizationNum'];
          // console.log('免疫卡号', immunizationNum);
          if (immunizationNum.length === 12) {
            this.profileApiSvc.decodeImmunityVacCard(immunizationNum, res => {
              // console.log('解密结果', res);
              if (res && res.code === 0 && res.data) {
                this.immunityVacCard = res.data;
              }
            });
          } else {
            this.immunityVacCard = immunizationNum;
          }
        }
      });
    } else {
      this.immunityVacCard = '';
    }

  }
}

import { Component, OnInit } from '@angular/core';
import { NbDialogService, NbIconLibraries } from '@nebular/theme';
import { BindingEmailComponent } from '../binding-email/binding-email.component';
import { PhoneDialogComponent } from '../phone-dialog/phone-dialog.component';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';
import { ChangeEmailComponent } from '../change-email/change-email.component';
import { ChangePhoneComponent } from '../change-phone/change-phone.component';

@Component({
  selector: 'uea-account-binding-info',
  templateUrl: './account-binding-info.component.html',
  styleUrls: ['./account-binding-info.component.scss']
})
export class AccountBindingInfoComponent implements OnInit {
  // 绑定了则为false,未绑定则为true
  active: boolean = true;

  binding: boolean = true;
  isPhone: boolean = true;
  phoneNumber = '';

  constructor(
    private dialogService: NbDialogService,
    iconLibraries: NbIconLibraries
  ) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconLibraries.setDefaultPack('fas');
  }

  ngOnInit() {}

  // 弹框
  nowBinding(type: string, val: boolean) {
    // 绑定邮箱
    if (type === 'email') {
      if (!val) {
        this.dialogService
          .open(BindingEmailComponent, {
            context: {
              binding: this.binding
            }
          })
          .onClose.subscribe(binding => {
            this.binding = binding;
          });
      } else {
        this.dialogService.open(ChangeEmailComponent, {
          hasBackdrop: false
        });
      }
    }
    // 绑定手机
    if (type === 'phone') {
      if (!val) {
        this.dialogService
          .open(PhoneDialogComponent, {
            context: {
              isPhone: this.isPhone
            }
          })
          .onClose.subscribe(resp => {
            console.log(resp);
            this.isPhone = resp.isPhone;
            this.phoneNumber = resp.telPhone;
            if (resp.hasOwnProperty('telPhone')) {
              const reg = /^(\d{3})\d*(\d{2})$/;
              this.phoneNumber = this.phoneNumber.replace(reg, '$1******$2');
            } else {
              this.phoneNumber = '';
            }
          });
      } else {
        this.dialogService.open(ChangePhoneComponent, {
          hasBackdrop: false,
          context: {
            phoneNumber: this.phoneNumber
          }
        });
      }
    }
    // 更改密码
    if (type === 'password') {
      this.dialogService.open(PasswordDialogComponent);
    }
  }
}

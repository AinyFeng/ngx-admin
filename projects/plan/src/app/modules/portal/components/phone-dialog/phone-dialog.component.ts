import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'uea-phone-dialog',
  templateUrl: './phone-dialog.component.html',
  styleUrls: ['./phone-dialog.component.scss']
})
export class PhoneDialogComponent implements OnInit {
  isPhone: boolean;
  telPhone: string;

  constructor(
    private ref: NbDialogRef<PhoneDialogComponent>,
    private msg: NzMessageService
  ) {}

  ngOnInit() {}

  // 保存or关闭
  saveDialog(index: boolean) {
    if (index) {
      if (this.telPhone) {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.telPhone)) {
          this.msg.warning('请填写正确的手机号码');
          return;
        } else {
          this.isPhone = false;
          this.ref.close({
            isPhone: this.isPhone,
            telPhone: this.telPhone
          });
        }
      } else {
        this.msg.warning('请填写手机号码');
        return;
      }
    } else {
      this.isPhone = true;
      this.telPhone = '';
      this.ref.close({
        isPhone: this.isPhone,
        telPhone: this.telPhone
      });
    }
  }
}

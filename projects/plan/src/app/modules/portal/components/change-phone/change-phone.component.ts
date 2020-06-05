import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'uea-change-phone',
  templateUrl: './change-phone.component.html',
  styleUrls: ['./change-phone.component.scss']
})
export class ChangePhoneComponent implements OnInit {
  telPhone = '';
  phoneNumber: string;

  constructor(
    private ref: NbDialogRef<ChangePhoneComponent>,
    private msg: NzMessageService
  ) {}

  ngOnInit() {}

  // 保存or关闭
  saveDialog(index: boolean) {
    if (index) {
      this.ref.close();
    } else {
      this.ref.close();
    }
  }
}

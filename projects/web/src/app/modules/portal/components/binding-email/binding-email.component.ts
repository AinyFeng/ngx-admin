import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'uea-binding-email',
  templateUrl: './binding-email.component.html',
  styleUrls: ['./binding-email.component.scss']
})
export class BindingEmailComponent implements OnInit {
  email: string;
  binding: boolean;

  constructor(
    private ref: NbDialogRef<BindingEmailComponent>,
    private msg: NzMessageService
  ) {}

  ngOnInit() {}

  // 保存or关闭
  saveDialog(index: boolean) {
    if (index) {
      if (this.email) {
        let res = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (res.test(this.email)) {
          this.binding = false;
          this.ref.close(this.binding);
        } else {
          this.msg.warning('请正确书写邮箱地址');
        }
      } else {
        this.msg.warning('请输入邮箱地址');
        return;
      }
    } else {
      this.binding = true;
      this.ref.close(this.binding);
    }
  }
}

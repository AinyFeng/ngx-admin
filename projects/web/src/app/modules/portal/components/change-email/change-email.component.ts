import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'uea-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {
  email: string;

  constructor(
    private ref: NbDialogRef<ChangeEmailComponent>,
    private msg: NzMessageService
  ) {}

  ngOnInit() {}

  // 保存 or 关闭
  saveDialog(index: boolean) {
    this.ref.close();
  }
}

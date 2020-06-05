import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';

@Component({
  selector: 'uea-operate-record',
  templateUrl: './operate-record.component.html',
  styleUrls: ['./operate-record.component.scss']
})
export class OperateRecordComponent implements OnInit {
  listOfData: any[] = [];

  constructor(private dialogService: NbDialogService) {}

  ngOnInit() {}

  // 修改密码
  checkout() {
    this.dialogService.open(PasswordDialogComponent);
  }
}

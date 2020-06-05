import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { UserService } from '@tod/uea-auth-lib';
import { LodopPrintService } from '@tod/svs-common-lib';

import * as moment from 'moment';

@Component({
  selector: 'uea-injection-sheet-dialog',
  templateUrl: './injection-sheet-dialog.component.html',
  styleUrls: ['./injection-sheet-dialog.component.scss']
})
export class InjectionSheetDialogComponent implements OnInit {
  // 打印加载错误
  error = false;

  // 需要打印的注射单的数据
  printInfo: any;
  // 选择打印的数据信息
  @Input()
  injectSingleData: any;
  // 基本信息
  @Input()
  profile: any;
  // 是否是儿童
  @Input()
  child: boolean;
  // povInfo pov信息
  povInfo: any;
  qrCode = '';

  @Output()
  readonly closeDialog = new EventEmitter<void>();
  // 当前时间
  nowDate = moment().format('YYYY-MM-DD');
  // 登录用户
  userInfo: any;

  constructor(
    private ref: NbDialogRef<InjectionSheetDialogComponent>,
    public lodopPrintSvc: LodopPrintService,
    private userSvc: UserService
  ) {
    // 加载打印机
    this.lodopPrintSvc.getLodopStatus().subscribe(status => {
      this.error = status;
    });

    this.userSvc.getUserInfoByType().subscribe(user => (this.userInfo = user));
  }

  ngOnInit() {
    this.qrCode = this.profile.profileCode;
    console.log('print', this.printInfo);
  }

  // 打印
  print(preview: boolean) {
    this.lodopPrintSvc.print(preview, 'injectSingle', 10, 10);
  }

  // 关闭
  close() {
    this.ref.close();
    // this.closeDialog.emit();
  }

  /**
   * 关闭提醒
   */
  closeAlert() {
    if (this.error) {
      this.error = false;
    }
  }
}

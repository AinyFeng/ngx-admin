import {Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'uea-alipay-dialog',
  templateUrl: './alipay-dialog.component.html',
  styleUrls: ['./alipay-dialog.component.scss']
})
export class AlipayDialogComponent implements OnInit {

  // 回执码
  receiptCode: string;

  constructor(
    private msg: NzMessageService,
    private modalSvc: NzModalService,
    private ref: NbDialogRef<AlipayDialogComponent>
  ) {
  }

  ngOnInit() {
    this.getBarcode();
  }

  /**
   * 支付宝回执码校验正则表达式
   */
  immunityVacCardReg = new RegExp(/[a-zA-Z0-9]/);

  // 监听扫码枪
  getBarcode() {
    window.onkeyup = (event: KeyboardEvent) => {
        if (!this.immunityVacCardReg.test(this.receiptCode) && this.receiptCode !== '') {
          this.msg.error('且只能输入英文、数字，请重新填写');
          return;
        }
      if (event.key === 'Enter') {
        if (this.receiptCode) {
          this.ref.close({receiptCode: this.receiptCode});
        }
      }
    };
  }

  onClose() {
    this.ref.close();
  }

  submit() {
    console.log('this.receiptCode', this.receiptCode);
    if (!this.immunityVacCardReg.test(this.receiptCode) || this.receiptCode === '' || !this.receiptCode) {
      this.msg.error('回执码填写错误，请检查');
      return;
    }
    this.modalSvc.confirm({
      nzTitle: '提示',
      nzContent: `<p>是否确认缴费?</p>`,
      nzMaskClosable: true,
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
          this.ref.close({receiptCode: this.receiptCode});
      }
    });
  }
}

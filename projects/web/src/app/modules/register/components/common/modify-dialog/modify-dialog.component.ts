import {Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'uea-modify-dialog',
  templateUrl: './modify-dialog.component.html',
  styleUrls: ['./modify-dialog.component.scss']
})
export class ModifyDialogComponent implements OnInit {

  // 免疫卡号
  immunizationNum: string;

  constructor(
    private ref: NbDialogRef<ModifyDialogComponent>
  ) {
  }

  ngOnInit() {
    this.getBarcode();
  }

  // 监听扫码枪
  getBarcode() {
    window.onkeyup = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (this.immunizationNum) {
          this.ref.close({immunizationNum: this.immunizationNum});
        }
      }
    };
  }

  onClose() {
    this.ref.close();
  }


}

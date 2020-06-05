import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'uea-save-vaccinate-record-confirm-dialog',
  templateUrl: './save-vaccinate-record-confirm-dialog.component.html',
  styleUrls: ['./save-vaccinate-record-confirm-dialog.component.scss']
})
export class SaveVaccinateRecordConfirmDialogComponent implements OnInit {

  @Input()
  records = [];
  /**
   * 入库失败的记录
   */
  failedRecords = [];
  /**
   * 需要二次确认的记录
   */
  confirmRecords = [];

  constructor(private ref: NbDialogRef<SaveVaccinateRecordConfirmDialogComponent>) {
  }

  ngOnInit() {
    this.records.forEach(rec => {
      if (rec['isForce'] === '2') {
        this.failedRecords.push(rec);
      }
      if (rec['isForce'] === '1') {
        this.confirmRecords.push(rec);
      }
    });
  }

  onClose(close = false) {
    this.ref.close(close);
  }

}

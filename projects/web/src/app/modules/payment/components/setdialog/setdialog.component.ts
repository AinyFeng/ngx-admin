import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'uea-setdialog',
  templateUrl: './setdialog.component.html',
  styleUrls: ['./setdialog.component.scss']
})
export class SetdialogComponent implements OnInit {
  constructor(protected ref: NbDialogRef<SetdialogComponent>) {}

  ngOnInit() {}

  saveSet() {
    this.ref.close();
  }

  dismiss() {
    this.ref.close();
  }
}

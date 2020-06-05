import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'uea-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {
  constructor(private ref: NbDialogRef<PasswordDialogComponent>) {}

  ngOnInit() {}

  closeDialog() {
    this.ref.close();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'uea-update-child-profile',
  templateUrl: './update-child-profile.component.html',
  styleUrls: ['./update-child-profile.component.scss']
})
export class UpdateChildProfileComponent implements OnInit {
  @ViewChild('child', { static: true }) childComponent;
  loading = false;

  constructor(private ref: NbDialogRef<UpdateChildProfileComponent>) {}

  ngOnInit() {}

  onClose() {
    this.ref.close();
  }

  onSubmit() {
    this.childComponent.onSubmit();
  }

  onLoading(e) {
    this.loading = e;
  }
}

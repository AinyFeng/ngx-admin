import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'uea-update-adult-profile',
  templateUrl: './update-adult-profile.component.html',
  styleUrls: ['./update-adult-profile.component.scss']
})
export class UpdateAdultProfileComponent implements OnInit {
  @ViewChild('adult', { static: true }) adultComponent;
  loading = false;

  constructor(private ref: NbDialogRef<UpdateAdultProfileComponent>) {}

  ngOnInit() {}

  onClose() {
    this.ref.close();
  }

  onSubmit() {
    this.adultComponent.onSubmit();
  }

  onLoading(e) {
    this.loading = e;
  }
}

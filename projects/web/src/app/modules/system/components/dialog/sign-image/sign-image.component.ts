import {Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'uea-sign-image',
  templateUrl: './sign-image.component.html',
  styleUrls: ['./sign-image.component.scss']
})
export class SignImageComponent implements OnInit {
  // 接收的图片
  signPic: string;

  constructor(
    private ref: NbDialogRef<SignImageComponent>
  ) {
  }

  ngOnInit() {
  }

  onClose() {
    this.ref.close();
  }

}

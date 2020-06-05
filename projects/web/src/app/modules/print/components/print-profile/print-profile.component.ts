import { Component, Input } from '@angular/core';

@Component({
  selector: 'uea-print-profile',
  templateUrl: './print-profile.component.html',
  styleUrls: ['./print-profile.component.scss']
})
export class PrintProfileComponent {
  // 档案信息
  @Input()
  profileData: any = {};

  constructor() {
    console.log('profileData', this.profileData);
  }
}

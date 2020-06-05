import { Component } from '@angular/core';

@Component({
  selector: 'uea-out-patient-management',
  templateUrl: './out-patient-management.component.html'
})
export class OutPatientManagementComponent {
  userInfoData: any[];

  constructor() {
  }

  getUserInfoData() {
    return this.userInfoData;
  }
}

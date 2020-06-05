import { Component, Input, OnInit } from '@angular/core';
import {
  ProfileService,
  TransformUtils
} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-reservation-add',
  templateUrl: './reservation-add.component.html',
  styleUrls: ['./reservation-add.component.scss']
})
export class ReservationAddComponent implements OnInit {

  @Input()
  profileCode: string;

  profile: any;

  constructor(private profileApiSvc: ProfileService) {
  }

  ngOnInit() {
    this.queryProfile();
  }

  queryProfile() {
    const pageEntity: any = {
      page: 1,
      pageSize: 10
    };
    this.profileApiSvc.queryProfileByStr(this.profileCode, pageEntity, res => {
      console.log('档案查询结果', res);
      if (res[0].code === 0) {
        const data = res[0].data;
        if (data.length > 0) {
          const profile = data[0];
          const birthDate = profile['birthDate'];
          const age = TransformUtils.getAgeFromBirthDate(birthDate);
          profile['age'] = age['age'];
          profile['month'] = age['month'];
          this.profile = profile;
        }
      }
    });
  }

}

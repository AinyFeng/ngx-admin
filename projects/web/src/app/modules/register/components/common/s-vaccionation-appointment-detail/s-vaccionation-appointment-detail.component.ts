import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'uea-s-vaccionation-appointment-detail',
  templateUrl: './s-vaccionation-appointment-detail.component.html',
  styleUrls: ['./s-vaccionation-appointment-detail.component.scss']
})
export class SVaccionationAppointmentDetailComponent implements OnInit {
  // 数据从数据库中获取
  reservationDetail = {
    vacName: '乙肝',
    price: '免费',
    injectionTimes: 2,
    reservationDate: '2019-05-06',
    reservationTime: '08:00 -- 08:30',
    source: '人工预约'
  };

  constructor(
    private ref: NbDialogRef<SVaccionationAppointmentDetailComponent>
  ) {}

  ngOnInit() {}

  onClose() {
    this.ref.close();
  }
}

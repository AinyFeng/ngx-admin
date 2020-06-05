import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'uea-reservation-by-vacc-detail-list',
  templateUrl: './reservation-by-vacc-detail-list.component.html',
  styleUrls: ['./reservation-by-vacc-detail-list.component.scss']
})
export class ReservationByVaccDetailListComponent implements OnInit {

  @Input()
  reservationData = [];
  constructor(private ref: NbDialogRef<ReservationByVaccDetailListComponent>) { }

  ngOnInit() {
  }

  onClose() {
    this.ref.close();
  }

}

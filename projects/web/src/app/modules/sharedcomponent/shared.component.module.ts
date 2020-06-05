import { NgModule } from '@angular/core';
import { UeaModule } from '../../@uea/uea.module';
import { VaccinateReservationComponent } from './components/vaccinate-reservation/vaccinate-reservation.component';
import { ReservationAddComponent } from './components/reservation-add/reservation-add.component';

const COMP = [
  VaccinateReservationComponent,
  ReservationAddComponent
];

@NgModule({
  declarations: [...COMP],
  imports: [
    UeaModule
  ],
  exports: [...COMP]
})
export class SharedComponentModule { }

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()

/**
 * 接种预约数据共享服务
 * 用于将登记台查到的接种预约记录传递到接种记录组件中
 */
export class VaccinateReservationDataService {
  /**
   * 接种预约记录
   */
  private vaccinateReservation$ = new BehaviorSubject<any[]>([]);

  setVaccinateReservation(data: any[]) {
    this.vaccinateReservation$.next(data);
  }

  getVaccinateReservation() {
    return this.vaccinateReservation$.asObservable();
  }
}

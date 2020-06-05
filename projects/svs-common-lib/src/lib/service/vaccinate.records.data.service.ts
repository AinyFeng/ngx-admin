import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
/**
 * 接种记录数据共享service
 */
export class VaccinateRecordsDataService {
  private vaccinateRecords$ = new BehaviorSubject<any>(null);

  setVaccinateRecord(data: any[]) {
    this.vaccinateRecords$.next(data);
  }

  getVaccinateRecord() {
    return this.vaccinateRecords$.asObservable();
  }
}

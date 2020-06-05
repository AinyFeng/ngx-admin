import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LOCAL_STORAGE } from '../../base/localStorage.base';
import { map } from 'rxjs/operators';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { ApiSystemWorkingTimeService } from '../../api/system/api-system-working-time.service';

@Pipe({
  name: 'reservationTimePipe'
})
export class ReservationTimePipe implements PipeTransform {

  constructor(private localSt: LocalStorageService,
    private reservationTimeSvc: ApiSystemWorkingTimeService) { }

  transform(value: string): any {
    if (!value || value.trim() === '') return of('');
    const workingTime = this.localSt.retrieve(LOCAL_STORAGE.WORKING_TIME + value);
    if (workingTime !== null) {
      return new Promise(resolve => {
        resolve(workingTime);
      });
    }
    return this.queryWorkingTime(value).pipe(
      map(resp => {
        if (
          resp['code'] === 0 &&
          resp.hasOwnProperty('data') &&
          resp['data'].length !== 0
        ) {
          this.localSt.store(
            LOCAL_STORAGE.WORKING_TIME + value,
            resp['data'][0]['workingTime']
          );
          return resp['data'][0]['workingTime'];
        } else {
          this.localSt.store(LOCAL_STORAGE.WORKING_TIME + value, value);
          return value;
        }
      })
    );
  }

  queryWorkingTime(workingTimeSerial: string) {
    const param = {
      workingTimeSerial: workingTimeSerial
    };
    return this.reservationTimeSvc.queryWorkingTimeForPipe(param);
  }
}

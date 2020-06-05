import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reservationChannelPipe'
})
export class ReservationChannelPipe implements PipeTransform {
  transform(value: string): any {
    if (!value || value.trim() === '') return value;
    switch (value) {
      case '0':
        return '门诊预约';
      case '1':
        return '微信预约';
      case '2':
        return 'APP预约';
    }
  }
}

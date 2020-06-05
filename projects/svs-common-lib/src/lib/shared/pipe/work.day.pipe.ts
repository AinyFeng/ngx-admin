import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workDayPipe'
})
export class WorkDayPipe implements PipeTransform {
  transform(value: any): any {
    if (value === null || value === '') return value;
    switch (value) {
      case 0:
        return '周日';
      case 1:
        return '周一';
      case 2:
        return '周二';
      case 3:
        return '周三';
      case 4:
        return '周四';
      case 5:
        return '周五';
      case 6:
        return '周六';
      default:
        console.log('日期不合法！');
        break;
    }
  }
}

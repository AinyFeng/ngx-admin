import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qbGenderPipe',
  pure: false
})
export class QbGenderPipePipe implements PipeTransform {
  transform(item: any, args?: any): any {
    if (!item) {
      return item;
    }
    if (item === 'f') {
      return '女';
    } else if (item === 'm') {
      return '男';
    } else {
      return '未知';
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'businessTypePipe'
})
export class BusinessTypePipe implements PipeTransform {
  transform(value: string): string {
    if (!value || value.trim() === '') return null;
    switch (value) {
      case 'A':
        return '儿童接种';
      case 'B':
        return '成人接种';
      case 'C':
        return '体检';
      default:
        return value;
    }
  }
}

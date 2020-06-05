import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatusPipe'
})

export class OrderStatusPipe implements PipeTransform {

  transform(value: string): any {
    switch (value) {
      case '0':
        return '免费';
      case '1':
        return '待缴费';
      case '2':
        return '已缴费';
      case '3':
        return '已取消';
      case '4':
        return '无需付款';
      case '8':
        return '接种完成';
      case '9':
        return '已退款';
      default:
        return '-';
    }
  }
}

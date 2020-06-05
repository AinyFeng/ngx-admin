import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invoiceStatusPipe'
})

export class InvoiceStatusPipe implements PipeTransform {

  transform(value: string): any {
    switch (value) {
      case '0':
        return '未开票';
      case '1':
        return '已开票';
      case '2':
        return '已作废';
      default:
        return '-';
    }
  }
}

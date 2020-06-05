import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qbTtableFilter',
  pure: false
})

/**qbGenderPipe
 * 过滤器
 * 根据输入内容进行过滤
 */
export class QbTablePipe implements PipeTransform {
  transform(items: any[], val: string): any {
    if (!items || items.length === 0 || !val || val.trim() === '') {
      return items;
    }

    return items.filter(item => this.check(item, val));
  }

  private check(item: any, val: string): boolean {
    for (const i in item) {
      if (item.hasOwnProperty(i)) {
        const o = item[i].toString().toLowerCase();
        if (o.indexOf(val.toLowerCase()) !== -1) return true;
      }
    }
    return false;
  }
}

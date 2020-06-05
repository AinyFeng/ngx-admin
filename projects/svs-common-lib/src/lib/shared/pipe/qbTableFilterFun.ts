import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qbTableFilterFun',
  pure: false
})
/**
 * 过滤器
 * 可以根据输入的表达式进行判断
 */
export class QbTableFilterFun implements PipeTransform {
  transform(items: any[], callBack: (args) => boolean): any {
    if (!items || items.length === 0 || !callBack) {
      return items;
    }
    return items.filter(item => callBack(item));
  }
}

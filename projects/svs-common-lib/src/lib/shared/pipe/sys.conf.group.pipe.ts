import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sysConfGroupPipe'
})
/**
 * 用于区分系统配置字典中的分组
 */
export class SysConfGroupPipe implements PipeTransform {
  transform(value: string): any {
    if (!value || value === '') return value;
    switch (value) {
      case '1':
        return '用户';
      case '2':
        return '科室（部门）';
      case '3':
        return 'POV门诊';
      case '4':
        return '系统';
      default:
        return value;
    }
  }
}

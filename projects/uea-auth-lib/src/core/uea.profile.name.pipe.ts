import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'profilenamePipe'
})
export class UeaProfileNamePipe implements PipeTransform {
  transform(value: string): string {
    const v = this.tinternal(value);
    return v + '(' + value + ')';
  }
  private tinternal(value: string): string {
    if (!value || value.trim() === '') return null;
    switch (value) {
      case 'birthdate':
        return '出生日期';
      case 'country':
        return '国籍';
      case 'department':
        return '部门';
      case 'email':
        return '电子邮箱';
      case 'email_verified':
        return '电子邮箱是否确认';
      case 'employee':
        return '职员';
      case 'employeeNumber':
        return '职员编号';
      case 'family_name':
        return '姓氏';
      case 'formatted':
        return '住址';
      case 'given_name':
        return '名字';
      case 'inum':
        return '通行证编号';
      case 'iss':
        return '发行机构';
      case 'locality':
        return '城市';
      case 'member_of':
        return '所属组别';
      case 'name':
        return '姓名';
      case 'organization':
        return '单位名称';
      case 'phone_mobile_number':
        return '手机号码';
      case 'phone_number':
        return '固定电话';
      case 'phone_number_verified':
        return '固定电话是否确认';
      case 'pov':
        return '门诊编号';
      case 'region':
        return '地区';
      case 'room_number':
        return '科室名称';
      case 'status':
        return '用户状态';
      case 'street_address':
        return '街道地址';
      case 'sub':
        return '主编号';
      case 'title':
        return '职位';
      case 'updated_at':
        return '更新时间';
      case 'userCode':
        return '用户编号';
      case 'user_name':
        return '用户名称';
      default:
        return value;
    }
  }
}

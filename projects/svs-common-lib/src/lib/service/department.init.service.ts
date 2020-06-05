import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
/**
 * pov部门初始化
 * 获取该pov下的所有的部门(科室)
 */
export class DepartmentInitService {
  departmentData: any[] = [];

  constructor(private localSt: LocalStorageService) {
    const departmentData = this.localSt.retrieve(LOCAL_STORAGE.DEPARTMENT_DATA);
    if (departmentData !== null) {
      this.setDepartmentData(departmentData);
    }
  }

  setDepartmentData(data) {
    this.departmentData = data;
    this.localSt.store(LOCAL_STORAGE.DEPARTMENT_DATA, data);
  }

  getDepartmentData(type?: string) {
    return type ? this.departmentData.filter(depart => depart.type === type) : this.departmentData;
  }

  /**
   * 根据部门类型选择登记台
   * @param typeList
   */
  getDepartmentDataByDepartmentList(typeList: string[]) {
    if (typeList.length === 0) return undefined;
    return this.departmentData.filter(department => typeList.includes(department.type));
  }


}

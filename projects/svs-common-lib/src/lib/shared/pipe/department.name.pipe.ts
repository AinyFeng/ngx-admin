import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DepartmentInfoService } from '../../api/master/department/department.info.service';
import { LOCAL_STORAGE } from '../../base/localStorage.base';
import { DepartmentInitService } from '../../service/department.init.service';

@Pipe({
  name: 'departmentNamePipe'
})
/**
 * 根据部门编码获取部门名称
 * 先从localstorage中查找，如果有则不发请求
 */
export class DepartmentNamePipe implements PipeTransform {

  localDepartmentData: any[] = [];

  constructor(
    private departmentSvc: DepartmentInfoService,
    private localSt: LocalStorageService,
    private departmentInitSvc: DepartmentInitService
  ) {
    this.localDepartmentData = departmentInitSvc.getDepartmentData();
  }

  transform(value: string): any {
    if (!value || value.trim() === '') return of('');
    const departmentName = this.localSt.retrieve(
      LOCAL_STORAGE.DEPARTMENT_DATA + value
    );
    if (departmentName !== null) {
      return new Promise(resolve => {
        resolve(departmentName);
      });
    }
    if (this.localDepartmentData.length > 0) {
      const department = this.localDepartmentData.find(dep => dep.departmentCode === value);
      if (department) {
        this.localSt.store(LOCAL_STORAGE.DEPARTMENT_DATA + value, department['departmentName']);
        return new Promise(resolve => resolve(department['departmentName']));
      }
    }
    return this.queryDepartmentName(value).pipe(
      map(resp => {
        if (
          resp.code === 0 &&
          resp.hasOwnProperty('data') &&
          resp['data'].length !== 0
        ) {
          this.localSt.store(
            LOCAL_STORAGE.DEPARTMENT_DATA + value,
            resp.data[0]['departmentName']
          );
          return resp.data[0]['departmentName'];
        } else {
          this.localSt.store(LOCAL_STORAGE.DEPARTMENT_DATA + value, value);
          return value;
        }
      })
    );
  }

  queryDepartmentName(departmentCode: string): Observable<any> {
    let query = {
      departmentCode: departmentCode
    };
    return this.departmentSvc.queryDepartmentInfoForPipe(query);
  }
}

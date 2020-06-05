import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class VaccDepartmentManageService {
  private vaccineChange$ = new BehaviorSubject<any>(null);

  vaccineArr: any = [];

  /**
   * 将获取到的小类编码与部门编码合并
   * @param departmentCode
   * @param vaccineSubData
   */
  setDepartmentVaccineArrByDepartmentCode(departmentCode: string, vaccineSubData: any[]) {
    const departmentData = this.vaccineArr.find(va => va['departmentCode'] === departmentCode);
    if (!departmentData) {
      const dd = {
        departmentCode: departmentCode,
        vaccine: vaccineSubData
      };
      this.vaccineArr.push(dd);
    } else {
      for (let i = 0; i < this.vaccineArr.length; i++) {
        const va = this.vaccineArr[i];
        if (va.departmentCode === departmentCode) {
          va['vaccine'] = vaccineSubData;
          break;
        }
      }
    }
  }

  /**
   * 根据部门编码查询疫苗数据
   * @param departmentCode
   */
  getVaccineByDepartmentCode(departmentCode: string) {
    return this.vaccineArr.find(va => va['departmentCode'] === departmentCode);
  }
}

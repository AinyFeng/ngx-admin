import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { Observable, of } from 'rxjs';
import { LOCAL_STORAGE } from '../../base/localStorage.base';
import { map } from 'rxjs/operators';
import { PovStaffApiService } from '../../api/master/PovStaff/pov.staff.api.service';
import { UserService } from '@tod/uea-auth-lib';
import { PovStaffInitService } from '../../service/pov.staff.init.service';

@Pipe({
  name: 'povStaffNamePipe'
})
/**
 * 查询职员信息pipe
 */
export class PovStaffNamePipe implements PipeTransform {

  userInfo: any;

  povStaffData = [];

  constructor(
    private povStaffService: PovStaffApiService,
    private localSt: LocalStorageService,
    private userSvc: UserService,
    private povStaffInitSvc: PovStaffInitService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
    this.povStaffData = povStaffInitSvc.getPovStaffData();
  }

  /**
   * 根据员工工号查询员工姓名
   * @param value - number 工号
   */
  transform(value: string): any {
    if (!value || value.trim() === '') return new Promise(resolve => resolve(value));
    const povStaffName = this.localSt.retrieve(LOCAL_STORAGE.POV_STAFF + value);
    if (povStaffName !== null) {
      return new Promise(resolve => {
        resolve(povStaffName);
      });
    }
    if (this.povStaffData.length > 0) {
      const staff = this.povStaffData.find(_staff => {
        if (_staff.hasOwnProperty('number') && _staff.number === value) {
          return _staff;
        }
      });
      if (staff) {
        this.localSt.store(LOCAL_STORAGE.POV_STAFF + value, staff['realName']);
        return new Promise(resolve => resolve(staff['realName']));
      }
    }
    return this.queryPovStaffName(value).pipe(
      map(resp => {
        if (
          resp.code === 0 &&
          resp.hasOwnProperty('data') &&
          resp['data'].length !== 0
        ) {
          this.localSt.store(
            LOCAL_STORAGE.POV_STAFF + value,
            resp.data[0]['realName']
          );
          return resp.data[0]['realName'];
        } else {
          this.localSt.store(LOCAL_STORAGE.POV_STAFF + value, value);
          return value;
        }
      })
    );
  }

  /**
   * 需要查询所有pov门诊的staff信息，不能仅限于当前pov
   * @param userCode
   */
  queryPovStaffName(userCode: string): Observable<any> {
    if (!this.userInfo) return;
    const query = {
      // povCode: this.userInfo.pov,
      number: userCode
    };
    return this.povStaffService.queryPovStaffForPipe(query);
  }
}

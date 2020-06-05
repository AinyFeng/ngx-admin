import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
/**
 * 门诊人员信息初始化数据
 */
export class PovStaffInitService {
  povStaffData: any[] = [];

  constructor(private localSt: LocalStorageService) {
    const staffData = this.localSt.retrieve(LOCAL_STORAGE.POV_STAFF);
    if (staffData !== null) {
      this.setPovStaffData(staffData);
    }
  }

  setPovStaffData(data) {
    this.povStaffData = data;
    this.localSt.store(LOCAL_STORAGE.POV_STAFF, data);
  }

  getPovStaffData(userCode?: string) {
    return userCode ? this.povStaffData.filter(staff => staff.number === userCode) : this.povStaffData;
  }
}

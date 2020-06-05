import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
/**
 * 登记记录数据状态变化
 */
export class RegRecordDataService {

  public static REG_RECORD_CHANGE = 'REG_RECORD_CHANGE';

  private regRecordCountChange$ = new BehaviorSubject<string>(null);
  /**
   * 登记记录集合
   */
  private regRecords$ = new BehaviorSubject<any[]>([]);

  setRegRecordCountChange(sign?: string) {
    this.regRecordCountChange$.next(sign);
  }

  getRegRecordCountChange() {
    return this.regRecordCountChange$.asObservable();
  }

  /**
   * 登记记录集合
   * @param records
   */
  setRegRecords(records: any[]) {
    this.regRecords$.next(records);
  }

  /**
   * 获取登记记录
   */
  getRegRecords() {
    return this.regRecords$.asObservable();
  }
}

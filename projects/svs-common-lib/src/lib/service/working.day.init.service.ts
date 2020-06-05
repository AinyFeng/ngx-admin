import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
/**
 * pov 工作日初始化
 * 获取pov 的所有的有效工作日
 */
export class WorkingDayInitService {
  /**
   * 工作日类型 - 周
   */
  static readonly WORKING_DAY_TYPE_WEEK = '0';

  /**
   * 工作日类型 - 单双周
   */
  static readonly WORKING_DAY_TYPE_DOUBLE_WEEK = '1';

  /**
   * 工作日类型 - 月
   */
  static readonly WORKING_DAY_TYPE_MONTH = '2';

  /**
   * 工作日数据，所有有效的工作日数据，即 useAble = 1
   */
  workingDayData: any;

  /**
   * 工作日 - 周，数据
   */
  weekDayData: any;

  /**
   * 工作日 - 单双周，数据
   */
  doubleWeekDayData: any;

  /**
   * 工作日 - 月，数据
   */
  monthData: any;
  constructor(private localSt: LocalStorageService) {
    const workingDayData = this.localSt.retrieve(
      LOCAL_STORAGE.WORKING_DAY_DATA
    );
    if (workingDayData) {
      this.workingDayData = workingDayData;
    }
  }

  setWeekWorkDay() {
    this.weekDayData = this.workingDayData.filter(
      day => day.workingRound === WorkingDayInitService.WORKING_DAY_TYPE_WEEK
    );
  }

  setDoubleWeekWorkDay() {
    this.doubleWeekDayData = this.workingDayData.filter(
      day =>
        day.workingRound === WorkingDayInitService.WORKING_DAY_TYPE_DOUBLE_WEEK
    );
  }

  setMonthWorkDay() {
    this.monthData = this.workingDayData.filter(
      day => day.workingRound === WorkingDayInitService.WORKING_DAY_TYPE_MONTH
    );
  }

  getWorkingDayData() {
    return this.workingDayData;
  }
  setWorkingDayData(data: any) {
    this.workingDayData = data;
    this.localSt.store(LOCAL_STORAGE.WORKING_DAY_DATA, data);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TransformUtils } from '../utils/transform.utils';

@Injectable()
export class ProfileDataService {

  /**
   * 接种策略变化标识
   */
  public static VACCINATE_STRATEGY_CHANGE = '1';
  // 档案状态订阅
  profileStatusDelete$ = new Subject<boolean>();

  constructor() {
  }

  // 受种人的档案资料，全局作用域，所有需要用到档案信息的地方都可以有这个
  private profile$ = new BehaviorSubject<any>(null);

  private _parents$ = new BehaviorSubject<any>(null);

  private _vaccinatedRecords$ = new BehaviorSubject<any>(null);

  // 当前登录用户所属 pov 信息
  private _povInfo$ = new BehaviorSubject<any>(null);

  /**
   * 刷新接种策略模型
   */
  private _vaccinateStrategyChange$ = new BehaviorSubject<string>(null);

  setProfileData(data: any): void {
    if (data) {
      const age = TransformUtils.getAgeFromBirthDate(data['birthDate']);
      data.age = age.age;
      data.month = age.month;
      data.days = age.days;
      if (data.hasOwnProperty('profileStatusCode')) {
        this.profileStatusDelete$.next(data['profileStatusCode'] === '10');
      }
    }
    this.profile$.next(data);
  }

  resetProfileData() {
    this.profile$.next(null);
  }

  getProfileData(): Observable<any> {
    return this.profile$.asObservable();
  }

  /**
   * 检查档案状态是否为"服务器删除"
   */
  getProfileDeletedStatus(): Observable<boolean> {
    return this.profileStatusDelete$.asObservable();
  }

  /**
   * 设置档案状态
   * @param status
   */
  setProfileDeleteStatus(status: boolean) {
    this.profileStatusDelete$.next(status);
  }

  setParents(data: any) {
    this._parents$.next(data);
  }

  getParenets() {
    return this._parents$.asObservable();
  }

  setVaccinatedRecords(data: any) {
    this._vaccinatedRecords$.next(data);
  }

  getVaccinatedRecords() {
    return this._vaccinatedRecords$.asObservable();
  }

  setPovInfo(data: any) {
    this._povInfo$.next(data);
  }

  getPovInfo() {
    return this._povInfo$.asObservable();
  }

  setVaccinateStrategyChange(sign: string) {
    this._vaccinateStrategyChange$.next(sign);
  }

  getVaccinateStrategyChange() {
    return this._vaccinateStrategyChange$.asObservable();
  }
}

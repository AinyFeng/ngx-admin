import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * 接种策略刷新服务 service
 * 用于在别的地方做出修改，需要提示接种策略进行刷新的操作提示
 */
@Injectable()
export class RecommendVaccineNotificationService {
  private vaccineStrategy$ = new BehaviorSubject<string>(null);

  setVaccineStrategyNotification(notice: string) {
    this.vaccineStrategy$.next(notice);
  }

  getVaccineStrategyNotification() {
    return this.vaccineStrategy$.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
/**
 * 用于将获取到的工作日 工作时间段数据共享
 */
export class WorkDatetimeService {
  private workDatetime$ = new BehaviorSubject({});

  setWorkDatetime(date: any) {
    const keys = Object.keys(date);
    if (keys.length === 0) return;
    this.workDatetime$.next(date);
  }

  getWorkDatetime() {
    return this.workDatetime$.asObservable();
  }
}

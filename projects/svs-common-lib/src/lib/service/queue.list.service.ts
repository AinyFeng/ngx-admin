import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Injectable()
export class QueueListService {
  /**
   * 登记台台号
   */
  private registDest$ = new BehaviorSubject<any>(null);
  /**
   * 当前叫号信息
   */
  private callingNumber$ = new BehaviorSubject<any>(null);

  private callNumber$ = new BehaviorSubject<object>({});

  // 下一号对象
  private nextQueueItem$ = new BehaviorSubject<object>({});

  // 待叫号队列的数量
  private queueCount$ = new BehaviorSubject<number>(0);

  // 叫下一号从 call-number 传递给 queue-list 的触发数据，只是触发作用
  private callNext$ = new BehaviorSubject<any>(null);

  setCallNext(data: any) {
    this.callNext$.next(data);
  }

  getCallNext() {
    return this.callNext$.asObservable();
  }

  /**
   * 设置排队队列的数量
   * @param count
   */
  setQueueCount(count: number) {
    this.queueCount$.next(count);
  }

  /**
   * 获取排队队列的数量
   */
  getQueueCount(): Observable<number> {
    return this.queueCount$.asObservable();
  }

  /**
   * 设置当前被叫号码
   * @param data
   */
  setCallNumber(data: any) {
    this.callNumber$.next(data);
  }

  /**
   * 获取被叫号码
   */
  getCallNumber() {
    return this.callNumber$.asObservable();
  }

  setNextQueueItem(data: any) {
    this.nextQueueItem$.next(data);
  }

  getNextQueueItem() {
    return this.nextQueueItem$.asObservable();
  }

  /**
   * 设置当前叫号信息
   * @param currentNumber
   */
  setCallingNumber(currentNumber: any) {
    this.callingNumber$.next(currentNumber);
  }

  /**
   * 获取当前叫号信息
   */
  getCallingNumber() {
    return this.callingNumber$.asObservable();
  }

  setRegistDesk(desk: any) {
    this.registDest$.next(desk);
  }

  getRegistDesk() {
    return this.registDest$.asObservable();
  }

  clearQueueListMessage() {
    this.setCallingNumber(null);
    this.setRegistDesk(null);
    this.setQueueCount(0);
    this.setCallNext('0');
    this.setCallNumber({});
    this.setNextQueueItem(null);
  }
}

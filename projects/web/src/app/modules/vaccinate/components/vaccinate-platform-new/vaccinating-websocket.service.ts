import {Injectable, OnDestroy} from '@angular/core';
import {interval, Observable, Subject} from 'rxjs';
import {WebSocketSubject} from 'rxjs/internal-compatibility';
import {webSocket} from 'rxjs/webSocket';
import * as moment from 'moment';

/**
 * websocket服务
 */
@Injectable()
export class VaccinatingWebsocketService implements OnDestroy {
  private period = 60 * 1000 * 4;                     // 4分钟发送一次心跳
  private heartBeatSubscription = null;               // 心跳检测
  private ws: WebSocketSubject<any>;
  private url: string = '';
  private open$: Subject<any> = new Subject<any>();
  private close$: Subject<any> = new Subject<any>();

  constructor() {
  }

  connect(url?: string) {
    if (!!url) {
      this.url = url;
    }
    this.close();
    this.open$ = new Subject<any>();
    this.close$ = new Subject<any>();
    this.ws = null;
    console.log('websocket start', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    this.ws = webSocket({
      url: this.url,
      openObserver: this.open$,
      closeObserver: this.close$,
      // deserializer: e => console.log(e)
    });
    this.sendHeartBeat();
  }

  getMessage(): Observable<any> {
    return this.ws.asObservable();
  }

  isOpen(): Observable<any> {
    return this.open$.asObservable();
  }

  isClose(): Observable<any> {
    return this.close$.asObservable();
  }

  sendHeartBeat() {
    this.stopHeatBeat();
    this.heartBeatSubscription = interval(this.period).subscribe((val) => {
      // console.log('发送心跳次数', val + 1);
      this.ws.next(val + 1);
    });
  }

  stopHeatBeat() {
    // 取消订阅停止心跳
    if (typeof this.heartBeatSubscription !== 'undefined' && this.heartBeatSubscription != null) {
      this.heartBeatSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    console.log('websocket stop', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    this.stopHeatBeat();
    this.close();
  }

  close() {
    if (typeof this.ws !== 'undefined') {
      this.ws.error({ code: 1000, reason: '正常关闭'});
    }
    if (typeof this.open$ !== 'undefined') {
      this.open$.error({ code: 1000, reason: '正常关闭'});
    }
    if (typeof this.close$ !== 'undefined') {
      this.close$.error({ code: 1000, reason: '正常关闭'});
    }
  }
}

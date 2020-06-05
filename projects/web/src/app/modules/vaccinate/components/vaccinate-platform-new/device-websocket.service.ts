import {Injectable, OnDestroy} from '@angular/core';
import {interval, Observable, Subject} from 'rxjs';
import {WebSocketSubject} from 'rxjs/internal-compatibility';
import {webSocket} from 'rxjs/webSocket';
import * as moment from 'moment';

/**
 * websocket服务
 */
@Injectable()
export class DeviceWebsocketService implements OnDestroy {
  // private period = 60 * 1000 * 4;                     // 4分钟发送一次心跳
  private period = 3000;                     // 4分钟发送一次心跳
  private heartBeatSubscription = null;               // 心跳检测
  private ws: WebSocketSubject<any>;
  private url: string = '';
  private open$: Subject<any> = new Subject();
  private close$: Subject<any> = new Subject();
  private sentMessage: any;

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
    console.log('数衍设备websocket start', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
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

  sendMessage(value: any) : void {
    this.sentMessage = value;
    this.ws.next(value);
  }

  reSendMessage() {
    this.sendMessage(this.sentMessage);
  }

  isOpen(): Observable<any> {
    return this.open$.asObservable();
  }

  isClose(): Observable<any> {
    return this.close$.asObservable();
  }

  sendCheck() {
    this.ws.next({'ntype': '103', 'orderId': '123456789', 'timestamp': new Date().valueOf() + ''});
  }

  sendHeartBeat() {
    this.stopHeatBeat();
    this.heartBeatSubscription = interval(this.period).subscribe((val) => {
      // console.warn('发送心跳次数', val + 1);
      this.sendCheck();
    });
  }

  stopHeatBeat() {
    // 取消订阅停止心跳
    if (typeof this.heartBeatSubscription !== 'undefined' && this.heartBeatSubscription != null) {
      this.heartBeatSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.close();
  }

  close() {
    console.log('数衍设备websocket stop', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    this.stopHeatBeat();
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

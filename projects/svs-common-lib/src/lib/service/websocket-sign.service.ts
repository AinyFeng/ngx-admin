import { FactoryProvider, Injectable, OnDestroy } from '@angular/core';
import { interval, Observable, Subject, Subscription } from 'rxjs';

@Injectable()

/**
 * 与签字板交互的websocket service，用来获取签字数据，作用域只限定于签字的component，所以不指定为 root
 */
export class WebsocketSignService implements OnDestroy {
  /**
   * websocket 连接地址
   */
  url: string;
  /**
   * websocket 实例
   */
  private ws: WebSocket;
  /**
   * 用于发送消息
   */
  private messageSubject = new Subject();
  /**
   * websocket 连接成功的状态标识符
   */
  connectSuccess = false;
  /**
   * 每1秒都检查一遍
   */
  period = 3000;
  /**
   * 定时检测是否连接签字板
   */
  heartBeatCheckSubscription: Subscription;
  /**
   * 重新连接的标识符
   * false 没有重连
   * true 重新连接中
   */
  reconnectFlag = false;
  /**
   * 重新连接的频率
   */
  reconnectPeriod = 1000;
  /**
   * 重新连接的订阅对象
   */
  reconnectSubscription: Subscription;

  onOpenSubject = new Subject();
  /**
   * 重连次数
   */
  reconnectCount = 0;

  constructor() {
    this.heartBeatCheckStart();
  }

  ngOnDestroy(): void {
    console.log('ws 组件销毁');
    this.stopReconnect();
    this.heartBeatCheckStop();
    this.onClose(null, 'close');
  }

  connect(url: string) {
    if (!url) {
      console.log('请输入websocket 连接地址');
      return;
    }
    this.url = url;
    this.createWebsocket();
  }

  /**
   * 创建连接
   */
  createWebsocket() {
    // 如果 connectSuccess = true， 说明已经连接，不用重新连接
    if (this.connectSuccess) {
      // console.log('websocket 已经连接，不会创建新的连接');
      return;
    }
    if (this.reconnectCount > 3) {
      this.connectSuccess = false;
      this.onClose();
      this.heartBeatCheckStop();
      this.stopReconnect();
      return;
    }
    this.reconnectCount++;
    console.log('websocket 建立新的连接 -> ' + this.url);
    // 建立新的连接
    this.ws = new WebSocket(this.url);
    // 建立连接之后，监听各种事件
    this.ws.onopen = (ev: Event) => this.onOpen(ev);
    // 消息返回事件
    this.ws.onmessage = (message: MessageEvent) => this.onMessage(message);
    // websocket 通道关闭事件
    this.ws.onclose = (ev: CloseEvent) => this.onClose(ev);
    // websocket 连接异常
    this.ws.onerror = (ev: Event) => this.onError(ev);
  }

  onOpen(ev: Event) {
    // 设置连接标识符为 false，表示
    this.connectSuccess = true;
    this.onOpenSubject.next(ev);
  }

  /**
   * 消息返回
   * @param message 消息实体
   */
  onMessage(message: any) {
    this.messageSubject.next(message);
  }

  /**
   * 连接关闭
   * 关闭之后就不再连接
   * @param ev
   * @param reason
   */
  onClose(ev?: any, reason?: string) {
    console.log(
      'websocket 连接关闭 -> ',
      ev ? { code: ev.code, reason: ev.reason, wasClean: ev.wasClean } : ev
    );
    this.connectSuccess = false;
    if (ev && ev.wasClean === false) {
      this.reconnect();
    } else {
      this.closeSocket(1000, reason);
    }
  }

  /**
   * 连接异常
   * 当出现异常的时候重新连接，只在出现异常的时候重新连接
   * @param ev
   */
  onError(ev?: any) {
    // this.tostaSvc.warning('签连接异常，请检查是否打开了签字板程序', '签字板连接失败', {
    //   preventDuplicates: true
    // });
    this.connectSuccess = false;
    console.warn('websocket 连接异常');
    this.reconnect();
  }

  /**
   * 重新连接
   */
  reconnect() {
    // 如果已经连接，则直接return，不做重连
    if (this.connectSuccess) {
      this.stopReconnect();
      console.log('websocket 已经重新连接成功 -> ' + this.url);
      return;
    }
    // 如果正在重新连接，则return
    if (this.reconnectFlag) {
      console.log('websocket 正在重新连接 -> ' + this.url);
      return;
    }
    // 开始重新连接
    this.reconnectFlag = true;
    this.reconnectSubscription = interval(this.reconnectPeriod).subscribe(
      async val => {
        // console.log(`重连${val}次`);
        this.connect(this.url);
      }
    );
  }

  /**
   * 停止重新连接
   */
  stopReconnect() {
    // 设置重新连接的标识符为 false
    this.reconnectFlag = false;
    // 如果重新连接的订阅对象不等于 null， 则将该订阅对象取消订阅
    if (
      this.reconnectSubscription !== undefined &&
      this.reconnectSubscription !== null
    )
      this.reconnectSubscription.unsubscribe();
  }

  /**
   * 开始心跳检测
   */
  heartBeatCheckStart() {
    this.heartBeatCheckSubscription = interval(this.period).subscribe(val => {
      if (
        this.ws !== undefined &&
        this.ws !== null &&
        this.ws.readyState === 1
      ) {
        // console.log(`第${val}次检测，websocket 已连接`);
      } else {
        // 如果 websocket 的状态 readyState 不等于 1 ，说明连接已经关闭或者异常，需要重新连接
        this.reconnect();
        this.heartBeatCheckStop();
      }
    });
  }

  /**
   * 停止重新连接
   */
  heartBeatCheckStop() {
    // 取消订阅之后
    if (this.heartBeatCheckSubscription !== null)
      this.heartBeatCheckSubscription.unsubscribe();
  }

  /**
   * 向服务端websocket server 发送消息
   * @param message
   */
  sendMessage(message: any) {
    this.ws.send(message);
  }

  /**
   * 接受消息的调用方法
   */
  getMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  isOpen(): Observable<any> {
    return this.onOpenSubject.asObservable();
  }

  /**
   * 关闭socket 流
   * @param code
   * @param reason
   */
  closeSocket(code?: number, reason?: string) {
    if (this.ws) this.ws.close(code, reason);
  }
}

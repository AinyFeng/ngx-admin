import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SignErrorMsg } from './joyusing.signpad.model';
import { NzMessageService } from 'ng-zorro-antd';


@Injectable()
/**
 * 捷星M30A签字版 service
 */
export class JoyusingSignpadService {

  /**
   * websocket 连接地址
   */
  url: string;
  /**
   * websocket 实例
   */
  private ws: WebSocket;

  /**
   * websocket 连接成功的状态标识符
   */
  connectSuccess = false;

  /**
   * 消息实体
   */
  private messageObj$ = new BehaviorSubject<any>(null);

  constructor(private msg: NzMessageService) {
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
  }

  /**
   * 消息返回
   * @param message 消息实体
   */
  onMessage(message: any) {
    console.log('signpad', message);
    if (this.url === 'ws://127.0.0.1:40000') {
      // 汉王
      this.messageObj$.next(message);
    } else {
      const data = JSON.parse(message.data);
      console.log('message.data====', data);
      if (data.type === 3) {
        if (data.ret === SignErrorMsg.成功) {
          this.messageObj$.next(data);
        } else {
          this.messageObj$.next('error');
        }
      } else if (data.type === 2) {
        if (data.ret === SignErrorMsg.成功) {
          this.msg.warning('签字取消');
        } else {
          this.messageObj$.next('error');
        }
      } else if (data.type === 11) {
        if (data.ret === SignErrorMsg.成功) { // 只签字，不查看任何文档
          this.messageObj$.next(data);
        } else {
          this.messageObj$.next('error');
        }
      } else if (data.ret !== SignErrorMsg.成功) {
        console.error('签字版异常', SignErrorMsg[data.ret]);
        this.msg.error(SignErrorMsg[data.ret]);
      } else if (data.ret === SignErrorMsg.成功) {
        this.msg.success('签字板操作成功');
      }
    }
  }

  getMessage() {
    return this.messageObj$.asObservable();
  }


  /**
   * 连接关闭
   * 关闭之后就不再连接
   * @param ev
   * @param reason
   */
  onClose(ev?: any, reason?: string) {
    this.connectSuccess = false;
  }

  /**
   * 连接异常
   * 当出现异常的时候重新连接，只在出现异常的时候重新连接
   * @param ev
   */
  onError(ev ?: any) {
    console.warn('websocket 连接异常');
  }


  /**
   * 向服务端websocket server 发送消息
   * @param message
   */
  sendMessage(message: any) {
    this.ws.send(message);
  }

  /**
   * 关闭socket 流
   * @param code
   * @param reason
   */
  closeSocket(code ?: number, reason ?: string) {
    if (this.ws) {
      this.ws.close(code, reason);
      this.connectSuccess = false;
    }
  }

  /**
   * 执行签字操作，并查看签字文档（告知书）
   * @param pdfUrl 告知书访问路径
   * @param signPage
   */

  /*sign(pdfUrl: string, signPage = '2') {
    const json: any = {};
    json.PDFPath = pdfUrl;
    json.XmlPath = ''; // 为空表示点击屏幕进行签名
    json.Location = '0,' + signPage + ',3000,1000'; // 0 代表签字, signPage 代表页码, 后面的代表X Y坐标
    json.Retain = '发送的语音内容'; // 必填参数，不可为空，随意填写，不知道什么作用 (预留项)
    json.Timeout = 60;
    json.type = 3;
    const jsonStr = JSON.stringify(json);
    this.ws.send(jsonStr);
  }*/
  /**
   * 执行签字操作，并查看签字文档（告知书）
   * @param pdfUrl 告知书访问路径
   * @param signPage
   * @description 点击签字才可以签字,点击其他地方无法签字,从而来固定签字的位置
   */
  sign(pdfUrl: string, signPage = '1') {
    const json: any = {};
    json.PDFPath = pdfUrl;
    json.XmlPath = 'D:\\\\hw.xml'; // 为空表示点击屏幕进行签名 D:\\hw.xml
    json.Location = '0,' + signPage + ',1000,100'; // 0 代表签字, signPage 代表页码, 后面的代表X Y坐标
    json.Retain = '发送的语音内容'; // 必填参数，不可为空，随意填写，不知道什么作用 (预留项)
    json.Timeout = 60;
    json.type = 3;
    const jsonStr = JSON.stringify(json);
    console.log('执行签字操作的位置', json.Location);
    this.ws.send(jsonStr);
  }

  /**
   * 只签字，不查看任何文档
   */
  signWithoutAgreement(xmlPath: string, signNamePath?: string) {
    if (!xmlPath) {
      this.msg.warning('请传入xmlPath路径');
      return;
    }
    const json: any = {};
    json.type = 11;
    json.XmlPath = xmlPath;
    json.SignNamePath = signNamePath;
    const jsonStr = JSON.stringify(json);
    this.ws.send(jsonStr);
  }

  /**
   * 取消所有操作
   */
  cancelAllOperation() {
    const json: any = {};
    json.type = 2;
    const jsonStr = JSON.stringify(json);
    this.ws.send(jsonStr);
  }

  /**
   * 设置音量
   * @param vol
   */
  setVolume(vol = 1) {
    const json: any = {};
    json.type = 19;
    json.Value = vol;
    const jsonStr = JSON.stringify(json);
    this.ws.send(jsonStr);
  }

  /**
   * 设置亮度
   * @param brightness
   */
  setBrightness(brightness = 5) {
    const json: any = {};
    json.type = 20;
    json.Value = brightness;
    const jsonStr = JSON.stringify(json);
    this.ws.send(jsonStr);
  }

  /**
   * 设置签字内容区域大小，默认800宽度
   */
  setSignWidth() {
    const json: any = {};
    json.SignWidth = 800;
    json.type = 60;
    const jsonStr = JSON.stringify(json);
    this.ws.send(jsonStr);
  }
}

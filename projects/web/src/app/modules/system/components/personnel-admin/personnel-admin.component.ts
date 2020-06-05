import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {NbDialogService} from '@nebular/theme';
import {AddStaffComponent} from '../dialog/add-staff/add-staff.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '@tod/uea-auth-lib';
import {ConfigService} from '@ngx-config/core';
import {NzMessageService} from 'ng-zorro-antd';
import {Subscription} from 'rxjs';
import {SignImageComponent} from '../dialog/sign-image/sign-image.component';
import {
  PovStaffApiService,
  MedicalStaffSignService,
  PovStaffInitService,
  SysConfInitService,
  SysConfKey,
  JoyusingSignpadService
} from '@tod/svs-common-lib';
import {ConfirmDialogComponent} from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import {ValidatorsUtils} from '../../../../@uea/components/form/validators-utils';
import {WINDOW} from '@delon/theme';

@Component({
  selector: 'uea-personnel-admin',
  templateUrl: './personnel-admin.component.html',
  styleUrls: ['../system.common.scss'],
  providers: [JoyusingSignpadService]
})
export class PersonnelAdminComponent implements OnInit, OnDestroy {
  private readonly signPadKey = 'signPad';

  adminData: any[] = [];
  adminDataList: any[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  form: FormGroup;
  loading = false;

  // 登录用户信息
  userInfo: any;

  // websocket 访问地址
  wsUrl: string;

  // 签字得到的签字图片
  signPic = '';
  // 签字是否成功
  signSuccess = false;

  // 是否需要签字的判断条件, true - 强制签字， false - 不需要签字
  isSignAvailable = false;
  private readonly isSignAvailableKey = 'signRequired';
  // 签字类型
  signType: any;
  // websocket 访问地址
  websocketUrl: string;
  // 捷宇星签字版异常
  signError = false;
  signName: any;
  // 当前访问地址的域名
  hostname: any;

  // 订阅集合
  private subscription: Subscription[] = [];

  // 点击了那条数据
  checkData: any;

  isConnect = false;

  // 全部的医护人员的信息
  staffAllInfo: any = [];


  constructor(
    private dialogSvc: NbDialogService,
    private fb: FormBuilder,
    private povStaffSvc: PovStaffApiService,
    private userSvc: UserService,
    private configService: ConfigService,
    private ws: JoyusingSignpadService,
    private msg: NzMessageService,
    private signSvc: MedicalStaffSignService,
    private staffInitSvc: PovStaffInitService,
    private sysConfSvc: SysConfInitService,
    @Inject(WINDOW) private window: Window,
  ) {
    // 获取系统设置
    this.initSysConf();
    const signPadJson = this.configService.getSettings(this.signPadKey);
    console.log('signPadJson', signPadJson);
    if (this.signType === '0') {
      // 捷宇星
      this.websocketUrl = signPadJson.wsUrl;
      console.log('websocketUrl', this.websocketUrl);
    } else {
      // 汉王
      this.websocketUrl = signPadJson.hanwangUrl;
    }
    this.userSvc.getUserInfoByType().subscribe(user => (this.userInfo = user));
    const location = window.location;
    console.log('location', location);
    this.hostname = location.hostname;
  }

  ngOnInit() {
    // 获取全部的医护人员的信息
    this.staffAllInfo = this.staffInitSvc.getPovStaffData();

    // 如果签字设置为 true，则连接签字板，否则不连接
    if (this.isSignAvailable) {
      this.ws.connect(this.websocketUrl);
      const sub = this.ws.getMessage().subscribe(message => {
        console.log('签字返回的结果', message);
        if (this.signType === '0') {
          // 捷宇星签字
          if (message === 'error') {
            this.signError = true;
            return;
          }
          if (message) {
            console.log('签字回调====', message);
            this.signError = false;
            // const signature = JSON.parse(message.base64);
            const signature = message.base64;
            // if (signature.hasOwnProperty('SignName0')) {
            //   const signName0 = signature['SignName0'] + '';
            //   const indx = signName0.lastIndexOf(';');
            //   this.signName = signName0.substr(0, indx);
            this.signPic = 'data:image/png;base64,' + signature;
              this.signSuccess = true;
            console.log('yyyy', this.signPic);
              // 签字和重新签字
              if (this.signSuccess) {
                console.log('是否签字', this.checkData.signatureImageUrl);
                if (!this.checkData.signatureImageUrl) {
                  let params = {
                    userCode: this.checkData.number,
                    signatureImageUrl: this.signPic
                  };
                  console.log('插入', params);
                  this.signSvc.insertPovStaffSignInfo(params, resp => {
                    console.log(resp);
                    if (resp.code === 0) {
                      this.signSuccess = false;
                      this.msg.info('签字成功');
                      this.search();
                    }
                  });
                } else {
                  let params = {
                    userCode: this.checkData.number,
                    signatureImageUrl: this.signPic,
                    id: this.checkData.signId
                  };
                  console.log('修改', params);
                  this.signSvc.updatePovStaffSignInfo(params, resp => {
                    console.log(resp);
                    if (resp.code === 0) {
                      this.signSuccess = false;
                      this.msg.info('成功修改签字信息');
                      this.search();
                    }
                  });
                }
              }
            // }
          }
        } else {
          // 汉王签字
          if (message && message['error']) {
            this.msg.error('签字板签字失败，请重新签字');
          }
          if (message && !message.hasOwnProperty('error')) {
            console.log('汉王message====', message);
            let signature: string = message.data;
            console.log('汉王signature====', signature);
            const reg = new RegExp(/\'/g);
            let sign = signature.replace(reg, '"');
            const signatureJson = JSON.parse(sign);
            console.log('汉王signatureJson====', signatureJson);
            this.signName = signatureJson['signatureData'];
            this.signPic = 'data:image/png;base64,' + this.signName;
            this.signSuccess = true;
            // 签字和重新签字
            if (this.signSuccess) {
              console.log('是否签字', this.checkData.signatureImageUrl);
              if (!this.checkData.signatureImageUrl) {
                let params = {
                  userCode: this.checkData.number,
                  signatureImageUrl: this.signPic
                };
                console.log('插入', params);
                this.signSvc.insertPovStaffSignInfo(params, resp => {
                  console.log(resp);
                  if (resp.code === 0) {
                    this.signSuccess = false;
                    this.msg.info('签字成功');
                    this.search();
                  }
                });
              } else {
                let params = {
                  userCode: this.checkData.number,
                  signatureImageUrl: this.signPic,
                  id: this.checkData.signId
                };
                console.log('修改', params);
                this.signSvc.updatePovStaffSignInfo(params, resp => {
                  console.log(resp);
                  if (resp.code === 0) {
                    this.signSuccess = false;
                    this.msg.info('成功修改签字信息');
                    this.search();
                  }
                });
              }
            }
          }
        }
      });
      this.subscription.push(sub);
    }

    /*    this.ws.connect(this.websocketUrl);
        const sub = this.ws.getMessage().subscribe(message => {
          console.log('sign', message);
          if (message && !message.hasOwnProperty('error')) {
            let signature: string = message.data;
            const reg = new RegExp(/\'/g);
            let sign = signature.replace(reg, '"');
            const signatureJson = JSON.parse(sign);
            this.signPic = 'data:image/png;base64,' + signatureJson['signatureData'];
            this.signSuccess = true;
            // 签字和重新签字
            if (this.signSuccess) {
              console.log('是否签字', this.checkData.signatureImageUrl);
              if (!this.checkData.signatureImageUrl) {
                let params = {
                  userCode: this.checkData.number,
                  signatureImageUrl: this.signPic
                };
                console.log('插入', params);
                this.signSvc.insertPovStaffSignInfo(params, resp => {
                  console.log(resp);
                  if (resp.code === 0) {
                    this.signSuccess = false;
                    this.msg.info('签字成功');
                    this.search();
                  }
                });
              } else {
                let params = {
                  userCode: this.checkData.number,
                  signatureImageUrl: this.signPic,
                  id: this.checkData.id
                };
                console.log('修改', params);
                this.signSvc.updatePovStaffSignInfo(params, resp => {
                  console.log(resp);
                  if (resp.code === 0) {
                    this.signSuccess = false;
                    this.msg.info('成功修改签字信息');
                    this.search();
                  }
                });
              }
            }
          }
          if (message && message['error']) {
            this.msg.error('签字板签字失败，请重新签字');
          }
        });*/
    // this.subscription.push(sub);
    this.form = this.fb.group({
      realName: [null],
      telephone: [null, [ValidatorsUtils.validatePhoneNo('telephone')]]
    });
    this.search();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
    // this.ws.stopReconnect();
    // this.ws.heartBeatCheckStop();
    this.ws.closeSocket();
  }

  /**
   * 初始化系统配置项
   */
  initSysConf() {
    // 获取系统配置的签字类型  0 - 捷宇星  1 - 汉王
    this.signType = this.sysConfSvc.getConfValue(SysConfKey.signType);
    // 是否强制签字， 签字 - 1，不签字 - 0
    this.isSignAvailable = this.sysConfSvc.getConfValue(SysConfKey.signRequired) === '1';
  }

  // 新增用户
  addAdmin() {
    this.dialogSvc
      .open(AddStaffComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          userInfo: this.userInfo,
        }
      })
      .onClose.subscribe(resp => {
      if (resp) {
        this.search();
      }
    });
  }

  // 修改医护人员信息
  changeStaffInfo(data: any) {
    this.dialogSvc
      .open(AddStaffComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          userInfo: this.userInfo,
          updateStaffData: data
        }
      })
      .onClose.subscribe(resp => {
      console.log('返回的结果', resp);
      if (resp) {
        this.search();
      }
    });
  }

  // 删除医护人员信息
  deleteStaffInfo(data: any) {
    this.dialogSvc.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认删除',
        content: '是否确认删除此医护人员数据?'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        this.povStaffSvc.deletePovStaff(data.id, resp => {
          if (resp.code === 0) {
            this.msg.info('删除成功');
            this.search(this.pageIndex);
          }
        });
      }
    });
  }

  // 查询信息
  search(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    if (this.form.invalid) {
      this.msg.warning('请正确填写手机号码');
      return;
    }
    this.loading = true;
    let conditions = JSON.parse(JSON.stringify(this.form.value));
    let query = {
      povCode: this.userInfo.pov,
      realName: conditions.realName,
      telephone: conditions.telephone,
    };
    console.log('参数', query);
    this.adminData = [];
    this.adminDataList = [];
    this.loading = true;
    this.povStaffSvc.queryPovStaff(query, resp => {
      console.log('查询结果', resp);
      this.loading = false;
      if (resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data.length === 0) {
        return;
      }
      this.adminData = resp.data;
      this.staffInitSvc.setPovStaffData(this.adminData);
      /*if (this.adminData) {
        this.adminDataList = this.adminData.slice((this.pageIndex - 1) * this.pageSize, (this.pageIndex) * this.pageSize);
      }*/
      /*if (resp[1].code !== 0 || !resp[1].hasOwnProperty('data') || resp[1].data.length === 0) {
        return;
      }
      this.total = resp[1].data[0].count;*/
    });
  }

  // 重置
  reset() {
    this.form.reset();
    /*this.adminData = [];
    this.adminDataList = [];*/
    this.loading = false;
  }

  // 签字
  sign(data) {
    console.log('sign', data);
    this.checkData = data;
    this.signSuccess = false;
    if (this.isSignAvailable) {
      if (this.signType === '0') {
        // 调用捷宇星
        let url = 'http://' + this.hostname + ':19998';
        console.log('捷宇星的url', url);
        this.ws.signWithoutAgreement('E:\\sign\\sign.xml');
      } else {
        // 使用汉王签字版签字
        let url = 'open,' + this.websocketUrl;
        console.log('汉王URL====', url);
        this.ws.sendMessage(url);
      }
    }

    /*let url = 'open,' + this.websocketUrl;
    this.ws.sendMessage(url);*/
  }

  // 重新签字
  resign(data) {
    this.checkData = data;
    this.signSuccess = false;
    if (this.isSignAvailable) {
      if (this.signType === '0') {
        // 调用捷宇星
        // let url = 'http://' + this.hostname + ':19998' + this.websocketUrl;
        this.ws.signWithoutAgreement('E:\\sign\\sign.xml');
        // console.log('捷宇星的url', url);
        // this.ws.signWithoutAgreement(url);
      } else {
        // 使用汉王签字版签字
        let url = 'open,' + this.websocketUrl;
        console.log('汉王URL====', url);
        this.ws.sendMessage(url);
      }
    }
    /*  this.checkData = data;
      let url = 'open,' + this.websocketUrl;
      this.ws.sendMessage(url);*/
  }

  // 查看签字
  checkSign(data) {
    let params = {
      userCode: data.number,
    };
    this.signSvc.queryStaffSignInfo(params, resp => {
      if (resp.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        console.log('查看', resp);
        this.dialogSvc.open(SignImageComponent, {
          context: {
            signPic: resp.data[0].signatureImageUrl
          }
        });
      } else {
        this.msg.warning('未查询到签字信息');
      }
    });
  }
}

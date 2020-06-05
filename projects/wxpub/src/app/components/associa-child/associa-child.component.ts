import {DateUtils} from '@tod/svs-common-lib';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import { ToastService } from 'ng-zorro-antd-mobile';
import {Location} from '@angular/common';
import {WxService} from '../../services/wx.service';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {timer, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-associa-child',
  templateUrl: './associa-child.component.html',
  styleUrls: [
    './associa-child.component.scss',
    '../../wx.component.scss'
  ]
})
export class AssociaChildComponent implements OnInit {
  childInfo: FormGroup;
  userInfo = {};
  birthday = undefined;
  countDown = 0;
  timer = undefined;
  codeStr = '获取验证码';
  // 获取到的验证码
  codeValue = '';

  cityData: any;

  res: any = {
    cho2: true,
    worldpost: '1',
    contact: '1',
    country: '1',
    agree: true,
  };

  constructor(
    private fb: FormBuilder,
    private wxService: WxService,
    // private _toast: ToastService,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('wxUserInfo'));
    this.childInfo = this.fb.group({
      name: [null, [Validators.required]],
      birthday: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      inviteCode: [null, [Validators.required]]
    });
  }

  addAttend() {
    const form = this.childInfo.value;
    console.log(11, form);
    // if (this.childInfo.invalid) {
    let toastStr = '';
    if (!form.name) {
      toastStr = '请先填写宝宝名字在提交！';
    } else if (!form.birthday) {
      toastStr = '请先填写宝宝生日在提交！';
    } else if (!form.inviteCode) {
      toastStr = '验证码不可为空！';
    }
    // this._toast.show(toastStr, 1000);
    //   return;
    // }
    const params = {
      userAccount: this.userInfo['userAccount'],
      contactPhone: (form.phone + '').replace(/\s*/g, '') || '',
      name: form.name,
      bathDate: this.currentDateFormat(form.birthday, 'YYYY-MM-DD HH:mm:ss'),
      code: form.inviteCode,
      familyRelation: '0'
    };

    this.wxService.insertAttend(params, res => {
      console.log('关注儿童====', res);
      if (res.code === 0) {
        this.location.back();
      } else {
        // this._toast.show(res.msg, 1000);
      }
    });
    console.log(22, form);
  }

  getCode() {
    // return timer(1000).pipe(map(() => true));
    const form = this.childInfo.value;
    if (!form.phone) {
      // this._toast.show('请先输入受种人或监护人手机号', 1000);
      // return;
    }
    const params = {
      phoneNumber: (form.phone + '').replace(/\s*/g, ''),
      platformCode: 'aliyun',
      templateName: 'aliyun'
    };
    this.wxService.sendSms(
      params,
      res => {
        console.log('验证码====', res);
        if (res.code === 0) {
          this.codeValue = res.data;
        }
      }
    );
    this.countDown = 60;
    this.countDown--;
    this.codeStr = this.countDown + ' S ';
    this.timer = setInterval(() => {
      if (this.countDown > 0) {
        this.countDown--;
        this.codeStr = this.countDown + ' S ';
      } else {
        this.codeStr = '重新获取';
        clearInterval(this.timer);
      }
    }, 1000);
  }

  currentDateFormat(date, format: string = 'YYYY-MM-DD'): any {
    return DateUtils.getFormatTime(date, format);
  }

  getMaxDate() {
    return new Date();
  }
}

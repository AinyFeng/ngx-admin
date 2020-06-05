import {Component, OnInit, ViewChild} from '@angular/core';
// import {ViewChild} from 'angular2/core';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';
import {ActivatedRoute, Params} from '@angular/router';
// import { ToastService } from 'ng-zorro-antd-mobile';
import {Location} from '@angular/common';
import {WxService} from '../../services/wx.service';
import {DateUtils} from '@tod/svs-common-lib';

@Component({
  selector: 'app-appointment-sign',
  templateUrl: './appointment-sign.component.html',
  styleUrls: [
    './appointment-sign.component.scss',
    '../../wx.component.scss'
  ]
})
export class AppointmentSignComponent implements OnInit {
  @ViewChild(SignaturePad, {static: false}) public signaturePad: SignaturePad;
  signaturePadOptions: Object = {
    minWidth: 4,
    canvasWidth: 320,
    canvasHeight: 300,
    penColor: 'orange'
  };
  // 上级页面传过来的预约信息
  appointInfo: any;
  // 告知书模版
  appointModel: String;
  // 是否显示签字版
  showSignPad = false;
  showSign = false;
  signImageUrl = '';
  agreeItemData = {value: 'Agree Submit', name: 'Agree Item', checked: false};
  agree: true;
  testValue: number;
  testOption: Object;
  imageConfig: Object;

  constructor(
    private activeRoute: ActivatedRoute,
    private wxService: WxService,
    // private _toast: ToastService,
    private location: Location
  ) {
    this.imageConfig = require('../../../assets/data/resourcePath/resourceConfig.json');
    this.activeRoute.params.subscribe((params: Params) => {
      this.appointInfo = JSON.parse(params['appoint']);
      let signature = this.appointInfo['detailDatas'][0]['signature'] || '';
      if (signature.length > 0) {
        this.signImageUrl = this.imageConfig['imageHost'] + signature;
      } else {
        this.signImageUrl = '';
      }
      console.log(22, this.appointInfo);
    });
  }

  ngOnInit() {
    this.signaturePadOptions['canvasWidth'] = window.innerWidth;
    this.signaturePadOptions['canvasHeight'] = window.innerHeight * 0.75;
    this.wxService.queryAgreementModel({subclassCodes: this.appointInfo['detailDatas'][0]['reservationVaccine']}, res => {
      if (res.code === 0) {
        this.appointModel = res.data[0]['content'];
        // console.log('告知书模板信息====', res.data[0]['content']);
      }
    });

    setTimeout(() => {
      this.testValue = 300;
      this.testOption = {
        name: 'name',
        nick: 'ccj'
      };
    }, 15000);
  }

  // 父组件接受数据
  imageData(e) {
    console.log(e);
  }

  clearSign() {
    console.log(22, this.signaturePad);
    setTimeout(() => {
      this.signaturePad.clear();
    }, 500);

  }

  // 确定签字
  comSign(img) {
    this.showSignPad = false;
    this.signImageUrl = img;
    this.showSign = true;
    // if (this.signaturePad.isEmpty()) {
    //   // this._toast.show('签字信息不能为空!', 2000);
    //   return;
    // }
    const tempSignatureData = this.appointInfo['detailDatas'].map(item => {
      return {
        reservationDetailSerial: item['reservationDetailSerial'],
        signatureInfo: this.signImageUrl.split('base64,')[1],
        profileCode: this.appointInfo['profileCode'],
        vaccinateInjectNumber: '' + item['vaccinateInjectNumber'],
        vaccineBroadHeadingCode: item['reservationGroup'], // 大类编码
        vaccineSubclassCode: item['reservationVaccine'], // 疫苗小类编码
        signSource: '0', // 签字来源, 0-微信
        agreementCode: item['reservationVaccine'], // 告知书编码
        vaccineProductCode: item['reservationProduct'], // 产品编码
        signTime: DateUtils.getFormatTime(new Date()), // 签字时间
        povCode: this.appointInfo['povCode'], // pov编码
      };
    });
    const params = {
      reservationSignatures: tempSignatureData
    };
    this.wxService.saveSignatureInfo(params, res => {
      if (res.code === 0) {
        // 签字成功返回上级页面
        this.location.back();
      }
      // console.log('存储预约签字信息====', res);
    });
  }

  // 已签过的 则 回显签字版图片
  toSign() {
    if (this.signImageUrl.length > 0) {
      return;
    }
    this.showSignPad = true;
    setTimeout(() => {
      if (this.signImageUrl.length > 0) {
        // 这里一定是signImageUrl有值的时候才去 回显签字版图片，要不 判断签字版是否为空的方法一直都为false，因为signImageUrl=''，导致签字版不为空
        this.signaturePad.fromDataURL(this.signImageUrl);
      }
    }, 20);
  }
}

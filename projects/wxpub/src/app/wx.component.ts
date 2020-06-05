import {Component, OnInit} from '@angular/core';
import {WxService} from './services/wx.service';
import {AuthService, UserProfile, UserService} from '@tod/uea-auth-lib';
import {Router} from '@angular/router';

@Component({
  selector: 'app-wx-component',
  template: `
      <router-outlet></router-outlet>
      <notifier-container></notifier-container>
  `,
  styleUrls: ['./wx.component.scss']
})
export class WxComponent implements OnInit {

  // profile: Partial<UserProfile>;
  profile = {};

  constructor(
    private wxService: WxService,
    private authService: AuthService,
    protected router: Router,
    private userService: UserService) {

    this.authService.runInitialLoginSequence();
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        console.log('====已登陆=====', this.authService);
        // this.router.navigateByUrl('/wxHome');
      }
    });
  }

  ngOnInit() {
    this.userService.getUserInfoByType().subscribe(
      (userProfile) => {
        this.profile = userProfile;
        // 临时配置 模拟微信帐号登录获取用户信息, 在授权功能调试完成之前请不要注释！！！！
        this.profile = {
          ...userProfile,
          userAccount: userProfile['user_name'], // 临时配置 模拟微信登录 获取用户手机号
          // profileCode: '340621030120180571', // 档案编号
          // contactPhone: '18154172077', // 监护人手机号码
          name:  userProfile['user_name'], // 受种人姓名
          vaccinationPovCode: '', // 接种POV;
        };
        localStorage.setItem(
          'wxUserInfo',
          JSON.stringify(this.profile)
        );
        // gluu 在公众号登陆的链接
        // "https://open.weixin.qq.com/connect/oauth2/authorize?" +
        //   "appid=wx27f981e2313b12a0&" +
        //   "redirect_uri=https%3A%2F%2Fuat.chinavacc.com.cn%2Fpassport%2Fauth%2Fweixin%2Fcallback&" +
        //   "response_type=code&" +
        //   "scope=snsapi_base&" +
        //   "connect_redirect=1" +
        //   "#wechat_redirect"

        console.log('=====wxUserInfo=====', JSON.parse(localStorage.getItem('wxUserInfo')));
        console.table('wx components is ',  this.profile);
      }
    );

    // const userInfo = JSON.parse(localStorage.getItem('wxUserInfo'));
    const wxDicInfo = JSON.parse(localStorage.getItem('wxDicInfo'));
    const HFTongUserInfo = JSON.parse(localStorage.getItem('hftUserInfo'));

    if (!wxDicInfo) {
      this.getWxDicInfo();
    }
    if (!HFTongUserInfo) {
      this.getHFTongInfo();
    }
  }

  getWxDicInfo() {
    let wxInfo = {
      idType: undefined,
      residentialType: undefined,
      birthHospital: undefined,
      nationData: undefined
    };
    this.wxService.queryDictionary({}, res => {
      console.log('获取字典数据====', res);
      let idTypeData = []; // 户口类型
      let residentialTypeData = []; // 居住类型
      if (res.code === 0) {
        res.data.forEach(item => {
          if (item.dictType === 'id_type') {
            idTypeData.push(item);
          } else if (item.dictType === 'residential_type') {
            residentialTypeData.push(item);
          }
        });
        // dictKey: "1"
        // dictType: "residential_type"
        // dictTypeCn: "居住类型"
        // dictValue: "本地"
        // id: 140
        wxInfo.idType = idTypeData.map(item => {
          return {
            ...item,
            label: item.dictValue,
            value: item.dictKey
          };
        });
        wxInfo.residentialType = residentialTypeData.map(item => {
          return {
            ...item,
            label: item.dictValue,
            value: item.dictKey
          };
        });
        localStorage.setItem('wxDicInfo', JSON.stringify(wxInfo));
      }
    });
    // 出生医院data
    this.wxService.queryHospitalBaseInfo({}, res => {
      if (res.code === 0) {
        // areaCode: "340602000000"
        // hospitalCode: "3406020201"
        // hospitalName: "石台镇卫生院"
        // id: 1
        // isCumObstetrics: "0"
        wxInfo.birthHospital = res.data.map(item => {
          return {
            ...item,
            label: item.hospitalName,
            value: item.areaCode
          };
        });
        localStorage.setItem('wxDicInfo', JSON.stringify(wxInfo));
      }
    });
    // 民族数据
    this.wxService.queryNationBaseInfo({}, res => {
      if (res.code === 0) {
        // "code": "5",
        //   "id": 5,
        //   "name": "维吾尔族"
        wxInfo.nationData = res.data.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.code
          };
        });
        localStorage.setItem('wxDicInfo', JSON.stringify(wxInfo));
      }
    });
  }

  getHFTongInfo() {
    const params = {
      maKey: '28ebfcdfd53a43e3a16b69345179aa5b',
      ticket: 'ace0520a0d5a48999ce6f0ff892ae6a0'
    };
    this.wxService.getHFTongInfo(params, res => {
      // todo
      // 实际情况是 拿到合肥通的接口的 userId，来 svs 后台认证拿到用户信息之后 存入 'hftUserInfo' 之中
      let hftUser = {};
      if (res.code === '0') {
        hftUser = {
          ...res['data']['perUserVo']
        };
        localStorage.setItem('hftUserInfo', JSON.stringify(hftUser));
        console.log('hftUserInfo======hftUser==%o', hftUser);
      }
    });
  }
}

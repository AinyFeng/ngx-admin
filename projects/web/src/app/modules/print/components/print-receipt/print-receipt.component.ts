import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '@tod/uea-auth-lib';
import { ConfigService } from '@ngx-config/core';

@Component({
  selector: 'uea-print-receipt',
  templateUrl: './print-receipt.component.html',
  styleUrls: ['./print-receipt.component.scss']
})
export class PrintReceiptComponent implements OnInit {
  id = 'receipt';
  // 用户信息
  userInfo: any;
  // 发票打印模板参数
  receiptTemplateJson: any;
  // 每个省份打印的模板
  @Output()
  readonly printTemplate = new EventEmitter();

  constructor(private userSvc: UserService, private configSvc: ConfigService) {
    this.receiptTemplateJson = this.configSvc.getSettings('receiptTemplate');
  }

  ngOnInit() {
    // 根据用户信息获取当前所在地区，根据地区获取打印的模板
    this.userSvc.getUserInfoByType().subscribe(user => {
      // console.log(user);
      this.userInfo = user;
      const province = user.pov.substring(0, 2);
      // 安徽
      if (province === '34') {
        this.printTemplate.emit({
          template: this.receiptTemplateJson.anhui2017,
          id: this.id,
          location: '34'
        });
      }
      // 上海
      if (province === '31') {
        this.printTemplate.emit({
          template: this.receiptTemplateJson.shanghai2017,
          id: this.id,
          location: '31'
        });
      }
      // 江西
      if (province === '36') {
        this.printTemplate.emit({
          template: this.receiptTemplateJson.jiangxi,
          id: this.id,
          location: '36'
        });
      }
      // 云南
      if (province === '53') {
        this.printTemplate.emit({
          template: this.receiptTemplateJson.yunnan,
          id: this.id,
          location: '53'
        });
      }
    });
  }
}

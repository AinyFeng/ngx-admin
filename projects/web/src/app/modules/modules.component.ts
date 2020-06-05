import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { NbIconLibraries, NbMenuItem } from '@nebular/theme';
import { StartupService, LOCAL_STORAGE } from '@tod/svs-common-lib';
import { MODULES_MENU_ITEMS } from './modules-menu';

@Component({
  selector: 'mds-modules-component',
  styleUrls: ['modules.component.scss'],
  template: `
    <uea-page-portal [sidemenus]="menuItems">
      <router-outlet></router-outlet>
    </uea-page-portal>
  `
})
export class ModulesComponent implements OnInit {

  menuItems: NbMenuItem[] = MODULES_MENU_ITEMS;

  constructor(
    private startSvc: StartupService,
    private localSt: LocalStorageService,
    private iconLibraries: NbIconLibraries
  ) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    this.iconLibraries.setDefaultPack('fas');

    // router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     const url = event.url;
    //     const mainUrl = url.split('/')[2];
    //     if (mainUrl !== 'dashboard') {
    //       this.navService.setShowGohomeBtn(true);
    //     } else {
    //       this.navService.setShowGohomeBtn(false);
    //     }
    //     if (mainUrl === 'wxService') {
    //       this.headerSvc.setHeaderDisplay(false);
    //     } else {
    //       this.headerSvc.setHeaderDisplay(true);
    //     }
    //     this.navService.setHeaderTitle({ url: mainUrl });
    //     const menus: any = this.menuItems.filter(item => {
    //       return item.link.indexOf(mainUrl) !== -1;
    //     });
    //     if (menus.length !== 0) {
    //       if (menus[0].children) {
    //         this.navService.setMenuItems(menus[0].children);
    //       }
    //     } else {
    //       this.navService.setMenuItems([]);
    //     }
    //   }
    // });
    this.localSt.store(LOCAL_STORAGE.SYSTEM_NOTICE, false);
  }

  ngOnInit(): void {
    this.startSvc.start();

    // https://pulsar.apache.org/docs/en/client-libraries-websocket/#docsNav
    // consumer 会读取未消费信息
    // reader 只会读取最新消息
    //
    // const url = 'ws://192.168.1.113:18080/ws/v2/consumer/persistent/svs_test/ns1_test/topic_test/my-subscription';
    // const url = 'ws://192.168.1.113:18080/ws/v2/consumer/persistent/public/default/registerWaitingQueue/registerWaitingQueueSub';
    // this.webSocketSvc.connect(url);
    // this.webSocketSvc.getMessage().subscribe(receiveMsg => {
    //   console.log('收到了websocket 信息', receiveMsg);
    //   const data = JSON.parse(receiveMsg.data);
    //   console.log('转换之后', data);
    //   const ackMsg = { messageId: data.messageId };
    //   console.log(ackMsg);
    //   this.webSocketSvc.sendMessage(JSON.stringify(ackMsg));
    // });
  }
}

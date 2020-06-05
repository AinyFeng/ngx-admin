import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { NbMenuItem } from '@nebular/theme';

export class AppTitle {
  mainTitle: string;
  subTitle: string;
}

@Injectable({ providedIn: 'root' })
/**
 * 用于控制布局中的头部header 或者 底部 footer 的显示或隐藏
 */
export class AppStateService {

  private static readonly APP_TITLE: AppTitle = { mainTitle: '智慧预防接种平台', subTitle: '' };
  private static readonly APP_SIDEMENU: NbMenuItem[] = [];

  private appTitleSubject$ = new BehaviorSubject<AppTitle>(AppStateService.APP_TITLE);
  public appTitle$ = this.appTitleSubject$.asObservable();

  private appSideMenuSubject$ = new Subject<NbMenuItem[]>();
  public appSideMenu$ = this.appSideMenuSubject$.asObservable();

  private fullScreenSubject$ = new Subject<boolean>();
  public fullScreen$ = this.fullScreenSubject$.asObservable();

  getAppTitle() {
    return this.appTitle$;
  }

  setSubTitle(subtitle: string) {
    const newtitle = { mainTitle: AppStateService.APP_TITLE.mainTitle, subTitle: subtitle };
    this.appTitleSubject$.next(newtitle);
  }

  clearSubTitle() {
    const newtitle = { mainTitle: AppStateService.APP_TITLE.mainTitle, subTitle: '' };
    this.appTitleSubject$.next(newtitle);
  }

  getAppSideMenu() {
    return this.appSideMenu$;
  }

  setAppSideMenu(items: NbMenuItem[]) {
    this.appSideMenuSubject$.next(items);
  }

  setFullScreen(flag: boolean) {
    this.fullScreenSubject$.next(flag);
  }

  getFullScreen() {
    return this.fullScreen$;
  }

  compactMain() {
    this.fullScreenSubject$.next(false);
  }
}

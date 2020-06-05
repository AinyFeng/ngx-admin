import { AuthService } from '@tod/uea-auth-lib';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  NbSidebarService,
  NbThemeService,
  NbMediaBreakpointsService,
  NbIconLibraries,
  NbMenuService
} from '@nebular/theme';
import { map, takeWhile } from 'rxjs/operators';
import {
  UEA_DASHBOARD_OPTIONS,
  defaultDashboardOptions
} from '../dashboard/uea.options';
import { UserProfile } from '@tod/uea-auth-lib';
import { UserService } from '@tod/uea-auth-lib';
import { AppStateService, AppTitle } from '../../service/app.state.service';

@Component({
  selector: 'uea-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit, OnDestroy {
  title: AppTitle;
  private alive: boolean = true;
  user: Partial<UserProfile>;
  userPictureOnly: boolean = false;
  currentTheme = 'default';
  themes = [
    { value: 'default', name: '浅色风格' },
    { value: 'dark', name: '深色风格' },
    { value: 'cosmic', name: '宇宙风格' },
    { value: 'corporate', name: '企业风格' }
  ];
  userContextMenu = [
    // { title: '账户信息', link: '/modules/portal/accountBindingInfo', icon: 'passport' },
    {
      title: '个人信息',
      link: '/tools/personalInfo',
      icon: 'id-badge'
    },
    // { title: '操作记录', link: '/modules/portal/operateRecord', icon: 'compact-disc' },
    {
      title: '退出登录',
      icon: 'sign-out-alt',
      data: 'actionlogout'
    }
  ];
  messageContextMenu = [
    {
      title: '接收消息',
      link: '/modules/portal/messageList',
      icon: 'envelope'
    },
    {
      title: '发送消息',
      link: '/modules/portal/sendMessage',
      icon: 'comment-dots'
    },
    {
      title: '已删消息',
      link: '/modules/portal/deleteMessage',
      icon: 'trash-alt'
    }
  ];

  // tagLang = 'lang';
  // userMenuKey = 'header.user.action';
  // language = [
  //   { title: '简体中文', data: 'zh_CN' },
  //   { title: '繁體中文', data: 'zh_HK' },
  //   { title: 'English', data: 'en_US' }
  // ];

  constructor(
    private appStateService: AppStateService,
    private authService: AuthService,
    @Inject(UEA_DASHBOARD_OPTIONS) protected options = defaultDashboardOptions,
    private sidebarService: NbSidebarService,
    private themeService: NbThemeService,
    private userService: UserService,
    private breakpointService: NbMediaBreakpointsService,
    private menuService: NbMenuService,
    private router: Router,
    iconLibraries: NbIconLibraries
  ) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconLibraries.setDefaultPack('fas');

    this.appStateService.getAppTitle().subscribe(
      (title) => {
        this.title = title;
      }
    );

    this.menuService.onItemClick().subscribe((event) => {
      if (event.item.data === 'actionlogout') {
        console.log('logout clicked');
        this.authService.logout();
      }
    });

    this.userService.userInfo$
      .subscribe(
        (profile) => {
          this.user = profile;
        }
      );
  }

  ngOnInit() {

    this.currentTheme = this.themeService.currentTheme;

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeWhile(() => this.alive)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeWhile(() => this.alive)
      )
      .subscribe(themeName => (this.currentTheme = themeName));
  }

  ngOnDestroy() {
    this.alive = false;
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'sidebar-menu');
    return false;
  }

  navigateHome() {
    this.navigateByUrl('/modules/dashboard');
    return false;
  }

  navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
    return false;
  }

  startSearch() {
    // this.analyticsService.trackEvent('startSearch');
  }

  goToHome() {
    this.navigateHome();
  }

  expandFull() {
    this.appStateService.setFullScreen(false);
  }
}

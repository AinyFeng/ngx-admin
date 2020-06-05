import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Subject, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  switchMap,
  tap
} from 'rxjs/operators';
import { UserService } from '@tod/uea-auth-lib';
import { PovInfoService, HospitalBaseInfoService, AdministrativeService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-f-select-hospital',
  templateUrl: './select-hospital.component.html',
  styleUrls: ['./select-hospital.component.scss'],
  providers: [PovInfoService, HospitalBaseInfoService]
})
export class SelectHospitalComponent implements OnInit, OnDestroy {
  povData = [];
  povTotal: number;
  povPageIndex = 1;
  searchPov$ = new Subject<any[]>();

  hospitalData = [];
  hosTotal: number;
  hosPageIndex = 1;

  loading = false;
  // 判断是是否显示接种单位
  flag: boolean;

  searchHospital$ = new Subject<any[]>();

  private subscription: Subscription[] = [];

  // 被选中的node节点
  selectedNodeKey: any;

  // 行政区划树节点数据
  administrativeTreeData = [];
  // 用户信息
  userInfo: any;

  /**
   * 查询医院关键字
   */
  searchText: string;
  /**
   * 查询门诊关键字
   */
  searchPovText: string;

  constructor(
    private ref: NbDialogRef<SelectHospitalComponent>,
    private povDataSvc: PovInfoService,
    private hosDataSvc: HospitalBaseInfoService,
    private msg: NzMessageService,
    private adminSvc: AdministrativeService,
    private userSvc: UserService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => {
      if (user) {
        this.userInfo = user;
        const provinceCode = user.pov.substr(0, 2);
        // 只获取当前登录用户所在的省份行政区划数据
        this.administrativeTreeData = this.adminSvc
          .getAdministrativeTreeData()
          .filter(province => province['key'] === provinceCode + '0000');
        if (this.administrativeTreeData.length !== 0) {
          this.administrativeTreeData[0]['expanded'] = true;
          // console.log(this.administrativeTreeData);
          this.substringAreaCode(this.administrativeTreeData[0]['key']);
        }
      }
    });
  }

  ngOnInit() {
    this.queryPovData();
    this.queryHosData();
    const sub1 = this.searchHospital$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerms => {
        // console.log('pov queryHosData', searchTerms);
        this.queryHosData(1, searchTerms.toString());
      });

    const sub2 = this.searchPov$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(searchTerms => {
        // console.log('pov searchPov$', searchTerms);
        this.queryPovData(1, searchTerms.toString());
      });
    this.subscription.push(sub1);
    this.subscription.push(sub2);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  onClose() {
    this.ref.close();
  }

  /**
   * 查询pov数据
   */
  queryPovData(page = 1, name?: string) {
    if (!this.selectedNodeKey) {
      this.msg.info('请先选择地区范围，比如安徽省');
      return;
    }
    this.povPageIndex = page;
    this.loading = true;
    let query = {
      povCode: this.selectedNodeKey,
      pageEntity: { page: page, pageSize: 10 }
    };
    if (name) {
      query['name'] = name;
    }
    console.log(query);
    this.povDataSvc.queryPovAndCount(query, resp => {
      this.loading = false;
      this.povData = [];
      // console.log(resp);
      if (
        resp[0].code !== 0 ||
        !resp[0].hasOwnProperty('data') ||
        resp[1].code !== 0 ||
        !resp[1].hasOwnProperty('data')
      ) {
        // this.msg.warning('没有查到pov数据');
        return;
      }
      this.povData = resp[0].data;
      this.povTotal = resp[1].data[0].count;
    });
  }

  /**
   * 查询出生医院数据
   */
  queryHosData(page = 1, hospitalName?: string) {
    if (!this.selectedNodeKey) {
      this.msg.info('请先选择地区范围');
      return;
    }
    this.hosPageIndex = page;
    this.loading = true;
    let query = {
      areaCode: this.selectedNodeKey,
      pageEntity: {
        page: page,
        pageSize: 10
      }
    };
    if (hospitalName) {
      query['hospitalName'] = hospitalName;
    }
    console.log(query);
    this.hosDataSvc.queryHospitalAndCount(query, resp => {
      this.loading = false;
      this.hospitalData = [];
      // console.log(resp);
      if (
        resp[0].code !== 0 ||
        !resp[0].hasOwnProperty('data') ||
        resp[1].code !== 0 ||
        !resp[1].hasOwnProperty('data')
      ) {
        // this.msg.warning('没有查到出生医院数据');
        return;
      }
      this.hospitalData = resp[0].data;
      this.hosTotal = resp[1].data[0].count;
    });
  }

  /**
   * 根据输入的input参数查询pov，模糊查询
   * @param ev
   */
  filterPov(ev) {
    // console.log(ev);
    if (ev && ev.length < 2) {
      return;
    }
    this.searchPov$.next(ev);
  }

  /**
   * 根据输入的参数查询医院，模糊查询
   * @param ev
   */
  filterHospital(ev) {
    // console.log(ev);
    if (ev && ev.length < 2) {
      return;
    }
    this.searchHospital$.next(ev);
  }

  /**
   * 选择一个 pov
   */
  selectPov(data) {
    this.ref.close({ label: data.name, value: data.povCode });
  }

  /**
   * 选择一个 hospital
   * @param data
   */
  selectHos(data) {
    this.ref.close({
      label: data.hospitalName,
      value: data.hospitalCode,
      type: 'nonPov'
    });
  }

  /**
   * 获取点击事件的数据
   * @param node
   */
  onClickTree(node) {
    // console.log('选择了节点', node);
    const origin = node.node.origin;
    const level = origin.level;
    if (level === 1) {
      this.substringAreaCode(node.keys[0].substr(0, 2));
    }
    if (level === 2) {
      this.substringAreaCode(node.keys[0].substr(0, 4));
    }
    if (level === 3) {
      this.substringAreaCode(node.keys[0]);
    }
  }

  /**
   * 根据所选节点key值获取areaCode
   * 将截取之后的code 作为模糊查询的参数之一
   * @param areaCode 所选节点的key值
   */
  substringAreaCode(areaCode: string) {
    if (typeof areaCode !== 'string' || !areaCode) return;
    const reg = new RegExp(/[0]{3,}$/);
    const code = areaCode.replace(reg, '');
    this.selectedNodeKey = code;
    this.queryHosData();
    this.queryPovData();
  }
}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ColdchainSelectedNodeService, TreeDataApi} from '@tod/svs-common-lib';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-entry',
  template: `
      <div nz-row>
          <!--组织树-->
          <div nz-col [nzSpan]="isShow ? 6 : 0">
              <nz-card *ngIf="isShow" [nzTitle]="title"  [nzExtra]="extraTemplate" >
                  <ng-template #title>{{'组织树 [' + selectTitle+ ']'}}</ng-template>
                  <div style="overflow:scroll;height: 70vh;">
                      <ng-template #extraTemplate>
                          <i nz-icon nzType="close-circle" nzTheme="outline" style="cursor: pointer" (click)="close()"></i>
                      </ng-template>
                      <uea-select-district [selectedKeys]="initSelect" [treeData]="nodes" [expandAll]="true" (_onSelectNode)="activeNode($event)"></uea-select-district>
                  </div>
              </nz-card>
              <!--<uea-organization-tree [(isCard)]="isShow"></uea-organization-tree>-->
          </div>
          <!--切换区域-->
          <div nz-col [nzSpan]="isShow ? 18 : 24">
              <nz-card>
                  <router-outlet></router-outlet>
              </nz-card>
          </div>
          <!--折叠按钮-->
          <div class="flexible" (click)="isShow =! isShow" [class.position-left]='isShow'>
              <i nz-icon [nzType]="isShow ? 'caret-left' : 'caret-right'" nzTheme="outline"></i>
          </div>
      </div>
  `,
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  isShow: boolean = true;
  // 切换的url
  url: string = '';
  flag: any;
  userInfo: any;
  areaCode: any;
  nodes = [];
  initSelect = [];
  selectTitle: string = '';
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private user: UserService,
    private treeDataApi: TreeDataApi,
    private selectedNodeSvc: ColdchainSelectedNodeService
  ) {
    this.activatedRoute.url.subscribe(url => {
      this.url = this.route.url;
    });
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      this.areaCode = this.userInfo.pov.slice(0, 4);
      this.treeDataApi.queryTreeDataByCityCode(this.areaCode, resp2 => {
        if (resp2['code'] === 0) {
          this.nodes = resp2['data'];
          console.log('树数据', this.nodes);
          // 进来默认选中树的根节点
          this.initSelect = this.nodes[0].areaCode;
          console.log('树根数据code', this.initSelect);
          /*刚开始进来初始化，会导致切换页面查询接口重复请求  ？？？*/
          this.selectTitle = this.nodes[0].title;
          this.selectedNodeSvc.setNzTreeSelectedNode(this.nodes[0]);
        }
      });
      console.log('用户所在的市code====', this.areaCode);
    });
  }

  ngOnInit() {
  }

  // 树的点击事件(回调)
  activeNode(data: any): void {
      this.selectTitle = data.title;
      this.selectedNodeSvc.setNzTreeSelectedNode(data);
  }
  close() {
    this.isShow = !this.isShow;
    // this.isCardChange.emit(this.isCard);
  }
}

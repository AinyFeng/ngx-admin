import { ConfirmDialogComponent } from './../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddMessageTemplateComponent } from '../dialog/add-message-template/add-message-template.component';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiSystemMessageInfoService, PovInfoService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-msg-template-manage',
  templateUrl: './msg-template-manage.component.html',
  styleUrls: ['../admin.common.scss']
})
export class MsgTemplateManageComponent implements OnInit {
  listOfData: any[] = [];

  templateName: any;
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;

  povInfo: any;
  userInfo: any;

  constructor(
    private messageTempSvc: ApiSystemMessageInfoService,
    private dialogSvc: NbDialogService,
    private povApiSvc: PovInfoService,
    private userSvc: UserService,
    private msg: NzMessageService,
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
    this.getPovInfo();

  }

  ngOnInit() {
    this.searchData();
  }

  // 重置
  reset() {
    this.templateName = '';
    // this.listOfData = [];
  }

  // 查询短信模板
  searchData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    let params = {
      templateName: this.templateName === '' || !this.templateName ? null : this.templateName,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    console.log(params);
    this.listOfData = [];
    this.messageTempSvc.queryMessageTemplateAndCount(params, resp => {
      this.loading = false;
      console.log(resp);
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        this.listOfData = [];
        return;
      }
      this.listOfData = resp[0].data;
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data') || resp[1].data.length === 0) {
        return;
      }
      this.total = resp[1].data[0].count;
    });
  }

  // 添加本地短信模板
  addTemplate() {
    this.dialogSvc.open(AddMessageTemplateComponent, {
      context: {
        povInfo: this.povInfo
      }
    }).onClose.subscribe(resp => this.searchData());
  }

  // 修改
  changeInfo(data) {
    this.dialogSvc.open(AddMessageTemplateComponent, {
      context: {
        template: data,
        povInfo: this.povInfo
      }
    }).onClose.subscribe(resp => this.searchData());

  }

  // 删除
  deleteInfo(data) {
    this.dialogSvc.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认删除',
        content: '是否确认删除该短信模板?'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        this.messageTempSvc.deleteMessageTemp(data.id, resp => {
          console.log(resp);
          if (resp.code === 0) {
            this.msg.warning('删除成功');
            this.searchData();
          }
        });
      }
    });
  }

  /**
   * 根据登录用户查询接种门诊的基本信息，比如接种门诊的地址，电话，工作时间等
   */
  getPovInfo() {
    if (!this.userInfo) return;
    const query = {
      povCode: this.userInfo.pov
    };
    console.log(query);
    this.povInfo = [];
    this.povApiSvc.queryPovInfo(query, resp => {
      console.log(resp);
      if (resp.code === 0 && resp.data.length !== 0 && resp.hasOwnProperty('data')) {
        this.povInfo = resp.data[0];
      } else {
        this.msg.warning('暂时未查询pov相关数据');
        return;
      }
    });
  }
}

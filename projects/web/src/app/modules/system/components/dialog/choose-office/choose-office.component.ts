import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { AdministrativeService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-choose-office',
  templateUrl: './choose-office.component.html',
  styleUrls: ['../../system.common.scss']
})
export class ChooseOfficeComponent implements OnInit {
  // 被选中的node节点
  selectedNodeKey: any;

  // 行政区划树节点数据
  administrativeTreeData = [];

  constructor(
    private ref: NbDialogRef<ChooseOfficeComponent>,
    private adminSvc: AdministrativeService,
    private msg: NzMessageService
  ) {
    // 只获取当前安徽省的省份行政区划数据
    this.administrativeTreeData = this.adminSvc
      .getAdministrativeTreeData()
      .filter(province => province['key'] === '340000000000');
    if (this.administrativeTreeData.length !== 0) {
      this.administrativeTreeData[0]['expanded'] = true;
    }
  }

  ngOnInit() { }

  // 关闭
  onClose() {
    this.ref.close();
  }

  // 确认选择科室
  confirm() {
    if (this.selectedNodeKey) {
      this.ref.close(this.selectedNodeKey);
    } else {
      this.msg.warning('请选择科室');
      return;
    }
  }

  /**
   * 获取点击事件的数据
   * @param ev
   */
  onClickTree(ev) {
    this.selectedNodeKey = ev.node['_title'];
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';

import {AdministrativeService} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.scss']
})
export class SelectAddressComponent implements OnInit {

  // 传参
  @Input()
  title: string;

  // 行政区划树节点数据
  administrativeTreeData = [];
  // 选择的树节点
  selectedNodeKey: any;

  // 输入框内容
  searchName: any;
  // 显示输入框
  searchInput = true;

  constructor(
    private modal: NzModalRef,
    private adminSvc: AdministrativeService
  ) {
    const provinces = '3406040802';
    const provinceCode = provinces.substr(0, 2);
    // 只获取当前登录用户所在的省份行政区划数据
    this.administrativeTreeData = this.adminSvc
      .getAdministrativeTreeData().filter(province => province['key'] === provinceCode + '0000');
    if (this.administrativeTreeData.length !== 0) {
      this.administrativeTreeData[0]['expanded'] = true;
      console.log(this.administrativeTreeData);
      this.substringAreaCode(this.administrativeTreeData[0]['key']);
    }
  }

  ngOnInit() {
  }

  /**
   * 获取点击事件的数据
   * @param node
   */
  onClickTree(node) {
    // console.log('选择了节点', node);
    this.substringAreaCode(node.keys[0]);
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
    if (code.length <= 2) {
      this.selectedNodeKey = '';
    } else {
      this.selectedNodeKey = code;
    }
  }

  // 隐藏
  hidden() {
    this.searchInput = !this.searchInput;
  }


}

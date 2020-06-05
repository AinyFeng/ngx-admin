import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'uea-select-district',
  templateUrl: './select-district.component.html'
})
export class SelectDistrictComponent implements OnInit {
  /**
   * 已选择节点
   */
  selectedNode: any;
  /**
   * 用户信息
   */
  userInfo: any;
  /**
   * 树节点查询关键字
   */
  searchNode: string;

  /**
   * 是否隐藏搜索框，默认 - true
   */
  @Input()
  hideSearchInput = false;

  @Input()
  treeData: any[];
  @Input()
  expandAll: boolean = false;
  @Input()
  expandedKeys: string[] = [];
  /**
   * 指定选中的节点
   */
  @Input()
  selectedKeys: string[] = [];
  /**
   * 不可选择的节点key
   * 表示此节点不可被选择 - 节点类型
   */
  @Input()
  unSelectedNodeKey: string;
  /**
   * 不可选择的节点value
   * 表示此节点不可被选择 - 节点值 当节点值 = 1 的时候不可被选择
   */
  @Input()
  unSelectedNodeValue = ['1'];

  /**
   * 选择节点
   */
  @Output()
  readonly _onSelectNode = new EventEmitter<void>();
  /**
   * 是否多选，默认 - false
   */
  @Input()
  multiple = false;

  constructor(private modalSvc: NzModalService) {
  }

  ngOnInit() {
  }


  selectNode(node) {
    console.log(node);
    const origin = node.node.origin;
    if (this.unSelectedNodeKey && origin.hasOwnProperty(this.unSelectedNodeKey) && this.unSelectedNodeValue.includes(origin[this.unSelectedNodeKey])) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: `<p>不可选择当前节点</p>`,
        nzMaskClosable: true
      });
      return;
    }
    node.node.expanded = !node.node.expanded;
    this.selectedNode = node.node.origin;
    this._onSelectNode.emit(this.selectedNode);
  }


}

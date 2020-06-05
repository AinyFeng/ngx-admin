import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'uea-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.scss']
})
export class SelectAddressComponent implements OnInit {
  @Input()
  areaCode = '';
  // 行政区划树节点数据
  @Input()
  TreeData = [];
  // 选择的树节点
  selectedNode: any;

  constructor( ) {
  }
  ngOnInit() {
  }
  /**
   * 获取点击事件的数据
   * @param node
   */
  activeNode(node) {
    // console.log('选择了节点', node);
   this.selectedNode = node;
  }
}

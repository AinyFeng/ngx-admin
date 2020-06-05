import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzModalService, NzTreeComponent } from 'ng-zorro-antd';
import { VaccExamineApi } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-select-school',
  templateUrl: './select-school.component.html'
})
export class SelectSchoolComponent implements OnInit {

  @ViewChild('treeComponent', { static: false }) treeComponent: NzTreeComponent;
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
  treeData: any = []; // SelectSchoolComponent.sampleNodes;
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

  constructor(private modalSvc: NzModalService) { }

  ngOnInit() { }

  selectNode(node) {
    // console.log(node);
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

  static sampleNodes = [
    {
      title: '妇幼保健计服中心接种门诊',
      key: '3411260105',
      expanded: true,
    },
    {
      title: '府城镇预防接种门诊',
      key: '3411260101',
      expanded: true,
      children: [
        {
          title: '实验小学',
          key: '1001',
          expanded: true,
          children: [
            { title: '一年级一班', key: '100111', isLeaf: true },
            { title: '一年级二班', key: '100112', isLeaf: true },
            { title: '一年级三班', key: '100113', isLeaf: true },
            { title: '二年级一班', key: '100121', isLeaf: true },
            { title: '二年级二班', key: '100122', isLeaf: true },
            { title: '二年级三班', key: '100123', isLeaf: true },
            { title: '三年级一班', key: '100131', isLeaf: true },
            { title: '三年级二班', key: '100132', isLeaf: true },
            { title: '三年级三班', key: '100133', isLeaf: true },
            { title: '四年级一班', key: '100141', isLeaf: true },
            { title: '四年级二班', key: '100142', isLeaf: true },
            { title: '四年级三班', key: '100143', isLeaf: true },
            { title: '五年级一班', key: '100151', isLeaf: true },
            { title: '五年级二班', key: '100152', isLeaf: true },
            { title: '五年级三班', key: '100153', isLeaf: true },
            { title: '六年级一班', key: '100161', isLeaf: true },
            { title: '六年级二班', key: '100162', isLeaf: true },
            { title: '六年级三班', key: '100163', isLeaf: true },
          ]
        },
        {
          title: '府城镇永安小学',
          key: '1002',
          children: [
            { title: '一年级一班', key: '100111', isLeaf: true },
            { title: '一年级二班', key: '100112', isLeaf: true },
            { title: '一年级三班', key: '100113', isLeaf: true },
            { title: '二年级一班', key: '100121', isLeaf: true },
            { title: '二年级二班', key: '100122', isLeaf: true },
            { title: '二年级三班', key: '100123', isLeaf: true },
            { title: '三年级一班', key: '100131', isLeaf: true },
            { title: '三年级二班', key: '100132', isLeaf: true },
            { title: '三年级三班', key: '100133', isLeaf: true },
            { title: '四年级一班', key: '100141', isLeaf: true },
            { title: '四年级二班', key: '100142', isLeaf: true },
            { title: '四年级三班', key: '100143', isLeaf: true },
            { title: '五年级一班', key: '100151', isLeaf: true },
            { title: '五年级二班', key: '100152', isLeaf: true },
            { title: '五年级三班', key: '100153', isLeaf: true },
            { title: '六年级一班', key: '100161', isLeaf: true },
            { title: '六年级二班', key: '100162', isLeaf: true },
            { title: '六年级三班', key: '100163', isLeaf: true },
          ]
        },
        {
          title: '工人子弟小学',
          key: '1003',
          children: [
            { title: '一年级一班', key: '100111', isLeaf: true },
            { title: '一年级二班', key: '100112', isLeaf: true },
            { title: '一年级三班', key: '100113', isLeaf: true },
            { title: '二年级一班', key: '100121', isLeaf: true },
            { title: '二年级二班', key: '100122', isLeaf: true },
            { title: '二年级三班', key: '100123', isLeaf: true },
            { title: '三年级一班', key: '100131', isLeaf: true },
            { title: '三年级二班', key: '100132', isLeaf: true },
            { title: '三年级三班', key: '100133', isLeaf: true },
            { title: '四年级一班', key: '100141', isLeaf: true },
            { title: '四年级二班', key: '100142', isLeaf: true },
            { title: '四年级三班', key: '100143', isLeaf: true },
            { title: '五年级一班', key: '100151', isLeaf: true },
            { title: '五年级二班', key: '100152', isLeaf: true },
            { title: '五年级三班', key: '100153', isLeaf: true },
            { title: '六年级一班', key: '100161', isLeaf: true },
            { title: '六年级二班', key: '100162', isLeaf: true },
            { title: '六年级三班', key: '100163', isLeaf: true },
          ]
        },
        {
          title: '府城镇中心小学',
          key: '1003',
          children: [
            { title: '一年级一班', key: '100111', isLeaf: true },
            { title: '一年级二班', key: '100112', isLeaf: true },
            { title: '一年级三班', key: '100113', isLeaf: true },
            { title: '二年级一班', key: '100121', isLeaf: true },
            { title: '二年级二班', key: '100122', isLeaf: true },
            { title: '二年级三班', key: '100123', isLeaf: true },
            { title: '三年级一班', key: '100131', isLeaf: true },
            { title: '三年级二班', key: '100132', isLeaf: true },
            { title: '三年级三班', key: '100133', isLeaf: true },
            { title: '四年级一班', key: '100141', isLeaf: true },
            { title: '四年级二班', key: '100142', isLeaf: true },
            { title: '四年级三班', key: '100143', isLeaf: true },
            { title: '五年级一班', key: '100151', isLeaf: true },
            { title: '五年级二班', key: '100152', isLeaf: true },
            { title: '五年级三班', key: '100153', isLeaf: true },
            { title: '六年级一班', key: '100161', isLeaf: true },
            { title: '六年级二班', key: '100162', isLeaf: true },
            { title: '六年级三班', key: '100163', isLeaf: true },
          ]
        }
      ]
    },
    {
      title: '总铺中心卫生院',
      key: '3411260801',
      expanded: true,
      children: [
        {
          title: '总铺镇中心小学',
          key: '1003',
          children: [
            { title: '一年级一班', key: '100111', isLeaf: true },
            { title: '一年级二班', key: '100112', isLeaf: true },
            { title: '一年级三班', key: '100113', isLeaf: true },
            { title: '二年级一班', key: '100121', isLeaf: true },
            { title: '二年级二班', key: '100122', isLeaf: true },
            { title: '二年级三班', key: '100123', isLeaf: true },
            { title: '三年级一班', key: '100131', isLeaf: true },
            { title: '三年级二班', key: '100132', isLeaf: true },
            { title: '三年级三班', key: '100133', isLeaf: true },
            { title: '四年级一班', key: '100141', isLeaf: true },
            { title: '四年级二班', key: '100142', isLeaf: true },
            { title: '四年级三班', key: '100143', isLeaf: true },
            { title: '五年级一班', key: '100151', isLeaf: true },
            { title: '五年级二班', key: '100152', isLeaf: true },
            { title: '五年级三班', key: '100153', isLeaf: true },
            { title: '六年级一班', key: '100161', isLeaf: true },
            { title: '六年级二班', key: '100162', isLeaf: true },
            { title: '六年级三班', key: '100163', isLeaf: true },
          ]
        }
      ]
    },
    {
      title: '板桥镇中心卫生院',
      key: '3411261302',
      expanded: true,
      children: [
        {
          title: '板桥镇中心小学',
          key: '1003',
          children: [
            { title: '一年级一班', key: '100111', isLeaf: true },
            { title: '一年级二班', key: '100112', isLeaf: true },
            { title: '一年级三班', key: '100113', isLeaf: true },
            { title: '二年级一班', key: '100121', isLeaf: true },
            { title: '二年级二班', key: '100122', isLeaf: true },
            { title: '二年级三班', key: '100123', isLeaf: true },
            { title: '三年级一班', key: '100131', isLeaf: true },
            { title: '三年级二班', key: '100132', isLeaf: true },
            { title: '三年级三班', key: '100133', isLeaf: true },
            { title: '四年级一班', key: '100141', isLeaf: true },
            { title: '四年级二班', key: '100142', isLeaf: true },
            { title: '四年级三班', key: '100143', isLeaf: true },
            { title: '五年级一班', key: '100151', isLeaf: true },
            { title: '五年级二班', key: '100152', isLeaf: true },
            { title: '五年级三班', key: '100153', isLeaf: true },
            { title: '六年级一班', key: '100161', isLeaf: true },
            { title: '六年级二班', key: '100162', isLeaf: true },
            { title: '六年级三班', key: '100163', isLeaf: true },
          ]
        }
      ]
    },
    {
      title: '疾控预防中心门诊',
      key: '3411260104',
      expanded: true,
    }
  ];


}

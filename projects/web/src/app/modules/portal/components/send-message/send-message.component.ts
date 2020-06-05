import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministrativeService, PovInfoService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
  // providers: [
  //   AdministrativeService,
  //   PovInfoService
  // ]
})
export class SendMessageComponent implements OnInit {
  form: FormGroup;

  options = [
    { value: '1', label: '普通' },
    { value: '2', label: '紧急' },
    { value: '3', label: '十分紧急' },
    { value: '4', label: '非常紧急' }
  ];
  // data = [
  //   '淮海路接种门诊提醒您,您的孩子刘力扬的2019-01-29已经超过应种时间,请尽快来接种,2019-06-20',
  //   '望江西路接种门诊提醒您,您的孩子王晓晓的2019-02-11已经超过应种时间,请尽快来接种,2019-04-20',
  //   '长江西路接种门诊提醒您,您的孩子刘思思的2017-03-19已经超过应种时间,请尽快来接种,2019-07-20',
  //   '科学大道接种门诊提醒您,您的孩子李子柒的2017-04-03已经超过应种时间,请尽快来接种,2019-05-20',
  // ];

  // 被选中的node节点
  selectedNodeKey: any;
  // 行政区划树节点数据
  administrativeTreeData = [];
  value: string;
  povData = [];

  @ViewChild('treeNode', { static: true }) treeNodeComponent;

  constructor(
    private adminSvc: AdministrativeService,
    private povDataSvc: PovInfoService,
    private fb: FormBuilder
  ) {
    // 只获取当前安徽省的省份行政区划数据
    this.administrativeTreeData = this.adminSvc
      .getAdministrativeTreeData()
      .filter(province => province['key'] === '340000000000');
    if (this.administrativeTreeData.length !== 0) {
      this.administrativeTreeData[0]['expanded'] = true;
      this.selectedNodeKey = this.administrativeTreeData[0]['key'];
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      msgTitle: [null], // 消息标题
      receivedPov: [null], // 接收的pov
      msgContent: [null], // 发送的内容
      urgent: ['1', [Validators.required]] // 紧急程度
    });
  }

  /**
   * 点击可扩展的节点
   */
  onExpandChange(event): void {
    const node = event.node;
    console.log(node);
    // 获取此节点的key
    this.substringAreaCode(node.key);
    if (node && node.getChildren().length === 0 && node.isExpanded) {
      if (typeof node['key'] === 'string') {
        this.loadNode().then(data => {
          node.addChildren(data);
        });
      } else {
        node.isLeaf = true;
      }
    }
  }

  loadNode() {
    return new Promise(resolve => {
      this.queryPovData(1, res => resolve(res));
    });
  }

  // 获取pov数据
  queryPovData(page = 1, func: Function) {
    console.log(this.selectedNodeKey);
    let query = {
      povCode: '34',
      pageEntity: { page: page, pageSize: 10 }
    };
    this.povDataSvc.queryPovAndCount(query, resp => {
      this.povData = [];
      if (
        resp[0].code !== 0 ||
        !resp[0].hasOwnProperty('data') ||
        resp[1].code !== 0 ||
        !resp[1].hasOwnProperty('data')
      ) {
        func(null);
        return;
      }
      this.povData = resp[0].data;
      this.povData.forEach(
        (ele, index) => (this.povData[index].title = ele.name)
      );
      this.povData.forEach((ele, index) => (this.povData[index].key = ele.id));
      func(this.povData);
    });
  }

  /**
   * 选择一个节点
   */
  selectNode(node: any) {
    console.log('已选节点', node);
    if (node.node._isLeaf) {
      const key = node['keys'][0];
      console.log(key);
      if (this.treeNodeComponent.getTreeNodeByKey(key).isLeaf !== null) {
        this.treeNodeComponent.getTreeNodeByKey(key).isLeaf = false;
      }
      this.treeNodeComponent.getTreeNodeByKey(key).isExpanded = true;
      this.treeNodeComponent.getTreeNodeByKey(key).canHide = true;
      console.log('此节点为叶子节点', node);
      // this.loadNode().then(data => {
      //     this.treeNodeComponent.getTreeNodeByKey(key).addChildren(data);
      //     this.treeNodeComponent.getTreeNodeByKey(key);
      //     // this.treeNodeComponent.getTreeNodeByKey(key).service.;
      // });
    }
  }

  choseBox(node) {
    console.log('选择改变了', node);
  }

  /**
   * 根据所选节点key值获取areaCode
   * @param areaCode 所选节点的key值
   */
  substringAreaCode(areaCode: string) {
    if (typeof areaCode !== 'string' || !areaCode) return;
    const reg = new RegExp(/[0]{3,}$/);
    const code = areaCode.replace(reg, '');
    this.selectedNodeKey = code;
    console.log(typeof this.selectedNodeKey);
  }
}

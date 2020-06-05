import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'uea-delete-message',
  templateUrl: './delete-message.component.html',
  styleUrls: ['./delete-message.component.scss']
})
export class DeleteMessageComponent implements OnInit {
  listOfData = [
    {
      id: 1,
      sender: '淮海路接种门诊',
      content: '您的孩子刘力扬的2017-07-29已经超过应种时间,请尽快来接种',
      sendTime: '2019-06-20'
    },
    {
      id: 2,
      sender: '望江西路接种门诊',
      content: '您的孩子刘思思的2017-07-29已经超过应种时间,请尽快来接种',
      sendTime: '2019-03-20'
    },
    {
      id: 3,
      sender: '长江西路接种门诊',
      content: '您的孩子李子柒的2017-07-29已经超过应种时间,请尽快来接种',
      sendTime: '2019-02-20'
    },
    {
      id: 4,
      sender: '科学大道接种门诊',
      content: '您的孩子张小小的2017-07-29已经超过应种时间,请尽快来接种',
      sendTime: '2019-05-20'
    }
  ];
  deleteList: any[] = [];
  deleteAllList: any[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;

  constructor(private msgService: NzMessageService) {}

  ngOnInit() {}

  // 彻底删除
  completeDelete() {
    if (!this.deleteList.length) {
      this.msgService.warning('请选择要删除的信息');
      return;
    } else {
      this.deleteAllList = this.deleteList;
      this.deleteList.forEach(list => {
        this.listOfData = this.listOfData.filter(item => item.id !== list.id);
      });
      this.deleteList = [];
    }
  }

  // checked状态
  refreshStatus() {
    let tempArr = [];
    this.listOfData.forEach((msg: any) => {
      if (msg.checked) {
        tempArr = this.listOfData.filter(ele => ele.id === msg.id);
      }
    });
    tempArr.forEach(ele => this.deleteList.push(ele));
  }

  // 恢复
  recover() {
    this.msgService.success('恢复成功');
    // this.deleteAllList.forEach(list => this.listOfData.unshift(list));
  }
}

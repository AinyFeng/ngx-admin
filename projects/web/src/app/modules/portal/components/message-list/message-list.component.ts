import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'uea-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {
  mapOfExpandData: { [key: string]: boolean } = {};
  allChecked = false;
  indeterminate = false;
  displayData: any[] = [];
  loading = false;
  deleteList: any[] = [];

  data = [
    {
      id: 1,
      sender: '淮海路接种门诊',
      content: '您的孩子刘力扬的2017-07-29已经超过应种时间,请尽快来接种',
      sendTime: '2019-06-20',
      description:
        '淮海路接种门诊提醒您,您的孩子刘力扬的2017-07-29已经超过应种时间,请尽快来接种,2019-06-20'
    },
    {
      id: 2,
      sender: '望江西路接种门诊',
      content: '您的孩子刘思思的2017-07-29已经超过应种时间,请尽快来接种',
      sendTime: '2019-03-20',
      description:
        '望江西路接种门诊提醒您,您的孩子小明的2017-07-29已经超过应种时间,请尽快来接种,2019-04-20'
    },
    {
      id: 3,
      sender: '长江西路接种门诊',
      content: '您的孩子李子柒的2017-07-29已经超过应种时间,请尽快来接种',
      sendTime: '2019-02-20',
      description:
        '长江西路接种门诊提醒您,您的孩子刘思思的2017-07-29已经超过应种时间,请尽快来接种,2019-07-20'
    },
    {
      id: 4,
      sender: '科学大道接种门诊',
      content: '您的孩子张小小的2017-07-29已经超过应种时间,请尽快来接种',
      sendTime: '2019-05-20',
      description:
        '科学大道接种门诊提醒您,您的孩子李子柒的2017-07-29已经超过应种时间,请尽快来接种,2019-05-20'
    }
  ];

  constructor(private msgService: NzMessageService) {}
  ngOnInit() {}

  // checkAll(value: boolean): void {
  //     this.displayData.forEach(data => {
  //         if (!data.disabled) {
  //             data.checked = value;
  //         }
  //     });
  //     this.refreshStatus();
  // }

  refreshStatus(): void {
    const validData = this.displayData.filter(value => !value.disabled);
    const allChecked =
      validData.length > 0 && validData.every(value => value.checked === true);
    const allUnChecked = validData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
    let tempArr = [];
    this.displayData.forEach((msg: any) => {
      if (msg.checked) {
        tempArr = this.displayData.filter(ele => ele.id === msg.id);
      }
    });
    tempArr.forEach(ele => this.deleteList.push(ele));
  }

  currentPageDataChange($event) {
    this.displayData = $event;
    this.refreshStatus();
  }

  // 删除消息
  deleteMsg() {
    if (!this.deleteList.length) {
      this.msgService.warning('请选择要删除的信息');
      return;
    } else {
      this.deleteList.forEach(list => {
        this.data = this.data.filter(item => item.id !== list.id);
      });
      this.deleteList = [];
    }
  }
}

import {Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

import {SystemPreliminaryClinicalService} from '@tod/svs-common-lib';
import {NzMessageService} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-precheck-dialog',
  templateUrl: './precheck-dialog.component.html',
  styleUrls: ['./precheck-dialog.component.scss']
})
export class PrecheckDialogComponent implements OnInit {
  // 测量的体温
  temperature: any;
  listOfData: any = [];

  // 接收的模板
  modelContent: any;
  // 档案信息
  profile: any;

  // 预诊是否正常  0-正常 1 - 不正常
  normalStatus = 0;
  userInfo: any;

  constructor(
    private ref: NbDialogRef<PrecheckDialogComponent>,
    private api: SystemPreliminaryClinicalService,
    private msg: NzMessageService,
    private userSvc: UserService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.modelContent.forEach(item => {
      item.options = ['是', '否'];
      item.checked = false;
    });
    this.listOfData = this.modelContent;
  }

  // 关闭
  onClose() {
    this.ref.close();
  }

  // 改变的时候
  changeRadio(data: any, value: string) {
    this.listOfData.forEach(item => {
      if (data.id === item.id) {
        item.checked = true;
        if (value === '是') {
          item.normalStatus = '1';
          item.recordValue = '1';
          item.normalRange = '不正常';
          this.normalStatus = 1;
        } else {
          item.normalStatus = '0';
          item.recordValue = '0';
          item.normalRange = '正常';
          this.normalStatus = 0;
        }
      }
    });
  }

  // 保存预诊记录
  saveInfo() {
    // 存放选择的数据
    const chooseOptions = this.listOfData.filter(el => el.checked);
    // console.log('选择', chooseOptions);
    if (!chooseOptions.length) {
      this.ref.close();
      return;
    }
    let checkedOptions = [];
    chooseOptions.forEach(item => {
      const option = {
        modelCode: item.modelCode,
        question: item.question,
        recordValue: item.recordValue,
        normalRange: item.normalRange,
        normalStatus: item.normalStatus
      };
      checkedOptions.push(option);
    });
    const params = {
      profileCode: this.profile.profileCode,
      profileName: this.profile.name,
      normalStatus: this.normalStatus,
      dataList: [...checkedOptions],
      createBy: this.userInfo.userCode,
    };
    // console.log('参数', params);
    this.api.regPreDiagnosisRecordInsert(params, resp => {
      // console.log('结果', resp);
      if (resp.code === 0) {
        this.msg.info('预诊保存成功');
      }
      this.ref.close(this.normalStatus);
    });
  }

}

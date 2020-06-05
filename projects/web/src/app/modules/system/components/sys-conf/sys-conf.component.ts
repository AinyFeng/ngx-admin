import { Component, OnInit } from '@angular/core';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiSystemConfigService, SysConfInitService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-sys-conf',
  templateUrl: './sys-conf.component.html',
  styleUrls: ['../system.common.scss']
})
export class SysConfComponent implements OnInit {
  sysConfData: any[] = [];
  povCode: string = '';

  insertSysConfData: any[] = [];
  updateSysConfData: any[] = [];

  showInfo = false;

  constructor(
    private confService: ApiSystemConfigService,
    private sysConfInitService: SysConfInitService,
    private messageService: NzMessageService,
    private userService: UserService
  ) {
    this.userService.getUserInfoByType().subscribe(user => {
      this.povCode = user.pov;
    });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.clearData();
    this.confService.getConf(this.povCode, resp => {
      console.log(resp);
      if (resp && resp.code === 0) {
        let sysConfDictDataList = resp.data;
        sysConfDictDataList.forEach(dict => {
          if (dict.hasOwnProperty('confValue')) {
            dict.defaultValue = dict.confValue;
            dict.id = dict.confId;
            this.updateSysConfData.push(dict);
          } else {
            this.insertSysConfData.push({
              confScope: dict.confScope,
              confCode: dict.confCode,
              confValue: dict.defaultValue,
              povCode: this.povCode
            });
          }
          if (dict.hasOwnProperty('confOptions') && dict.confOptions !== '') {
            dict.confOptions = JSON.parse(dict.confOptions);
          } else {
            dict.confOptions = [];
          }
        });
        const dataList = JSON.parse(JSON.stringify(sysConfDictDataList));
        this.sysConfInitService.setSysConfData(sysConfDictDataList);
        this.sysConfData = dataList.filter(d => d.confGroup !== '4');

        // console.log('sysConfData', this.sysConfData);
        // console.log('updateSysConfData', this.updateSysConfData);
        // console.log('insertSysConfData', this.insertSysConfData);
      }
    });
  }

  saveConf() {
    this.sysConfData.forEach(dict => {
      this.insertSysConfData.forEach(conf => {
        if (conf.confCode === dict.confCode) {
          conf.confValue = dict.defaultValue;
        }
      });
      this.updateSysConfData.forEach(conf => {
        if (conf.confCode === dict.confCode) {
          conf.confValue = dict.defaultValue;
        }
      });
    });

    let param: any = {
      insertSysConfList: this.insertSysConfData,
      updateSysConfList: this.updateSysConfData
    };
    this.confService.insertAndModify(param, resp => {
      if (resp && resp.code === 0 && resp.data === true) {
        this.showInfo = true;
        this.messageService.success('保存成功！', { nzDuration: 3000 });
      } else {
        this.messageService.error('保存失败！', { nzDuration: 3000 });
      }
      this.refresh();
    });
  }

  clearData() {
    this.sysConfData = [];
    this.insertSysConfData = [];
    this.updateSysConfData = [];
  }

  closeAlert() {
    this.showInfo = false;
  }
}
